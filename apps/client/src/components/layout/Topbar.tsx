// ==========================================
// Topbar — Mobile-only header
// Logo + notifications, hidden on desktop
// ==========================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import { useStore } from '../../store/useStore';

const Topbar: React.FC = () => {
  const navigate = useNavigate();
  const { unreadTotal } = useStore();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        display: { xs: 'block', md: 'none' },
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(20px) saturate(180%)',
        backgroundColor: 'rgba(var(--mui-palette-background-defaultChannel) / 0.85)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 56 }}>
        {/* Logo */}
        <Box
          onClick={() => navigate('/')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
          }}
        >
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED, #0D9488)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.9rem',
            }}
          >
            D
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              fontSize: '1.1rem',
              letterSpacing: '-0.02em',
            }}
          >
            DemoDay
          </Typography>
        </Box>

        {/* Actions */}
        <Box>
          <IconButton onClick={() => navigate('/inbox')} size="small">
            <Badge badgeContent={unreadTotal} color="error" max={99}>
              <NotificationsRoundedIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
