const mongoose = require('mongoose');

const skillGapReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  industry: { type: mongoose.Schema.Types.ObjectId, ref: 'Industry', required: true },
  knownSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  missingSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  readinessPercentage: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('SkillGapReport', skillGapReportSchema);
