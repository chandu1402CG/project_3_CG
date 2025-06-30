const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Load mock data
const usersData = require('../data/users.json');
const careCentersData = require('../data/careCenters.json');
const servicesData = require('../data/services.json');
let testimonialsData;

// Try to load testimonials data
try {
  testimonialsData = require('../data/testimonials.json');
  console.log('Testimonials data loaded successfully');
} catch (error) {
  console.error('Error loading testimonials data:', error);
  testimonialsData = { testimonials: [] };
}

// Load schedules data
let schedulesData;
try {
  schedulesData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/schedules.json'), 'utf8')
  );
  console.log('Schedules data loaded successfully');
} catch (error) {
  console.error('Error loading schedules data:', error);
  schedulesData = [];
}

// Authentication routes
router.post('/auth/register', (req, res) => {
  console.log('Register API called with data:', {
    ...req.body,
    password: req.body.password ? '[HIDDEN]' : 'undefined'
  });
  
  try {
    const { username, email, password, firstName, lastName, phone, address } = req.body;
    
    // Validate required fields
    if (!username || !email || !password || !firstName || !lastName) {
      console.log('Registration missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Check if user already exists
    console.log('Checking if user already exists with email:', email);
    const userExists = usersData.users.find(user => user.email === email);
    if (userExists) {
      console.log('User already exists with email:', email);
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Create new user (in a real app, you'd hash the password)
    const newUser = {
      id: uuidv4(), // Generate a unique UUID instead of sequential IDs
      username,
      email,
      password, // Note: In a real app, this would be hashed
      firstName,
      lastName,
      phone,
      address,
      role: 'user' // Set default role as 'user'
    };    // Read the latest user data first to make sure we have the most up-to-date list
    let currentUsersData;
    try {
      currentUsersData = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8')
      );
    } catch (readErr) {
      console.error('Error reading users.json:', readErr);
      currentUsersData = { users: [] }; // Start with empty users if file doesn't exist yet
    }
    
    // Add new user to the users array
    currentUsersData.users.push(newUser);
      try {
      console.log('Writing new user to file with ID:', newUser.id);
      // Use synchronous writeFile to ensure the data is written before responding
      fs.writeFileSync(
        path.join(__dirname, '../data/users.json'),
        JSON.stringify(currentUsersData, null, 2)
      );
      
      // Update the in-memory cache with the new data
      Object.assign(usersData, currentUsersData);
      
      console.log('User registration successful. Users count now:', currentUsersData.users.length);
      console.log('New user created with UUID:', newUser.id);
      console.log('User role set to:', newUser.role);
      
      // Return the user (minus password)
      const { password: _, ...userWithoutPassword } = newUser;
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: userWithoutPassword
      });
    } catch (writeErr) {
      console.error('Error writing to users.json:', writeErr);
      res.status(500).json({
        success: false,
        message: 'Error saving user data'
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

router.post('/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Read the latest user data from file
    const latestUserData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8')
    );
    
    // Find user
    const user = latestUserData.users.find(user => user.email === email && user.password === password);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Ensure the user has a role (for backward compatibility with existing users)
    if (!user.role) {
      user.role = 'user';
      console.log('Adding default role to existing user:', user.id);
      
      // Update the user in the file with the new role
      fs.writeFileSync(
        path.join(__dirname, '../data/users.json'),
        JSON.stringify(latestUserData, null, 2)
      );
    }
    
    // Return user data (minus password)
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Get all users (Admin only)
router.get('/auth/all-users', (req, res) => {
  try {
    // This would typically include authentication and admin role validation
    // For demo purposes, we'll just check a token or userId parameter
    const { userId } = req.query;
    
    console.log('Admin request to get all users from user ID:', userId);
    
    // Read the latest user data from file
    const latestUserData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8')
    );
    
    // Find the requesting user
    const requestingUser = latestUserData.users.find(user => user.id === userId);
    
    if (!requestingUser) {
      return res.status(404).json({
        success: false,
        message: 'Requesting user not found'
      });
    }
    
    // Check if the requesting user is an admin
    if (requestingUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    
    // Return all users (minus passwords)
    const usersWithoutPasswords = latestUserData.users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.status(200).json({
      success: true,
      data: usersWithoutPasswords
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving all users'
    });
  }
});

// Update user profile
router.put('/auth/update-profile', (req, res) => {
  try {
    console.log('Update profile API endpoint hit with data:', req.body);
    const { id, username, email, firstName, lastName, phone, address } = req.body;
    
    console.log('Update profile API called for user ID:', id);
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    // Read the latest user data from file
    const latestUserData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8')
    );
    
    // Find user index
    const userIndex = latestUserData.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get the existing user to preserve any properties not being updated
    const existingUser = latestUserData.users[userIndex];
    
    // Update user data (preserving password and other fields not in the request)
    latestUserData.users[userIndex] = {
      ...existingUser,
      username: username || existingUser.username,
      email: email || existingUser.email,
      firstName: firstName || existingUser.firstName,
      lastName: lastName || existingUser.lastName,
      phone: phone || existingUser.phone,
      address: address || existingUser.address,
    };
    
    // Save updated user data
    fs.writeFileSync(
      path.join(__dirname, '../data/users.json'),
      JSON.stringify(latestUserData, null, 2)
    );
    
    // Update the in-memory data
    Object.assign(usersData, latestUserData);
    
    console.log('User profile updated successfully');
    
    // Return the updated user (minus password)
    const { password: _, ...userWithoutPassword } = latestUserData.users[userIndex];
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during profile update'
    });
  }
});

// Add family member or pet
router.post('/auth/add-family-member', (req, res) => {
  try {
    console.log('Adding family member or pet with data:', req.body);
    const { userId, memberType, name, age, petType } = req.body;
    
    if (!userId || !memberType || !name) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Read the latest user data from file
    const latestUserData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8')
    );
    
    // Find user index
    const userIndex = latestUserData.users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get the existing user to update
    const existingUser = latestUserData.users[userIndex];
    
    if (memberType === 'elder' || memberType === 'child') {
      // Handle family member
      if (!existingUser.familyMembers) {
        existingUser.familyMembers = [];
      }
      
      existingUser.familyMembers.push({
        id: uuidv4(),
        name,
        age,
        type: memberType
      });
    } else if (memberType === 'pet') {
      // Handle pet
      if (!existingUser.pets) {
        existingUser.pets = [];
      }
      
      existingUser.pets.push({
        id: uuidv4(),
        name,
        type: petType
      });
    }
    
    // Save updated user data
    fs.writeFileSync(
      path.join(__dirname, '../data/users.json'),
      JSON.stringify(latestUserData, null, 2)
    );
    
    // Update the in-memory data
    Object.assign(usersData, latestUserData);
    
    console.log('Family member or pet added successfully');
    
    // Return the updated user (minus password)
    const { password: _, ...userWithoutPassword } = existingUser;
    
    res.status(200).json({
      success: true,
      message: 'Family member or pet added successfully',
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Add family member error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding family member or pet'
    });
  }
});

// Remove family member or pet
router.post('/auth/remove-family-member', (req, res) => {
  try {
    console.log('Remove family member or pet with data:', req.body);
    const { userId, memberId, memberType } = req.body;
    
    if (!userId || !memberId || !memberType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Read the latest user data from file
    const latestUserData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8')
    );
    
    // Find user index
    const userIndex = latestUserData.users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get the existing user to update
    const existingUser = latestUserData.users[userIndex];
    
    if (memberType === 'familyMember') {
      // Remove family member
      if (existingUser.familyMembers && existingUser.familyMembers.length > 0) {
        existingUser.familyMembers = existingUser.familyMembers.filter(member => member.id !== memberId);
      }
    } else if (memberType === 'pet') {
      // Remove pet
      if (existingUser.pets && existingUser.pets.length > 0) {
        existingUser.pets = existingUser.pets.filter(pet => pet.id !== memberId);
      }
    }
    
    // Save updated user data
    fs.writeFileSync(
      path.join(__dirname, '../data/users.json'),
      JSON.stringify(latestUserData, null, 2)
    );
    
    // Update the in-memory data
    Object.assign(usersData, latestUserData);
    
    console.log('Family member or pet removed successfully');
    
    // Return the updated user (minus password)
    const { password: _, ...userWithoutPassword } = existingUser;
    
    res.status(200).json({
      success: true,
      message: 'Family member or pet removed successfully',
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Remove family member error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing family member or pet'
    });
  }
});

// Care Centers routes
router.get('/care-centers', (req, res) => {
  try {
    // Read the latest care center data from file
    const latestCentersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/careCenters.json'), 'utf8')
    );
    
    res.json({
      success: true,
      data: latestCentersData.careCenters
    });
  } catch (error) {
    console.error('Error reading care centers data:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving care centers'
    });
  }
});

router.get('/care-centers/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Read the latest care center data from file
    const latestCentersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/careCenters.json'), 'utf8')
    );
    
    const center = latestCentersData.careCenters.find(center => center.id === id);
    
    if (!center) {
      return res.status(404).json({
        success: false,
        message: 'Care center not found'
      });
    }
    
    res.json({
      success: true,
      data: center
    });
  } catch (error) {
    console.error('Error reading care center data:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving care center'
    });
  }
});

