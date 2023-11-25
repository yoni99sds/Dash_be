const express = require('express');
const db = require('../db');
const bcrypt = require('bcrypt');
const router = express.Router();
// Route to get all users
router.get('/users', async (req, res) => {
  try {
    const [rows, fields] = await db.execute('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to add a new user
router.post('/users', async (req, res) => {
  try {
    const { name, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    const role_id = 3;
    const [result] = await db.execute('INSERT INTO users (name, username, password, role_id) VALUES (?, ?, ?,?)', [name, username, hashedPassword, role_id]);
    res.json({ id: result.insertId, name, username, password, role_id });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route to edit a user
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows, fields] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update a user
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, password } = req.body;
    const [result] = await db.execute('UPDATE users SET name = ?, username = ?, password = ? WHERE id = ?', [name, username, password, id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json({ id, name, username, password });
    }
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route to delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json({ message: 'User deleted successfully' });
    }
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
