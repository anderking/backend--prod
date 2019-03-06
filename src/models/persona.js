'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PersonaSchema = Schema({
	name: String,
	cedula: { type: String, unique: true },
	telefono: String,
	direccion: String,
	estado: String,
	sexo: String,
	edoCivil: String,
  	fechaNacimiento: Date,
	userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	
}, {
    versionKey: false
});

module.exports = mongoose.model('Persona', PersonaSchema);