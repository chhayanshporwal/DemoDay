// ==========================================
// InboxPage — 3-tier messaging layout
// Primary | General | Requests tabs
// ==========================================

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import UserAvatar from '../components/shared/UserAvatar';

const MOCK_CONVERSATIONS = [
  { id: '1', name: 'Aditya Sharma', username: 'aditya_dev', lastMsg: 'Loved your FFmpeg integration! Can we chat?', time: '2m', unread: 2, tier: 'primary', role: 'creator' as const },
  { id: '2', name: 'Priya Patel', username: 'priya_codes', lastMsg: 'Thanks for the feedback on the carousel component.', time: '1h', unread: 0, tier: 'primary', role: 'creator' as const },
  { id: '3', name: 'Rakuten HR', username: 'rakuten_hr', lastMsg: 'We have an open position that matches your profile...', time: '3h', unread: 1, tier: 'request', role: 'recruiter' as const },
  { id: '4', name: 'Mercari Engineering', username: 'mercari_eng', lastMsg: 'Impressive callsentry project! Would you be open to...', time: '1d', unread: 1, tier: 'request', role: 'recruiter' as const },
];

const InboxPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedConvo, setSelectedConvo] = useState<string | null>(null);

  const filteredConvos = MOCK_CONVERSATIONS.filter(
    (c) => activeTab === 1 ? c.tier === 'general' : activeTab === 2 ? c.tier === 'request' : c.tier === 'primary'
  );

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 120px)', gap: 0, mx: -4, mt: -3 }}>
      {/* Conversation list panel */}
      <Box
        sx={{
          width: { xs: selectedConvo ? 0 : '100%', md: 360 },
          flexShrink: 0,
          borderRight: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'width 0.3s ease',
        }}
      >
        <Box sx={{ px: 2.5, pt: 2.5, pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Inbox</Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Search conversations..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          variant="fullWidth"
          sx={{
            px: 1, minHeight: 40,
            '& .MuiTab-root': { minHeight: 40, fontSize: '0.8rem', fontWeight: 600, textTransform: 'none' },
          }}
        >
          <Tab label="Primary" />
          <Tab label="General" />
          <Tab label={<Badge badgeContent={2} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 16, minWidth: 16 } }}>Requests</Badge>} />
        </Tabs>

        <Divider />

        {/* Conversation list */}
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {filteredConvos.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary" variant="body2">No conversations yet</Typography>
            </Box>
          ) : (
            filteredConvos.map((convo) => (
              <Box
                key={convo.id}
                onClick={() => setSelectedConvo(convo.id)}
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  px: 2.5,
                  py: 1.5,
                  cursor: 'pointer',
                  bgcolor: selectedConvo === convo.id ? 'action.selected' : 'transparent',
                  transition: 'background-color 0.15s ease',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <UserAvatar name={convo.name} roleType={convo.role} size={44} openToWork={convo.role === 'creator'} />
                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: convo.unread ? 700 : 500 }} noWrap>
                      {convo.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">{convo.time}</Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: convo.unread ? 'text.primary' : 'text.secondary',
                      fontWeight: convo.unread ? 600 : 400,
                    }}
                    noWrap
                  >
                    {convo.lastMsg}
                  </Typography>
                </Box>
                {convo.unread > 0 && (
                  <Box sx={{
                    alignSelf: 'center',
                    width: 20, height: 20, borderRadius: '50%',
                    bgcolor: 'primary.main', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontWeight: 700, flexShrink: 0,
                  }}>
                    {convo.unread}
                  </Box>
                )}
              </Box>
            ))
          )}
        </Box>
      </Box>

      {/* Chat panel */}
      <Box
        sx={{
          flex: 1,
          display: { xs: selectedConvo ? 'flex' : 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selectedConvo ? (
          <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Chat header */}
            <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <UserAvatar name={MOCK_CONVERSATIONS.find(c => c.id === selectedConvo)?.name} size={36} showRing={false} />
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {MOCK_CONVERSATIONS.find(c => c.id === selectedConvo)?.name}
              </Typography>
            </Box>
            {/* Messages placeholder */}
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">Messages will appear here</Typography>
            </Box>
            {/* Input */}
            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <TextField fullWidth size="small" placeholder="Type a message..." />
            </Box>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>Select a conversation</Typography>
            <Typography variant="body2" color="text.secondary">
              Choose from your existing conversations or start a new one
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default InboxPage;
