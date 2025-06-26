import React from 'react';
import { Chip, styled } from '@mui/material';

const RoleBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(3),
  right: theme.spacing(3),
  fontWeight: 500,
  letterSpacing: '0.5px',
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  textTransform: 'uppercase'
}));

export default RoleBadge;
