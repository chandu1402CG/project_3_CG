import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Divider,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import ElderlyIcon from '@mui/icons-material/Elderly';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import PetsIcon from '@mui/icons-material/Pets';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { motion } from 'framer-motion';
import ProfileCard from './ProfileCard';
import CardHeader from './CardHeader';
import CardContent from './CardContent';

const AdminDashboard = ({ 
  user, 
  activeTab, 
  allUsers, 
  adminLoading, 
  adminError, 
  startEditingUser,
  openAdminFamilyDialog, 
  removeAdminFamilyMember,
  fetchAdminData,
  deleteUserHandler
}) => {
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    userId: null,
    userName: ''
  });

  const openDeleteDialog = (userId, firstName, lastName, e) => {
    if (e) e.stopPropagation(); // Prevent accordion from toggling
    setDeleteDialog({
      open: true,
      userId,
      userName: `${firstName} ${lastName}`
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      userId: null,
      userName: ''
    });
  };

  const handleUserDeletion = async () => {
    if (!deleteDialog.userId) return;
    
    await deleteUserHandler(deleteDialog.userId);
    closeDeleteDialog();
  };
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="tabpanel"
      hidden={activeTab !== 1}
      id="tabpanel-1"
      sx={{ mb: 4 }}
    >
      <ProfileCard>
        <CardHeader>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Manage all users and their family members
          </Typography>
        </CardHeader>
        
        <CardContent>
          {adminLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : adminError ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {adminError}
            </Alert>
          ) : allUsers.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', my: 4, fontStyle: 'italic', color: 'text.secondary' }}>
              No users found in the system
            </Typography>
          ) : (
            <>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: 'text.secondary' }}>
                Total users: {allUsers.length}
              </Typography>
              
              {allUsers.map((userData) => (
                <Accordion key={userData.id} sx={{ 
                  mb: 2, 
                  borderRadius: 1,
                  '&:before': { display: 'none' },
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`user-${userData.id}-content`}
                    id={`user-${userData.id}-header`}
                    sx={{ 
                      bgcolor: userData.role === 'admin' ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                      borderRadius: 1
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: userData.role === 'admin' ? 'primary.main' : 'secondary.main',
                          mr: 2
                        }}
                      >
                        {userData.firstName ? userData.firstName[0] : 'U'}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {userData.firstName} {userData.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {userData.email} • {userData.username}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex' }}>
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent accordion from toggling
                            startEditingUser(userData);
                          }}
                          sx={{ mr: 1, minWidth: '60px' }}
                        >
                          Edit
                        </Button>
                        {userData.id !== user.id && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<PersonRemoveIcon />}
                            onClick={(e) => openDeleteDialog(userData.id, userData.firstName, userData.lastName, e)}
                            sx={{ minWidth: '60px' }}
                          >
                            Delete
                          </Button>
                        )}
                      </Box>
                      {userData.role === 'admin' && (
                        <Chip 
                          label="Admin" 
                          size="small" 
                          color="primary" 
                          sx={{ mr: 2 }}
                        />
                      )}
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <PersonIcon sx={{ mr: 1, fontSize: '1rem' }} /> Basic Info
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemText 
                              primary="Phone" 
                              secondary={userData.phone || 'Not provided'} 
                              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                              secondaryTypographyProps={{ variant: 'body1' }}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText 
                              primary="Address" 
                              secondary={userData.address || 'Not provided'} 
                              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                              secondaryTypographyProps={{ variant: 'body1' }}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText 
                              primary="User ID" 
                              secondary={userData.id} 
                              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                              secondaryTypographyProps={{ variant: 'body1', sx: { fontSize: '0.8rem', fontFamily: 'monospace' } }}
                            />
                          </ListItem>
                        </List>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2" color="secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                            <ElderlyIcon sx={{ mr: 1, fontSize: '1rem' }} /> Family Members
                          </Typography>
                          <Box>
                            <Button 
                              size="small" 
                              startIcon={<ElderlyIcon />} 
                              onClick={() => openAdminFamilyDialog(userData.id, 'elder')}
                              sx={{ mr: 1, fontSize: '0.75rem' }}
                            >
                              Add Elder
                            </Button>
                            <Button 
                              size="small" 
                              startIcon={<ChildCareIcon />} 
                              onClick={() => openAdminFamilyDialog(userData.id, 'child')}
                              sx={{ fontSize: '0.75rem' }}
                            >
                              Add Child
                            </Button>
                          </Box>
                        </Box>
                        
                        {(!userData.familyMembers || userData.familyMembers.length === 0) ? (
                          <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                            No family members
                          </Typography>
                        ) : (
                          <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                            {userData.familyMembers.map((member) => (
                              <ListItem 
                                key={member.id} 
                                sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
                                secondaryAction={
                                  <IconButton 
                                    edge="end" 
                                    size="small"
                                    onClick={() => removeAdminFamilyMember(userData.id, member.id, true)}
                                    sx={{ color: 'error.main' }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                }
                              >
                                <ListItemAvatar>
                                  <Avatar sx={{ bgcolor: member.type === 'elder' ? 'secondary.light' : 'success.light', width: 30, height: 30 }}>
                                    {member.type === 'elder' ? <ElderlyIcon fontSize="small" /> : <ChildCareIcon fontSize="small" />}
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText 
                                  primary={member.name} 
                                  secondary={`${member.age} years old • ${member.type === 'elder' ? 'Elder' : 'Child'}`}
                                  primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                                  secondaryTypographyProps={{ variant: 'body2' }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        )}
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2" color="info.main" sx={{ display: 'flex', alignItems: 'center' }}>
                            <PetsIcon sx={{ mr: 1, fontSize: '1rem' }} /> Pets
                          </Typography>
                          <Button 
                            size="small" 
                            startIcon={<PetsIcon />} 
                            onClick={() => openAdminFamilyDialog(userData.id, 'pet')}
                            sx={{ fontSize: '0.75rem' }}
                          >
                            Add Pet
                          </Button>
                        </Box>
                        
                        {(!userData.pets || userData.pets.length === 0) ? (
                          <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                            No pets
                          </Typography>
                        ) : (
                          <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                            {userData.pets.map((pet) => (
                              <ListItem 
                                key={pet.id} 
                                sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
                                secondaryAction={
                                  <IconButton 
                                    edge="end" 
                                    size="small"
                                    onClick={() => removeAdminFamilyMember(userData.id, pet.id, false)}
                                    sx={{ color: 'error.main' }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                }
                              >
                                <ListItemAvatar>
                                  <Avatar sx={{ bgcolor: 'info.light', width: 30, height: 30 }}>
                                    <PetsIcon fontSize="small" />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText 
                                  primary={pet.name} 
                                  secondary={`Type: ${pet.type}`}
                                  primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                                  secondaryTypographyProps={{ variant: 'body2' }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        )}
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  startIcon={<GroupIcon />}
                  onClick={() => fetchAdminData(user.id)}
                  disabled={adminLoading}
                >
                  Refresh User Data
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </ProfileCard>
      
      {/* Delete User Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm User Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete user <strong>{deleteDialog.userName}</strong>? 
            This action cannot be undone, and all associated data for this user will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleUserDeletion} 
            color="error" 
            variant="contained" 
            startIcon={<DeleteIcon />}
            autoFocus
          >
            Delete User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
