const express = require('express');
const router = express.Router();

// TEMP TEST ROUTE (to check if API works)
router.get('/', (req, res) => {
  res.json({ message: "Route working" });
});

// You can keep these for later (commented for now)
// const { getCompanies, getCompanyById, createCompany, updateCompany, deleteCompany } = require('../controllers/companyController');

// router.route('/').get(getCompanies).post(createCompany);
// router.route('/:id').get(getCompanyById).put(updateCompany).delete(deleteCompany);

module.exports = router;