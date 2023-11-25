// queries.js
const db = require('./db');
const bcrypt = require('bcrypt');
const authenticateUserQuery = async (username, password) => {
  try {
    // Query to authenticate user, admin, or influencer
    const [rows] = await db.execute(`
      SELECT id, username, password, role_id FROM users WHERE username = ? 
      UNION
      SELECT id, username, password, role_id FROM admin WHERE username = ?
      UNION
      SELECT id, username, password, role_id FROM influencers WHERE username = ?
    `, [username, username, username]);

    if (rows.length > 0) {
      const user = rows[0];
      // Compare the entered password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return { ...user };
      }
    }

    return null;
  } catch (error) {
    throw error;
  }
};



const getUserRoleQuery = async (role_id) => {
  try {
    // Query to get the user's role from the roles table
    const [rows] = await db.execute('SELECT role_name FROM roles WHERE role_id = ?', [role_id]);

    if (rows.length > 0) {
      return rows[0].role_name;
    }

    return null;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  authenticateUserQuery,
  getUserRoleQuery,
  // Add more queries as needed
};
