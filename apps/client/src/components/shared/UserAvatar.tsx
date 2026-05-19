// ==========================================
// UserAvatar — Avatar with role-based ring borders
// Green = Open to Work, Indigo = Hiring, Gold = Verified
// ==========================================

import React from 'react';
import Avatar, { type AvatarProps } from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import type { RoleType } from '@demoday/shared';

interface UserAvatarProps extends AvatarProps {
  name?: string;
  avatarUrl?: string | null;
  roleType?: RoleType;
  openToWork?: boolean;
  isVerified?: boolean;
  size?: number;
  showRing?: boolean;
}

const getRingColor = (
  roleType?: RoleType,
  openToWork?: boolean,
  isVerified?: boolean
): string | null => {
  if (isVerified) return '#F59E0B'; // Gold — verified institution
  if (roleType === 'recruiter') return '#4F46E5'; // Indigo — hiring
  if (openToWork) return '#10B981'; // Green — open to work
  return null;
};

const getInitials = (name?: string): string => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  avatarUrl,
  roleType,
  openToWork,
  isVerified,
  size = 40,
  showRing = true,
  sx,
  ...props
}) => {
  const ringColor = showRing ? getRingColor(roleType, openToWork, isVerified) : null;

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        borderRadius: '50%',
        ...(ringColor && {
          padding: '3px',
          background: `linear-gradient(135deg, ${ringColor}, ${ringColor}AA)`,
        }),
      }}
    >
      <Avatar
        src={avatarUrl ?? undefined}
        alt={name}
        {...props}
        sx={{
          width: size,
          height: size,
          fontSize: size * 0.4,
          fontWeight: 600,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          border: ringColor ? '2px solid' : 'none',
          borderColor: 'background.paper',
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          },
          ...sx,
        }}
      >
        {getInitials(name)}
      </Avatar>
    </Box>
  );
};

export default UserAvatar;
