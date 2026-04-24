const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './backend/.env' });

// Load models
const Industry = require('./backend/models/Industry');
const Skill = require('./backend/models/Skill');
const CompanyRequirement = require('./backend/models/CompanyRequirement');

const companiesData = [
  {
    companyName: "Google AI",
    logo: "https://logo.clearbit.com/google.com",
    industryName: "Artificial Intelligence",
    description: "Develops advanced AI solutions, cloud AI tools, and machine learning platforms.",
    skillsStr: "Python, TensorFlow, Deep Learning, NLP, Data Structures, Cloud Computing"
  },
  {
    companyName: "Microsoft Azure AI",
    logo: "https://logo.clearbit.com/microsoft.com",
    industryName: "Artificial Intelligence",
    description: "Focuses on enterprise AI services, intelligent apps, and cloud-based machine learning.",
    skillsStr: "Python, Azure, Machine Learning, SQL, NLP, Power BI"
  },
  {
    companyName: "OpenAI",
    logo: "https://logo.clearbit.com/openai.com",
    industryName: "Artificial Intelligence",
    description: "Builds cutting-edge generative AI models, chatbots, and automation systems.",
    skillsStr: "Python, PyTorch, NLP, Deep Learning, APIs, Reinforcement Learning"
  },
  {
    companyName: "Amazon AWS AI",
    logo: "https://logo.clearbit.com/amazon.com",
    industryName: "Artificial Intelligence",
    description: "Provides AI-powered cloud services, recommendation systems, and analytics tools.",
    skillsStr: "Python, AWS, Machine Learning, Data Engineering, NLP, Cloud Security"
  },
  {
    companyName: "IBM Watson",
    logo: "https://logo.clearbit.com/ibm.com",
    industryName: "Artificial Intelligence",
    description: "Delivers enterprise AI, automation, and data-driven decision systems.",
    skillsStr: "Python, AI Ethics, NLP, Data Science, Machine Learning, APIs"
  },
  {
    companyName: "NVIDIA AI",
    logo: "https://logo.clearbit.com/nvidia.com",
    industryName: "Artificial Intelligence",
    description: "Specializes in GPU computing, AI hardware, and deep learning acceleration.",
    skillsStr: "CUDA, Python, Deep Learning, Computer Vision, TensorFlow, PyTorch"
  },
  {
    companyName: "Infosys AI",
    logo: "https://logo.clearbit.com/infosys.com",
    industryName: "Artificial Intelligence",
    description: "Provides AI-driven business transformation and automation solutions.",
    skillsStr: "Python, SQL, Data Analytics, Machine Learning, Cloud, Automation"
  },
  {
    companyName: "TCS AI Labs",
    logo: "https://logo.clearbit.com/tcs.com",
    industryName: "Artificial Intelligence",
    description: "Develops AI applications for enterprise services, healthcare, and finance.",
    skillsStr: "Python, AI, Data Science, NLP, Java, Cloud Computing"
  },
  {
    companyName: "Accenture AI",
    logo: "https://logo.clearbit.com/accenture.com",
    industryName: "Artificial Intelligence",
    description: "Offers AI consulting, automation, and digital transformation services.",
    skillsStr: "Python, Machine Learning, Data Analysis, Cloud, APIs, Business Intelligence"
  }
];

const seedCompanies = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    for (const item of companiesData) {
      // 1. Get or create industry
      let industry = await Industry.findOne({ name: item.industryName });
      if (!industry) {
        industry = await Industry.create({
          name: item.industryName,
          description: `Companies, skills, and internships related to ${item.industryName}`,
          growthLevel: 'High'
        });
        console.log(`Created Industry: ${industry.name}`);
      }

      // 2. Process Skills
      const skillNames = item.skillsStr.split(',').map(s => s.trim());
      const requiredSkillIds = [];

      for (const skillName of skillNames) {
        // Attempt to find skill
        let skill = await Skill.findOne({ name: new RegExp(`^${skillName}$`, 'i') });
        if (!skill) {
          skill = await Skill.create({
            name: skillName,
            icon: 'icon-default', // Some default icon
            mappedIndustries: [industry._id]
          });
          console.log(`Created Skill: ${skill.name}`);
        } else {
          // If skill exists, ensure industry is in mappedIndustries
          if (!skill.mappedIndustries.includes(industry._id)) {
            skill.mappedIndustries.push(industry._id);
            await skill.save();
            console.log(`Updated Skill mapped industries: ${skill.name}`);
          }
        }
        requiredSkillIds.push(skill._id);
      }

      // 3. Create or update Company Requirement
      let company = await CompanyRequirement.findOne({ companyName: item.companyName });
      if (company) {
         // Update existing
         company.industry = industry._id;
         company.requiredSkills = requiredSkillIds;
         company.description = item.description;
         company.logo = item.logo;
         await company.save();
         console.log(`Updated Company: ${company.companyName}`);
      } else {
         await CompanyRequirement.create({
           companyName: item.companyName,
           logo: item.logo,
           industry: industry._id,
           description: item.description,
           requiredSkills: requiredSkillIds
         });
         console.log(`Created Company: ${item.companyName}`);
      }
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedCompanies();
