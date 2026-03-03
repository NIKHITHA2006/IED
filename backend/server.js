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

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/industries', industryRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
