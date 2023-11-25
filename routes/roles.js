const express = require('express');
const router = express.Router();
const { getRoleNameQuery } = require('../queries');

router.get('/:role_id', async (req, res) => {
  try {
    const { role_id } = req.params;

    // Fetch role_name based on role_id
    const role = await getRoleNameQuery(role_id);

    if (role) {
      res.json({ success: true, role_name: role.role_name });
    } else {
      res.status(404).json({ success: false, message: 'Role not found' });
    }
  } catch (error) {
    console.error('Error fetching role name:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
