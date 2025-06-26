import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
  Snackbar
} from '@mui/material';
import { motion } from 'framer-motion';

// Icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

// Custom components
import {
  UserProfileSection,
  AdminDashboard,
  FamilyMemberDialog,
  AdminEditUserDialog
} from '../components/profile';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [editSuccess, setEditSuccess] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(true);
  
  // Family members and pets state
  const [showFamilyDialog, setShowFamilyDialog] = useState(false);
  const [familyType, setFamilyType] = useState('elder'); // 'elder', 'child', or 'pet'
  const [familyMember, setFamilyMember] = useState({ name: '', age: '', type: '' });
  const [familySuccess, setFamilySuccess] = useState(false);
  
  // Admin state
  const [isAdmin, setIsAdmin] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUserData, setEditedUserData] = useState({});
  const [adminEditSuccess, setAdminEditSuccess] = useState(false);
  const [adminFamilyMemberDialog, setAdminFamilyMemberDialog] = useState(false);
  const [adminFamilyMemberType, setAdminFamilyMemberType] = useState('elder');
  const [adminFamilyMember, setAdminFamilyMember] = useState({ name: '', age: '', type: '' });
  const [adminTargetUserId, setAdminTargetUserId] = useState(null);
  
  // Snackbar state for notifications
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  // Check backend server status
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        await fetch('http://localhost:5000/api');
        setBackendAvailable(true);
      } catch (error) {
        console.warn('Backend server appears to be offline:', error);
        setBackendAvailable(false);
      }
    };
    
    checkServerStatus();
  }, []);
  
  // Function to fetch all users for admin
  const fetchAdminData = useCallback(async (userId) => {
    if (!backendAvailable) return;
    
    try {
      setAdminLoading(true);
      setAdminError(null);
      
      const { fetchAllUsers } = await import('../services/api');
      const usersData = await fetchAllUsers(userId);
      
      setAllUsers(usersData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setAdminError(err.message);
    } finally {
      setAdminLoading(false);
    }
  }, [backendAvailable]);
  
  // Handle user deletion by admin
  const handleDeleteUser = async (userIdToDelete) => {
    if (!user?.id || !backendAvailable || !userIdToDelete) return;
    
    setAdminLoading(true);
    
    try {
      const { deleteUser } = await import('../services/api');
      await deleteUser(userIdToDelete, user.id);
      
      // Refresh the list of users after deletion
      await fetchAdminData(user.id);
      
      // Show success message
      setSnackbarState({
        open: true,
        message: 'User deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      setSnackbarState({
        open: true,
        message: error.message || 'Failed to delete user',
        severity: 'error'
      });
    } finally {
      setAdminLoading(false);
    }
  };
  
  useEffect(() => {
    // Get user data from localStorage
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        setUser(userData);
        setEditedUser(userData);
        
        // Check if user is admin
        const isAdminUser = userData.role === 'admin';
        setIsAdmin(isAdminUser);
        setLoading(false);
      } catch (err) {
        console.error('Error parsing user data:', err);
        setError('Could not load user profile');
        setLoading(false);
      }
    } else {
      // Redirect to login if no user found
      navigate('/login');
    }
  }, [navigate]);
  
  // Separate effect to fetch admin data when needed
  useEffect(() => {
    // If the user is loaded and is admin, fetch all users
    if (user && user.role === 'admin' && backendAvailable) {
      fetchAdminData(user.id);
    }
  }, [user, backendAvailable, fetchAdminData]);
  
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleEditSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // If we already know the backend is unavailable, skip the API call and do local update only
      if (!backendAvailable) {
        console.log('Backend is offline, updating local storage only');
        localStorage.setItem('user', JSON.stringify(editedUser));
        setUser(editedUser);
        setEditMode(false);
        setEditSuccess(true);
        setLoading(false);
        return; // Exit early
      }
      
      // Check if the backend is reachable first
      try {
        await fetch('http://localhost:5000/api');
        // Just checking if the server responds at all - we don't need the response
      } catch (serverError) {
        console.error('Server check failed:', serverError);
        setBackendAvailable(false);
        throw new Error('Cannot connect to the backend server. Your changes will be saved locally only.');
      }
      
      // Import the API function
      const { updateUserProfile } = await import('../services/api');
      
      // Ensure current user data is valid
      JSON.parse(localStorage.getItem('user'));
      
      // Call the API to update the user profile
      const response = await updateUserProfile(editedUser);
      
      console.log('Profile update response:', response);
      
      // Update localStorage with the latest user data
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      setEditMode(false);
      setEditSuccess(true);
    } catch (err) {
      console.error('Error saving profile changes:', err);
      
      // Handle server connection errors - fall back to localStorage only
      if (err.message && (err.message.includes('Cannot connect to the backend server') || 
                          err.message.includes('Failed to fetch') ||
                          err.message.includes('Unexpected token'))) {
        
        // Show a warning but still update the local storage
        const warningMessage = 'Warning: Could not connect to the server. Your changes have been saved locally only and will sync when the server is available.';
        setError(warningMessage);
        
        // Update localStorage as a fallback
        localStorage.setItem('user', JSON.stringify(editedUser));
        setUser(editedUser);
        
        // Still consider it a partial success
        setEditMode(false);
        setTimeout(() => setEditSuccess(true), 1500); // Show success after a delay
      } else {
        // For other errors, show the error message
        setError(err.message || 'Could not save profile changes');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const cancelEdit = () => {
    setEditedUser(user);
    setEditMode(false);
  };
  
  const handleCloseSnackbar = () => {
    setEditSuccess(false);
    setFamilySuccess(false);
    setAdminEditSuccess(false);
  };
  
  // Handle tab change for admin view
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Family member dialog handlers
  const openFamilyDialog = (type) => {
    setFamilyType(type);
    setFamilyMember({ name: '', age: '', type: '' });
    setShowFamilyDialog(true);
  };
  
  const closeFamilyDialog = () => {
    setShowFamilyDialog(false);
  };
  
  const handleFamilyMemberChange = (e) => {
    const { name, value } = e.target;
    setFamilyMember(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const addFamilyMember = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // If we already know the backend is unavailable, skip the API call and do local update only
      if (!backendAvailable) {
        console.log('Backend is offline, updating local storage only');
        
        // Update user object with new family member/pet
        const updatedUser = { ...user };
        
        if (familyType === 'elder' || familyType === 'child') {
          if (!updatedUser.familyMembers) {
            updatedUser.familyMembers = [];
          }
          updatedUser.familyMembers.push({
            id: Date.now().toString(), // Generate a simple ID
            name: familyMember.name,
            age: familyMember.age,
            type: familyType
          });
        } else if (familyType === 'pet') {
          if (!updatedUser.pets) {
            updatedUser.pets = [];
          }
          updatedUser.pets.push({
            id: Date.now().toString(),
            name: familyMember.name,
            type: familyMember.type
          });
        }
        
        // Save to localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        // Close dialog and show success
        setShowFamilyDialog(false);
        setFamilySuccess(true);
        setLoading(false);
        return; // Exit early
      }
      
      // Import the API function
      const { updateFamilyMember } = await import('../services/api');
      
      // Prepare data to send
      let payload = {
        userId: user.id
      };
      
      if (familyType === 'elder' || familyType === 'child') {
        payload.memberType = familyType;
        payload.name = familyMember.name;
        payload.age = familyMember.age;
      } else if (familyType === 'pet') {
        payload.memberType = 'pet';
        payload.name = familyMember.name;
        payload.petType = familyMember.type;
      }
      
      // Call API
      const response = await updateFamilyMember(payload);
      
      // Update localStorage with the latest user data
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      
      // Show success notification
      setShowFamilyDialog(false);
      setFamilySuccess(true);
    } catch (err) {
      console.error('Error adding family member:', err);
      // Error handling code...
    } finally {
      setLoading(false);
    }
  };
  
  // Helper to remove family member or pet
  const removeFamilyMember = async (id, isFamilyMember) => {
    setLoading(true);
    setError(null);
    
    try {
      // Implementation details...
    } catch (err) {
      console.error('Error removing family member:', err);
      // Error handling code...
    } finally {
      setLoading(false);
    }
  };
  
  // Admin functions for managing user profiles
  const startEditingUser = (targetUser) => {
    setEditingUserId(targetUser.id);
    setEditedUserData({
      username: targetUser.username,
      password: '', // Password field starts empty
      firstName: targetUser.firstName,
      lastName: targetUser.lastName,
      phone: targetUser.phone,
      address: targetUser.address,
      role: targetUser.role
    });
  };
  
  const handleAdminEditChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const cancelAdminEdit = () => {
    setEditingUserId(null);
    setEditedUserData({});
  };
  
  const saveAdminUserChanges = async () => {
    if (!editingUserId || !user?.id) return;
    
    try {
      setAdminLoading(true);
      setAdminError(null);
      
      // Import the admin API function
      const { adminUpdateUser } = await import('../services/api');
      
      // Call the API
      const response = await adminUpdateUser(user.id, editingUserId, editedUserData);
      
      if (response.success) {
        // Update the users list
        setAllUsers(response.data);
        setEditingUserId(null);
        setEditedUserData({});
        setAdminEditSuccess(true);
      }
    } catch (err) {
      console.error('Error updating user as admin:', err);
      setAdminError(err.message);
    } finally {
      setAdminLoading(false);
    }
  };
  
  // Admin functions for managing family members and pets
  const openAdminFamilyDialog = (userId, type) => {
    setAdminTargetUserId(userId);
    setAdminFamilyMemberType(type);
    setAdminFamilyMember({ name: '', age: '', type: '' });
    setAdminFamilyMemberDialog(true);
  };
  
  const closeAdminFamilyDialog = () => {
    setAdminFamilyMemberDialog(false);
    setAdminTargetUserId(null);
  };
  
  const handleAdminFamilyMemberChange = (e) => {
    const { name, value } = e.target;
    setAdminFamilyMember(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const addAdminFamilyMember = async () => {
    if (!adminTargetUserId || !user?.id) return;
    
    try {
      setAdminLoading(true);
      setAdminError(null);
      
      // Import the admin API function
      const { adminAddFamilyMember } = await import('../services/api');
      
      // Prepare data to send
      let memberData = {
        memberType: adminFamilyMemberType,
        name: adminFamilyMember.name,
      };
      
      if (adminFamilyMemberType === 'elder' || adminFamilyMemberType === 'child') {
        memberData.age = adminFamilyMember.age;
      } else if (adminFamilyMemberType === 'pet') {
        memberData.petType = adminFamilyMember.type;
      }
      
      // Call the API
      const response = await adminAddFamilyMember(user.id, adminTargetUserId, memberData);
      
      if (response.success) {
        // Update the users list
        setAllUsers(response.data);
        setAdminFamilyMemberDialog(false);
        setAdminTargetUserId(null);
        setAdminEditSuccess(true);
      }
    } catch (err) {
      console.error('Error adding family member as admin:', err);
      setAdminError(err.message);
    } finally {
      setAdminLoading(false);
    }
  };
  
  const removeAdminFamilyMember = async (targetUserId, memberId, isFamilyMember) => {
    if (!targetUserId || !user?.id) return;
    
    try {
      setAdminLoading(true);
      setAdminError(null);
      
      // Import the admin API function
      const { adminRemoveFamilyMember } = await import('../services/api');
      
      // Call the API
      const response = await adminRemoveFamilyMember(
        user.id, 
        targetUserId, 
        memberId, 
        isFamilyMember ? 'familyMember' : 'pet'
      );
      
      if (response.success) {
        // Update the users list
        setAllUsers(response.data);
        setAdminEditSuccess(true);
      }
    } catch (err) {
      console.error('Error removing family member as admin:', err);
      setAdminError(err.message);
    } finally {
      setAdminLoading(false);
    }
  };
  
  // Handle closing the notification snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarState(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading profile...
        </Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/login')}
        >
          Return to login
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      {!backendAvailable && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Backend server appears to be offline. Profile changes will be saved locally only.
        </Alert>
      )}
      
      {/* Notification Snackbar */}
      <Snackbar
        open={snackbarState.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarState.severity} 
          variant="filled" 
          sx={{ width: '100%' }}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={editSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Profile updated successfully!
        </Alert>
      </Snackbar>
      
      {/* Admin action success message */}
      <Snackbar
        open={adminEditSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          User data updated successfully!
        </Alert>
      </Snackbar>
      
      {/* Admin Tabs - Only visible for admin users */}
      {user && user.role === 'admin' && (
        <Box sx={{ width: '100%', mb: 4 }}>
          <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
              aria-label="Admin tabs"
            >
              <Tab 
                icon={<AccountCircleIcon />} 
                label="My Profile" 
                id="tab-0"
                aria-controls="tabpanel-0"
              />
              <Tab 
                icon={<AdminPanelSettingsIcon />} 
                label="Admin Dashboard" 
                id="tab-1"
                aria-controls="tabpanel-1"
              />
            </Tabs>
          </Paper>
        </Box>
      )}
      
      {/* Admin Dashboard Tab Content */}
      {user && user.role === 'admin' && activeTab === 1 && (
        <AdminDashboard
          user={user}
          activeTab={activeTab}
          allUsers={allUsers}
          adminLoading={adminLoading}
          adminError={adminError}
          startEditingUser={startEditingUser}
          openAdminFamilyDialog={openAdminFamilyDialog}
          removeAdminFamilyMember={removeAdminFamilyMember}
          fetchAdminData={fetchAdminData}
          deleteUserHandler={handleDeleteUser}
        />
      )}
      
      {/* User Profile Tab Content */}
      <UserProfileSection
        user={user}
        editMode={editMode}
        editedUser={editedUser}
        handleEditChange={handleEditChange}
        cancelEdit={cancelEdit}
        handleEditSubmit={handleEditSubmit}
        loading={loading}
        error={error}
        openFamilyDialog={openFamilyDialog}
        removeFamilyMember={removeFamilyMember}
        setEditMode={setEditMode}
        activeTab={activeTab}
        isAdmin={isAdmin}
        allUsers={allUsers}
        editingUserId={editingUserId}
      />
      
      {/* Success message for family/pet updates */}
      <Snackbar
        open={familySuccess}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Family members or pets updated successfully!
        </Alert>
      </Snackbar>
      
      {/* Admin User Edit Dialog */}
      <AdminEditUserDialog
        open={!!editingUserId}
        onClose={cancelAdminEdit}
        userData={editedUserData}
        handleChange={handleAdminEditChange}
        onSave={saveAdminUserChanges}
        loading={adminLoading}
        error={adminError}
        allUsers={allUsers}
        editingUserId={editingUserId}
      />
      
      {/* User Family Member/Pet Dialog */}
      <FamilyMemberDialog
        open={showFamilyDialog}
        onClose={closeFamilyDialog}
        familyType={familyType}
        familyMember={familyMember}
        handleChange={handleFamilyMemberChange}
        onSubmit={addFamilyMember}
        loading={loading}
      />
      
      {/* Admin Family Member/Pet Dialog */}
      <FamilyMemberDialog
        open={adminFamilyMemberDialog}
        onClose={closeAdminFamilyDialog}
        familyType={adminFamilyMemberType}
        familyMember={adminFamilyMember}
        handleChange={handleAdminFamilyMemberChange}
        onSubmit={addAdminFamilyMember}
        loading={adminLoading}
        isAdmin={true}
      />
      
      {/* Notification Snackbar for user deletion */}
      <Snackbar
        open={snackbarState.open}
        autoHideDuration={6000}
        onClose={() => setSnackbarState(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarState(prev => ({ ...prev, open: false }))} 
          severity={snackbarState.severity} 
          variant="filled" 
          sx={{ width: '100%' }}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage;