// Services routes
router.get('/services', (req, res) => {
  try {
    // Read the latest services data from file
    const latestServicesData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/services.json'), 'utf8')
    );
    
    res.json({
      success: true,
      data: latestServicesData.services
    });
  } catch (error) {
    console.error('Error reading services data:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving services'
    });
  }
});

router.get('/services/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Read the latest services data from file
    const latestServicesData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/services.json'), 'utf8')
    );
    
    const service = latestServicesData.services.find(service => service.id === id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error reading service data:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving service'
    });
  }
});

// Get all items
router.get('/items', (req, res) => {
  res.json({ 
    success: true, 
    data: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' }
    ] 
  });
});

// Get a single item
router.get('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  res.json({ 
    success: true, 
    data: { id, name: `Item ${id}` } 
  });
});

// Create a new item
router.post('/items', (req, res) => {
  const { name } = req.body;
  
  // Here you would typically save to a database
  // For now, we'll just echo back the data
  
  res.status(201).json({ 
    success: true, 
    data: { id: Date.now(), name } 
  });
});

// Update an item
router.put('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;
  
  res.json({ 
    success: true, 
    data: { id, name } 
  });
});

// Delete an item
router.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  res.json({ 
    success: true, 
    message: `Item ${id} deleted successfully` 
  });
});

