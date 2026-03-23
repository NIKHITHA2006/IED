const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Internship = require('./models/Internship');
const Industry = require('./models/Industry');
const Skill = require('./models/Skill');

dotenv.config();

const seedInternships = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Internship Seeder');

    // Wipe existing internships just in case they are corrupted
    await Internship.deleteMany();
    console.log('Old internships deleted.');

    // Fetch industries
    const aiIndustry = await Industry.findOne({ name: 'Artificial Intelligence' });
    const cloudIndustry = await Industry.findOne({ name: 'Cloud Computing' });
    const cyberIndustry = await Industry.findOne({ name: 'Cyber Security' });
    
    // Fetch some skills
    const python = await Skill.findOne({ name: 'Python' });
    const ml = await Skill.findOne({ name: 'Machine Learning' });
    const aws = await Skill.findOne({ name: 'AWS' });
    const docker = await Skill.findOne({ name: 'Docker' });
    const linux = await Skill.findOne({ name: 'Linux' });
    const hacking = await Skill.findOne({ name: 'Ethical Hacking' });

    if (!aiIndustry || !cloudIndustry || !cyberIndustry || !python || !ml || !aws || !docker || !linux || !hacking) {
      console.log('Missing data in DB, please make sure industries and skills are seeded first.');
      process.exit(1);
    }

    const newInternships = [
      {
        title: 'Machine Learning Engineering Intern',
        industry: aiIndustry._id,
        requiredSkills: [python._id, ml._id],
        duration: '6 Months',
        description: 'Work alongside top AI researchers to build deep learning models for predictive analytics. You will be optimizing algorithms and pushing them to production.',
        applyUrl: 'https://unstop.com/internship?quickApply=true&id=1'
      },
      {
        title: 'Cloud DevOps Intern',
        industry: cloudIndustry._id,
        requiredSkills: [aws._id, docker._id, linux._id],
        duration: '3 Months',
        description: 'Help build scalable CI/CD pipelines and manage containerized applications over AWS. Exciting fast-paced environment with lots of learning opportunities.',
        applyUrl: 'https://unstop.com/internship?quickApply=true&id=2'
      },
      {
        title: 'Security Analyst Trainee',
        industry: cyberIndustry._id,
        requiredSkills: [hacking._id, linux._id],
        duration: '6 Months',
        description: 'Join the red team to simulate cyber attacks on web applications. Learn penetration testing methodologies and draft security assessment reports.',
        applyUrl: 'https://unstop.com/internship?quickApply=true&id=3'
      },
      {
        title: 'Data Science Intern - GenAI',
        industry: aiIndustry._id,
        requiredSkills: [python._id],
        duration: '4 Months',
        description: 'Experiment with Generative AI models. Clean and structure large datasets for training large language models (LLMs). Python expertise is a must.',
        applyUrl: 'https://unstop.com/internship?quickApply=true&id=4'
      },
      {
        title: 'AWS Cloud Architect Intern',
        industry: cloudIndustry._id,
        requiredSkills: [aws._id],
        duration: '6 Months',
        description: 'Design and deploy robust serverless architectures. Assist the senior architect team in migrating legacy systems to the cloud.',
        applyUrl: 'https://unstop.com/internship?quickApply=true&id=5'
      }
    ];

    await Internship.insertMany(newInternships);
    console.log(`Successfully added ${newInternships.length} internships!`);

    process.exit();
  } catch (error) {
    console.error('Error with seeder:', error);
    process.exit(1);
  }
};

seedInternships();
