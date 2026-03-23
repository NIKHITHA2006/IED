const Internship = require('../models/Internship');

const crypto = require('crypto');

const getInternships = async (req, res) => {
  const internships = await Internship.find({}).populate('industry').populate('requiredSkills');
  
  // Ensure applyUrl exists
  let updated = false;
  for (let internship of internships) {
    if (!internship.applyUrl) {
      internship.applyUrl = 'https://unstop.com/internship?quickApply=true&usertype=students&domain=2&oppstatus=open';
      await internship.save();
      updated = true;
    }
  }
  
  res.json(internships);
};

const createInternship = async (req, res) => {
  const { title, industry, requiredSkills, duration, description, applyUrl } = req.body;
  
  const finalApplyUrl = applyUrl || 'https://unstop.com/internship?quickApply=true&usertype=students&domain=2&oppstatus=open';
  
  const internship = new Internship({ title, industry, requiredSkills, duration, description, applyUrl: finalApplyUrl });
  const createdInternship = await internship.save();
  res.status(201).json(createdInternship);
};

const updateInternship = async (req, res) => {
  const { title, industry, requiredSkills, duration, description, applyUrl } = req.body;
  const internship = await Internship.findById(req.params.id);
  if (internship) {
    internship.title = title || internship.title;
    internship.industry = industry || internship.industry;
    internship.requiredSkills = requiredSkills || internship.requiredSkills;
    internship.duration = duration || internship.duration;
    internship.description = description || internship.description;
    internship.applyUrl = applyUrl || internship.applyUrl;
    const updatedInternship = await internship.save();
    res.json(updatedInternship);
  } else {
    res.status(404).json({ message: 'Internship not found' });
  }
};

const deleteInternship = async (req, res) => {
  const internship = await Internship.findById(req.params.id);
  if (internship) {
    await internship.deleteOne();
    res.json({ message: 'Internship removed' });
  } else {
    res.status(404).json({ message: 'Internship not found' });
  }
};

module.exports = { getInternships, createInternship, updateInternship, deleteInternship };
