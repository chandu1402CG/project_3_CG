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
  try {
    const { username, email, password, firstName, lastName, phone, address } = req.body;
    
    // Check if user already exists
    const userExists = usersData.users.find(user => user.email === email);
    if (userExists) {
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
    };
    
    // Return the new user (minus password)
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: userWithoutPassword
    });
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
    
    // Find user
    const user = usersData.users.find(user => user.email === email && user.password === password);
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
  res.json({
    success: true,
    data: careCentersData.careCenters
  });
});

router.get('/care-centers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const center = careCentersData.careCenters.find(center => center.id === id);
  
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
});

// Services routes
router.get('/services', (req, res) => {
  res.json({
    success: true,
    data: servicesData.services
  });
});

router.get('/services/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const service = servicesData.services.find(service => service.id === id);
  
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
