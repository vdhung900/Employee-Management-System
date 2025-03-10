const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/SalaryController');

router.get('/', salaryController.getAllSalaries);
router.post('/', salaryController.addSalary);
router.get('/detail/:id', salaryController.getSalaryById);
router.get('/:employeeId', salaryController.getSalaryByEmployeeId);
router.put('/:id', salaryController.updateSalary);
router.delete('/:id', salaryController.deleteSalary);

module.exports = router;
