const Skill = require('../models/Skill');

const getSkills = async (req, res) => {
  const skills = await Skill.find({}).populate('mappedIndustries');
  res.json(skills);
};

const createSkill = async (req, res) => {
  const { name, icon, mappedIndustries } = req.body;
  const skill = new Skill({ name, icon, mappedIndustries });
  const createdSkill = await skill.save();
  res.status(201).json(createdSkill);
};

const updateSkill = async (req, res) => {
  const { name, icon, mappedIndustries } = req.body;
  const skill = await Skill.findById(req.params.id);
  if (skill) {
    skill.name = name || skill.name;
    skill.icon = icon || skill.icon;
    skill.mappedIndustries = mappedIndustries || skill.mappedIndustries;
    const updatedSkill = await skill.save();
    res.json(updatedSkill);
  } else {
    res.status(404).json({ message: 'Skill not found' });
  }
};

const deleteSkill = async (req, res) => {
  const skill = await Skill.findById(req.params.id);
  if (skill) {
    await skill.deleteOne();
    res.json({ message: 'Skill removed' });
  } else {
    res.status(404).json({ message: 'Skill not found' });
  }
};

module.exports = { getSkills, createSkill, updateSkill, deleteSkill };
