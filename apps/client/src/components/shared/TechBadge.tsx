// ==========================================
// TechBadge — Styled skill chip
// Monospace font, teal accent, hover animation
// ==========================================

import React from 'react';
import Chip, { type ChipProps } from '@mui/material/Chip';

interface TechBadgeProps extends Omit<ChipProps, 'label'> {
  label: string;
  active?: boolean;
}

const TechBadge: React.FC<TechBadgeProps> = ({ label, active = false, ...props }) => {
  return (
    <Chip
      label={label}
      size="small"
      variant={active ? 'filled' : 'outlined'}
      {...props}
      sx={{
        fontFamily: '"Fira Code", "JetBrains Mono", monospace',
        fontSize: '0.75rem',
        fontWeight: 500,
        letterSpacing: '0.02em',
        borderRadius: '8px',
        height: 28,
        transition: 'all 0.2s ease',
        ...(active
          ? {
              bgcolor: 'secondary.main',
              color: 'secondary.contrastText',
              '&:hover': {
                bgcolor: 'secondary.dark',
                transform: 'scale(1.05)',
              },
            }
          : {
              borderColor: 'secondary.main',
              color: 'secondary.main',
              '&:hover': {
                bgcolor: 'rgba(13, 148, 136, 0.08)',
                borderColor: 'secondary.dark',
                transform: 'scale(1.05)',
              },
            }),
        ...props.sx,
      }}
    />
  );
};

export default TechBadge;