// Admin endpoint to update a user's profile
router.put('/auth/admin-update-user', (req, res) => {
  try {
    const { adminId, targetUserId, userData } = req.body;
    
    console.log('Admin update user API called by admin ID:', adminId, 'for target user ID:', targetUserId);
    
    if (!adminId || !targetUserId || !userData) {
      return res.status(400).json({
        success: false,
        message: 'Admin ID, target user ID, and user data are required'
      });
    }
    
    // Read the latest user data from file
    const latestUserData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8')
    );
    
    // Find the admin user
    const adminUser = latestUserData.users.find(user => user.id === adminId);
    
    // Check if the admin exists and has admin role
    if (!adminUser) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found'
      });
    }
    
    if (adminUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    
    // Find target user index
    const targetUserIndex = latestUserData.users.findIndex(user => user.id === targetUserId);
    
    if (targetUserIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Target user not found'
      });
    }
    
    // Get the existing user to preserve properties not being updated
    const existingUser = latestUserData.users[targetUserIndex];
    
    // Update user data (preserving email and other fields not in the request)
    // Admin can update: username, password, firstName, lastName, phone, address, and role
    // Email is preserved and cannot be changed by admin
    latestUserData.users[targetUserIndex] = {
      ...existingUser,
      username: userData.username || existingUser.username,
      // Email cannot be changed by admin
      password: userData.password || existingUser.password, // Allow password change
      firstName: userData.firstName || existingUser.firstName,
      lastName: userData.lastName || existingUser.lastName,
      phone: userData.phone || existingUser.phone,
      address: userData.address || existingUser.address,
      role: userData.role || existingUser.role
    };
    
    // Save updated user data
    fs.writeFileSync(
      path.join(__dirname, '../data/users.json'),
      JSON.stringify(latestUserData, null, 2)
    );
    
    // Update the in-memory data
    Object.assign(usersData, latestUserData);
    
    console.log('User profile updated by admin successfully');
    
    // Return all users (minus passwords) for admin dashboard update
    const usersWithoutPasswords = latestUserData.users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      data: usersWithoutPasswords
    });
    
  } catch (error) {
    console.error('Error updating user profile by admin:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user profile'
    });
  }
});

