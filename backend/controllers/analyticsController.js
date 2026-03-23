const Industry = require('../models/Industry');
const Skill = require('../models/Skill');
const Internship = require('../models/Internship');
const SkillGapReport = require('../models/SkillGapReport');

const getDashboardStats = async (req, res) => {
  try {
    const totalIndustries = await Industry.countDocuments();
    const totalSkills = await Skill.countDocuments();
    const totalInternships = await Internship.countDocuments();
    const totalReports = await SkillGapReport.countDocuments();

    // Skill Demand (Frequency of skills in internships)
    const internships = await Internship.find({}).populate('requiredSkills');
    const skillDemand = {};
    internships.forEach(internship => {
      internship.requiredSkills.forEach(skill => {
        skillDemand[skill.name] = (skillDemand[skill.name] || 0) + 1;
      });
    });
    const barChartData = Object.keys(skillDemand).map(key => ({ name: key, demand: skillDemand[key] }));

    // Internship Distribution (By Industry)
    const industryInternships = await Internship.aggregate([
      { $group: { _id: '$industry', count: { $sum: 1 } } }
    ]);
    const industries = await Industry.find({});
    const pieChartData = industryInternships.map(item => {
      const ind = industries.find(i => i._id.toString() === item._id.toString());
      return { name: ind ? ind.name : 'Unknown', value: item.count };
    });

    // Industry Growth (Dummy data if not available in DB, but we'll use growthLevel)
    const growthMap = { 'Low': 1, 'Medium': 2, 'High': 3, 'Very High': 4 };
    const lineChartData = industries.map(ind => ({ name: ind.name, growth: growthMap[ind.growthLevel] || 0 }));

    res.json({
      kpis: { totalIndustries, totalSkills, totalInternships, totalReports },
      barChartData,
      pieChartData,
      lineChartData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAggregateSkillGap = async (req, res) => {
  try {
    const reports = await SkillGapReport.find({}).populate('missingSkills');
    const missingSkillMap = {};
    reports.forEach(report => {
      report.missingSkills.forEach(skill => {
        missingSkillMap[skill.name] = (missingSkillMap[skill.name] || 0) + 1;
      });
    });
    const aggregateGap = Object.keys(missingSkillMap).map(key => ({ name: key, count: missingSkillMap[key] }));
    res.json(aggregateGap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const saveSkillGapReport = async (req, res) => {
  const { industryId, knownSkills, missingSkills, readinessPercentage } = req.body;
  const report = new SkillGapReport({
    user: req.user._id,
    industry: industryId,
    knownSkills,
    missingSkills,
    readinessPercentage
  });
  const savedReport = await report.save();
  res.status(201).json(savedReport);
};

module.exports = { getDashboardStats, getAggregateSkillGap, saveSkillGapReport };
