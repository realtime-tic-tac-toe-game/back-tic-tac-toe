'use strict';

const allGames = [];

const createGame = (id, player1, player2) => {
  const myGame = {
    id,
    player1,
    player2,
    playTurn: player1,
    playBoard: Array(9).fill(null),
    // status : 'waiting',
    theWinner: null,
  };
  allGames.push(myGame);
  return myGame;
};

const updateGame = (game) => {
  const idx = allGames.findIndex((item) => item.id === game.id);
  if (idx !== -1) {
    allGames[idx] = game;
  }
};

const getGame = (id) => allGames.find((item) => item.id === id);
module.exports = { allGames, createGame, updateGame, getGame };
