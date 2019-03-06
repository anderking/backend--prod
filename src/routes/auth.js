'use strict'

const express = require('express');
const AuthController = require('../controllers/auth');
const auth = require('../middlewares/auth');
const router = express.Router();
const User = require('../models/user');

router.post('/signup', AuthController.signUp);
router.post('/signin', AuthController.signIn);
router.get('/private', auth, (req, res) => {
  res.status(200).send({ message: 'Tienes acceso' });
});

module.exports = router;