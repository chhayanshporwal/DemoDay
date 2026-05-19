// ==========================================
// StudioPage — Dynamic project demo publisher
// Metadata form + switches to hide likes and comments count
// ==========================================

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import VideoFileRoundedIcon from '@mui/icons-material/VideoFileRounded';
import PhotoLibraryRoundedIcon from '@mui/icons-material/PhotoLibraryRounded';
import TechBadge from '../components/shared/TechBadge';
import { useStore } from '../store/useStore';
import api from '../lib/axios';
import { useNavigate } from 'react-router-dom';

const TECH_OPTIONS = [
  'React', 'React Native', 'Next.js', 'Vue.js', 'Node.js', 'Express',
  'TypeScript', 'Python', 'Django', 'FastAPI', 'PostgreSQL', 'MongoDB',
  'Docker', 'AWS', 'FFmpeg', 'Flutter', 'Go', 'Rust', 'TensorFlow', 'WebRTC',
];

const StudioPage: React.FC = () => {
  const navigate = useNavigate();
  const { pushToast, user } = useStore();

  const [mediaType, setMediaType] = useState<'reel' | 'carousel'>('reel');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [customMediaUrl, setCustomMediaUrl] = useState('');
  const [hideLikesCount, setHideLikesCount] = useState(false);
  const [hideCommentsCount, setHideCommentsCount] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      pushToast({ message: 'You must be logged in to publish a demo', severity: 'error' });
      return;
    }

    if (!title.trim()) {
      pushToast({ message: 'Please enter a project title', severity: 'warning' });
      return;
    }

    // Default sample/mock video or image if none provided
    const mediaUrl = customMediaUrl.trim() || (
      mediaType === 'reel'
        ? 'https://assets.mixkit.co/videos/preview/mixkit-coding-on-laptop-with-colored-lights-around-42867-large.mp4'
        : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'
    );

    try {
      setIsPublishing(true);
      await api.post('/studio/posts', {
        title,
        description: description || undefined,
        media_type: mediaType,
        media_urls: [mediaUrl],
        tech_stack: techStack,
        hide_likes_count: hideLikesCount,
        hide_comments_count: hideCommentsCount,
      });

      pushToast({ message: 'Demo published successfully!', severity: 'success' });
      navigate('/');
    } catch (err: any) {
      pushToast({
        message: err.response?.data?.message || 'Failed to publish post',
        severity: 'error',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', px: 2, pb: 8 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Studio</Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Publish your project demo, coding walk-through, or product design.
      </Typography>

      <Box component="form" onSubmit={handlePublish} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Media type selector */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {[
            { type: 'reel' as const, icon: <VideoFileRoundedIcon sx={{ fontSize: 24 }} />, label: 'Video Reel', desc: 'Demo reel / video walk-through' },
            { type: 'carousel' as const, icon: <PhotoLibraryRoundedIcon sx={{ fontSize: 24 }} />, label: 'Image Deck', desc: 'Architecture slides / screenshot deck' },
          ].map((opt) => (
            <Card
              key={opt.type}
              onClick={() => setMediaType(opt.type)}
              sx={{
                p: 2, textAlign: 'center', cursor: 'pointer',
                border: '2px solid',
                borderColor: mediaType === opt.type ? 'primary.main' : 'divider',
                bgcolor: mediaType === opt.type ? 'rgba(79, 70, 229, 0.04)' : 'background.paper',
                transition: 'all 0.2s ease',
                '&:hover': { borderColor: 'primary.light' },
              }}
            >
              <Box sx={{ color: mediaType === opt.type ? 'primary.main' : 'text.secondary', mb: 0.5 }}>
                {opt.icon}
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{opt.label}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>{opt.desc}</Typography>
            </Card>
          ))}
        </Box>

        {/* Optional Media URL Paste for testing / direct embedding */}
        <TextField
          fullWidth
          label="Demo Media URL (Optional)"
          placeholder={mediaType === 'reel' ? 'Paste direct video URL (.mp4) or leave blank for a tech sample video' : 'Paste direct image URL (.png, .jpg) or leave blank'}
          value={customMediaUrl}
          onChange={(e) => setCustomMediaUrl(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': { borderRadius: '12px' },
          }}
        />

        {/* Metadata form */}
        <TextField
          fullWidth
          label="Project Title"
          placeholder="e.g., CallSentry — AI Spam Detection App"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': { borderRadius: '12px' },
          }}
        />

        <TextField
          fullWidth
          label="Description"
          placeholder="What problem did you solve? Walk through your architecture and key engineering challenges..."
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': { borderRadius: '12px' },
          }}
        />

        <Autocomplete
          multiple
          options={TECH_OPTIONS}
          value={techStack}
          onChange={(_, val) => setTechStack(val)}
          renderInput={(params) => <TextField {...params} label="Tech Stack" placeholder="Add technologies..." />}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => {
              const { key, ...rest } = getTagProps({ index });
              return <TechBadge key={key} label={option} active {...rest} />;
            })
          }
          sx={{
            '& .MuiOutlinedInput-root': { borderRadius: '12px' },
          }}
        />

        {/* Post Display Toggles */}
        <Card
          sx={{
            p: 2,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            bgcolor: 'rgba(255, 255, 255, 0.01)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>
            Advanced Settings (Visibility & Engagement)
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={hideLikesCount}
                onChange={(e) => setHideLikesCount(e.target.checked)}
                color="secondary"
              />
            }
            label={
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>Hide Likes Count</Typography>
                <Typography variant="caption" color="text.secondary">Only you will see the total number of likes on this post</Typography>
              </Box>
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={hideCommentsCount}
                onChange={(e) => setHideCommentsCount(e.target.checked)}
                color="secondary"
              />
            }
            label={
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>Turn Off Commenting</Typography>
                <Typography variant="caption" color="text.secondary">Prevent other users from leaving comments on this post</Typography>
              </Box>
            }
          />
        </Card>

        <Button
          type="submit"
          variant="contained"
          color="secondary"
          size="large"
          fullWidth
          disabled={isPublishing}
          sx={{
            mt: 2,
            py: 1.5,
            borderRadius: '12px',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          {isPublishing ? 'Publishing Demo...' : 'Publish Demo'}
        </Button>
      </Box>
    </Box>
  );
};

export default StudioPage;
