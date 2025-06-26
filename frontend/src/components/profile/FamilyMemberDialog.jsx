import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Grid,
  TextField,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const FamilyMemberDialog = ({ 
  open, 
  onClose, 
  familyType, 
  familyMember, 
  handleChange, 
  onSubmit, 
  loading, 
  isAdmin = false
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {familyType === 'elder' ? 'Add Elder Family Member' : 
         familyType === 'child' ? 'Add Child' : 'Add Pet'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          {familyType === 'pet' ? 
            `Please provide details about ${isAdmin ? 'the' : 'your'} pet.` :
            `Please provide details about ${isAdmin ? 'the' : 'your'} family member.`}
        </DialogContentText>
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={familyMember.name || ''}
              onChange={handleChange}
            />
          </Grid>
          
          {(familyType === 'elder' || familyType === 'child') && (
            <Grid item xs={12}>
              <TextField
                label="Age"
                name="age"
                type="number"
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
                value={familyMember.age || ''}
                onChange={handleChange}
              />
            </Grid>
          )}
          
          {familyType === 'pet' && (
            <Grid item xs={12}>
              <TextField
                label="Type of Pet"
                name="type"
                fullWidth
                placeholder="Dog, Cat, Bird, etc."
                value={familyMember.type || ''}
                onChange={handleChange}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button 
          onClick={onSubmit} 
          color="primary" 
          variant="contained"
          disabled={loading || 
            !familyMember.name || 
            ((familyType === 'elder' || familyType === 'child') && !familyMember.age) ||
            (familyType === 'pet' && !familyMember.type)
          }
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
        >
          {loading ? 'Adding...' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FamilyMemberDialog;
