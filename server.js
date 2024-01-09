const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const crypto = require('crypto');
const cors = require('cors');
const usersRouter = require('./routes/users');
const influencersRouter = require('./routes/influencer');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const rolesRouter = require('./routes/roles');
const influencerPerformanceRouter = require('./routes/InfluencerPerformance');
const trackingRouter = require('./routes/tracking');
const promoCodeRoutes = require('./routes/PromoCode');
const referralLinksRoutes = require('./routes/ReferralLink');
const patientRoutes = require('./routes/patients');


const sequelize = require('./dbs');
const PromoCode = require('./models/PromoCode');
const Users = require('./models/users');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
const secretKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRydCIsInJvbGUiOiJVc2VycyIsImlkIjo0LCJpYXQiOjE3MDQ0ODg2NTAsImV4cCI6MTcwNDQ5MjI1MH0.SIqh641gfHlf14XU4N3wWTnaEJa7-aa1_HfozvOG738';

// Configure the express-session middleware with the secret key
app.use(session({
  secret: secretKey,
  resave: true,
  saveUninitialized: true
}));
sequelize.sync().then(() => {
  console.log('Models synchronized with the database.');
});
// Configure the connect-flash middleware
app.use(flash());

// Middleware to parse JSON requests
app.use(express.json());

app.use('/api', usersRouter);
app.use('/api', influencersRouter);
app.use('/api', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/roles', rolesRouter);
app.use('/api', influencerPerformanceRouter);
app.use('/api/tracking', trackingRouter);
app.use('/api', promoCodeRoutes);
app.use('/api', referralLinksRoutes);


app.use('/api', patientRoutes);

// Endpoint to get promocode id
app.get('/api/promocode', async (req, res) => {
  try {
    const code = req.query.code; // Get the code from the query parameters

    // Assuming you have a database model for promocodes
    const promocode = await PromoCode.findOne({ code });

    if (!promocode) {
      return res.status(404).json({ error: 'Promocode not found' });
    }

    // Return the promocodeid
    res.json({ promocodeid: promocode._id });
  } catch (error) {
    console.error('Error fetching promocodeid:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(8012, () => {
  console.log('Server is running on port 8012');
});
