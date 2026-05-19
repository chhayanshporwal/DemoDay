// ==========================================
// Sidebar — Collapsible left navigation
// 250px expanded → 80px collapsed (smooth transition)
// Hidden on mobile, replaced by BottomNav
// ==========================================

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Badge from '@mui/material/Badge';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';
import VideoCallRoundedIcon from '@mui/icons-material/VideoCallRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';

import { useColorScheme } from '@mui/material/styles';
import { useStore } from '../../store/useStore';
import UserAvatar from '../shared/UserAvatar';

const SIDEBAR_EXPANDED = 250;
const SIDEBAR_COLLAPSED = 78;

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, setMode } = useColorScheme();
  const { sidebarCollapsed, toggleSidebar, user, unreadTotal } = useStore();

  const navItems: NavItem[] = [
    { label: 'Home', icon: <HomeRoundedIcon />, path: '/' },
    { label: 'Explore', icon: <ExploreRoundedIcon />, path: '/explore' },
    { label: 'Studio', icon: <VideoCallRoundedIcon />, path: '/studio' },
    { label: 'Inbox', icon: <ChatBubbleRoundedIcon />, path: '/inbox', badge: unreadTotal },
    { label: 'Profile', icon: <PersonRoundedIcon />, path: user ? `/profile/${user.id}` : '/profile/me' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: sidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        bgcolor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        zIndex: 1200,
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          px: sidebarCollapsed ? 1.5 : 2.5,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          minHeight: 72,
          cursor: 'pointer',
          transition: 'padding 0.3s ease',
        }}
        onClick={() => navigate('/')}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #0D9488 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.1rem',
            flexShrink: 0,
          }}
        >
          D
        </Box>
        {!sidebarCollapsed && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
              animation: 'fadeIn 0.3s ease',
            }}
          >
            DemoDay
          </Typography>
        )}
      </Box>

      <Divider sx={{ mx: sidebarCollapsed ? 1 : 2 }} />

      {/* Nav Items */}
      <Box sx={{ flex: 1, py: 1.5, px: sidebarCollapsed ? 1 : 1.5 }}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Tooltip
              key={item.path}
              title={sidebarCollapsed ? item.label : ''}
              placement="right"
              arrow
            >
              <Box
                onClick={() => navigate(item.path)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: sidebarCollapsed ? 0 : 2,
                  py: 1.25,
                  mb: 0.5,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  bgcolor: active ? 'primary.main' : 'transparent',
                  color: active ? '#fff' : 'text.secondary',
                  '&:hover': {
                    bgcolor: active ? 'primary.dark' : 'action.hover',
                    color: active ? '#fff' : 'text.primary',
                    transform: 'translateX(2px)',
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: '1.35rem',
                    transition: 'color 0.2s ease',
                  },
                }}
              >
                {item.badge ? (
                  <Badge badgeContent={item.badge} color="error" max={99}>
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
                {!sidebarCollapsed && (
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: active ? 600 : 500,
                      whiteSpace: 'nowrap',
                      animation: 'fadeIn 0.2s ease',
                    }}
                  >
                    {item.label}
                  </Typography>
                )}
              </Box>
            </Tooltip>
          );
        })}
      </Box>

      <Divider sx={{ mx: sidebarCollapsed ? 1 : 2 }} />

      {/* Bottom section */}
      <Box sx={{ p: sidebarCollapsed ? 1 : 2 }}>
        {/* Theme toggle */}
        <Tooltip title={sidebarCollapsed ? (mode === 'dark' ? 'Light mode' : 'Dark mode') : ''} placement="right">
          <Box
            onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: sidebarCollapsed ? 0 : 2,
              py: 1,
              borderRadius: '12px',
              cursor: 'pointer',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              color: 'text.secondary',
              transition: 'all 0.2s ease',
              '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
            }}
          >
            {mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
            {!sidebarCollapsed && (
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </Typography>
            )}
          </Box>
        </Tooltip>

        {/* User profile mini */}
        {user && (
          <Box
            onClick={() => navigate(`/profile/${user.id}`)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: sidebarCollapsed ? 1 : 1.5,
              mt: 1,
              borderRadius: '12px',
              cursor: 'pointer',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              transition: 'all 0.2s ease',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <UserAvatar
              name={user.full_name}
              avatarUrl={user.avatar_url}
              roleType={user.role_type}
              openToWork={user.open_to_work}
              size={32}
            />
            {!sidebarCollapsed && (
              <Box sx={{ overflow: 'hidden' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }} noWrap>
                  {user.full_name}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  @{user.username}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Collapse toggle */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <IconButton onClick={toggleSidebar} size="small" sx={{ color: 'text.secondary' }}>
            {sidebarCollapsed ? <ChevronRightRoundedIcon /> : <ChevronLeftRoundedIcon />}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export { SIDEBAR_EXPANDED, SIDEBAR_COLLAPSED };
export default Sidebar;
