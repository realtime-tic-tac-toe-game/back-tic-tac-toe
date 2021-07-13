'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);

const io = require('socket.io')(http);
const gameRoom = 'game';
const { v4: uuidv4 } = require('uuid');
// const { Socket } = require('dgram');

io.listen(server);
const queue ={
  allGames:[],
  allPlayers:[],
}

app.use(cors());
app.get('/test', (req, res) => {
  res.send('Hello From Hiba and Sukina !');
});

io.on('connection', (socket) => {
  console.log('hello connect');
  socket.on('join', (payload) => {
    const player = {name: payload.name, id: socket.id};
    queue.allPlayers.push(player);
    socket.join(gameRoom);
    socket
      .to(gameRoom)
      .emit('onlineGamers',player);
  });

  socket.on('createGame', (payload) => {
    const gameData = {...payload, id: uuidv4(), socketId: socket.id};
    queue.allGames.push(gameData);
    console.log('hello from create backend', payload);
    socket
    .in(gameRoom)
    .emit('newGame', gameData);
   
    
    console.log('hello from create ', {
      ...payload,
      id: uuidv4 (),
      socketId: socket.id,
    } )
    console.log('Queue',queue);
  });

  socket.on('claim', (payload) => {
    console.log('hello claim backend');
    socket.to(payload.playerId).emit('claimed',{name: payload.name });
    queue.allGames=quque.allGames.filter((item) => item.id !== payload.id);
  });
  socket.on('getAll', () => {
    queue.allPlayers.forEach((player) => {
      socket.emit('onlineGamers', {name : player.name, id : player.id});
    });
    queue.allGames.forEach((game) => {
      socket.emit('newGame',game);
    });
  });

  socket.on('disconnect', () => {
    socket.to(gameRoom).emit('offlineGamers', { id: socket.id });
    queue.allPlayers = queue.allPlayers.filter((player) => player.id !== socket.id);
  });
});

server.listen(port, () => {
  console.log(`Listening on PORT ${port}`);
});
