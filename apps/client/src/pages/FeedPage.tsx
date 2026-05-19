// ==========================================
// FeedPage — Home feed with skeleton loading
// Vertical reel cards, infinite scroll placeholder
// ==========================================

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import UserAvatar from '../components/shared/UserAvatar';
import TechBadge from '../components/shared/TechBadge';

const MOCK_POSTS = [
  {
    id: '1',
    author: { full_name: 'Chhayansh Porwal', username: 'chhayansh', avatar_url: null },
    title: 'CallSentry — AI Spam Detection App',
    tech_stack: ['React Native', 'Python', 'TensorFlow'],
    likes_count: 142,
    comments_count: 23,
  },
  {
    id: '2',
    author: { full_name: 'Aditya Sharma', username: 'aditya_dev', avatar_url: null },
    title: 'Real-Time Collaborative Code Editor',
    tech_stack: ['Next.js', 'WebRTC', 'Redis'],
    likes_count: 89,
    comments_count: 15,
  },
  {
    id: '3',
    author: { full_name: 'Priya Patel', username: 'priya_codes', avatar_url: null },
    title: 'Voice-RAG Portfolio Assistant',
    tech_stack: ['FastAPI', 'LangChain', 'ChromaDB'],
    likes_count: 256,
    comments_count: 41,
  },
];

const FeedPage: React.FC = () => {
  return (
    <Box sx={{ maxWidth: 560, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Home
      </Typography>

      {/* Feed cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {MOCK_POSTS.map((post) => (
          <Card key={post.id} sx={{ overflow: 'visible' }}>
            <CardHeader
              avatar={<UserAvatar name={post.author.full_name} size={38} openToWork showRing />}
              title={
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {post.author.full_name}
                </Typography>
              }
              subheader={
                <Typography variant="caption" color="text.secondary">
                  @{post.author.username} · 2h ago
                </Typography>
              }
              sx={{ pb: 1 }}
            />

            {/* Video placeholder */}
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
                background: 'linear-gradient(135deg, #1E1B4B 0%, #0B0F1A 50%, #134E4A 100%)',
              }}
            >
              <Typography sx={{ color: '#64748B', fontSize: '0.85rem' }}>
                📹 Reel Preview
              </Typography>
            </Box>

            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {post.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 2 }}>
                {post.tech_stack.map((tech) => (
                  <TechBadge key={tech} label={tech} />
                ))}
              </Box>

              {/* Engagement row */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton size="small" sx={{ color: 'text.secondary' }}>
                  <FavoriteBorderRoundedIcon fontSize="small" />
                </IconButton>
                <Typography variant="caption" color="text.secondary" sx={{ mr: 1.5 }}>
                  {post.likes_count}
                </Typography>
                <IconButton size="small" sx={{ color: 'text.secondary' }}>
                  <ChatBubbleOutlineRoundedIcon fontSize="small" />
                </IconButton>
                <Typography variant="caption" color="text.secondary" sx={{ mr: 1.5 }}>
                  {post.comments_count}
                </Typography>
                <Box sx={{ flex: 1 }} />
                <IconButton size="small" sx={{ color: 'text.secondary' }}>
                  <BookmarkBorderRoundedIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ color: 'text.secondary' }}>
                  <ShareRoundedIcon fontSize="small" />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}

        {/* Loading skeletons */}
        {[1, 2].map((i) => (
          <Card key={`skel-${i}`}>
            <CardHeader
              avatar={<Skeleton variant="circular" width={38} height={38} />}
              title={<Skeleton width="40%" />}
              subheader={<Skeleton width="25%" />}
            />
            <Skeleton variant="rectangular" sx={{ aspectRatio: '9 / 16' }} />
            <CardContent>
              <Skeleton width="70%" sx={{ mb: 1 }} />
              <Skeleton width="50%" />
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default FeedPage;
