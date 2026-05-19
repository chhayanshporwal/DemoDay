// ==========================================
// OnboardingPage — Role selection + tech stack picker
// Step 1: Creator vs Recruiter, Step 2: Tech stacks
// ==========================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import BusinessCenterRoundedIcon from '@mui/icons-material/BusinessCenterRounded';
import type { RoleType } from '@demoday/shared';
import TechBadge from '../components/shared/TechBadge';
import { useStore } from '../store/useStore';
import supabase from '../lib/supabase';
import api from '../lib/axios';

const TECH_OPTIONS = [
  'React', 'React Native', 'Next.js', 'Vue.js', 'Angular', 'Svelte',
  'Node.js', 'Express', 'NestJS', 'Django', 'Flask', 'FastAPI',
  'TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'Rust', 'C++',
  'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API',
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure',
  'TensorFlow', 'PyTorch', 'FFmpeg', 'WebRTC',
  'Figma', 'Flutter', 'Swift', 'Kotlin',
];

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, accessToken, isLoading, setUser } = useStore();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<RoleType | null>(null);
  const [techStacks, setTechStacks] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading) {
      if (!accessToken) {
        navigate('/login', { replace: true });
      } else if (user) {
        navigate('/', { replace: true });
      }
    }
  }, [user, accessToken, isLoading, navigate]);

  const handleComplete = async () => {
    try {
      const { data: { user: supabaseUser }, error: userError } = await supabase.auth.getUser();
      if (userError || !supabaseUser) {
        throw new Error('Supabase user session not found');
      }

      // Sync user profile to backend PostgreSQL
      const response = await api.post('/users/sync', {
        email: supabaseUser.email,
        full_name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
        role_type: role,
        avatar_url: supabaseUser.user_metadata?.avatar_url || null,
        tech_stack: techStacks,
      });

      // Update local Zustand store
      setUser(response.data.data);
      navigate('/', { replace: true });
    } catch (err: any) {
      console.error('[Onboarding] Sync failed:', err);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress size={48} sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      {/* Progress */}
      <Box sx={{ width: '100%', maxWidth: 500, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" color="text.secondary">Step {step} of 2</Typography>
          <Typography variant="caption" color="text.secondary">{step * 50}%</Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={step * 50}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: 'divider',
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
              background: 'linear-gradient(90deg, #4F46E5, #0D9488)',
            },
          }}
        />
      </Box>

      {/* Step 1: Role Selection */}
      {step === 1 && (
        <Box sx={{ maxWidth: 600, width: '100%', animation: 'fadeIn 0.4s ease' }}>
          <Typography variant="h3" sx={{ textAlign: 'center', mb: 1, fontWeight: 700 }}>
            What brings you to DemoDay?
          </Typography>
          <Typography color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
            This helps us personalize your experience
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
            {[
              {
                type: 'creator' as RoleType,
                icon: <CodeRoundedIcon sx={{ fontSize: 40 }} />,
                title: 'I\'m a Creator',
                desc: 'I build software and want to showcase my projects to get hired.',
              },
              {
                type: 'recruiter' as RoleType,
                icon: <BusinessCenterRoundedIcon sx={{ fontSize: 40 }} />,
                title: 'I\'m a Recruiter',
                desc: 'I hire tech talent and want to discover candidates visually.',
              },
            ].map((opt) => (
              <Card
                key={opt.type}
                onClick={() => setRole(opt.type)}
                sx={{
                  cursor: 'pointer',
                  border: '2px solid',
                  borderColor: role === opt.type ? 'primary.main' : 'divider',
                  bgcolor: role === opt.type ? 'rgba(79, 70, 229, 0.04)' : 'background.paper',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    borderColor: 'primary.light',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(79, 70, 229, 0.12)',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Box sx={{ color: role === opt.type ? 'primary.main' : 'text.secondary', mb: 2 }}>
                    {opt.icon}
                  </Box>
                  <Typography variant="h5" sx={{ mb: 1 }}>{opt.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{opt.desc}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              disabled={!role}
              onClick={() => setStep(2)}
              sx={{ minWidth: 200 }}
            >
              Continue
            </Button>
          </Box>
        </Box>
      )}

      {/* Step 2: Tech Stack Picker */}
      {step === 2 && (
        <Box sx={{ maxWidth: 550, width: '100%', animation: 'fadeIn 0.4s ease' }}>
          <Typography variant="h3" sx={{ textAlign: 'center', mb: 1, fontWeight: 700 }}>
            {role === 'creator' ? 'What do you build with?' : 'What skills are you hiring for?'}
          </Typography>
          <Typography color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
            Select at least 3 technologies to personalize your feed
          </Typography>

          <Autocomplete
            multiple
            options={TECH_OPTIONS.filter((t) => !techStacks.includes(t))}
            value={techStacks}
            onChange={(_, newVal) => setTechStacks(newVal)}
            renderInput={(params) => (
              <TextField {...params} placeholder="Search technologies..." />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...rest } = getTagProps({ index });
                return <TechBadge key={key} label={option} active {...rest} />;
              })
            }
            sx={{ mb: 3 }}
          />

          {/* Quick-select chips */}
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
            Popular picks
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 4 }}>
            {TECH_OPTIONS.slice(0, 15).map((tech) => (
              <Chip
                key={tech}
                label={tech}
                size="small"
                variant={techStacks.includes(tech) ? 'filled' : 'outlined'}
                color={techStacks.includes(tech) ? 'primary' : 'default'}
                onClick={() =>
                  setTechStacks((prev) =>
                    prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
                  )
                }
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="outlined" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              variant="contained"
              size="large"
              disabled={techStacks.length < 3}
              onClick={handleComplete}
              sx={{ minWidth: 200 }}
            >
              Launch DemoDay 🚀
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default OnboardingPage;
