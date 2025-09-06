import { prisma } from './prisma'
import { createNotification } from './notifications'

export const notificationTriggers = {
  // When a new comment is added to a query
  async onNewComment(commentId: string, actorId: string) {
    try {
      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        include: {
          query: {
            select: {
              id: true,
              title: true,
              userId: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      if (!comment) return

      // Notify the query author (if not the commenter)
      if (comment.query.userId !== actorId) {
        await createNotification({
          userId: comment.query.userId,
          title: 'New Comment',
          message: `${comment.user.name || 'Someone'} commented on your query "${comment.query.title}"`,
          type: 'COMMENT',
          queryId: comment.query.id,
          relatedUserId: comment.user.id
        })
      }

      // Notify other commenters (except the current commenter)
      const otherCommenters = await prisma.comment.findMany({
        where: {
          queryId: comment.query.id,
          userId: { notIn: [actorId, comment.query.userId] }, // Exclude self and query author
        },
        distinct: ['userId'],
        select: {
          userId: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      })

      for (const { userId } of otherCommenters) {
        await createNotification({
          userId,
          title: 'New Comment',
          message: `${comment.user.name || 'Someone'} also commented on "${comment.query.title}"`,
          type: 'COMMENT',
          queryId: comment.query.id,
          relatedUserId: comment.user.id
        })
      }

      // Check for mentions in the comment
      const mentionRegex = /@([a-zA-Z0-9_]+)/g
      let match
      const mentionedUsernames = new Set<string>()

      while ((match = mentionRegex.exec(comment.content)) !== null) {
        mentionedUsernames.add(match[1])
      }

      // Notify mentioned users
      if (mentionedUsernames.size > 0) {
        const mentionedUsers = await prisma.user.findMany({
          where: {
            name: { in: Array.from(mentionedUsernames) },
            id: { not: actorId }, // Don't notify if mentioned themselves
          },
          select: {
            id: true,
          },
        })

        for (const user of mentionedUsers) {
          await notificationTemplates.mentionedInComment(
            comment.query.title,
            comment.user.name || 'Someone',
            user.id,
            comment.query.id
          )
        }
      }
    } catch (error) {
      console.error('Error in onNewComment trigger:', error)
    }
  },

  // When a query status changes
  async onQueryStatusChange(queryId: string, newStatus: string, actorId: string) {
    try {
      const query = await prisma.query.findUnique({
        where: { id: queryId },
        select: {
          id: true,
          title: true,
          userId: true,
        },
      })

      if (!query) return

      // Get actor name for the notification
      const actor = await prisma.user.findUnique({
        where: { id: actorId },
        select: { name: true },
      })

      // Notify the query author about status change
      if (query.userId !== actorId) {
        await createNotification({
          userId: query.userId,
          title: 'Status Updated',
          message: `${actor?.name || 'Someone'} updated the status of "${query.title}" to ${newStatus}`,
          type: 'QUERY_UPDATE',
          queryId: query.id,
          relatedUserId: actorId
        })
      }

          // Get all users who should be notified about the status change
      const [officeAssignments, ngoAssignments] = await Promise.all([
        // Get office assignments with users
        prisma.queryOfficeAssignment.findMany({
          where: { queryId },
          select: {
            office: {
              select: {
                userOffices: {
                  select: { userId: true }
                }
              }
            }
          }
        }),
        // Get NGO assignments with users
        prisma.queryNgoAssignment.findMany({
          where: { queryId },
          select: {
            ngo: {
              select: {
                userNgos: {
                  select: { userId: true }
                }
              }
            }
          }
        })
      ]);

      // Get unique user IDs to notify
      const participantIds = new Set<string>();
      
      // Add office users
      officeAssignments.forEach(({ office }) => {
        office.userOffices.forEach(({ userId }) => {
          if (userId !== actorId) {
            participantIds.add(userId);
          }
        });
      });
      
      // Add NGO users
      ngoAssignments.forEach(({ ngo }) => {
        ngo.userNgos.forEach(({ userId }) => {
          if (userId !== actorId) {
            participantIds.add(userId);
          }
        });
      });

      // Notify all participants
      for (const participantId of participantIds) {
        await createNotification({
          userId: participantId,
          title: 'Query Status Updated',
          message: `The status of "${query.title}" has been updated to ${newStatus}.`,
          type: 'QUERY_UPDATE',
          queryId: query.id,
          relatedUserId: actorId
        });
      }
    } catch (error) {
      console.error('Error in onQueryStatusChange trigger:', error)
    }
  },

  // When a query is assigned to an office or NGO
  async onQueryAssigned(queryId: string, assigneeType: 'office' | 'ngo', assigneeId: string, actorId: string) {
    try {
      const [query, actor] = await Promise.all([
        prisma.query.findUnique({
          where: { id: queryId },
          select: {
            id: true,
            title: true,
            userId: true,
          },
        }),
        prisma.user.findUnique({
          where: { id: actorId },
          select: { name: true },
        }),
      ]);

      if (!query) return;

      let assigneeName = '';
      let userIds: string[] = [];

      if (assigneeType === 'office') {
        // Get office with users through userOffices
        const office = await prisma.office.findUnique({
          where: { id: assigneeId },
          select: {
            name: true,
            userOffices: {
              select: { 
                user: { 
                  select: { id: true } 
                } 
              },
            },
          },
        });

        if (office) {
          assigneeName = office.name;
          userIds = office.userOffices
            .filter((userOffice: any) => userOffice.user?.id) // Filter out any null users
            .map((userOffice: any) => userOffice.user!.id); // Non-null assertion is safe due to filter
        }
      } else {
        // Get NGO with users through userNgos
        const ngo = await prisma.nGO.findUnique({
          where: { id: assigneeId },
          select: {
            name: true,
            userNgos: {
              select: { 
                user: { 
                  select: { id: true } 
                } 
              },
            },
          },
        });

        if (ngo) {
          assigneeName = ngo.name;
          userIds = ngo.userNgos
            .filter((userNgo: any) => userNgo.user?.id) // Filter out any null users
            .map((userNgo: any) => userNgo.user!.id); // Non-null assertion is safe due to filter
        }
      }

      if (!assigneeName) return;

      // Notify the assigned users
      for (const userId of userIds) {
        if (userId !== actorId) { // Exclude the actor
          await createNotification({
            userId,
            title: 'New Assignment',
            message: `You've been assigned to query "${query.title}" in ${assigneeName}`,
            type: 'QUERY_UPDATE',
            queryId: query.id,
            relatedUserId: actorId
          });
        }
      }

      // Notify the query author
      if (query.userId !== actorId) {
        await createNotification({
          userId: query.userId,
          title: 'Query Assigned',
          message: `${actor?.name || 'Someone'} assigned your query "${query.title}" to ${assigneeName}`,
          type: 'QUERY_UPDATE',
          queryId: query.id,
          relatedUserId: actorId
        });
      }
    } catch (error) {
      console.error('Error in onQueryAssigned trigger:', error)
    }
  },

  // When a user likes a query
  async onQueryLiked(queryId: string, userId: string) {
    try {
      const [query, liker] = await Promise.all([
        prisma.query.findUnique({
          where: { id: queryId },
          select: {
            id: true,
            title: true,
            userId: true,
          },
        }),
        prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            name: true,
          },
        }),
      ])

      if (!query || !liker || query.userId === userId) return

      // Notify the query author
      await createNotification({
        userId: query.userId,
        title: 'Query Liked',
        message: `${liker.name || 'Someone'} liked your query "${query.title}"`,
        type: 'LIKE',
        queryId: query.id,
        relatedUserId: liker.id
      })
    } catch (error) {
      console.error('Error in onQueryLiked trigger:', error)
    }
  },

  // When a query is shared
  async onQueryShared(queryId: string, userId: string) {
    try {
      const [query, sharer] = await Promise.all([
        prisma.query.findUnique({
          where: { id: queryId },
          select: {
            id: true,
            title: true,
            userId: true,
          },
        }),
        prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            name: true,
          },
        }),
      ])

      if (!query || !sharer) return

      // Only notify if shared by someone other than the author
      if (query.userId !== userId) {
        await createNotification({
          userId: query.userId,
          title: 'Query Shared',
          message: `${sharer.name || 'Someone'} shared your query "${query.title}"`,
          type: 'SHARE',
          queryId: query.id,
          relatedUserId: sharer.id
        })
      }
    } catch (error) {
      console.error('Error in onQueryShared trigger:', error)
    }
  },
}

export type NotificationTriggers = typeof notificationTriggers
