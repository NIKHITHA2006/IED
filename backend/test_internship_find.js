const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Internship = require('./models/Internship');
const Industry = require('./models/Industry');
const Skill = require('./models/Skill');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    try {
      const internships = await Internship.find({}).populate('industry').populate('requiredSkills');
      console.log('Success:', internships.length);
      process.exit(0);
    } catch (err) {
      console.error('Error fetching:', err);
      process.exit(1);
    }
  });
