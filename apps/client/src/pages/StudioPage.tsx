// ==========================================
// StudioPage — Upload zone placeholder
// Drag-and-drop area + metadata form
// ==========================================

import React, { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LinearProgress from '@mui/material/LinearProgress';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import VideoFileRoundedIcon from '@mui/icons-material/VideoFileRounded';
import PhotoLibraryRoundedIcon from '@mui/icons-material/PhotoLibraryRounded';
import TechBadge from '../components/shared/TechBadge';

const TECH_OPTIONS = [
  'React', 'React Native', 'Next.js', 'Vue.js', 'Node.js', 'Express',
  'TypeScript', 'Python', 'Django', 'FastAPI', 'PostgreSQL', 'MongoDB',
  'Docker', 'AWS', 'FFmpeg', 'Flutter', 'Go', 'Rust',
];

const StudioPage: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [mediaType, setMediaType] = useState<'reel' | 'carousel' | null>(null);
  const [techStack, setTechStack] = useState<string[]>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Studio</Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Upload a 60-second project demo or architecture diagram carousel
      </Typography>

      {/* Media type selector */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
        {[
          { type: 'reel' as const, icon: <VideoFileRoundedIcon sx={{ fontSize: 32 }} />, label: 'Video Reel', desc: 'MP4 up to 60 seconds' },
          { type: 'carousel' as const, icon: <PhotoLibraryRoundedIcon sx={{ fontSize: 32 }} />, label: 'Image Carousel', desc: 'Up to 10 slides' },
        ].map((opt) => (
          <Card
            key={opt.type}
            onClick={() => setMediaType(opt.type)}
            sx={{
              p: 3, textAlign: 'center', cursor: 'pointer',
              border: '2px solid',
              borderColor: mediaType === opt.type ? 'primary.main' : 'divider',
              bgcolor: mediaType === opt.type ? 'rgba(79, 70, 229, 0.04)' : 'background.paper',
              '&:hover': { borderColor: 'primary.light' },
            }}
          >
            <Box sx={{ color: mediaType === opt.type ? 'primary.main' : 'text.secondary', mb: 1 }}>
              {opt.icon}
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>{opt.label}</Typography>
            <Typography variant="caption" color="text.secondary">{opt.desc}</Typography>
          </Card>
        ))}
      </Box>

      {/* Drop zone */}
      <Card
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); }}
        sx={{
          p: 6, mb: 3, textAlign: 'center', cursor: 'pointer',
          border: '2px dashed',
          borderColor: dragActive ? 'primary.main' : 'divider',
          bgcolor: dragActive ? 'rgba(79, 70, 229, 0.04)' : 'transparent',
          transition: 'all 0.25s ease',
          '&:hover': { borderColor: 'primary.light', bgcolor: 'rgba(79, 70, 229, 0.02)' },
        }}
      >
        <CloudUploadRoundedIcon
          sx={{ fontSize: 56, color: dragActive ? 'primary.main' : 'text.secondary', mb: 2 }}
        />
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          {dragActive ? 'Drop your file here' : 'Drag & drop your file here'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          or click to browse • {mediaType === 'carousel' ? 'PNG, JPG up to 10MB each' : 'MP4 up to 50MB'}
        </Typography>
        <Button variant="outlined" size="small">Browse Files</Button>
      </Card>

      {/* Upload progress placeholder */}
      <Box sx={{ mb: 3, display: 'none' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption">Uploading...</Typography>
          <Typography variant="caption">45%</Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={45}
          sx={{
            height: 6, borderRadius: 3,
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #4F46E5, #0D9488)',
            },
          }}
        />
      </Box>

      {/* Metadata form */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField fullWidth label="Project Title" placeholder="e.g., CallSentry — AI Spam Detection" required />
        <TextField fullWidth label="Description" placeholder="Walk through your architecture and key decisions..." multiline rows={3} />
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
        />
        <TextField fullWidth label="Collaborators" placeholder="@username1, @username2" />
        <Button variant="contained" size="large" fullWidth disabled sx={{ mt: 1 }}>
          Publish Demo
        </Button>
      </Box>
    </Box>
  );
};

export default StudioPage;
