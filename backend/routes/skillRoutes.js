const express = require('express');
const router = express.Router();
const { getSkills, createSkill, updateSkill, deleteSkill } = require('../controllers/skillController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/').get(getSkills).post(protect, admin, createSkill);
router.route('/:id').put(protect, admin, updateSkill).delete(protect, admin, deleteSkill);

module.exports = router;
