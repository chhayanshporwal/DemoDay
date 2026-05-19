// ==========================================
// ProfilePage — Dynamic professional portfolio
// Posts Timeline | Projects Grid | Experience | Verified Credentials
// ==========================================

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';

// Icons
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import DynamicFeedRoundedIcon from '@mui/icons-material/DynamicFeedRounded';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import RepeatRoundedIcon from '@mui/icons-material/RepeatRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import SpeakerNotesOffRoundedIcon from '@mui/icons-material/SpeakerNotesOffRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';

// Components & Libs
import UserAvatar from '../components/shared/UserAvatar';
import TechBadge from '../components/shared/TechBadge';
import { useStore } from '../store/useStore';
import api from '../lib/axios';
import type { UserProfile, FeedPost, PostComment, RoleType } from '@demoday/shared';

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, pushToast } = useStore();

  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  // Social Modals / States
  const [commentPost, setCommentPost] = useState<FeedPost | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const [repostPostObj, setRepostPostObj] = useState<FeedPost | null>(null);
  const [repostCommentary, setRepostCommentary] = useState('');
  const [isSubmittingRepost, setIsSubmittingRepost] = useState(false);

  const [postMenuAnchor, setPostMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedMenuPost, setSelectedMenuPost] = useState<FeedPost | null>(null);

  const fetchProfileData = async () => {
    if (!id) return;
    try {
      setIsLoadingProfile(true);
      const res = await api.get(`/users/${id}/portfolio`);
      setProfileUser(res.data);
    } catch (err: any) {
      pushToast({
        message: err.response?.data?.message || 'Failed to load profile',
        severity: 'error',
      });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const fetchUserPosts = async () => {
    if (!id) return;
    try {
      setIsLoadingPosts(true);
      const res = await api.get(`/studio/feed`, {
        params: {
          author_id: id,
          limit: 50,
        },
      });
      setPosts(res.data.data);
    } catch (err: any) {
      pushToast({
        message: err.response?.data?.message || 'Failed to load posts',
        severity: 'error',
      });
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
    fetchUserPosts();
    setActiveTab(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleLikeClick = async (post: FeedPost) => {
    if (!currentUser) {
      pushToast({ message: 'Please log in to like posts', severity: 'info' });
      return;
    }
    
    // Optimistic local state update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === post.id) {
          const isLiked = !p.is_liked;
          return {
            ...p,
            is_liked: isLiked,
            likes_count: p.likes_count + (isLiked ? 1 : -1),
          };
        }
        return p;
      })
    );

    try {
      await api.post(`/studio/posts/${post.id}/like`);
    } catch (err: any) {
      // rollback
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === post.id) {
            const isLiked = !p.is_liked;
            return {
              ...p,
              is_liked: isLiked,
              likes_count: p.likes_count + (isLiked ? 1 : -1),
            };
          }
          return p;
        })
      );
      pushToast({
        message: err.response?.data?.message || 'Failed to like post',
        severity: 'error',
      });
    }
  };

  const handleSaveClick = async (post: FeedPost) => {
    if (!currentUser) {
      pushToast({ message: 'Please log in to save posts', severity: 'info' });
      return;
    }
    
    // Optimistic local state update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === post.id) {
          return { ...p, is_saved: !p.is_saved };
        }
        return p;
      })
    );

    try {
      await api.post(`/studio/posts/${post.id}/save`);
    } catch (err: any) {
      // rollback
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === post.id) {
            return { ...p, is_saved: !p.is_saved };
          }
          return p;
        })
      );
      pushToast({
        message: err.response?.data?.message || 'Failed to save post',
        severity: 'error',
      });
    }
  };

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
    if (!currentUser) {
      pushToast({ message: 'Please log in to comment', severity: 'info' });
      return;
    }

    try {
      const res = await api.post(`/studio/posts/${commentPost.id}/comments`, {
        comment_text: newCommentText,
      });
      setComments((prev) => [...prev, res.data]);
      setNewCommentText('');
      
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === commentPost.id) {
            return { ...p, comments_count: p.comments_count + 1 };
          }
          return p;
        })
      );
    } catch (err: any) {
      pushToast({
        message: err.response?.data?.message || 'Failed to add comment',
        severity: 'error',
      });
    }
  };

  const handleOpenRepost = (post: FeedPost) => {
    if (!currentUser) {
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
      fetchUserPosts();
      fetchProfileData();
    } catch (err: any) {
      pushToast({
        message: err.response?.data?.message || 'Failed to repost',
        severity: 'error',
      });
    } finally {
      setIsSubmittingRepost(false);
    }
  };

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
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === selectedMenuPost.id) {
            return { ...p, hide_likes_count: newHideState };
          }
          return p;
        })
      );
      handleClosePostMenu();

      await api.patch(`/studio/posts/${selectedMenuPost.id}`, {
        hide_likes_count: newHideState,
      });
    } catch (err: any) {
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === selectedMenuPost.id) {
            return { ...p, hide_likes_count: !newHideState };
          }
          return p;
        })
      );
      pushToast({ message: 'Failed to update settings', severity: 'error' });
    }
  };

  const handleToggleCommentsCount = async () => {
    if (!selectedMenuPost) return;
    const newHideState = !selectedMenuPost.hide_comments_count;
    try {
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === selectedMenuPost.id) {
            return { ...p, hide_comments_count: newHideState };
          }
          return p;
        })
      );
      handleClosePostMenu();

      await api.patch(`/studio/posts/${selectedMenuPost.id}`, {
        hide_comments_count: newHideState,
      });
    } catch (err: any) {
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === selectedMenuPost.id) {
            return { ...p, hide_comments_count: !newHideState };
          }
          return p;
        })
      );
      pushToast({ message: 'Failed to update settings', severity: 'error' });
    }
  };

  const handleDeletePost = async () => {
    if (!selectedMenuPost) return;
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    try {
      setPosts((prev) => prev.filter((p) => p.id !== selectedMenuPost.id));
      handleClosePostMenu();

      await api.delete(`/studio/posts/${selectedMenuPost.id}`);
      pushToast({ message: 'Post deleted successfully', severity: 'success' });
      fetchProfileData();
    } catch (err: any) {
      fetchUserPosts();
      pushToast({ message: 'Failed to delete post', severity: 'error' });
    }
  };

  const handleCopyLink = () => {
    if (!selectedMenuPost) return;
    const link = `${window.location.origin}/posts/${selectedMenuPost.id}`;
    navigator.clipboard.writeText(link).then(
      () => {
        pushToast({ message: 'Demo link copied to clipboard!', severity: 'success' });
        handleClosePostMenu();
      },
      () => {
        pushToast({ message: 'Failed to copy link', severity: 'error' });
      }
    );
  };

  const renderPostContent = (post: FeedPost, isNested: boolean = false) => {
    const isVideo = post.media_type === 'reel';
    const hasMedia = post.media_urls && post.media_urls.length > 0;

    return (
      <Card
        sx={{
          bgcolor: isNested ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
          border: isNested ? '1px dashed rgba(255, 255, 255, 0.12)' : 'none',
          borderRadius: isNested ? 2 : 0,
          boxShadow: 'none',
          overflow: 'hidden',
        }}
      >
        <CardHeader
          avatar={
            <UserAvatar
              name={post.author?.full_name}
              avatarUrl={post.author?.avatar_url}
              roleType={post.author?.role_type as RoleType}
              size={isNested ? 32 : 40}
              showRing={!isNested}
            />
          }
          title={
            <Typography variant={isNested ? 'body2' : 'body1'} sx={{ fontWeight: 600 }}>
              {post.author?.full_name || 'Someone'}
            </Typography>
          }
          subheader={
            <Typography variant="caption" color="text.secondary">
              {post.author?.headline || post.author?.role_type || 'Creator'} • {new Date(post.created_at).toLocaleDateString()}
            </Typography>
          }
          action={
            !isNested && (
              <IconButton size="small" onClick={(e) => handleOpenPostMenu(e, post)}>
                <MoreVertRoundedIcon fontSize="small" />
              </IconButton>
            )
          }
          sx={{ px: isNested ? 1.5 : 2, py: 1.5 }}
        />

        {/* Media Rendering */}
        {hasMedia ? (
          <Box
            sx={{
              width: '100%',
              maxHeight: isNested ? 200 : 360,
              overflow: 'hidden',
              borderRadius: isNested ? 1.5 : 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#000',
              aspectRatio: isNested ? '16 / 10' : undefined,
            }}
          >
            {isVideo ? (
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
          <Typography variant={isNested ? 'subtitle2' : 'h6'} sx={{ fontWeight: 600, mb: 1 }}>
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

          {!isNested && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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

              <IconButton
                size="small"
                onClick={() => handleOpenRepost(post)}
                sx={{ color: 'text.secondary' }}
              >
                <RepeatRoundedIcon fontSize="small" />
              </IconButton>

              <Box sx={{ flex: 1 }} />

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

  if (isLoadingProfile) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 3, mb: -6 }} />
        <Box sx={{ px: { xs: 2, md: 4 }, position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-end', gap: 2.5, mb: 3 }}>
          <Skeleton variant="circular" width={100} height={100} sx={{ border: '4px solid', borderColor: 'background.paper' }} />
          <Box sx={{ flex: 1, pb: 1 }}>
            <Skeleton width="40%" height={32} />
            <Skeleton width="60%" height={20} sx={{ mt: 1 }} />
          </Box>
        </Box>
        <Box sx={{ px: { xs: 2, md: 4 } }}>
          <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
            <Skeleton width={80} height={40} />
            <Skeleton width={80} height={40} />
            <Skeleton width={80} height={40} />
          </Box>
          <Skeleton width="100%" height={100} sx={{ mb: 2 }} />
        </Box>
      </Box>
    );
  }

  if (!profileUser) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="text.secondary">
          User portfolio not found.
        </Typography>
      </Box>
    );
  }

  const projectPosts = posts.filter((p) => !p.parent_post_id);

  return (
    <Box>
      {/* Header / Cover */}
      <Box
        sx={{
          height: 180,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 40%, #4F46E5 70%, #0D9488 100%)',
          mb: -6,
          position: 'relative',
        }}
      />

      {/* Profile info */}
      <Box sx={{ px: { xs: 2, md: 4 }, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2.5, mb: 2 }}>
          <UserAvatar
            name={profileUser.full_name}
            avatarUrl={profileUser.avatar_url}
            size={100}
            openToWork={profileUser.open_to_work}
            roleType={profileUser.role_type}
            sx={{ border: '4px solid', borderColor: 'background.paper' }}
          />
          <Box sx={{ flex: 1, pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {profileUser.full_name}
              </Typography>
              {profileUser.verified_badges?.length > 0 && (
                <VerifiedRoundedIcon sx={{ color: 'secondary.main', fontSize: 22 }} />
              )}
              {profileUser.open_to_work && (
                <Chip label="Open to Work" size="small" color="success" variant="outlined" sx={{ fontWeight: 600, height: 24 }} />
              )}
            </Box>
            <Typography color="text.secondary" sx={{ mt: 0.25 }}>
              {profileUser.headline || 'Professional Visual Portfolio'}
            </Typography>
          </Box>
          {currentUser?.id === profileUser.id && (
            <Button variant="outlined" startIcon={<EditRoundedIcon />} sx={{ flexShrink: 0, display: { xs: 'none', sm: 'flex' } }}>
              Edit Profile
            </Button>
          )}
        </Box>

        {/* Bio description */}
        {profileUser.bio && (
          <Typography variant="body2" sx={{ mb: 2.5, color: 'text.secondary', maxWidth: 700 }}>
            {profileUser.bio}
          </Typography>
        )}

        {/* Stats row */}
        <Box sx={{ display: 'flex', gap: 4, mb: 2.5 }}>
          {[
            { label: 'Posts', value: profileUser.post_count ?? 0 },
            { label: 'Connections', value: profileUser.connection_count ?? 0 },
            { label: 'Total Likes', value: profileUser.total_likes ?? 0 },
            { label: 'CGPA', value: profileUser.current_cgpa ? `${profileUser.current_cgpa}` : 'N/A' },
          ].map((stat) => (
            <Box key={stat.label}>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>{stat.value}</Typography>
              <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
            </Box>
          ))}
        </Box>

        {/* Tech stack */}
        {profileUser.tech_stack && profileUser.tech_stack.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 3 }}>
            {profileUser.tech_stack.map((t) => (
              <TechBadge key={t} label={t} />
            ))}
          </Box>
        )}

        <Divider sx={{ mb: 0 }} />

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{
            '& .MuiTab-root': { fontWeight: 600, textTransform: 'none', minHeight: 48 },
          }}
        >
          <Tab icon={<DynamicFeedRoundedIcon />} label="Posts" iconPosition="start" />
          <Tab icon={<GridViewRoundedIcon />} label="Projects" iconPosition="start" />
          <Tab icon={<TimelineRoundedIcon />} label="Experience" iconPosition="start" />
          <Tab icon={<ShieldRoundedIcon />} label="Credentials" iconPosition="start" />
        </Tabs>
      </Box>

      {/* Tab content */}
      <Box sx={{ mt: 3, px: { xs: 2, md: 4 } }}>
        {/* Posts activity timeline */}
        {activeTab === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 560, mx: 'auto', px: 1, pb: 6 }}>
            {isLoadingPosts ? (
              [1, 2].map((i) => (
                <Card key={i} sx={{ p: 2, background: 'rgba(30, 41, 59, 0.4)', borderRadius: 3 }}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton width="40%" height={20} />
                      <Skeleton width="20%" height={15} />
                    </Box>
                  </Box>
                  <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 2 }} />
                  <Skeleton width="60%" height={24} sx={{ mb: 1 }} />
                  <Skeleton width="90%" height={16} />
                </Card>
              ))
            ) : posts.length === 0 ? (
              <Card
                sx={{
                  p: 4,
                  textAlign: 'center',
                  background: 'rgba(30, 41, 59, 0.2)',
                  border: '1px dashed rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                }}
              >
                <DynamicFeedRoundedIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  No posts yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  When {profileUser.full_name} shares project showcases or reposts connection updates, they will appear here.
                </Typography>
              </Card>
            ) : (
              posts.map((post) => {
                const isRepost = !!post.parent_post_id;
                return (
                  <Card
                    key={post.id}
                    sx={{
                      overflow: 'visible',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      background: 'rgba(30, 41, 59, 0.4)',
                      backdropFilter: 'blur(16px)',
                      borderRadius: 3,
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
                      renderPostContent(post)
                    )}
                  </Card>
                );
              })
            )}
          </Box>
        )}

        {/* Projects visual Showcase Grid */}
        {activeTab === 1 && (
          <Box sx={{ columnCount: { xs: 1, sm: 2, md: 3 }, columnGap: '16px', px: 1, pb: 6 }}>
            {isLoadingPosts ? (
              [1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rectangular" height={180 + i * 20} sx={{ borderRadius: 3, mb: 2 }} />
              ))
            ) : projectPosts.length === 0 ? (
              <Card
                sx={{
                  p: 4,
                  textAlign: 'center',
                  background: 'rgba(30, 41, 59, 0.2)',
                  border: '1px dashed rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  width: '100%',
                }}
              >
                <GridViewRoundedIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  No original showcase items yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  When {profileUser.full_name} shares projects and original demos, they will appear here in a premium visual showcase.
                </Typography>
              </Card>
            ) : (
              projectPosts.map((p, i) => {
                const hasMedia = p.media_urls && p.media_urls.length > 0;
                const height = 180 + (i % 3) * 30;
                return (
                  <Card
                    key={p.id}
                    onClick={() => handleOpenComments(p)}
                    sx={{
                      mb: 2,
                      breakInside: 'avoid',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      borderRadius: 3,
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      background: 'rgba(15, 23, 42, 0.6)',
                      '&:hover .overlay': { opacity: 1 },
                      '&:hover img, &:hover video': { transform: 'scale(1.05)' },
                    }}
                  >
                    <Box sx={{ height, position: 'relative', overflow: 'hidden' }}>
                      {hasMedia ? (
                        p.media_type === 'reel' ? (
                          <video
                            src={p.media_urls[0]}
                            muted
                            playsInline
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                          />
                        ) : (
                          <img
                            src={p.media_urls[0]}
                            alt={p.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                          />
                        )
                      ) : (
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            background: `linear-gradient(${135 + (i * 30)}deg, #1E1B4B 0%, #0B0F1A 60%, #134E4A 100%)`,
                          }}
                        />
                      )}

                      <Box
                        className="overlay"
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.6) 50%, rgba(15,23,42,0.1) 100%)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                          p: 2,
                          opacity: 0.85,
                          transition: 'opacity 0.25s ease',
                        }}
                      >
                        <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', mb: 0.5 }}>
                          {p.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {p.tech_stack?.slice(0, 3).map((s) => (
                            <TechBadge key={s} label={s} active sx={{ height: 20, fontSize: '0.65rem' }} />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                );
              })
            )}
          </Box>
        )}

        {/* Experience Timeline */}
        {activeTab === 2 && (
          <Box sx={{ maxWidth: 600, mx: 'auto', px: 1, pb: 6 }}>
            {profileUser.institution && (
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Box sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  flexShrink: 0,
                  bgcolor: 'secondary.main',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <SchoolRoundedIcon />
                </Box>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>Education Showcase</Typography>
                  <Typography variant="body2" color="text.secondary">{profileUser.institution.name} · {profileUser.role_type === 'creator' ? 'Student' : 'Alumnus'}</Typography>
                  {profileUser.current_cgpa && (
                    <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500, color: 'success.main' }}>
                      CGPA Score: {profileUser.current_cgpa} / 10
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Box sx={{
                width: 44, height: 44, borderRadius: '12px', flexShrink: 0,
                bgcolor: 'primary.main', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <WorkRoundedIcon />
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Full-Stack Software Engineering</Typography>
                <Typography variant="body2" color="text.secondary">Independent Developer & Creator · 2024 - Present</Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  Building interactive open-source projects, demo applications, and high-impact visual showcases on DemoDay.
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Credentials */}
        {activeTab === 3 && (
          <Box sx={{ maxWidth: 500, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 2, px: 1, pb: 6 }}>
            {profileUser.institution ? (
              <Card sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5, background: 'rgba(30, 41, 59, 0.4)' }}>
                <Box sx={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  bgcolor: profileUser.institution.verified ? 'rgba(13, 148, 136, 0.1)' : 'action.hover',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <VerifiedRoundedIcon sx={{ color: profileUser.institution.verified ? 'secondary.main' : 'text.secondary' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{profileUser.institution.name} — Student Enrollment</Typography>
                  <Typography variant="caption" color={profileUser.institution.verified ? 'secondary.main' : 'text.secondary'}>
                    {profileUser.institution.verified ? '✓ Verified Student' : 'Enrollment pending verification'}
                  </Typography>
                </Box>
              </Card>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                No educational institution linked yet.
              </Typography>
            )}

            {[
              { label: 'GitHub — 200+ Contributions (2025)', verified: true },
              { label: 'AWS Certified Cloud Practitioner', verified: false },
            ].map((cred, i) => (
              <Card key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5, background: 'rgba(30, 41, 59, 0.4)' }}>
                <Box sx={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  bgcolor: cred.verified ? 'rgba(13, 148, 136, 0.1)' : 'action.hover',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <VerifiedRoundedIcon sx={{ color: cred.verified ? 'secondary.main' : 'text.secondary' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{cred.label}</Typography>
                  <Typography variant="caption" color={cred.verified ? 'secondary.main' : 'text.secondary'}>
                    {cred.verified ? '✓ Verified' : 'Pending verification'}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* --- Comments dialog --- */}
      <Dialog
        open={Boolean(commentPost)}
        onClose={() => setCommentPost(null)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Comments
          </Typography>
          <IconButton
            onClick={() => setCommentPost(null)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'text.secondary',
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.08)', p: 2 }}>
          {isLoadingComments ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : comments.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No comments yet. Be the first to share your thoughts!
            </Typography>
          ) : (
            <List disablePadding>
              {comments.map((comment) => (
                <ListItem key={comment.id} alignItems="flex-start" sx={{ px: 0, py: 1.5 }}>
                  <ListItemAvatar>
                    <UserAvatar
                      name={comment.author?.full_name}
                      avatarUrl={comment.author?.avatar_url}
                      roleType={comment.author?.role_type as RoleType}
                      size={36}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {comment.author?.full_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: 'text.primary', mt: 0.5 }}>
                        {comment.comment_text}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Write a comment..."
            size="small"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddComment();
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(255,255,255,0.03)',
                borderRadius: 2,
              },
            }}
          />
          <Button variant="contained" color="secondary" onClick={handleAddComment} disabled={!newCommentText.trim()}>
            Post
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- Repost dialog --- */}
      <Dialog
        open={Boolean(repostPostObj)}
        onClose={() => setRepostPostObj(null)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Repost Showcase Demo
          </Typography>
          <IconButton
            onClick={() => setRepostPostObj(null)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'text.secondary',
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.08)', p: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="What's your take on this project? Share your thoughts..."
            value={repostCommentary}
            onChange={(e) => setRepostCommentary(e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(255,255,255,0.03)',
                borderRadius: 2,
              },
            }}
          />
          {repostPostObj && (
            <Box sx={{ border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 2, p: 1.5, pointerEvents: 'none' }}>
              <Box sx={{ display: 'flex', gap: 1.5, mb: 1 }}>
                <UserAvatar
                  name={repostPostObj.author?.full_name}
                  avatarUrl={repostPostObj.author?.avatar_url}
                  roleType={repostPostObj.author?.role_type as RoleType}
                  size={32}
                />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {repostPostObj.author?.full_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {repostPostObj.author?.headline}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                {repostPostObj.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                {repostPostObj.description}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRepostPostObj(null)} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCreateRepost}
            disabled={isSubmittingRepost}
            startIcon={isSubmittingRepost ? <CircularProgress size={16} /> : <RepeatRoundedIcon />}
          >
            {isSubmittingRepost ? 'Reposting...' : 'Repost'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- Three-dots post menu --- */}
      <Menu
        anchorEl={postMenuAnchor}
        open={Boolean(postMenuAnchor)}
        onClose={handleClosePostMenu}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            minWidth: 180,
          },
        }}
      >
        {selectedMenuPost && currentUser && selectedMenuPost.author_id === currentUser.id ? [
          <MenuItem key="likes" onClick={handleToggleLikesCount}>
            <ListItemIcon sx={{ color: 'text.secondary' }}>
              {selectedMenuPost.hide_likes_count ? <VisibilityRoundedIcon fontSize="small" /> : <VisibilityOffRoundedIcon fontSize="small" />}
            </ListItemIcon>
            <Typography variant="body2">
              {selectedMenuPost.hide_likes_count ? 'Show Likes Count' : 'Hide Likes Count'}
            </Typography>
          </MenuItem>,
          <MenuItem key="comments" onClick={handleToggleCommentsCount}>
            <ListItemIcon sx={{ color: 'text.secondary' }}>
              {selectedMenuPost.hide_comments_count ? <ChatBubbleRoundedIcon fontSize="small" /> : <SpeakerNotesOffRoundedIcon fontSize="small" />}
            </ListItemIcon>
            <Typography variant="body2">
              {selectedMenuPost.hide_comments_count ? 'Turn On Commenting' : 'Turn Off Commenting'}
            </Typography>
          </MenuItem>,
          <Divider key="divider" sx={{ my: 0.5, borderColor: 'rgba(255,255,255,0.06)' }} />,
          <MenuItem key="delete" onClick={handleDeletePost} sx={{ color: '#EF4444' }}>
            <ListItemIcon sx={{ color: '#EF4444' }}>
              <DeleteOutlineRoundedIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="body2">Delete Post</Typography>
          </MenuItem>
        ] : (
          <MenuItem onClick={handleCopyLink}>
            <ListItemIcon sx={{ color: 'text.secondary' }}>
              <ContentCopyRoundedIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="body2">Copy Link to Demo</Typography>
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default ProfilePage;
