'use strict'

var express = require('express');
var LikeController = require('../controllers/like');
const auth = require('../middlewares/auth');
var router = express.Router();

router.post('/like/:idP', LikeController.upLike);
router.put('/like/:idP', LikeController.disLike);
router.get('/likesPublication/:idP', LikeController.getLikesPublication);
router.get('/likesUser/:idU', LikeController.getLikesUser);
router.get('/likes', LikeController.getLikes);
router.get('/islikes/:idU/:idP', LikeController.isLike);

module.exports = router;