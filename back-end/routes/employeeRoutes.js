const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const employeeController = require('../controllers/employeeController');

// Validation middleware
const employeeValidation = [
  check('fullName').notEmpty().withMessage('Full name is required'),
  check('dob').notEmpty().withMessage('Date of birth is required')
    .isISO8601().withMessage('Invalid date format'),
  check('gender').notEmpty().withMessage('Gender is required')
    .isIn(['male', 'female', 'other']).withMessage('Invalid gender value'),
  check('salaryBase').notEmpty().withMessage('Base salary is required')
    .isNumeric().withMessage('Salary must be a number'),
  check('startDate').notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Invalid date format')
];

// Routes
router.post('/', employeeValidation, employeeController.createEmployee);
router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.put('/:id', employeeValidation, employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router; 