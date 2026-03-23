const mongoose = require('mongoose');

const companyRequirementSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  industry: { type: mongoose.Schema.Types.ObjectId, ref: 'Industry' },
  requiredSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  description: { type: String },
  logo: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('CompanyRequirement', companyRequirementSchema);
