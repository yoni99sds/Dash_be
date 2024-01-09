const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Users  = require('../models/users'); 

// Route to get all users
router.get('/users', async (req, res) => {
  try {
    const users = await Users.findAll();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to add a new user
  router.post('/users', async (req, res) => {
    try {
      const { name, username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const role_id = 3;

      const newUser = await Users.create({
        name,
        username,
        password: hashedPassword,
        role_id,
      });

      res.json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Route to get a specific user
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findByPk(id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(user);
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update a user
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, password } = req.body;

    const user = await Users.findByPk(id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      // Update user fields
      user.name = name;
      user.username = username;
      user.password = await bcrypt.hash(password, 10);
      await user.save();

      res.json(user);
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findByPk(id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      await user.destroy();
      res.json({ message: 'User deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
