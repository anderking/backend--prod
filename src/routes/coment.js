'use strict'

var express = require('express');
var ComentController = require('../controllers/coment');
const auth = require('../middlewares/auth');
var router = express.Router();

router.post('/save-coment', auth, ComentController.saveComent);
router.get('/coment/:id', auth, ComentController.getComent);
router.get('/coments', auth, ComentController.getComents);
router.get('/comentsPublication/:id?', auth, ComentController.getcomentsPublication);
router.put('/coment/:id', auth, ComentController.updateComent);
router.delete('/coment/:id', auth, ComentController.deleteComent);

module.exports = router;