import React from 'react';
import { CardHeader as MuiCardHeader, styled } from '@mui/material';

const CardHeader = styled(MuiCardHeader)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  color: 'white',
  padding: theme.spacing(3),
  '& .MuiCardHeader-title': {
    fontSize: '1.5rem',
    fontWeight: 700
  },
  '& .MuiCardHeader-subheader': {
    color: 'rgba(255, 255, 255, 0.8)'
  }
}));

export default CardHeader;
