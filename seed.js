const db = require('./dbs');
const bcrypt = require('bcrypt');

const seedAdmin = async () => {
  try {
    const adminUsername = 'admin';
    const adminPassword = 'admin_password'; 

    // Check if admin already exists
    const existingAdmin = await db.query('SELECT * FROM admin WHERE username = :username', {
      replacements: { username: adminUsername },
      type: db.QueryTypes.SELECT,
    });

    if (!existingAdmin || existingAdmin.length === 0) {
      // Hash the admin password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      // Create the admin user
      const [result] = await db.query(
        'INSERT INTO admin(name, username, password, role_id) VALUES (:name, :username, :password, :role_id)',
        {
          replacements: { name: 'Admin', username: adminUsername, password: hashedPassword, role_id: 1},
          type: db.QueryTypes.INSERT,
        }
      );

      console.log('Admin user seeded successfully.');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};


seedAdmin();