// Admin endpoint to add family member or pet to any user
router.post('/auth/admin-add-family-member', (req, res) => {
  try {
    const { adminId, targetUserId, memberData } = req.body;
    
    console.log('Admin add family member API called by admin ID:', adminId, 'for target user ID:', targetUserId);
    
    if (!adminId || !targetUserId || !memberData) {
      return res.status(400).json({
        success: false,
        message: 'Admin ID, target user ID, and member data are required'
      });
    }
    
    // Read the latest user data from file
    const latestUserData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8')
    );
    
    // Find the admin user
    const adminUser = latestUserData.users.find(user => user.id === adminId);
    
    // Check if the admin exists and has admin role
    if (!adminUser) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found'
      });
    }
    
    if (adminUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    
    // Find target user
    const targetUserIndex = latestUserData.users.findIndex(user => user.id === targetUserId);
    
    if (targetUserIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Target user not found'
      });
    }
    
    const targetUser = latestUserData.users[targetUserIndex];
    
    if (memberData.memberType === 'elder' || memberData.memberType === 'child') {
      // Add family member
      if (!targetUser.familyMembers) {
        targetUser.familyMembers = [];
      }
      
      const newMember = {
        id: uuidv4(),
        name: memberData.name,
        age: memberData.age,
        type: memberData.memberType
      };
      
      targetUser.familyMembers.push(newMember);
      console.log(`Added ${memberData.memberType} to user ${targetUserId}`);
      
    } else if (memberData.memberType === 'pet') {
      // Add pet
      if (!targetUser.pets) {
        targetUser.pets = [];
      }
      
      const newPet = {
        id: uuidv4(),
        name: memberData.name,
        type: memberData.petType
      };
      
      targetUser.pets.push(newPet);
      console.log(`Added pet to user ${targetUserId}`);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid member type. Must be "elder", "child", or "pet".'
      });
    }
    
    // Save updated data
    latestUserData.users[targetUserIndex] = targetUser;
    fs.writeFileSync(
      path.join(__dirname, '../data/users.json'),
      JSON.stringify(latestUserData, null, 2)
    );
    
    // Update the in-memory data
    Object.assign(usersData, latestUserData);
    
    // Return all users (minus passwords) for admin dashboard update
    const usersWithoutPasswords = latestUserData.users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.status(200).json({
      success: true,
      message: 'Family member or pet added successfully',
      data: usersWithoutPasswords
    });
    
  } catch (error) {
    console.error('Error adding family member by admin:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding family member'
    });
  }
});

// Admin endpoint to remove family member or pet from any user
router.post('/auth/admin-remove-family-member', (req, res) => {
  try {
    const { adminId, targetUserId, memberId, memberType } = req.body;
    
    console.log('Admin remove family member API called by admin ID:', adminId, 'for target user ID:', targetUserId);
    
    if (!adminId || !targetUserId || !memberId || !memberType) {
      return res.status(400).json({
        success: false,
        message: 'Admin ID, target user ID, member ID, and member type are required'
      });
    }
    
    // Read the latest user data from file
    const latestUserData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8')
    );
    
    // Find the admin user
    const adminUser = latestUserData.users.find(user => user.id === adminId);
    
    // Check if the admin exists and has admin role
    if (!adminUser) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found'
      });
    }
    
    if (adminUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    
    // Find target user
    const targetUserIndex = latestUserData.users.findIndex(user => user.id === targetUserId);
    
    if (targetUserIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Target user not found'
      });
    }
    
    const targetUser = latestUserData.users[targetUserIndex];
    
    // Remove the family member or pet
    if (memberType === 'familyMember') {
      // Check if user has family members array
      if (!targetUser.familyMembers || targetUser.familyMembers.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User has no family members'
        });
      }
      
      // Find the index of the family member to remove
      const memberIndex = targetUser.familyMembers.findIndex(member => member.id === memberId);
      
      if (memberIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Family member not found'
        });
      }
      
      // Remove the family member
      targetUser.familyMembers.splice(memberIndex, 1);
      console.log(`Removed family member from user ${targetUserId}`);
      
    } else if (memberType === 'pet') {
      // Check if user has pets array
      if (!targetUser.pets || targetUser.pets.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User has no pets'
        });
      }
      
      // Find the index of the pet to remove
      const petIndex = targetUser.pets.findIndex(pet => pet.id === memberId);
      
      if (petIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Pet not found'
        });
      }
      
      // Remove the pet
      targetUser.pets.splice(petIndex, 1);
      console.log(`Removed pet from user ${targetUserId}`);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid member type. Must be "familyMember" or "pet".'
      });
    }
    
    // Save updated data
    latestUserData.users[targetUserIndex] = targetUser;
    fs.writeFileSync(
      path.join(__dirname, '../data/users.json'),
      JSON.stringify(latestUserData, null, 2)
    );
    
    // Update the in-memory data
    Object.assign(usersData, latestUserData);
    
    // Return all users (minus passwords) for admin dashboard update
    const usersWithoutPasswords = latestUserData.users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.status(200).json({
      success: true,
      message: 'Family member or pet removed successfully',
      data: usersWithoutPasswords
    });
    
  } catch (error) {
    console.error('Error removing family member by admin:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing family member'
    });
  }
});

