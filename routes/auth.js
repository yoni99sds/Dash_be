const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { authenticateUserQuery, getUserRoleQuery} = require('../queries');
const crypto = require('crypto');
const router = express.Router();
const Users = require('../models/users');
const Patient = require('../models/patient')
// Generate a secret key for signing JWT tokens
const secretKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRydCIsInJvbGUiOiJVc2VycyIsImlkIjo0LCJpYXQiOjE3MDQ0ODg2NTAsImV4cCI6MTcwNDQ5MjI1MH0.SIqh641gfHlf14XU4N3wWTnaEJa7-aa1_HfozvOG738';
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Forbidden' });

    req.user = user;
    next();
  });
};
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('Received login request for username:', username);

    // Authenticate user, admin, or influencer
    const user = await authenticateUserQuery(username, password);

    if (user) {
      console.log('User found:', user);

      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        // Get the user's role from the roles table
        const role = await getUserRoleQuery(user.role_id);

        // Generate JWT token
        const token = jwt.sign({ username: user.username, role, id: user.id  }, secretKey, { expiresIn: '1h' });
        console.log('Successful Authentication');
        res.json({
          
          success: true,
          message: 'Authentication successful',
          token,
          role,
        });
      } else {
        console.log('Invalid password');
        res.status(401).json({
          success: false,
          message: 'Authentication failed. Invalid username or password.',
        });
      }
    } else {
      console.log('User not found');
      res.status(401).json({
        success: false,
        message: 'Authentication failed. Invalid username or password.',
      });
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

const registerUser = async ({ name, username, password, influencerId = null, promoCodeId}) => {
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await Users.create({
      name,
      username,
      password:hashedPassword,
      influencerId, 
      promoCodeId,
      role_id: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { success: true, userId: user.id };
  } catch (error) {
    console.error('Error during registration:', error);
    return { success: false, message: 'Error during registration' };
  }
};


router.post('/signup', async (req, res) => {
  const { name, username, password, influencerId, promoCodeId } = req.body;

  try {
    // Register the user
    const { success, userId } = await registerUser({ name, username, password, influencerId, promoCodeId });

    if (success) {
      res.json({ success: true, userId });
    } else {
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
// Protected route that requires authentication
router.get('/protected-route', authenticateJWT, (req, res) => {
  // This route is protected and requires a valid JWT to access
  // The authenticated user information is available in req.user
  res.json({ success: true, user: req.user });
});

module.exports = router;


