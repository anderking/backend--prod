'use strict'

var express = require('express');
var RutaController = require('../controllers/ruta');
const auth = require('../middlewares/auth');
var router = express.Router();

router.post('/save-ruta', auth, RutaController.saveRuta);
router.get('/ruta/:id?', auth, RutaController.getRuta);
router.get('/rutas', auth, RutaController.getRutas);
router.get('/publicationsRuta/:id?', auth, RutaController.getpublicationsRuta);
router.put('/ruta/:id', auth, RutaController.updateRuta);
router.delete('/ruta/:id', auth, RutaController.deleteRuta);
router.get('/deleteRutas', auth, RutaController.deleteRutas);

module.exports = router;