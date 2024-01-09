const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET; 
const db = require('./db');
const bcrypt = require('bcrypt');
const Users = require('./models/users')
const PromoCode = require('./models/PromoCode')
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



const getUserRoleQuery = async (id) => {
  try {
    // Query to get the user's role from the roles table
    const [rows] = await db.execute('SELECT name FROM role WHERE id = ?', [id]);

    if (rows.length > 0) {
      return rows[0].name;
    }

    return null;
  } catch (error) {
    throw error;
  }
};





const generateToken = (user) => {
  // Generate JWT token with user's information
  const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
  return token;
};

module.exports = {  authenticateUserQuery,
  getUserRoleQuery,
 
  generateToken,
}




