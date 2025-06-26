import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Divider,
  IconButton,
  Grid,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import ElderlyIcon from '@mui/icons-material/Elderly';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import PetsIcon from '@mui/icons-material/Pets';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { motion } from 'framer-motion';
import ProfileCard from './ProfileCard';
import CardHeader from './CardHeader';
import CardContent from './CardContent';
import RoleBadge from './RoleBadge';

const UserProfileSection = ({ 
  user, 
  editMode, 
  editedUser, 
  handleEditChange,
  cancelEdit, 
  handleEditSubmit,
  loading,
  error,
  openFamilyDialog,
  removeFamilyMember,
  setEditMode,
  activeTab,
  isAdmin,
  allUsers,
  editingUserId
}) => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: activeTab === 0 ? 1 : 0, y: 0 }}
      style={{ display: activeTab === 0 || !isAdmin ? 'block' : 'none' }}
      transition={{ duration: 0.5 }}
      role="tabpanel"
      hidden={user && user.role === 'admin' && activeTab !== 0}
      id="tabpanel-0"
      aria-labelledby="tab-0"
    >
      <ProfileCard>
        <CardHeader>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            View and manage your account information
          </Typography>
          
          {user.role && (
            <RoleBadge>
              {user.role}
            </RoleBadge>
          )}
        </CardHeader>
        
        <CardContent sx={{ pt: 4 }}>
          {editMode ? (
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <TextField
                  label="Username"
                  name="username"
                  fullWidth
                  value={editedUser.username || ''}
                  onChange={handleEditChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  name="firstName"
                  fullWidth
                  value={editedUser.firstName || ''}
                  onChange={handleEditChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  fullWidth
                  value={editedUser.lastName || ''}
                  onChange={handleEditChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email (cannot be changed)"
                  fullWidth
                  value={editingUserId ? allUsers.find(u => u.id === editingUserId)?.email || '' : editedUser.email || ''}
                  InputProps={{
                    readOnly: true,
                  }}
                  disabled
                  helperText="Email address cannot be modified by admins"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Phone"
                  name="phone"
                  fullWidth
                  value={editedUser.phone || ''}
                  onChange={handleEditChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  name="address"
                  fullWidth
                  multiline
                  rows={2}
                  value={editedUser.address || ''}
                  onChange={handleEditChange}
                />
              </Grid>
              {error && (
                <Grid item xs={12}>
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                </Grid>
              )}
              
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={cancelEdit}
                  sx={{ mr: 2 }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleEditSubmit}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Grid>
            </Grid>
          ) : (
            <>
              <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                Account Information
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <FingerprintIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="User ID" 
                    secondary={user.id} 
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                    secondaryTypographyProps={{ 
                      sx: { 
                        wordBreak: 'break-all', 
                        overflowWrap: 'break-word',
                        fontSize: '0.75rem' 
                      } 
                    }}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <SecurityIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Role" 
                    secondary={user.role || 'User'} 
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Username" 
                    secondary={user.username} 
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <BadgeIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Full Name" 
                    secondary={`${user.firstName} ${user.lastName}`} 
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                  />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
                Contact Information
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <EmailIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Email" 
                    secondary={user.email} 
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <PhoneIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Phone" 
                    secondary={user.phone || 'Not provided'} 
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <HomeIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Address" 
                    secondary={user.address || 'Not provided'} 
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                  />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
                <ElderlyIcon sx={{ mr: 1 }} /> Family Members
              </Typography>
              
              {(!user.familyMembers || user.familyMembers.length === 0) ? (
                <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic', color: 'text.secondary' }}>
                  No family members added yet
                </Typography>
              ) : (
                <List>
                  {user.familyMembers && user.familyMembers.map((member) => (
                    <ListItem key={member.id} 
                      secondaryAction={
                        <IconButton edge="end" onClick={() => removeFamilyMember(member.id, true)}>
                          <DeleteIcon />
                        </IconButton>
                      }>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: member.type === 'elder' ? 'secondary.light' : 'success.light' }}>
                          {member.type === 'elder' ? <ElderlyIcon /> : <ChildCareIcon />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={member.name} 
                        secondary={`Age: ${member.age} • ${member.type === 'elder' ? 'Elder' : 'Child'}`}
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2, mb: 4 }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  color="secondary" 
                  startIcon={<ElderlyIcon />}
                  onClick={() => openFamilyDialog('elder')}
                >
                  Add Elder Member
                </Button>
                <Button 
                  variant="outlined" 
                  size="small"
                  color="success" 
                  startIcon={<ChildCareIcon />}
                  onClick={() => openFamilyDialog('child')}
                >
                  Add Child
                </Button>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
                <PetsIcon sx={{ mr: 1 }} /> Pets
              </Typography>
              
              {(!user.pets || user.pets.length === 0) ? (
                <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic', color: 'text.secondary' }}>
                  No pets added yet
                </Typography>
              ) : (
                <List>
                  {user.pets && user.pets.map((pet) => (
                    <ListItem key={pet.id}
                      secondaryAction={
                        <IconButton edge="end" onClick={() => removeFamilyMember(pet.id, false)}>
                          <DeleteIcon />
                        </IconButton>
                      }>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'info.light' }}>
                          <PetsIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={pet.name} 
                        secondary={`Type: ${pet.type}`}
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
              
              <Button 
                variant="outlined" 
                size="small"
                color="info" 
                startIcon={<PetsIcon />}
                onClick={() => openFamilyDialog('pet')}
                sx={{ mt: 2, mb: 4 }}
              >
                Add Pet
              </Button>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<EditIcon />}
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </ProfileCard>
    </Box>
  );
};

export default UserProfileSection;
