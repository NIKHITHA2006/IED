const CompanyRequirement = require('../models/CompanyRequirement');

const getCompanies = async (req, res) => {
  try {
    let companies = await CompanyRequirement.find({}).populate('industry').populate('requiredSkills');
    
    // DUMMY DATA FALLBACK
    if (companies.length === 0) {
      companies = [
        {
          _id: "dummy1",
          companyName: "Amazon",
          description: "Global e-commerce and cloud computing giant.",
          requiredSkills: [
            { _id: 's1', name: 'AWS' }, { _id: 's2', name: 'DSA' }, { _id: 's3', name: 'System Design' }, { _id: 's4', name: 'Java' }
          ]
        },
        {
          _id: "dummy2",
          companyName: "Google",
          description: "Multinational technology company focused on internet-related services.",
          requiredSkills: [
            { _id: 's2', name: 'DSA' }, { _id: 's5', name: 'Algorithms' }, { _id: 's3', name: 'System Design' }, { _id: 's6', name: 'Python' }
          ]
        },
        {
          _id: "dummy3",
          companyName: "Microsoft",
          description: "Produces computer software, consumer electronics, and computing services.",
          requiredSkills: [
            { _id: 's7', name: 'C#' }, { _id: 's8', name: 'Azure' }, { _id: 's2', name: 'DSA' }, { _id: 's9', name: 'OOP' }
          ]
        },
        {
          _id: "dummy4",
          companyName: "Infosys",
          description: "Indian multinational IT company.",
          requiredSkills: [
             { _id: 's4', name: 'Java' }, { _id: 's10', name: 'SQL' }, { _id: 's11', name: 'Aptitude' }, { _id: 's12', name: 'Communication' }
          ]
        }
      ];
    }
    
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const company = await CompanyRequirement.findById(req.params.id).populate('industry').populate('requiredSkills');
    if (company) {
      res.json(company);
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCompany = async (req, res) => {
  const { companyName, industry, requiredSkills, description, logo } = req.body;
  try {
    const company = new CompanyRequirement({ companyName, industry, requiredSkills, description, logo });
    const createdCompany = await company.save();
    res.status(201).json(createdCompany);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCompany = async (req, res) => {
  const { companyName, industry, requiredSkills, description, logo } = req.body;
  try {
    const company = await CompanyRequirement.findById(req.params.id);
    if (company) {
      company.companyName = companyName || company.companyName;
      company.industry = industry || company.industry;
      company.requiredSkills = requiredSkills || company.requiredSkills;
      company.description = description || company.description;
      company.logo = logo || company.logo;
      const updatedCompany = await company.save();
      res.json(updatedCompany);
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const company = await CompanyRequirement.findById(req.params.id);
    if (company) {
      await company.deleteOne();
      res.json({ message: 'Company removed' });
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCompanies, getCompanyById, createCompany, updateCompany, deleteCompany };
