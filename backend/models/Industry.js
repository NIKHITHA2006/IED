const mongoose = require('mongoose');

const industrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  growthLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Very High'], default: 'Medium' },
  image: { type: String, required: true }, // URL or Base64
}, { timestamps: true });

module.exports = mongoose.model('Industry', industrySchema);
