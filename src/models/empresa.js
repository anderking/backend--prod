'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmpresaSchema = Schema({
	name: String,
	rif: { type: String, unique: true },
	telefono: String,
	direccion: String,
	estado: String,
	userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	
}, {
    versionKey: false
});

module.exports = mongoose.model('Empresa', EmpresaSchema);