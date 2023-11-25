const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const usersRouter =require('./routes/users')
const influencersRouter = require('./routes/influencer'); // Add this line
const adminRoutes = require('./routes/admin')
const authRoutes = require('./routes/auth')
const rolesRouter = require('./routes/roles');
const app = express();

app.use(cors());
const PORT = process.env.PORT || 8012;

// Middleware to parse JSON requests
app.use(express.json());





app.use('/api', usersRouter);
app.use('/api', influencersRouter); // Add this line
app.use('/api', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/roles', rolesRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
