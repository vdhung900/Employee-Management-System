const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const verifyToken = require('../middlewares/authMiddleware');


// Đăng nhập và cấp token JWT
router.route('/login').post(UserController.login);
router.route('/register').post(UserController.register);
router.route('/logout').post(UserController.logout);
router.route('/profile').get(verifyToken, UserController.getUserProfile);
module.exports = router;
