const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Industry = require('../models/Industry');
const Skill = require('../models/Skill');
const Internship = require('../models/Internship');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const industriesData = [
  { name: 'Artificial Intelligence', description: 'Development of computer systems capable of performing tasks that normally require human intelligence.', growthLevel: 'High', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800' },
  { name: 'Cloud Computing', description: 'Delivery of computing services over the internet, including servers, storage, databases, and networking.', growthLevel: 'Very High', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800' },
  { name: 'Cyber Security', description: 'Protection of computer systems and networks from information disclosure, theft, or damage.', growthLevel: 'High', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800' },
  { name: 'Data Science', description: 'Interdisciplinary field that uses scientific methods, processes, and algorithms to extract knowledge from data.', growthLevel: 'High', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800' },
  { name: 'Biomedical Engineering', description: 'Application of engineering principles and design concepts to medicine and biology for healthcare purposes.', growthLevel: 'High', image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800' },
  { name: 'Electrical Engineering', description: 'Engineering discipline concerned with the study, design, and application of equipment which use electricity.', growthLevel: 'Medium', image: 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&q=80&w=800' },
  { name: 'Electronics & Embedded Systems', description: 'Specialized computer systems that are part of larger devices or systems, performing dedicated functions.', growthLevel: 'High', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800' },
  { name: 'Internet of Things (IoT)', description: 'Network of physical objects embedded with sensors, software, and other technologies for connecting and exchanging data.', growthLevel: 'High', image: 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&q=80&w=800' },
  { name: 'Robotics & Automation', description: 'Design, construction, operation, and use of robots, as well as computer systems for their control.', growthLevel: 'High', image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=800' },
  { name: 'Semiconductor Technology', description: 'Creation and improvement of semiconductor devices like transistors and integrated circuits.', growthLevel: 'Very High', image: 'https://images.unsplash.com/photo-1591815302525-756a9bcc3425?auto=format&fit=crop&q=80&w=800' },
];

const skillsData = [
  // AI
  { name: 'Python', icon: 'CpuChipIcon' }, { name: 'Machine Learning', icon: 'AcademicCapIcon' }, { name: 'Deep Learning', icon: 'BeakerIcon' }, { name: 'TensorFlow', icon: 'CodeBracketIcon' }, { name: 'OpenCV', icon: 'EyeIcon' }, { name: 'NLP', icon: 'ChatBubbleBottomCenterTextIcon' },
  // Cloud
  { name: 'AWS', icon: 'CloudIcon' }, { name: 'Azure', icon: 'CloudIcon' }, { name: 'Docker', icon: 'Square3Stack3DIcon' }, { name: 'Kubernetes', icon: 'WheelIcon' }, { name: 'DevOps', icon: 'CogIcon' }, { name: 'Linux', icon: 'CommandLineIcon' },
  // Security
  { name: 'Ethical Hacking', icon: 'ShieldExclamationIcon' }, { name: 'Network Security', icon: 'LockClosedIcon' }, { name: 'Cryptography', icon: 'KeyIcon' }, { name: 'Penetration Testing', icon: 'BugAntIcon' }, { name: 'SIEM', icon: 'SignalIcon' },
  // Data Science
  { name: 'SQL', icon: 'TableCellsIcon' }, { name: 'Pandas', icon: 'ChartBarIcon' }, { name: 'NumPy', icon: 'VariableIcon' }, { name: 'Data Visualization', icon: 'ChartPieIcon' }, { name: 'Statistics', icon: 'CalculatorIcon' },
  // BioMed
  { name: 'Medical Imaging', icon: 'PhotoIcon' }, { name: 'Bioinformatics', icon: 'FingerPrintIcon' }, { name: 'Signal Processing', icon: 'WavesIcon' }, { name: 'MATLAB', icon: 'Square2StackIcon' },
  // Electrical
  { name: 'Power Systems', icon: 'BoltIcon' }, { name: 'Control Systems', icon: 'AdjustmentsHorizontalIcon' }, { name: 'PLC', icon: 'CpuChipIcon' }, { name: 'SCADA', icon: 'PresentationChartLineIcon' },
  // Electronics
  { name: 'C Programming', icon: 'CodeBracketIcon' }, { name: 'Microcontrollers', icon: 'CpuChipIcon' }, { name: 'ARM Cortex', icon: 'RectangleGroupIcon' }, { name: 'PCB Design', icon: 'ViewColumnsIcon' }, { name: 'VLSI', icon: 'ServerIcon' },
  // IoT
  { name: 'MQTT', icon: 'ArrowsRightLeftIcon' }, { name: 'Arduino', icon: 'MicrochipIcon' }, { name: 'Raspberry Pi', icon: 'Square3Stack3DIcon' }, { name: 'Sensor Networks', icon: 'WifiIcon' }, { name: 'Edge Computing', icon: 'RectangleStackIcon' },
  // Robotics
  { name: 'ROS', icon: 'RobotIcon' }, { name: 'Kinematics', icon: 'ArrowPathIcon' }, { name: 'Mechatronics', icon: 'Cog6ToothIcon' }, { name: 'Industrial Automation', icon: 'WrenchIcon' }, { name: 'Motion Control', icon: 'PlayCircleIcon' },
  // Semiconductor
  { name: 'CMOS Design', icon: 'CubeIcon' }, { name: 'Verilog', icon: 'DocumentTextIcon' }, { name: 'FPGA', icon: 'CpuChipIcon' }, { name: 'Chip Fabrication', icon: 'FireIcon' }, { name: 'Physical Design', icon: 'SwatchIcon' }
];

const importData = async () => {
  try {
    await User.deleteMany();
    await Industry.deleteMany();
    await Skill.deleteMany();
    await Internship.deleteMany();

    // Create Admin
    await User.create({
      name: 'Admin User',
      email: 'admin@ied.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create Default User
    await User.create({
      name: 'Student User',
      email: 'student@ied.com',
      password: 'user123',
      role: 'user'
    });

    const createdIndustries = await Industry.insertMany(industriesData);

    // Map skills to industries
    const skillsWithIndustries = skillsData.map((skill, index) => {
      let industryName = '';
      if (index < 6) industryName = 'Artificial Intelligence';
      else if (index < 12) industryName = 'Cloud Computing';
      else if (index < 17) industryName = 'Cyber Security';
      else if (index < 22) industryName = 'Data Science';
      else if (index < 26) industryName = 'Biomedical Engineering';
      else if (index < 30) industryName = 'Electrical Engineering';
      else if (index < 35) industryName = 'Electronics & Embedded Systems';
      else if (index < 40) industryName = 'Internet of Things (IoT)';
      else if (index < 45) industryName = 'Robotics & Automation';
      else industryName = 'Semiconductor Technology';

      const ind = createdIndustries.find(i => i.name === industryName);
      return { ...skill, mappedIndustries: [ind._id] };
    });

    const createdSkills = await Skill.insertMany(skillsWithIndustries);

    // Create Internships
    const internships = [
      { title: 'AI Research Intern', industry: 'Artificial Intelligence', duration: '6 Months', description: 'Work on cutting-edge ML models.' },
      { title: 'Cloud Engineer Intern', industry: 'Cloud Computing', duration: '3 Months', description: 'Assist in cloud infrastructure management.' },
      { title: 'Cyber Security Analyst Intern', industry: 'Cyber Security', duration: '4 Months', description: 'Monitor network security and perform audits.' },
      { title: 'Data Analyst Intern', industry: 'Data Science', duration: '6 Months', description: 'Analyze large datasets and create visualizations.' },
      { title: 'Biomedical Systems Intern', industry: 'Biomedical Engineering', duration: '5 Months', description: 'Design medical diagnostic tools.' },
      { title: 'Embedded Systems Intern', industry: 'Electronics & Embedded Systems', duration: '3 Months', description: 'Develop firmware for embedded devices.' },
      { title: 'Power Systems Intern', industry: 'Electrical Engineering', duration: '4 Months', description: 'Analyze electrical grid performance.' },
      { title: 'IoT Developer Intern', industry: 'Internet of Things (IoT)', duration: '6 Months', description: 'Build connected sensor systems.' },
      { title: 'Robotics Engineer Intern', industry: 'Robotics & Automation', duration: '6 Months', description: 'Develop control algorithms for robots.' },
      { title: 'VLSI Design Intern', industry: 'Semiconductor Technology', duration: '4 Months', description: 'Work on IC design and verification.' },
      { title: 'FPGA Developer Intern', industry: 'Semiconductor Technology', duration: '3 Months', description: 'Implement logic on FPGA boards.' },
      { title: 'Control Systems Intern', industry: 'Electrical Engineering', duration: '6 Months', description: 'Design feedback control loops.' },
      { title: 'Medical Device Engineer Intern', industry: 'Biomedical Engineering', duration: '4 Months', description: 'Testing and validation of medical equipment.' },
      { title: 'Automation Engineer Intern', industry: 'Robotics & Automation', duration: '3 Months', description: 'Industrial automation using PLC/SCADA.' },
      { title: 'Semiconductor Process Intern', industry: 'Semiconductor Technology', duration: '6 Months', description: 'Improve chip fabrication processes.' },
    ];

    const mappedInternships = internships.map(intern => {
      const ind = createdIndustries.find(i => i.name === intern.industry);
      const indSkills = createdSkills.filter(s => s.mappedIndustries.includes(ind._id));
      return {
        ...intern,
        industry: ind._id,
        requiredSkills: indSkills.slice(0, 3).map(s => s._id), // Take first 3 skills
      };
    });

    await Internship.insertMany(mappedInternships);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
