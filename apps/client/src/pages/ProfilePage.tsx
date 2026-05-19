// ==========================================
// ProfilePage — 3-tab visual portfolio
// Project Grid | Experience Timeline | Verified Credentials
// ==========================================

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import UserAvatar from '../components/shared/UserAvatar';
import TechBadge from '../components/shared/TechBadge';

const MOCK_PROJECTS = [
  { id: '1', title: 'CallSentry', stack: ['React Native', 'Python'], h: 200 },
  { id: '2', title: 'Voice-RAG Assistant', stack: ['FastAPI', 'LangChain'], h: 240 },
  { id: '3', title: 'Portfolio Hub', stack: ['Next.js', 'TypeScript'], h: 180 },
  { id: '4', title: 'Edvance LMS', stack: ['React', 'Node.js'], h: 220 },
  { id: '5', title: 'Live Transcriber', stack: ['WebRTC', 'FFmpeg'], h: 200 },
  { id: '6', title: 'CI/CD Dashboard', stack: ['Docker', 'Go'], h: 260 },
];

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

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
            name="Chhayansh Porwal"
            size={100}
            openToWork
            roleType="creator"
            sx={{ border: '4px solid', borderColor: 'background.paper' }}
          />
          <Box sx={{ flex: 1, pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>Chhayansh Porwal</Typography>
              <VerifiedRoundedIcon sx={{ color: 'secondary.main', fontSize: 22 }} />
              <Chip label="Open to Work" size="small" color="success" variant="outlined" sx={{ fontWeight: 600, height: 24 }} />
            </Box>
            <Typography color="text.secondary" sx={{ mt: 0.25 }}>
              3rd Year CSE Undergraduate | Full-Stack · Rajasthan Technical University
            </Typography>
          </Box>
          <Button variant="outlined" startIcon={<EditRoundedIcon />} sx={{ flexShrink: 0, display: { xs: 'none', sm: 'flex' } }}>
            Edit Profile
          </Button>
        </Box>

        {/* Stats row */}
        <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
          {[
            { label: 'Projects', value: '12' },
            { label: 'Connections', value: '847' },
            { label: 'Total Likes', value: '2.4k' },
            { label: 'CGPA', value: '8.67' },
          ].map((stat) => (
            <Box key={stat.label}>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>{stat.value}</Typography>
              <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
            </Box>
          ))}
        </Box>

        {/* Tech stack */}
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 3 }}>
          {['React', 'React Native', 'Node.js', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'Docker'].map((t) => (
            <TechBadge key={t} label={t} />
          ))}
        </Box>

        <Divider sx={{ mb: 0 }} />

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{
            '& .MuiTab-root': { fontWeight: 600, textTransform: 'none', minHeight: 48 },
          }}
        >
          <Tab icon={<GridViewRoundedIcon />} label="Projects" iconPosition="start" />
          <Tab icon={<TimelineRoundedIcon />} label="Experience" iconPosition="start" />
          <Tab icon={<ShieldRoundedIcon />} label="Credentials" iconPosition="start" />
        </Tabs>
      </Box>

      {/* Tab content */}
      <Box sx={{ mt: 3 }}>
        {/* Projects Grid */}
        {activeTab === 0 && (
          <Box sx={{ columnCount: { xs: 2, md: 3 }, columnGap: '12px' }}>
            {MOCK_PROJECTS.map((p) => (
              <Card
                key={p.id}
                sx={{
                  mb: 1.5, breakInside: 'avoid', cursor: 'pointer', overflow: 'hidden',
                  '&:hover .overlay': { opacity: 1 },
                }}
              >
                <Box sx={{
                  height: p.h,
                  background: `linear-gradient(${parseInt(p.id) * 45}deg, #1E1B4B, #0B0F1A, #134E4A)`,
                  position: 'relative',
                }}>
                  <Box className="overlay" sx={{
                    position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.7)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                    p: 1.5, opacity: 0, transition: 'opacity 0.3s ease',
                  }}>
                    <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>{p.title}</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                      {p.stack.map((s) => (
                        <TechBadge key={s} label={s} active sx={{ height: 20, fontSize: '0.6rem' }} />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
        )}

        {/* Experience Timeline */}
        {activeTab === 1 && (
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            {[
              { icon: <WorkRoundedIcon />, title: 'Full-Stack Intern', org: 'Startup XYZ', period: 'Jan 2026 – Present', desc: 'Building production microservices with Node.js and PostgreSQL.' },
              { icon: <SchoolRoundedIcon />, title: 'B.Tech Computer Science', org: 'Rajasthan Technical University', period: '2023 – 2027', desc: 'CGPA: 8.67/10 • Core: DSA, OS, DBMS, Computer Networks' },
            ].map((exp, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Box sx={{
                  width: 44, height: 44, borderRadius: '12px', flexShrink: 0,
                  bgcolor: 'primary.main', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {exp.icon}
                </Box>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{exp.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{exp.org} · {exp.period}</Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>{exp.desc}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {/* Credentials */}
        {activeTab === 2 && (
          <Box sx={{ maxWidth: 500, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { label: 'Rajasthan Technical University — B.Tech CSE', verified: true },
              { label: 'GitHub — 200+ Contributions (2025)', verified: true },
              { label: 'AWS Certified Cloud Practitioner', verified: false },
            ].map((cred, i) => (
              <Card key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5 }}>
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
    </Box>
  );
};

export default ProfilePage;
