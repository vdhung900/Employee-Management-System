const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/SalaryController');

router.post('/', salaryController.addSalary);
router.get('/:employeeId', salaryController.getSalary);
router.put('/:id', salaryController.updateSalary);
router.delete('/:id', salaryController.deleteSalary);

module.exports = router;
