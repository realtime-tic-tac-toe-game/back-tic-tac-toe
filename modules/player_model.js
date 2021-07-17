'use strict';

const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
  playerName: String,
  playerId: String,
});

const PlayerModel = mongoose.model('players', playerSchema);

module.exports = PlayerModel;
