'use strict'

var express = require('express');
var PersonaController = require('../controllers/persona');
const auth = require('../middlewares/auth');
var router = express.Router();

router.post('/save-persona', auth, PersonaController.savePersona);
router.get('/persona/:id?', auth, PersonaController.getPersona);
router.get('/personas', auth, PersonaController.getPersonas);
router.put('/persona/:id', auth, PersonaController.updatePersona);
router.delete('/persona/:id', auth, PersonaController.deletePersona);

module.exports = router;