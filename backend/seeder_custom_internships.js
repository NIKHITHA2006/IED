const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Internship = require('./models/Internship');
const Industry = require('./models/Industry');
const Skill = require('./models/Skill');

dotenv.config();

const internshipsData = [
  {
    title: 'AI/ML Intern',
    industryName: 'Artificial Intelligence',
    skills: ['Python', 'NumPy', 'Pandas', 'Scikit-learn', 'Deep Learning Basics'],
    duration: '2-6 months',
    description: 'Work on ML models like prediction, classification, NLP. May include real datasets and model deployment.'
  },
  {
    title: 'Data Science Intern',
    industryName: 'Data Science',
    skills: ['Python', 'SQL', 'Pandas', 'Matplotlib', 'Statistics'],
    duration: '2-5 months',
    description: 'Analyze data, create dashboards, and extract insights for business decisions.'
  },
  {
    title: 'Web Development Intern (Frontend)',
    industryName: 'Software Engineering',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
    duration: '1-4 months',
    description: 'Build UI components, responsive websites, and improve user experience.'
  },
  {
    title: 'Full Stack Developer Intern',
    industryName: 'Software Engineering',
    skills: ['MongoDB', 'Express', 'React', 'Node.js'],
    duration: '3-6 months',
    description: 'Work on both frontend + backend, APIs, database integration.'
  },
  {
    title: 'Backend Developer Intern',
    industryName: 'Software Engineering',
    skills: ['Node.js', 'Java', 'Python', 'REST APIs', 'Databases'],
    duration: '2-5 months',
    description: 'Develop APIs, server logic, authentication, and database management.'
  },
  {
    title: 'DevOps Intern',
    industryName: 'Cloud Computing',
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'Linux'],
    duration: '3-6 months',
    description: 'Automate deployments, manage servers, cloud infrastructure.'
  },
  {
    title: 'Cybersecurity Intern',
    industryName: 'Cyber Security',
    skills: ['Networking Basics', 'Ethical Hacking', 'Kali Linux'],
    duration: '2-6 months',
    description: 'Perform vulnerability testing, security audits, and threat analysis.'
  },
  {
    title: 'Cloud Computing Intern',
    industryName: 'Cloud Computing',
    skills: ['AWS', 'Azure', 'GCP', 'Virtualization', 'Networking'],
    duration: '2-4 months',
    description: 'Work on cloud deployment, scaling apps, and infrastructure.'
  },
  {
    title: 'Mobile App Developer Intern',
    industryName: 'Mobile App Development',
    skills: ['Flutter', 'React Native', 'Android', 'Java', 'Kotlin'],
    duration: '2-5 months',
    description: 'Build mobile apps, UI screens, and integrate APIs.'
  },
  {
    title: 'UI/UX Design Intern',
    industryName: 'UI/UX Design',
    skills: ['Figma', 'Adobe XD', 'Design Thinking'],
    duration: '1-3 months',
    description: 'Design user-friendly interfaces and improve product usability.'
  },
  {
    title: 'Software Engineer Intern',
    industryName: 'Software Engineering',
    skills: ['DSA', 'Java', 'Python', 'C++', 'OOPs'],
    duration: '3-6 months',
    description: 'Work on real-world software features and debugging.'
  },
  {
    title: 'QA/Testing Intern',
    industryName: 'Software Engineering',
    skills: ['Manual Testing', 'Selenium', 'Test Cases'],
    duration: '1-3 months',
    description: 'Test applications, find bugs, ensure quality.'
  },
  {
    title: 'Blockchain Intern',
    industryName: 'Blockchain',
    skills: ['Solidity', 'Ethereum', 'Smart Contracts'],
    duration: '2-5 months',
    description: 'Build decentralized applications and smart contracts.'
  },
  {
    title: 'NLP Intern',
    industryName: 'Artificial Intelligence',
    skills: ['Python', 'NLP Libraries', 'Transformers'],
    duration: '2-4 months',
    description: 'Work on chatbots, text classification, sentiment analysis.'
  },
  {
    title: 'Computer Vision Intern',
    industryName: 'Artificial Intelligence',
    skills: ['OpenCV', 'CNN', 'TensorFlow', 'PyTorch'],
    duration: '2-5 months',
    description: 'Build image recognition, object detection models.'
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected.');

    await Internship.deleteMany();
    console.log('Cleared old internships.');

    let newInternshipsCount = 0;

    for (let i = 0; i < internshipsData.length; i++) {
      const item = internshipsData[i];

      // Ensure Industry exists
      let industry = await Industry.findOne({ name: item.industryName });
      if (!industry) {
        industry = await Industry.create({
          name: item.industryName,
          description: `The ${item.industryName} industry.`,
          growthLevel: 'High',
          image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'
        });
        console.log(`Created new industry: ${item.industryName}`);
      }

      // Ensure Skills exist
      const skillIds = [];
      for (const skillName of item.skills) {
        const safeSkillName = String(skillName).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        let skill = await Skill.findOne({ name: new RegExp('^' + safeSkillName + '$', 'i') });
        if (!skill) {
          skill = await Skill.create({
            name: skillName,
            icon: 'CodeBracketIcon',
            mappedIndustries: [industry._id]
          });
          console.log(`Created new skill: ${skillName}`);
        } else {
          // If skill exists, make sure industry is mapped
          if (!skill.mappedIndustries.includes(industry._id)) {
            skill.mappedIndustries.push(industry._id);
            await skill.save();
          }
        }
        skillIds.push(skill._id);
      }

      // Create Internship
      const newInternship = new Internship({
        title: item.title,
        industry: industry._id,
        requiredSkills: skillIds,
        duration: item.duration,
        description: item.description,
        applyUrl: `https://unstop.com/internship?quickApply=true&id=${Date.now()}_${i}` // Unique URL
      });

      await newInternship.save();
      newInternshipsCount++;
    }

    console.log(`Successfully seeded ${newInternshipsCount} custom internships!`);
    process.exit();
  } catch (error) {
    console.error('Seeding Error:', error.message);
    if (error.errors) {
      Object.keys(error.errors).forEach(key => {
        console.error(error.errors[key].message);
      });
    }
    process.exit(1);
  }
};

seedData();
