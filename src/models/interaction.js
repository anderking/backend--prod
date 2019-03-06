'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InteractionSchema = Schema({
	userEmisorID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	userReceptorID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	interaction: String,
	check: { type: Boolean, default: true },
}, {
    versionKey: false
});

module.exports = mongoose.model('Interaction', InteractionSchema);
