import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';

const AdminEditUserDialog = ({ 
  open, 
  onClose, 
  userData, 
  handleChange, 
  onSave, 
  loading, 
  error,
  allUsers,
  editingUserId
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Edit User
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Username"
              name="username"
              fullWidth
              value={userData.username || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              name="firstName"
              fullWidth
              value={userData.firstName || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              name="lastName"
              fullWidth
              value={userData.lastName || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email (cannot be changed)"
              fullWidth
              value={editingUserId ? allUsers.find(u => u.id === editingUserId)?.email || '' : ''}
              InputProps={{
                readOnly: true,
              }}
              disabled
              helperText="Email address cannot be modified"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password (leave blank to keep unchanged)"
              name="password"
              type="password"
              fullWidth
              value={userData.password || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone"
              name="phone"
              fullWidth
              value={userData.phone || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              name="address"
              fullWidth
              multiline
              rows={2}
              value={userData.address || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              label="Role"
              name="role"
              fullWidth
              value={userData.role || 'user'}
              onChange={handleChange}
              SelectProps={{
                native: true,
              }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </TextField>
          </Grid>
          
          {error && (
            <Grid item xs={12}>
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button 
          onClick={onSave} 
          color="primary" 
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminEditUserDialog;
