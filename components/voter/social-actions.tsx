'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import { MessageCircle, Share2, ThumbsUp, ArrowUpCircle, User, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SocialActionsProps {
  queryId: string;
  initialLikes?: number;
  initialComments?: number;
  initialShares?: number;
  initialUpvotes?: number;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  retweetCount?: number;
  className?: string;
}

export function SocialActions({
  queryId,
  initialLikes = 0,
  initialComments = 0,
  initialShares = 0,
  initialUpvotes = 0,
  likeCount,
  commentCount,
  shareCount,
  retweetCount,
  className = '',
}: SocialActionsProps) {
  const [likes, setLikes] = useState(likeCount ?? initialLikes);
  const [comments, setComments] = useState(commentCount ?? initialComments);
  const [commentsList, setCommentsList] = useState<Array<{
    id: string;
    content: string;
    createdAt: string;
    user: {
      id: string;
      name: string | null;
      email: string | null;
    };
  }>>([]);
  const [shares, setShares] = useState(initialShares);
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [commentInputRef, setCommentInputRef] = useState<HTMLTextAreaElement | null>(null);
  const commentsSectionRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch initial like/upvote state
  const fetchInteractionState = useCallback(async () => {
    try {
      setIsLoading(true);
      const [likeRes, upvoteRes] = await Promise.all([
        fetch(`/api/queries/${queryId}/like`),
        fetch(`/api/queries/${queryId}/upvote`)
      ]);

      if (likeRes.ok) {
        const likeData = await likeRes.json();
        if (likeData.success) {
          setIsLiked(!!likeData.isLiked);
          setLikes(likeData.likeCount || 0);
        }
      }

      if (upvoteRes.ok) {
        const upvoteData = await upvoteRes.json();
        if (upvoteData.success) {
          setIsUpvoted(!!upvoteData.isUpvoted);
          setUpvotes(upvoteData.upvoteCount || 0);
        }
      }
    } catch (error) {
      console.error('Error fetching interaction state:', error);
    } finally {
      setIsLoading(false);
    }
  }, [queryId]);

  // Fetch comments
  const fetchComments = useCallback(async () => {
    try {
      setIsCommentLoading(true);
      const response = await fetch(`/api/queries/${queryId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setCommentsList(data.comments || []);
        setComments(data.commentCount || 0);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        variant: 'destructive',
      });
    } finally {
      setIsCommentLoading(false);
    }
  }, [queryId, toast]);

  // Initial fetch
  useEffect(() => {
    fetchInteractionState();
    fetchComments();
  }, [fetchInteractionState, fetchComments]);

  const handleLike = async () => {
    if (isSubmitting) return;
    
    const currentIsLiked = isLiked;
    const currentLikes = likes;
    const newLikeStatus = !currentIsLiked;
    const newLikeCount = newLikeStatus ? currentLikes + 1 : Math.max(0, currentLikes - 1);
    
    // Optimistic update
    setIsLiked(newLikeStatus);
    setLikes(newLikeCount);
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/queries/${queryId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ like: newLikeStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update like status');
      }

      const data = await response.json();
      if (data.success) {
        setIsLiked(!!data.isLiked);
        setLikes(data.likeCount || 0);
      }
    } catch (error) {
      // Revert on error
      setIsLiked(currentIsLiked);
      setLikes(currentLikes);
      toast({
        title: 'Error',
        description: 'Failed to update like status',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvote = async () => {
    if (isSubmitting) return;
    
    const currentIsUpvoted = isUpvoted;
    const currentUpvotes = upvotes;
    const newUpvoteStatus = !currentIsUpvoted;
    const newUpvoteCount = newUpvoteStatus ? currentUpvotes + 1 : Math.max(0, currentUpvotes - 1);
    
    // Optimistic update
    setIsUpvoted(newUpvoteStatus);
    setUpvotes(newUpvoteCount);
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/queries/${queryId}/upvote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ upvote: newUpvoteStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update upvote status');
      }

      const data = await response.json();
      if (data.success) {
        setIsUpvoted(!!data.isUpvoted);
        setUpvotes(data.upvoteCount || 0);
      }
    } catch (error) {
      // Revert on error
      setIsUpvoted(currentIsUpvoted);
      setUpvotes(currentUpvotes);
      toast({
        title: 'Error',
        description: 'Failed to update upvote status',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    try {
      const response = await fetch(`/api/queries/${queryId}/share`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setShares(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;

    const currentComments = comments;
    const tempId = `temp-${Date.now()}`;
    const newComment = {
      id: tempId,
      content: commentText,
      createdAt: new Date().toISOString(),
      user: {
        id: 'current-user',
        name: 'You',
        email: null
      }
    };
    
    // Optimistic update
    setComments(prev => prev + 1);
    setCommentsList(prev => [newComment, ...prev]);
    setCommentText('');
    setIsSubmitting(true);
    setIsCommentLoading(true);
    
    try {
      const response = await fetch(`/api/queries/${queryId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: commentText }),
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      // Refresh comments to get the actual data from the server
      await fetchComments();
      
      // Scroll to the comment input after a short delay
      setTimeout(() => {
        commentInputRef?.focus();
      }, 100);
      
      toast({
        title: 'Success',
        description: 'Your comment has been added',
      });
    } catch (error) {
      // Revert on error
      setComments(currentComments);
      setCommentsList(prev => prev.filter(c => c.id !== tempId));
      const errorMessage = error instanceof Error ? error.message : 'Failed to post comment';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <div className="flex items-center space-x-1">
        <TooltipProvider>
          
         

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-8 px-2.5 text-muted-foreground hover:text-green-600 hover:bg-green-50/50 transition-colors rounded-md ${isCommentOpen ? 'text-green-600 bg-green-50' : ''}`}
                onClick={() => setIsCommentOpen(!isCommentOpen)}
                disabled={isSubmitting || isLoading}
              >
                <MessageCircle className="h-4 w-4" />
                {comments > 0 && <span className="ml-1.5 text-xs font-medium">{comments}</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isCommentOpen ? 'Hide comments' : 'Show comments'}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2.5 text-muted-foreground hover:text-green-600 hover:bg-green-50/50 transition-colors rounded-md ${
                  isUpvoted ? 'text-green-600 bg-green-50' : ''
                }`}
                onClick={handleUpvote}
                disabled={isSubmitting || isLoading}
              >
                <ArrowUpCircle className={`h-4 w-4 ${isUpvoted ? 'fill-current' : ''}`} />
                {upvotes > 0 && <span className="ml-1.5 text-xs font-medium">{upvotes}</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isUpvoted ? 'Remove upvote' : 'Upvote'}</p>
            </TooltipContent>
          </Tooltip>

          <div className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2.5 text-muted-foreground hover:text-red-600 hover:bg-red-50/50 transition-colors rounded-md"
                  onClick={() => setIsShareDropdownOpen(!isShareDropdownOpen)}
                  disabled={isSubmitting || isLoading}
                >
                  <Share2 className="h-4 w-4" />
                  {shares > 0 && <span className="ml-1.5 text-xs font-medium">{shares}</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share</p>
              </TooltipContent>
            </Tooltip>
            
            {isShareDropdownOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 overflow-hidden">
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/dashboard/voter/queries/details/${queryId}`);
                    toast({
                      title: 'Link copied!',
                      description: 'Share link has been copied to clipboard',
                    });
                    handleShare();
                    setIsShareDropdownOpen(false);
                  }}
                >
                  Copy link
                </button>
                {navigator.share && (
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                    onClick={async () => {
                      try {
                        await navigator.share({
                          title: 'Check this out',
                          text: 'Thought you might be interested in this',
                          url: `${window.location.origin}/dashboard/voter/queries/details/${queryId}`,
                        });
                        handleShare();
                      } catch (err) {
                        // User cancelled share
                      }
                      setIsShareDropdownOpen(false);
                    }}
                  >
                    Share via...
                  </button>
                )}
              </div>
            )}
          </div>
        </TooltipProvider>
      </div>

      {/* Comments Section */}
      {isCommentOpen && (
        <div 
          ref={commentsSectionRef}
          className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 animate-in fade-in-50"
        >
          {/* Comments List */}
          <div className="max-h-60 overflow-y-auto p-3 space-y-3 bg-white">
            {isCommentLoading && commentsList.length === 0 && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
              </div>
            )}
            {commentsList.length === 0 ? (
              <div className="py-4 text-center">
                <MessageCircle className="h-6 w-6 mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {commentsList.map((comment) => (
                  <div key={comment.id} className="flex gap-2 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-medium text-sm text-gray-600">
                      {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {comment.user?.name || 'Anonymous'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-0.5 break-words">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Comment Input */}
          <div className="border-t border-gray-200 p-3 bg-gray-50">
            <form onSubmit={handleComment} className="flex gap-2">
              <Textarea 
                ref={setCommentInputRef}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={1}
                className="text-sm flex-1 min-h-[40px] max-h-24 resize-none transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                style={{ scrollbarWidth: 'thin' }}
                autoFocus={isCommentOpen}
                disabled={isSubmitting}
              />
              <Button 
                type="submit" 
                size="sm"
                disabled={!commentText.trim() || isSubmitting}
                className={`self-end h-[40px] px-4 bg-green-600 hover:bg-green-700 transition-colors ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Posting...
                  </>
                ) : 'Post'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