// Delete a user (Admin only)
router.delete('/auth/delete-user/:userId', (req, res) => {
  try {
    console.log('DELETE user API called for userId:', req.params.userId);
    
    // Get the admin user ID from the query params for authorization
    const { adminId } = req.query;
    
    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Admin authorization required'
      });
    }
    
    // Find the admin user to check permissions
    const adminUser = usersData.users.find(user => user.id === adminId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Admin privileges required'
      });
    }
    
    const userIdToDelete = req.params.userId;
    
    // Read the latest user data first
    let currentUsersData;
    try {
      currentUsersData = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8')
      );
    } catch (readErr) {
      console.error('Error reading users.json:', readErr);
      return res.status(500).json({
        success: false,
        message: 'Error reading user data'
      });
    }
    
    // Find the user to be deleted
    const userIndex = currentUsersData.users.findIndex(user => user.id === userIdToDelete);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Don't allow deleting the last admin
    const userToDelete = currentUsersData.users[userIndex];
    if (userToDelete.role === 'admin') {
      const adminCount = currentUsersData.users.filter(user => user.role === 'admin').length;
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the last admin user'
        });
      }
    }
    
    // Remove the user from the array
    currentUsersData.users.splice(userIndex, 1);
    
    // Save the updated users array back to file
    try {
      fs.writeFileSync(
        path.join(__dirname, '../data/users.json'),
        JSON.stringify(currentUsersData, null, 2)
      );
      
      // Update the in-memory cache with the new data
      Object.assign(usersData, currentUsersData);
      
      console.log('User deleted successfully:', userIdToDelete);
      
      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (writeErr) {
      console.error('Error writing to users.json:', writeErr);
      res.status(500).json({
        success: false,
        message: 'Error saving user data'
      });
    }
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during user deletion'
    });
  }
});

// Testimonials route - GET all testimonials
router.get('/testimonials', (req, res) => {
  try {
    console.log('GET /testimonials endpoint called');
    
    // Try to read the file directly to make sure we have the latest data
    let testimonials;
    try {
      testimonials = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../data/testimonials.json'), 'utf8')
      ).testimonials || [];
      console.log(`Read ${testimonials.length} testimonials from file`);
    } catch (readErr) {
      console.error('Error reading testimonials.json file:', readErr);
      testimonials = testimonialsData.testimonials || [];
      console.log(`Using in-memory data with ${testimonials.length} testimonials`);
    }
    
    res.status(200).json({
      success: true,
      message: 'Testimonials fetched successfully',
      data: testimonials
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching testimonials'
    });
  }
});

