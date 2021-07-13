'use strict';

const allPlayers = [];

const createPlayer = (id, name, gameId,symbol) => {
  const myPlayer = {
    id,
    name,
    gameId,
    symbol,
  };
  allPlayers.push(myPlayer);
  return myPlayer;
};
const getPlayer = id => allPlayers.find (item => item.id=== id);

const removePlayer = id=>{
  const idx = allPlayers.findIndex(item => item.id=== id);
  if (idx !== -1){
    allPlayers.splice(idx,1);
  }
};

module.exports = {allPlayers,createPlayer, getPlayer, removePlayer};

