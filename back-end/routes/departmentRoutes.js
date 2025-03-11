const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const departmentController = require('../controllers/departmentController');

// Validation middleware
const departmentValidation = [
  check('name').notEmpty().withMessage('Department name is required'),
  check('description').optional()
];

// Add employee to department validation
const addEmployeeValidation = [
  check('employeeId').notEmpty().withMessage('Employee ID is required')
    .isMongoId().withMessage('Invalid employee ID format')
];

// Routes
router.post('/', departmentValidation, departmentController.createDepartment);
router.get('/', departmentController.getAllDepartments);
router.get('/:id', departmentController.getDepartmentById);
router.put('/:id', departmentValidation, departmentController.updateDepartment);
router.delete('/:id', departmentController.deleteDepartment);
router.post('/:id/add-employee', addEmployeeValidation, departmentController.addEmployeeToDepartment);
router.post('/remove-employee', addEmployeeValidation, departmentController.removeEmployeeFromDepartment);

module.exports = router; 