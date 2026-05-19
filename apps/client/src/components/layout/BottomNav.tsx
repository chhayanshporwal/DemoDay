// ==========================================
// BottomNav — Mobile bottom tab navigation
// Replaces sidebar on screens < 768px
// ==========================================

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import Badge from '@mui/material/Badge';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

import { useStore } from '../../store/useStore';

const routes = ['/', '/explore', '/studio', '/inbox', '/profile/me'];

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadTotal, user } = useStore();

  const currentIndex = routes.findIndex((r) => {
    if (r === '/') return location.pathname === '/';
    return location.pathname.startsWith(r.replace('/me', ''));
  });

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: { xs: 'block', md: 'none' },
        zIndex: 1200,
        borderTop: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(20px) saturate(180%)',
        backgroundColor: 'rgba(var(--mui-palette-background-defaultChannel) / 0.9)',
      }}
    >
      <BottomNavigation
        value={currentIndex}
        onChange={(_, newValue) => {
          const path = routes[newValue];
          if (path === '/profile/me' && user) {
            navigate(`/profile/${user.id}`);
          } else {
            navigate(path);
          }
        }}
        sx={{
          bgcolor: 'transparent',
          height: 60,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            py: 1,
            color: 'text.secondary',
            transition: 'color 0.2s ease',
            '&.Mui-selected': {
              color: 'primary.main',
            },
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.65rem',
            fontWeight: 600,
            mt: 0.25,
          },
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeRoundedIcon />} />
        <BottomNavigationAction label="Explore" icon={<ExploreRoundedIcon />} />
        <BottomNavigationAction
          label="Studio"
          icon={
            <AddCircleRoundedIcon
              sx={{
                fontSize: '2rem',
                background: 'linear-gradient(135deg, #4F46E5, #0D9488)',
                borderRadius: '50%',
                color: '#fff',
              }}
            />
          }
        />
        <BottomNavigationAction
          label="Inbox"
          icon={
            <Badge badgeContent={unreadTotal} color="error" max={99}>
              <ChatBubbleRoundedIcon />
            </Badge>
          }
        />
        <BottomNavigationAction label="Profile" icon={<PersonRoundedIcon />} />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;
