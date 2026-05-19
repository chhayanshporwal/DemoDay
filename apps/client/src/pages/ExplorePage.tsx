// ==========================================
// ExplorePage — Masonry talent grid + filter chips
// Recruiter-facing discovery dashboard
// ==========================================

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import IconButton from '@mui/material/IconButton';
import TechBadge from '../components/shared/TechBadge';
import UserAvatar from '../components/shared/UserAvatar';

const FILTER_CHIPS = ['React', 'Node.js', 'Python', 'TypeScript', 'AWS', 'Docker', 'Flutter', 'Go'];
const ROLES = ['All', 'Frontend', 'Backend', 'Full-Stack', 'Mobile', 'DevOps', 'ML/AI'];

const MOCK_PROJECTS = [
  { id: '1', title: 'AI Chat Platform', author: 'Chhayansh P.', stack: ['React', 'FastAPI'], likes: 142, h: 280 },
  { id: '2', title: 'E-commerce Dashboard', author: 'Aditya S.', stack: ['Next.js', 'Prisma'], likes: 89, h: 320 },
  { id: '3', title: 'Music Streaming App', author: 'Priya P.', stack: ['Flutter', 'Go'], likes: 256, h: 250 },
  { id: '4', title: 'DevOps Pipeline Tool', author: 'Rahul K.', stack: ['Docker', 'AWS'], likes: 67, h: 300 },
  { id: '5', title: 'Voice Assistant SDK', author: 'Ananya M.', stack: ['Python', 'WebRTC'], likes: 198, h: 270 },
  { id: '6', title: 'Blockchain Wallet', author: 'Vikram J.', stack: ['Rust', 'React'], likes: 312, h: 290 },
];

const ExplorePage: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [activeRole, setActiveRole] = useState('All');

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Explore</Typography>
        <IconButton><TuneRoundedIcon /></IconButton>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search projects, creators, or skills..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2.5 }}
      />

      {/* Role tabs */}
      <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1, mb: 2, '&::-webkit-scrollbar': { display: 'none' } }}>
        {ROLES.map((role) => (
          <Chip
            key={role}
            label={role}
            variant={activeRole === role ? 'filled' : 'outlined'}
            color={activeRole === role ? 'primary' : 'default'}
            onClick={() => setActiveRole(role)}
            sx={{ cursor: 'pointer', flexShrink: 0 }}
          />
        ))}
      </Box>

      {/* Tech filter chips */}
      <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 3 }}>
        {FILTER_CHIPS.map((tech) => (
          <TechBadge
            key={tech}
            label={tech}
            active={activeFilters.includes(tech)}
            onClick={() => toggleFilter(tech)}
            sx={{ cursor: 'pointer' }}
          />
        ))}
      </Box>

      {/* Masonry grid */}
      <Box
        sx={{
          columnCount: { xs: 1, sm: 2, lg: 3 },
          columnGap: '16px',
        }}
      >
        {MOCK_PROJECTS.map((project) => (
          <Card
            key={project.id}
            sx={{
              mb: 2,
              breakInside: 'avoid',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative',
              '&:hover .project-overlay': {
                opacity: 1,
              },
              '&:hover img, &:hover .placeholder-bg': {
                transform: 'scale(1.03)',
              },
            }}
          >
            {/* Thumbnail */}
            <Box
              className="placeholder-bg"
              sx={{
                height: project.h,
                background: `linear-gradient(${135 + parseInt(project.id) * 30}deg, #1E1B4B, #0B0F1A, #134E4A)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.4s ease',
              }}
            >
              <Typography sx={{ color: '#475569', fontSize: '0.8rem' }}>🎬 Preview</Typography>
            </Box>

            {/* Hover overlay */}
            <Box
              className="project-overlay"
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(transparent 40%, rgba(0,0,0,0.85))',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                p: 2,
              }}
            >
              <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', mb: 0.5 }}>
                {project.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <UserAvatar name={project.author} size={22} showRing={false} />
                <Typography sx={{ color: '#CBD5E1', fontSize: '0.75rem' }}>
                  {project.author}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {project.stack.map((t) => (
                  <TechBadge key={t} label={t} active sx={{ height: 22, fontSize: '0.65rem' }} />
                ))}
              </Box>
            </Box>
          </Card>
        ))}
      </Box>

      {/* Loading skeletons */}
      <Box sx={{ columnCount: { xs: 1, sm: 2, lg: 3 }, columnGap: '16px', mt: 1 }}>
        {[260, 300, 240].map((h, i) => (
          <Skeleton key={i} variant="rounded" height={h} sx={{ mb: 2, borderRadius: 2, breakInside: 'avoid' }} />
        ))}
      </Box>
    </Box>
  );
};

export default ExplorePage;
