'use strict'

var express = require('express');
var CalificacionController = require('../controllers/calificacion');
const auth = require('../middlewares/auth');
var router = express.Router();

router.post('/upCalificacion', CalificacionController.upCalificacion);
router.get('/calificacion/:idE/:idR', CalificacionController.isCalificacion);
router.get('/getCalificacion/:idE/:idR', CalificacionController.getCalificacion);
router.put('/calificacion/:id', CalificacionController.updateCalificacion);
router.get('/calificaciones/:idR', CalificacionController.getCalificacionesR);

module.exports = router;