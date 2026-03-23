const Industry = require('../models/Industry');

const getIndustries = async (req, res) => {
  const industries = await Industry.find({});
  res.json(industries);
};

const createIndustry = async (req, res) => {
  const { name, description, growthLevel, image } = req.body;
  const industry = new Industry({ name, description, growthLevel, image });
  const createdIndustry = await industry.save();
  res.status(201).json(createdIndustry);
};

const updateIndustry = async (req, res) => {
  const { name, description, growthLevel, image } = req.body;
  const industry = await Industry.findById(req.params.id);
  if (industry) {
    industry.name = name || industry.name;
    industry.description = description || industry.description;
    industry.growthLevel = growthLevel || industry.growthLevel;
    industry.image = image || industry.image;
    const updatedIndustry = await industry.save();
    res.json(updatedIndustry);
  } else {
    res.status(404).json({ message: 'Industry not found' });
  }
};

const deleteIndustry = async (req, res) => {
  const industry = await Industry.findById(req.params.id);
  if (industry) {
    await industry.deleteOne();
    res.json({ message: 'Industry removed' });
  } else {
    res.status(404).json({ message: 'Industry not found' });
  }
};

module.exports = { getIndustries, createIndustry, updateIndustry, deleteIndustry };
