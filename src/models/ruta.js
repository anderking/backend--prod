'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RutaSchema = Schema({
	name: { type: String, unique: true},
	description: String,
}, {
    versionKey: false
});

module.exports = mongoose.model('Ruta', RutaSchema);