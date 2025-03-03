const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');


// Đăng nhập và cấp token JWT
router.route('/login').post(UserController.login);
router.route('/register').post(UserController.register);
module.exports = router;
