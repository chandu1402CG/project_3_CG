const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Load mock data
const usersData = require('../data/users.json');
const careCentersData = require('../data/careCenters.json');
const servicesData = require('../data/services.json');

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
      id: usersData.users.length + 1,
      username,
      email,
      password, // Note: In a real app, this would be hashed
      firstName,
      lastName,
      phone,
      address
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
      
      // Return the new user (minus password)
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

module.exports = router;
