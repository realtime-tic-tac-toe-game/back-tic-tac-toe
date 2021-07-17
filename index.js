'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const mongoose = require('mongoose');

const io = require('socket.io')(http);
const gameRoom = 'game';
const { v4: uuidv4 } = require('uuid');

const { gameKey, checkWinner } = require('./modules/gameLogic');
const { allGames, createGame, updateGame, getGame } = require('./modules/game');
const {
  allPlayers,
  createPlayer,
  getPlayer,
  // removePlayer,
} = require('./modules/player');

const ChatModel = require('./modules/chat_model');
const PlayerModel = require('./modules/player_model');

io.listen(server);
const queue = {
  allGames,
  allPlayers,
};

app.use(cors());

app.get('/test', (req, res) => {
  res.send('Hello From Hiba and Sukina !');
});

io.on('connection', (socket) => {
  console.log('hello connect');

  socket.on('join', (payload) => {
    const player = { name: payload.name, id: socket.id };
    socket.to(gameRoom).emit('onlineGamers', player);
  });

  socket.on('createGame', (payload) => {
    const gameId = `Room${gameKey()}`;
    console.log(gameId);
    const player = createPlayer(socket.id, payload.name, gameId, 'X');
    const game = createGame(gameId, player.id, null);
    socket.join(gameId);
    socket.emit('creatPlayer', { player });
    socket.emit('updatedGame', { game });
  });

  socket.on('claim', (payload) => {
    console.log('hello claim backend');
    // queue.allGames=quque.allGames.filter((item) => item.id !== payload.id);

    const game = getGame(payload.gameId);
    if (game) {
      const yes = 'great';
    } else {
      return 'Incorrect ID ';
    }

    const player2 = createPlayer(socket.id, payload.name, payload.gameId, 'O');
    game.player2 = player2.id;
    game.status = 'playing';
    updateGame(game);

    socket.join(payload.gameId);
    socket.emit('creatPlayer', { player2 });
    socket.emit('updatedGame', { game });

    console.log('after create and update');

    socket.broadcast.emit('updatedGame', { game });

    socket.to(payload.gameId).emit('claimed', { name: payload.name });
  });

  socket.on('playing', (data) => {
    console.log('clicked from backend');
    const { player, squareValue, gameId } = data;

    // console.log('Tha data in playing',data.player);
    const game = getGame(data.gameId);

    const { playBoard = [], playTurn, player1, player2 } = game;
    console.log(playBoard);
    let next = '';

    if (playTurn === player1) {
      next = player2;
      playBoard[squareValue] = 'X';
    } else {
      next = player1;
      playBoard[squareValue] = 'O';
    }
    game.playBoard = playBoard;
    game.playTurn = next;
    console.log('before Update', game);
    updateGame(game);
    console.log('after update', game);
    io.in(gameId).emit('updatedGame', { game });

    const winner = checkWinner(playBoard);
    console.log('The winner', winner);

    if (winner) {
      const finalWinner = { ...winner, player };
      game.status = 'ended ';
      updateGame(game);

      io.in(gameId).emit('updatedGame', { game });

      io.in(gameId).emit('endGame', { finalWinner });
      console.log('final winner', finalWinner);
      return finalWinner;
    }
    console.log('after emit', game);
    const emptySquare = playBoard.findIndex((item) => item === null);
    if (emptySquare === -1) {
      game.status = 'ended';
      updateGame(game);
      io.in(gameId).emit('updatedGame', { game });
      io.in(gameId).emit('endGame', { winner: null });
      return;
    }
  });

  socket.on('getAll', () => {
    queue.allPlayers.forEach((player) => {
      socket.emit('onlineGamers', { name: player.name, id: player.id });
    });
    queue.allGames.forEach((game) => {
      socket.emit('newGame', game);
    });
  });

  socket.on('allPlayer', async () => {
    await PlayerModel.find({}, (err, data) => {
      console.log(data);
      socket.emit('getAllPlayer', data);
    });
  });

  socket.on('chatSend', (data) => {
    // const { name, massage } = data;
    console.log(data);

    let newChat = new ChatModel(data);
    newChat.save();
  });

  setInterval(() => {
    ChatModel.find({}, (err, data) => {
      // console.log(data);
      socket.emit('getChat', data);
    });
  }, 500);

  socket.on('refreshGame', (payload) => {
    let gameId = `Room${gameKey()}`;
    const player1 = payload.player1;
    const player2 = payload.player2;
    const game = createGame(gameId, player1, player2);

    console.log('after create', game);
  });
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

server.listen(port, () => {
  console.log(`Listening on PORT ${port}`);
});
