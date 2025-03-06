const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const UserController = require('../controllers/UserController');
const verifyToken = require('../middlewares/authMiddleware');

// Validation middleware
const authValidation = [
  check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  check('role')
    .optional()
    .isIn(['admin', 'employee']).withMessage('Invalid role')
];

// Đăng nhập và cấp token JWT
router.post('/login', [
  check('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Please enter a valid email address'),
  check('password').notEmpty().withMessage('Password is required')
], UserController.login);

router.post('/register', authValidation, UserController.register);
router.post('/logout', UserController.logout);
router.get('/profile', verifyToken, UserController.getUserProfile);

module.exports = router;
