'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PublicationSchema = Schema({
	title: String,
	description: String,
	image: String,
	tarifa: String,
	vistas: Number,
  	create_at: { type: Date, default: Date.now() },
	userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	categoriaID: { type: mongoose.Schema.Types.ObjectId, ref: "Categoria" },
	rutaID: { type: mongoose.Schema.Types.ObjectId, ref: "Ruta" },
	
}, {
    versionKey: false
});

module.exports = mongoose.model('Publication', PublicationSchema);