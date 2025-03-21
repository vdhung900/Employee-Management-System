const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');

// Validation middleware
const validateLinkEmployee = [
  body('userId').isMongoId().withMessage('ID người dùng không hợp lệ'),
  body('employeeId').isMongoId().withMessage('ID nhân viên không hợp lệ')
];

// Routes
router.post('/link-employee', auth, validateLinkEmployee, userController.linkEmployee);

module.exports = router; 