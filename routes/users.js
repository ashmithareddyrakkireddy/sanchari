const express = require('express');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const {storeReturnTo} = require('../utils/middleware.js');
const router = express.Router();
const users = require('../controllers/users.js')


router.route('/register')
      .get(users.renderRegisterForm)
      .post(catchAsync(users.registerUser))

router.route('/login')
      .get(users.renderLoginForm)
      .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(users.LoginUser))

router.get('/logout', users.LogoutUser);

module.exports = router;