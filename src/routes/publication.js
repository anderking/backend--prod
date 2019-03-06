'use strict'

var express = require('express');
var PublicationController = require('../controllers/publication');
const auth = require('../middlewares/auth');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: './img' });

router.post('/save-publication', auth, PublicationController.savePublication);
router.get('/publication/:id?', auth, PublicationController.getPublication);
router.get('/publications', auth, PublicationController.getPublications);
router.get('/publications/:id', auth, PublicationController.getPublicationsUser);
router.put('/publication/:id', auth, PublicationController.updatePublication);
router.delete('/publication/:id', auth, PublicationController.deletePublication);
router.post('/upload-image-publication/:id', multipartMiddleware, PublicationController.uploadImage);
router.get('/get-image-publication/:image', PublicationController.getImageFile);

module.exports = router;