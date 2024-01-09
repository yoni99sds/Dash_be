const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const Users = require('../models/users');
const Signups = require('../models/signup');
// Route to get all admins
router.get('/admin', async (req, res) => {
  try {
    const [rows, fields] = await db.execute('SELECT id, name, username FROM admin');
    res.json(rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to add a new admin
router.post('/admin', async (req, res) => {
  try {
    const { name, username, password } = req.body;
    const role_id = 1;

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert the admin with the hashed password
    const [result] = await db.execute(
      'INSERT INTO admin (name, username, password, roleId) VALUES (?, ?, ?, ?)',
      [name, username, hashedPassword, role_id]
    );

    res.json({
      id: result.insertId,
      name,
      username,
      roleId,
    });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route to update an admin
router.put('/admin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute('UPDATE admin SET name = ?, username = ?, password = ? WHERE id = ?', [name, username, hashedPassword, id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Admin not found' });
    } else {
      res.json({ id, name, username });
    }
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to delete an admin
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findByPk(id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      // Delete associated signups
      await Signups.destroy({
        where: { userId: id }
      });

      // Delete the user
      await user.destroy();
      res.json({ message: 'User and associated signups deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
