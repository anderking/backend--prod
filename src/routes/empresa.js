'use strict'

var express = require('express');
var EmpresaController = require('../controllers/empresa');
const auth = require('../middlewares/auth');
var router = express.Router();

router.post('/save-empresa', auth, EmpresaController.saveEmpresa);
router.get('/empresa/:id?', auth, EmpresaController.getEmpresa);
router.get('/empresas', auth, EmpresaController.getEmpresas);
router.put('/empresa/:id', auth, EmpresaController.updateEmpresa);
router.delete('/empresa/:id', auth, EmpresaController.deleteEmpresa);

module.exports = router;