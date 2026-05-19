// ==========================================
// FeedPage — Home feed with skeleton loading
// Vertical reel cards, infinite scroll, likes, saves, comments & reposts
// ==========================================

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import RepeatRoundedIcon from '@mui/icons-material/RepeatRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import UserAvatar from '../components/shared/UserAvatar';
import TechBadge from '../components/shared/TechBadge';
import { useStore } from '../store/useStore';
import api from '../lib/axios';
import type { FeedPost, PostComment } from '@demoday/shared';

// Icons
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import SpeakerNotesOffRoundedIcon from '@mui/icons-material/SpeakerNotesOffRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';

const FeedPage: React.FC = () => {
  const {
    posts,
    nextCursor,
    hasMore,
    isLoadingFeed,
    setPosts,
    appendPosts,
    toggleLike,
    toggleSave,
    setFeedLoading,
    resetFeed,
    user,
    pushToast,
    updatePostInFeed,
    deletePostInFeed,
  } = useStore();

  // Dialog / Drawer states
  const [commentPost, setCommentPost] = useState<FeedPost | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const [repostPostObj, setRepostPostObj] = useState<FeedPost | null>(null);
  const [repostCommentary, setRepostCommentary] = useState('');
  const [isSubmittingRepost, setIsSubmittingRepost] = useState(false);

  // Post Card Options Menu states
  const [postMenuAnchor, setPostMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedMenuPost, setSelectedMenuPost] = useState<FeedPost | null>(null);

  // Load feed posts
  const fetchFeed = async (cursor?: string) => {
    try {
      setFeedLoading(true);
      const res = await api.get('/studio/feed', {
        params: {
          cursor,
          limit: 10,
        },
      });
      if (cursor) {
        appendPosts(res.data.data, res.data.next_cursor, res.data.has_more);
      } else {
        setPosts(res.data.data);
      }
    } catch (err: any) {
      pushToast({
        message: err.response?.data?.message || 'Failed to fetch feed',
        severity: 'error',
      });
    } finally {
      setFeedLoading(false);
    }
  };

  useEffect(() => {
    resetFeed();
    fetchFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLikeClick = async (post: FeedPost) => {
    if (!user) {
      pushToast({ message: 'Please log in to like posts', severity: 'info' });
      return;
    }
    try {
      toggleLike(post.id); // optimistic update
      await api.post(`/studio/posts/${post.id}/like`);
    } catch (err: any) {
      toggleLike(post.id); // rollback
      pushToast({
        message: err.response?.data?.message || 'Failed to like post',
        severity: 'error',
      });
    }
  };

  const handleSaveClick = async (post: FeedPost) => {
    if (!user) {
      pushToast({ message: 'Please log in to save posts', severity: 'info' });
      return;
    }
    try {
      toggleSave(post.id); // optimistic update
      await api.post(`/studio/posts/${post.id}/save`);
    } catch (err: any) {
      toggleSave(post.id); // rollback
      pushToast({
        message: err.response?.data?.message || 'Failed to save post',
        severity: 'error',
      });
    }
  };

  // Comments handlers
  const handleOpenComments = async (post: FeedPost) => {
    if (post.hide_comments_count) {
      pushToast({ message: 'Commenting is turned off for this post', severity: 'warning' });
      return;
    }
    setCommentPost(post);
    setIsLoadingComments(true);
    setNewCommentText('');
    try {
      const res = await api.get(`/studio/posts/${post.id}/comments`);
      setComments(res.data);
    } catch (err: any) {
      pushToast({ message: 'Failed to load comments', severity: 'error' });
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentPost) return;
    if (!newCommentText.trim()) return;
    if (!user) {
      pushToast({ message: 'Please log in to comment', severity: 'info' });
      return;
    }

    try {
      const res = await api.post(`/studio/posts/${commentPost.id}/comments`, {
        comment_text: newCommentText,
      });
      setComments((prev) => [...prev, res.data]);
      setNewCommentText('');
      // update count locally on the post
      const updatedPosts = posts.map((p) => {
        if (p.id === commentPost.id) {
          return { ...p, comments_count: p.comments_count + 1 };
        }
        return p;
      });
      setPosts(updatedPosts);
    } catch (err: any) {
      pushToast({
        message: err.response?.data?.message || 'Failed to add comment',
        severity: 'error',
      });
    }
  };

  // Repost handlers
  const handleOpenRepost = (post: FeedPost) => {
    if (!user) {
      pushToast({ message: 'Please log in to repost', severity: 'info' });
      return;
    }
    setRepostPostObj(post);
    setRepostCommentary('');
  };

  const handleCreateRepost = async () => {
    if (!repostPostObj) return;
    try {
      setIsSubmittingRepost(true);
      await api.post(`/studio/posts/${repostPostObj.id}/repost`, {
        commentary: repostCommentary,
      });
      pushToast({ message: 'Post shared with connections!', severity: 'success' });
      setRepostPostObj(null);
      resetFeed();
      fetchFeed(); // Refresh feed to display the new repost at top
    } catch (err: any) {
      pushToast({
        message: err.response?.data?.message || 'Failed to repost',
        severity: 'error',
      });
    } finally {
      setIsSubmittingRepost(false);
    }
  };

  // Post card options handlers
  const handleOpenPostMenu = (event: React.MouseEvent<HTMLButtonElement>, post: FeedPost) => {
    setPostMenuAnchor(event.currentTarget);
    setSelectedMenuPost(post);
  };

  const handleClosePostMenu = () => {
    setPostMenuAnchor(null);
    setSelectedMenuPost(null);
  };

  const handleToggleLikesCount = async () => {
    if (!selectedMenuPost) return;
    const newHideState = !selectedMenuPost.hide_likes_count;
    try {
      // Optimistic state update
      updatePostInFeed(selectedMenuPost.id, { hide_likes_count: newHideState });
      handleClosePostMenu();

      await api.patch(`/studio/posts/${selectedMenuPost.id}`, {
        hide_likes_count: newHideState,
      });
      pushToast({
        message: newHideState ? 'Likes count is now hidden' : 'Likes count is now visible',
        severity: 'success',
      });
    } catch (err: any) {
      // Rollback
      updatePostInFeed(selectedMenuPost.id, { hide_likes_count: !newHideState });
      pushToast({
        message: err.response?.data?.message || 'Failed to update preferences',
        severity: 'error',
      });
    }
  };

  const handleToggleCommentsCount = async () => {
    if (!selectedMenuPost) return;
    const newHideState = !selectedMenuPost.hide_comments_count;
    try {
      // Optimistic state update
      updatePostInFeed(selectedMenuPost.id, { hide_comments_count: newHideState });
      handleClosePostMenu();

      await api.patch(`/studio/posts/${selectedMenuPost.id}`, {
        hide_comments_count: newHideState,
      });
      pushToast({
        message: newHideState ? 'Commenting has been turned off' : 'Commenting has been turned on',
        severity: 'success',
      });
    } catch (err: any) {
      // Rollback
      updatePostInFeed(selectedMenuPost.id, { hide_comments_count: !newHideState });
      pushToast({
        message: err.response?.data?.message || 'Failed to update preferences',
        severity: 'error',
      });
    }
  };

  const handleDeletePost = async () => {
    if (!selectedMenuPost) return;
    if (!window.confirm('Are you sure you want to delete this project demo? This action cannot be undone.')) {
      return;
    }
    
    const postId = selectedMenuPost.id;
    try {
      // Optimistic delete
      deletePostInFeed(postId);
      handleClosePostMenu();

      await api.delete(`/studio/posts/${postId}`);
      pushToast({
        message: 'Demo deleted successfully!',
        severity: 'success',
      });
    } catch (err: any) {
      pushToast({
        message: err.response?.data?.message || 'Failed to delete post',
        severity: 'error',
      });
      fetchFeed(); // Rollback by refetching
    }
  };

  const handleCopyLink = () => {
    if (!selectedMenuPost) return;
    const postUrl = `${window.location.origin}/posts/${selectedMenuPost.id}`;
    navigator.clipboard.writeText(postUrl)
      .then(() => {
        pushToast({
          message: 'Copied link to clipboard!',
          severity: 'success',
        });
      })
      .catch(() => {
        pushToast({
          message: 'Failed to copy link',
          severity: 'error',
        });
      });
    handleClosePostMenu();
  };

  const renderPostContent = (post: FeedPost, isNested = false) => {
    const showMedia = post.media_urls && post.media_urls.length > 0;

    return (
      <Card
        variant={isNested ? 'outlined' : 'elevation'}
        sx={{
          overflow: 'visible',
          position: 'relative',
          ...(isNested && {
            bgcolor: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(8px)',
            borderColor: 'rgba(255, 255, 255, 0.08)',
            mt: 1.5,
          }),
        }}
      >
        <CardHeader
          avatar={
            <UserAvatar
              name={post.author?.full_name || 'Anonymous'}
              avatarUrl={post.author?.avatar_url}
              roleType={post.author?.role_type as any}
              openToWork={post.author?.role_type === 'creator'}
              size={isNested ? 32 : 38}
              showRing
            />
          }
          title={
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {post.author?.full_name || 'Anonymous'}
            </Typography>
          }
          subheader={
            <Typography variant="caption" color="text.secondary">
              @{post.author?.username || 'user'} · {new Date(post.created_at).toLocaleDateString()}
            </Typography>
          }
          action={
            !isNested && (
              <IconButton size="small" onClick={(e) => handleOpenPostMenu(e, post)}>
                <MoreVertRoundedIcon fontSize="small" />
              </IconButton>
            )
          }
          sx={{ pb: 1, p: isNested ? 1.5 : undefined }}
        />

        {/* Video / Image Showcase */}
        {showMedia ? (
          <Box
            sx={{
              width: '100%',
              aspectRatio: '9 / 16',
              bgcolor: '#0B0F1A',
              borderRadius: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {post.media_type === 'reel' ? (
              <video
                src={post.media_urls[0]}
                controls
                playsInline
                loop
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <img
                src={post.media_urls[0]}
                alt={post.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </Box>
        ) : (
          !isNested && (
            <Box
              sx={{
                width: '100%',
                aspectRatio: '16 / 9',
                bgcolor: '#0B0F1A',
                borderRadius: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #1E1B4B 0%, #0B0F1A 50%, #134E4A 100%)',
              }}
            >
              <Typography sx={{ color: '#64748B', fontSize: '0.85rem' }}>
                📹 Reel Preview
              </Typography>
            </Box>
          )
        )}

        <CardContent sx={{ p: isNested ? 1.5 : undefined, pt: isNested ? 0 : undefined }}>
          <Typography variant={isNested ? 'subtitle1' : 'h6'} sx={{ fontWeight: 600, mb: 1 }}>
            {post.title}
          </Typography>
          {post.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              {post.description}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 2 }}>
            {post.tech_stack?.map((tech) => (
              <TechBadge key={tech} label={tech} />
            ))}
          </Box>

          {/* Social actions - Render only on root posts, not nested repost targets */}
          {!isNested && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {/* Like Option */}
              <IconButton
                size="small"
                onClick={() => handleLikeClick(post)}
                sx={{
                  color: post.is_liked ? '#EF4444' : 'text.secondary',
                  transition: 'transform 0.15s ease',
                  '&:active': { transform: 'scale(1.2)' },
                }}
              >
                {post.is_liked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderRoundedIcon fontSize="small" />}
              </IconButton>
              <Typography variant="caption" color="text.secondary" sx={{ mr: 1.5 }}>
                {post.hide_likes_count ? 'Likes Hidden' : post.likes_count}
              </Typography>

              {/* Comment Option */}
              <IconButton
                size="small"
                onClick={() => handleOpenComments(post)}
                sx={{ color: 'text.secondary' }}
                disabled={post.hide_comments_count}
              >
                <ChatBubbleOutlineRoundedIcon fontSize="small" />
              </IconButton>
              <Typography variant="caption" color="text.secondary" sx={{ mr: 1.5 }}>
                {post.hide_comments_count ? 'Comments Hidden' : post.comments_count}
              </Typography>

              {/* Repost Option */}
              <IconButton
                size="small"
                onClick={() => handleOpenRepost(post)}
                sx={{ color: 'text.secondary' }}
              >
                <RepeatRoundedIcon fontSize="small" />
              </IconButton>

              <Box sx={{ flex: 1 }} />

              {/* Save Option */}
              <IconButton
                size="small"
                onClick={() => handleSaveClick(post)}
                sx={{ color: post.is_saved ? '#F59E0B' : 'text.secondary' }}
              >
                {post.is_saved ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderRoundedIcon fontSize="small" />}
              </IconButton>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ maxWidth: 560, mx: 'auto', px: 2, pb: 8 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Home
      </Typography>

      {/* Feed cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {posts.map((post) => {
          const isRepost = !!post.parent_post_id;

          return (
            <Card
              key={post.id}
              sx={{
                overflow: 'visible',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(30, 41, 59, 0.4)',
                backdropFilter: 'blur(16px)',
              }}
            >
              {isRepost && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    pt: 1.5,
                    color: 'secondary.main',
                  }}
                >
                  <ShareRoundedIcon fontSize="inherit" sx={{ transform: 'rotate(-45deg)' }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, letterSpacing: '0.01em' }}>
                    {post.author?.full_name || 'Someone'} shared a post
                  </Typography>
                </Box>
              )}

              {/* Reposter's commentary */}
              {isRepost && post.repost_commentary && (
                <Box sx={{ px: 2, pt: 1, pb: 0.5 }}>
                  <Typography variant="body2">{post.repost_commentary}</Typography>
                </Box>
              )}

              {/* Render parent nested card or main post card */}
              {isRepost && post.parent_post ? (
                <Box sx={{ px: 2, pb: 2 }}>
                  {renderPostContent(post.parent_post as FeedPost, true)}

                  {/* Root interaction options for the repost container */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 2 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleLikeClick(post)}
                      sx={{
                        color: post.is_liked ? '#EF4444' : 'text.secondary',
                        transition: 'transform 0.15s ease',
                        '&:active': { transform: 'scale(1.2)' },
                      }}
                    >
                      {post.is_liked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderRoundedIcon fontSize="small" />}
                    </IconButton>
                    <Typography variant="caption" color="text.secondary" sx={{ mr: 1.5 }}>
                      {post.hide_likes_count ? 'Likes Hidden' : post.likes_count}
                    </Typography>

                    <IconButton
                      size="small"
                      onClick={() => handleOpenComments(post)}
                      sx={{ color: 'text.secondary' }}
                      disabled={post.hide_comments_count}
                    >
                      <ChatBubbleOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="caption" color="text.secondary" sx={{ mr: 1.5 }}>
                      {post.hide_comments_count ? 'Comments Hidden' : post.comments_count}
                    </Typography>

                    <Box sx={{ flex: 1 }} />

                    <IconButton
                      size="small"
                      onClick={() => handleSaveClick(post)}
                      sx={{ color: post.is_saved ? '#F59E0B' : 'text.secondary' }}
                    >
                      {post.is_saved ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderRoundedIcon fontSize="small" />}
                    </IconButton>
                  </Box>
                </Box>
              ) : (
                renderPostContent(post, false)
              )}
            </Card>
          );
        })}

        {/* Load More Button */}
        {hasMore && !isLoadingFeed && posts.length > 0 && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => fetchFeed(nextCursor || undefined)}
            sx={{ mt: 2, py: 1, borderRadius: '12px' }}
          >
            Load Older Demos
          </Button>
        )}

        {/* Loading skeletons */}
        {isLoadingFeed &&
          [1, 2].map((i) => (
            <Card key={`skel-${i}`} sx={{ border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <CardHeader
                avatar={<Skeleton variant="circular" width={38} height={38} />}
                title={<Skeleton width="40%" />}
                subheader={<Skeleton width="25%" />}
              />
              <Skeleton variant="rectangular" sx={{ aspectRatio: '16 / 9' }} />
              <CardContent>
                <Skeleton width="70%" sx={{ mb: 1 }} />
                <Skeleton width="50%" />
              </CardContent>
            </Card>
          ))}

        {!isLoadingFeed && posts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 6, opacity: 0.6 }}>
            <Typography variant="body1">No demos uploaded yet. Be the first to share one!</Typography>
          </Box>
        )}
      </Box>

      {/* COMMENTS DIALOG */}
      <Dialog
        open={!!commentPost}
        onClose={() => setCommentPost(null)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            backgroundImage: 'none',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Comments
          <IconButton size="small" onClick={() => setCommentPost(null)}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ maxHeight: 400, overflowY: 'auto' }}>
          {isLoadingComments ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress color="secondary" size={32} />
            </Box>
          ) : comments.length === 0 ? (
            <Typography variant="body2" align="center" color="text.secondary" sx={{ py: 4 }}>
              No comments yet. Start the conversation!
            </Typography>
          ) : (
            <List disablePadding>
              {comments.map((comment) => (
                <React.Fragment key={comment.id}>
                  <ListItem alignItems="flex-start" sx={{ px: 0, py: 1.5 }}>
                    <ListItemAvatar>
                      <UserAvatar
                        name={comment.author?.full_name}
                        avatarUrl={comment.author?.avatar_url}
                        roleType={comment.author?.role_type as any}
                        size={32}
                        showRing
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {comment.author?.full_name || 'Anonymous'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ mt: 0.5, color: 'text.primary' }}>
                          {comment.comment_text}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <TextField
            autoFocus
            fullWidth
            size="small"
            placeholder={user ? "Write a professional feedback..." : "Log in to add comment"}
            disabled={!user}
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAddComment();
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
            }}
          />
          <Button
            variant="contained"
            color="secondary"
            disabled={!user || !newCommentText.trim()}
            onClick={handleAddComment}
            sx={{ borderRadius: '12px', textTransform: 'none' }}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* REPOST / SHARE DIALOG */}
      <Dialog
        open={!!repostPostObj}
        onClose={() => setRepostPostObj(null)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            backgroundImage: 'none',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Repost Demo
          <IconButton size="small" onClick={() => setRepostPostObj(null)}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Share this project demo with your connections. Add your commentary explaining why this project stands out!
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Add your thoughts or why you recommend this project..."
            value={repostCommentary}
            onChange={(e) => setRepostCommentary(e.target.value)}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
            }}
          />

          {repostPostObj && (
            <Box
              sx={{
                p: 2,
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                bgcolor: 'rgba(255, 255, 255, 0.02)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <UserAvatar
                  name={repostPostObj.author?.full_name}
                  avatarUrl={repostPostObj.author?.avatar_url}
                  size={24}
                  showRing={false}
                />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {repostPostObj.author?.full_name}
                </Typography>
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {repostPostObj.title}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="text"
            onClick={() => setRepostPostObj(null)}
            sx={{ borderRadius: '12px', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={isSubmittingRepost}
            onClick={handleCreateRepost}
            sx={{ borderRadius: '12px', textTransform: 'none', px: 3 }}
          >
            {isSubmittingRepost ? <CircularProgress size={20} color="inherit" /> : 'Repost'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* POST OPTIONS DROPDOWN MENU */}
      <Menu
        anchorEl={postMenuAnchor}
        open={Boolean(postMenuAnchor)}
        onClose={handleClosePostMenu}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            backgroundImage: 'none',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            minWidth: 220,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
            '& .MuiMenuItem-root': {
              fontSize: '0.875rem',
              py: 1.2,
              px: 2,
              gap: 1.5,
              borderRadius: '8px',
              mx: 0.5,
              my: 0.25,
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.05)',
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {selectedMenuPost && user && selectedMenuPost.author_id === user.id ? (
          [
            <MenuItem key="toggle-likes" onClick={handleToggleLikesCount}>
              <ListItemIcon sx={{ minWidth: 'auto !important' }}>
                {selectedMenuPost.hide_likes_count ? (
                  <VisibilityRoundedIcon fontSize="small" color="secondary" />
                ) : (
                  <VisibilityOffRoundedIcon fontSize="small" />
                )}
              </ListItemIcon>
              {selectedMenuPost.hide_likes_count ? 'Show Likes Count' : 'Hide Likes Count'}
            </MenuItem>,

            <MenuItem key="toggle-comments" onClick={handleToggleCommentsCount}>
              <ListItemIcon sx={{ minWidth: 'auto !important' }}>
                {selectedMenuPost.hide_comments_count ? (
                  <ChatBubbleRoundedIcon fontSize="small" color="secondary" />
                ) : (
                  <SpeakerNotesOffRoundedIcon fontSize="small" />
                )}
              </ListItemIcon>
              {selectedMenuPost.hide_comments_count ? 'Turn On Commenting' : 'Turn Off Commenting'}
            </MenuItem>,

            <Divider key="divider" sx={{ my: '4px !important' }} />,

            <MenuItem
              key="delete"
              onClick={handleDeletePost}
              sx={{
                color: '#EF4444',
                '&:hover': {
                  bgcolor: 'rgba(239, 68, 68, 0.08) !important',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 'auto !important', color: '#EF4444' }}>
                <DeleteOutlineRoundedIcon fontSize="small" />
              </ListItemIcon>
              Delete Demo
            </MenuItem>,
          ]
        ) : (
          <MenuItem onClick={handleCopyLink}>
            <ListItemIcon sx={{ minWidth: 'auto !important' }}>
              <ContentCopyRoundedIcon fontSize="small" />
            </ListItemIcon>
            Copy Link to Demo
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default FeedPage;

