// auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { authenticateUserQuery, getUserRoleQuery } = require('../queries');
const crypto = require('crypto');
const router = express.Router();

// Generate a secret key for signing JWT tokens
const secretKey = crypto.randomBytes(32).toString('hex');
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('Received login request for username:', username);

    // Authenticate user, admin, or influencer
    const user = await authenticateUserQuery(username, password);

    if (user) {
      console.log('User found:', user);

      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compareSync(password, user.password);

      if (isPasswordValid) {
        // Get the user's role from the roles table
        const role = await getUserRoleQuery(user.role_id);

        // Generate JWT token
        const token = jwt.sign({ username: user.username, role }, secretKey, { expiresIn: '1h' });
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

module.exports = router;
