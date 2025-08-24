'use client'

import { useState } from 'react';
import { MessageCircle, Share2, ThumbsUp, ArrowUpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface SocialActionsProps {
  queryId: string;
  initialLikes?: number;
  initialComments?: number;
  initialShares?: number;
  initialUpvotes?: number;
  className?: string;
}

export function SocialActions({
  queryId,
  initialLikes = 0,
  initialComments = 0,
  initialShares = 0,
  initialUpvotes = 0,
  className = '',
}: SocialActionsProps) {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [comments, setComments] = useState(initialComments || 0);
  const [shares, setShares] = useState(initialShares || 0);
  const [upvotes, setUpvotes] = useState(initialUpvotes || 0);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleLike = async () => {
    if (isSubmitting) return;
    
    // Capture current state to avoid race conditions
    const currentIsLiked = isLiked;
    const currentLikes = likes;
    
    // Calculate new values
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to update like');
      }
      
      const data = await response.json();
      
      // Update with server's state
      if (data.success) {
        setLikes(data.likeCount);
        setIsLiked(data.isLiked);
        
        toast({
          title: data.isLiked ? 'Liked' : 'Removed like',
          description: data.isLiked ? 'Your like was recorded' : 'Like removed',
        });
      }
    } catch (error: unknown) {
      // Revert to previous state on error
      setIsLiked(currentIsLiked);
      setLikes(currentLikes);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to update like';
      if (!errorMessage.includes('AbortError')) {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      const currentShares = shares;
      // Optimistic update
      setShares(currentShares + 1);
      
      // Update share count on server
      const response = await fetch(`/api/queries/${queryId}/share`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to update share count');
      }
      
      const data = await response.json();
      // Only update if the server's count is different from our optimistic update
      if (data.shareCount !== undefined && data.shareCount !== currentShares + 1) {
        setShares(data.shareCount);
      }
    } catch (error: unknown) {
      // Revert on error
      setShares(prev => Math.max(0, prev - 1));
      const errorMessage = error instanceof Error ? error.message : 'Failed to share';
      if (!errorMessage.includes('AbortError')) {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvote = async () => {
    if (isSubmitting) return;
    
    // Capture current state to avoid race conditions
    const currentIsUpvoted = isUpvoted;
    const currentUpvotes = upvotes;
    
    // Calculate new values
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to process upvote');
      }
      
      const data = await response.json();
      
      // Update with server's state
      if (data.success) {
        setUpvotes(data.upvoteCount);
        setIsUpvoted(data.isUpvoted);
        
        toast({
          title: data.isUpvoted ? 'Upvoted' : 'Removed upvote',
          description: data.isUpvoted ? 'Your upvote was recorded' : 'Upvote removed',
        });
      }
    } catch (error: unknown) {
      // Revert to previous state on error
      setIsUpvoted(currentIsUpvoted);
      setUpvotes(currentUpvotes);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process upvote';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      const currentComments = comments;
      // Optimistic update
      setComments(currentComments + 1);
      
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
      
      const data = await response.json();
      // Only update if the server's count is different from our optimistic update
      if (data.commentCount !== undefined && data.commentCount !== currentComments + 1) {
        setComments(data.commentCount);
      }
      
      setCommentText('');
      setIsCommentOpen(false);
      toast({
        title: 'Comment posted',
        description: 'Your comment has been added',
      });
    } catch (error: unknown) {
      // Revert on error
      setComments(prev => Math.max(0, prev - 1));
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
    <div className={`flex items-center gap-0.5 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 px-2.5 text-muted-foreground hover:text-blue-600 hover:bg-blue-50/50 transition-colors rounded-md ${
          isLiked ? 'text-blue-600 bg-blue-50' : ''
        }`}
        onClick={handleLike}
      >
        <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
        {likes > 0 && <span className="ml-1.5 text-xs font-medium">{likes}</span>}
      </Button>

      <div className="relative">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2.5 text-muted-foreground hover:text-green-600 hover:bg-green-50/50 transition-colors rounded-md"
          onClick={() => setIsCommentOpen(!isCommentOpen)}
        >
          <MessageCircle className="h-4 w-4" />
          {comments > 0 && <span className="ml-1.5 text-xs font-medium">{comments}</span>}
        </Button>
        
        {isCommentOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10 p-4">
            <h4 className="font-medium text-sm mb-2">Add a comment</h4>
            <form onSubmit={handleComment} className="space-y-3">
              <Textarea 
                placeholder="Share your thoughts..." 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
                className="text-sm w-full"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsCommentOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={!commentText.trim()}
                >
                  Post
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className={`h-8 px-2.5 text-muted-foreground hover:text-green-600 hover:bg-green-50/50 transition-colors rounded-md ${
          isUpvoted ? 'text-green-600 bg-green-50' : ''
        }`}
        onClick={handleUpvote}
      >
        <ArrowUpCircle className={`h-4 w-4 ${isUpvoted ? 'fill-current' : ''}`} />
        {upvotes > 0 && <span className="ml-1.5 text-xs font-medium">{upvotes}</span>}
      </Button>

      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2.5 text-muted-foreground hover:text-red-600 hover:bg-red-50/50 transition-colors rounded-md"
          onClick={() => setIsShareDropdownOpen(!isShareDropdownOpen)}
        >
          <Share2 className="h-4 w-4" />
          {shares > 0 && <span className="ml-1.5 text-xs font-medium">{shares}</span>}
        </Button>
        
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
    </div>
  );
}
