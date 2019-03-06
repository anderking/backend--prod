'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CalificationSchema = Schema({
	userEmisorID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	userReceptorID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	value: Number,
	name: String,
}, {
    versionKey: false
});

module.exports = mongoose.model('Calification', CalificationSchema);
