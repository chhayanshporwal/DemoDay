// ==========================================
// ImageCarousel — Swipeable image carousel
// MUI MobileStepper, supports up to 10 slides
// ==========================================

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MobileStepper from '@mui/material/MobileStepper';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface ImageCarouselProps {
  images: string[];
  aspectRatio?: string;
  borderRadius?: number;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  aspectRatio = '4 / 3',
  borderRadius = 12,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = images.length;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveStep((prev) => Math.min(prev + 1, maxSteps - 1));
  };

  const handleBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  if (!images.length) return null;

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      {/* Image container */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio,
          borderRadius: `${borderRadius}px`,
          overflow: 'hidden',
          bgcolor: 'background.default',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: `translateX(-${activeStep * 100}%)`,
            height: '100%',
          }}
        >
          {images.map((img, idx) => (
            <Box
              key={idx}
              component="img"
              src={img}
              alt={`Slide ${idx + 1}`}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                flexShrink: 0,
              }}
            />
          ))}
        </Box>

        {/* Navigation arrows */}
        {activeStep > 0 && (
          <IconButton
            onClick={handleBack}
            size="small"
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255,255,255,0.9)',
              color: '#0F172A',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              '&:hover': { bgcolor: '#fff' },
              width: 32,
              height: 32,
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        )}
        {activeStep < maxSteps - 1 && (
          <IconButton
            onClick={handleNext}
            size="small"
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255,255,255,0.9)',
              color: '#0F172A',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              '&:hover': { bgcolor: '#fff' },
              width: 32,
              height: 32,
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        )}

        {/* Slide counter badge */}
        {maxSteps > 1 && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              px: 1,
              py: 0.25,
              borderRadius: 2,
              bgcolor: 'rgba(0,0,0,0.55)',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 600,
              backdropFilter: 'blur(4px)',
            }}
          >
            {activeStep + 1}/{maxSteps}
          </Box>
        )}
      </Box>

      {/* Dot indicators */}
      {maxSteps > 1 && (
        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          backButton={null}
          nextButton={null}
          sx={{
            justifyContent: 'center',
            bgcolor: 'transparent',
            mt: 1,
            '& .MuiMobileStepper-dot': {
              width: 6,
              height: 6,
              mx: 0.4,
              transition: 'all 0.3s ease',
            },
            '& .MuiMobileStepper-dotActive': {
              width: 18,
              borderRadius: 3,
              bgcolor: 'primary.main',
            },
          }}
        />
      )}
    </Box>
  );
};

export default ImageCarousel;
