// ==========================================
// MainLayout — Master layout wrapper
// Orchestrates Sidebar + Topbar + BottomNav + content
// ==========================================

import React from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Sidebar, { SIDEBAR_EXPANDED, SIDEBAR_COLLAPSED } from './Sidebar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../hooks/useAuth';

const MainLayout: React.FC = () => {
  const { sidebarCollapsed } = useStore();

  // Keep auth state synced
  useAuth();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile topbar */}
      <Topbar />

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flex: 1,
          // Desktop: offset by sidebar width
          ml: { xs: 0, md: `${sidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED}px` },
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          // Mobile: offset by topbar height + bottom nav
          pt: { xs: '56px', md: 0 },
          pb: { xs: '68px', md: 0 },
          minHeight: '100vh',
          maxWidth: { md: `calc(100vw - ${sidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED}px)` },
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 2, md: 3 },
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {/* Mobile bottom nav */}
      <BottomNav />
    </Box>
  );
};

export default MainLayout;