// Add new testimonial - POST
router.post('/testimonials', (req, res) => {
  try {
    console.log('POST /testimonials endpoint called with body:', req.body);
    
    const { name, role, content, rating } = req.body;
    
    // Validate required fields
    if (!name || !role || !content) {
      console.log('Validation failed:', { name, role, content });
      return res.status(400).json({
        success: false,
        message: 'Name, role, and content are required fields'
      });
    }

    console.log('Reading testimonials.json file');
    // Read the latest testimonials data from file
    let currentTestimonialsData;
    try {
      currentTestimonialsData = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../data/testimonials.json'), 'utf8')
      );
      console.log(`Read ${currentTestimonialsData.testimonials.length} testimonials from file`);
    } catch (readErr) {
      console.error('Error reading testimonials.json:', readErr);
      currentTestimonialsData = { testimonials: [] };
      console.log('Created empty testimonials array');
    }

    // Generate a unique ID (format: t + number)
    let newId;
    if (currentTestimonialsData.testimonials.length > 0) {
      const testimonialIds = currentTestimonialsData.testimonials.map(t => 
        parseInt(t.id.replace('t', '')) || 0
      );
      const maxId = Math.max(...testimonialIds);
      newId = `t${maxId + 1}`;
    } else {
      newId = 't1';
    }
    
    console.log('Generated new testimonial ID:', newId);
    
    // Create new testimonial object
    const newTestimonial = {
      id: newId,
      name,
      role,
      content,
      rating: rating || 5,
      image: `/images/testimonials/default.jpg` // Default image
    };

    // Add to testimonials array
    currentTestimonialsData.testimonials.push(newTestimonial);

    const testimonialFilePath = path.join(__dirname, '../data/testimonials.json');
    console.log('Writing testimonials to:', testimonialFilePath);
    
    try {
      // Save updated testimonials back to file
      fs.writeFileSync(
        testimonialFilePath,
        JSON.stringify(currentTestimonialsData, null, 2)
      );
      console.log('Testimonials file updated successfully');

      // Update the in-memory data
      testimonialsData = currentTestimonialsData;

      // Return success response with the new testimonial
      res.status(201).json({
        success: true,
        message: 'Testimonial added successfully',
        data: newTestimonial
      });
    } catch (writeErr) {
      console.error('Error writing testimonials to file:', writeErr);
      res.status(500).json({
        success: false,
        message: 'Server error while saving testimonial'
      });
    }
    
  } catch (error) {
    console.error('Error adding testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding testimonial'
    });
  }
});

// Password reset tokens storage (in-memory - would be in a database in production)
const resetTokens = {};

// Forgot Password - Step 1: Request password reset
router.post('/auth/forgot-password', (req, res) => {
  try {
    console.log('POST /auth/forgot-password endpoint called');
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    // Check if user exists
    const user = usersData.users.find(user => user.email === email);
    if (!user) {
      // For security reasons, don't reveal if user exists or not
      return res.status(200).json({
        success: true,
        message: 'If your email is registered, you will receive a reset link shortly'
      });
    }
    
    // Generate a reset token (UUID)
    const resetToken = uuidv4();
    
    // Store token with user information
    resetTokens[resetToken] = {
      userId: user.id,
      email: user.email,
      expires: Date.now() + (60 * 60 * 1000) // Token valid for 1 hour
    };
    
    console.log(`Reset token generated for email: ${email} - Token: ${resetToken}`);
    console.log('Reset tokens:', resetTokens);
    
    // In a real application, send email with reset link
    // For this demo, we'll just return the token directly
    
    return res.status(200).json({
      success: true,
      message: 'Password reset link sent successfully',
      resetToken: resetToken // This would normally be sent via email, not in the response
    });
    
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset request'
    });
  }
});

// Forgot Password - Step 2: Verify reset code (math puzzle answer)
router.post('/auth/verify-reset', (req, res) => {
  try {
    console.log('POST /auth/verify-reset endpoint called');
    const { email, answer, resetToken } = req.body;
    
    // Check if required data is provided
    if (!email || answer === undefined || !resetToken) {
      return res.status(400).json({
        success: false,
        message: 'Email, answer, and reset token are required'
      });
    }
    
    // Check if token exists and is valid
    const tokenData = resetTokens[resetToken];
    if (!tokenData || tokenData.email !== email || tokenData.expires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }
    
    // In a real application, we would verify the answer against what was sent
    // Here we'll just check if an answer was provided (the frontend does the verification)
    
    console.log(`Reset token verified for email: ${email}`);
    
    return res.status(200).json({
      success: true,
      message: 'Verification successful'
    });
    
  } catch (error) {
    console.error('Reset verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during reset verification'
    });
  }
});

