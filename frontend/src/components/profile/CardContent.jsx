import React from 'react';
import { CardContent as MuiCardContent, styled } from '@mui/material';

const CardContent = styled(MuiCardContent)(({ theme }) => ({
  padding: theme.spacing(4),
}));

export default CardContent;
