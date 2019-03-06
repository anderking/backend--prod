'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LikeSchema = Schema({
	userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	publicationID: { type: mongoose.Schema.Types.ObjectId, ref: "Publication" },
	check: { type: Boolean, default: true },
}, {
    versionKey: false
});

module.exports = mongoose.model('Like', LikeSchema);
