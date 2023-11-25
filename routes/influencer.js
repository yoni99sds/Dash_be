const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
// Route to get all influencers
router.get('/influencers', async (req, res) => {
  try {
    const [rows, fields] = await db.execute('SELECT * FROM influencers');
    res.json(rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to add a new influencer
// Assuming 'role_id' is a foreign key in the 'influencers' table
router.post('/influencers', async (req, res) => {
  try {
    const { name, username, password, referral_link, promo_codes } = req.body;

    // Assuming 'role_id' for influencers is 2
    const role_id = 2;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO influencers (name, username, password, referral_link, promo_codes, role_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, username, hashedPassword, referral_link, promo_codes, role_id]
    );

    res.json({ id: result.insertId, name, username, password, referral_link, promo_codes, role_id });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route to update an influencer
router.put('/influencers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, password, referral_link, promo_codes } = req.body;
    const [result] = await db.execute(
      'UPDATE influencers SET name = ?, username = ?, password = ?, referral_link = ?, promo_codes = ? WHERE id = ?',
      [name, username, password, referral_link, promo_codes, id]
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Influencer not found' });
    } else {
      res.json({ id, name, username, password, referral_link, promo_codes });
    }
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to delete an influencer
router.delete('/influencers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute('DELETE FROM influencers WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Influencer not found' });
    } else {
      res.json({ message: 'Influencer deleted successfully' });
    }
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
