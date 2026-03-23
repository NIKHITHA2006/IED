const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports
const userRoutes = require('./routes/userRoutes');
const industryRoutes = require('./routes/industryRoutes');
const skillRoutes = require('./routes/skillRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const companyRoutes = require('./routes/companyRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

// ✅ Keep CORS simple (best for now)
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/industries', industryRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/companies', companyRoutes);

// ✅ Health check (important for Render)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Basic error handler (optional but useful)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.stack || err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));