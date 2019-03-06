'use strict'

var express = require('express');
var CategoriaController = require('../controllers/categoria');
const auth = require('../middlewares/auth');
var router = express.Router();

router.post('/save-categoria', auth, CategoriaController.saveCategoria);
router.get('/categoria/:id?', auth, CategoriaController.getCategoria);
router.get('/publicationsCategoria/:id?', auth, CategoriaController.getpublicationsCategoria);
router.get('/categorias', auth, CategoriaController.getCategorias);
router.put('/categoria/:id', auth, CategoriaController.updateCategoria);
router.delete('/categoria/:id', auth, CategoriaController.deleteCategoria);
router.get('/deleteCategorias', auth, CategoriaController.deleteCategorias);

module.exports = router;