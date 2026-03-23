const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  industry: { type: mongoose.Schema.Types.ObjectId, ref: 'Industry', required: true },
  requiredSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  duration: { type: String, required: true },
  description: { type: String, required: true },
  applyUrl: { type: String, unique: true, sparse: true },
}, { timestamps: true });

module.exports = mongoose.model('Internship', internshipSchema);
