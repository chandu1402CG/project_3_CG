import React from 'react';
import { Card, styled } from '@mui/material';

const ProfileCard = styled(Card)(({ theme }) => ({
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  marginBottom: theme.spacing(4),
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: '0 6px 30px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-4px)'
  }
}));

export default ProfileCard;
