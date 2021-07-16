'use strict';

const gameKey = (length = 8) => {
  return Math.random().toString(10).substr(2, length);
};

const winning = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const checkWinner = (board) => {
  for (let i = 0; i < winning.length; i++) {
    const [x, y, z] = winning[i];
    if (board[x] !== 'play' && board[x] === board[y] && board[x] === board[z] && board[y] !== 'play' && board[z] !== 'play'  ) {
      return {
        winning: [x, y, z],
      };
    }
  }
  return null;
};
module.exports = { gameKey, checkWinner };
