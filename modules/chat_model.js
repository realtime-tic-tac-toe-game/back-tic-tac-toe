'use strict';

const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema({
  name: String,
  massage: String,
});

const ChatModel = mongoose.model('chat', ChatSchema);

module.exports = ChatModel;
