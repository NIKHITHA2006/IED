const express = require('express');
const router = express.Router();
const { getIndustries, createIndustry, updateIndustry, deleteIndustry } = require('../controllers/industryController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/').get(getIndustries).post(protect, admin, createIndustry);
router.route('/:id').put(protect, admin, updateIndustry).delete(protect, admin, deleteIndustry);

module.exports = router;