// Forgot Password - Step 3: Reset password with new password
router.post('/auth/reset-password', (req, res) => {
  try {
    console.log('POST /auth/reset-password endpoint called');
    const { email, newPassword, resetToken } = req.body;
    
    // Check if required data is provided
    if (!email || !newPassword || !resetToken) {
      return res.status(400).json({
        success: false,
        message: 'Email, new password, and reset token are required'
      });
    }
    
    // Check if token exists and is valid
    const tokenData = resetTokens[resetToken];
    if (!tokenData || tokenData.email !== email || tokenData.expires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }
    
    // Read the latest user data
    let currentUsersData;
    try {
      currentUsersData = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8')
      );
    } catch (readErr) {
      console.error('Error reading users.json:', readErr);
      return res.status(500).json({
        success: false,
        message: 'Error reading user data'
      });
    }
    
    // Find the user and update password
    const userIndex = currentUsersData.users.findIndex(user => user.email === email);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update the password
    currentUsersData.users[userIndex].password = newPassword; // In production, this would be hashed
    
    // Save the updated user data
    try {
      fs.writeFileSync(
        path.join(__dirname, '../data/users.json'),
        JSON.stringify(currentUsersData, null, 2)
      );
      
      // Update the in-memory cache
      Object.assign(usersData, currentUsersData);
      
      // Remove the used token
      delete resetTokens[resetToken];
      
      console.log(`Password reset successful for email: ${email}`);
      
      return res.status(200).json({
        success: true,
        message: 'Password reset successfully'
      });
      
    } catch (writeErr) {
      console.error('Error writing to users.json:', writeErr);
      return res.status(500).json({
        success: false,
        message: 'Error saving user data'
      });
    }
    
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset'
    });
  }
});

// Schedules Routes
// Get all schedules for a user
router.get('/schedules/:userId', (req, res) => {
  try {
    console.log('GET /schedules/:userId endpoint called');
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    // Read the latest schedules data
    let currentSchedulesData;
    try {
      currentSchedulesData = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../data/schedules.json'), 'utf8')
      );
    } catch (readErr) {
      console.error('Error reading schedules.json:', readErr);
      currentSchedulesData = [];
    }
    
    // Filter schedules by user ID
    const userSchedules = currentSchedulesData.filter(schedule => schedule.userId === userId);
    
    // Sort by date (newest first)
    userSchedules.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.status(200).json({
      success: true,
      message: 'Schedules fetched successfully',
      data: userSchedules
    });
    
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching schedules'
    });
  }
});

// Create a new schedule
router.post('/schedules', (req, res) => {
  try {
    console.log('POST /schedules endpoint called');
    
    const { 
      userId, 
      memberId, 
      memberName,
      memberType, 
      date, 
      dropOffTime, 
      pickupTime, 
      notes, 
      programType 
    } = req.body;
    
    // Validate required fields
    if (!userId || !memberId || !memberName || !memberType || !date || !dropOffTime || !pickupTime || !programType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Check if user exists
    const user = usersData.users.find(user => user.id === userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Read the latest schedules data
    let currentSchedulesData;
    try {
      currentSchedulesData = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../data/schedules.json'), 'utf8')
      );
    } catch (readErr) {
      console.error('Error reading schedules.json:', readErr);
      currentSchedulesData = [];
    }
    
    // Generate a unique ID
    const newId = `sched_${Date.now()}`;
    
    // Create new schedule
    const newSchedule = {
      id: newId,
      userId,
      memberId,
      memberName,
      memberType,
      date,
      dropOffTime,
      pickupTime,
      notes,
      programType,
      createdAt: new Date().toISOString()
    };
    
    // Add to schedules array
    currentSchedulesData.push(newSchedule);
    
    // Save updated schedules back to file
    try {
      fs.writeFileSync(
        path.join(__dirname, '../data/schedules.json'),
        JSON.stringify(currentSchedulesData, null, 2)
      );
      
      // Update in-memory data
      schedulesData = currentSchedulesData;
      
      res.status(201).json({
        success: true,
        message: 'Schedule created successfully',
        data: newSchedule
      });
      
    } catch (writeErr) {
      console.error('Error writing schedules to file:', writeErr);
      res.status(500).json({
        success: false,
        message: 'Server error while saving schedule'
      });
    }
    
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating schedule'
    });
  }
});

module.exports = router;
