'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ComentSchema = new Schema({
  text: String,
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  publicationID: { type: mongoose.Schema.Types.ObjectId, ref: "Publication" },
  create_at: { type: Date, default: Date.now("<YYYY-mm-ddTHH:MM:ss>") },

}, {
    versionKey: false
});


module.exports = mongoose.model('Coment', ComentSchema);
