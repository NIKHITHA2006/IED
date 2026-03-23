const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true }, // SVG or Path
  mappedIndustries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Industry' }],
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
