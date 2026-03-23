const express = require('express');
const router = express.Router();
const { getDashboardStats, getAggregateSkillGap, saveSkillGapReport } = require('../controllers/analyticsController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/stats', protect, admin, getDashboardStats);
router.get('/skill-gap', protect, admin, getAggregateSkillGap);
router.post('/report', protect, saveSkillGapReport);

module.exports = router;
