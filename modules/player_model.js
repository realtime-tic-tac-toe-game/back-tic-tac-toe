'use strict';

const mongoose = require ('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false,
});

const playerSchema = mongoose.Schema ({
    playerName : String ,
    playerId : String,
})

const PlayerModel = mongoose.model('players', playerSchema);

module.exports = PlayerModel;
