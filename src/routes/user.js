'use strict'

var express = require('express');
var UserController = require('../controllers/user');
const auth = require('../middlewares/auth');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: './img' });

router.post('/save-user', UserController.saveUser);
router.get('/user/:id?', auth, UserController.getUser);
router.get('/users', auth, UserController.getUsers);
router.get('/users/:id', auth, UserController.getUsersExcept);
router.put('/user/:id', auth, UserController.updateUser);
router.delete('/user/:id', auth, UserController.deleteUser);
router.get('/deleteUsers/:id', auth, UserController.deleteUsers);
router.post('/upload-image-user/:id', multipartMiddleware, UserController.uploadImage);
router.get('/get-image-user/:image', UserController.getImageFile);


module.exports = router;