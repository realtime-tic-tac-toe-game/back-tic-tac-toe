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
const { v4: uuid } = require('uuid');
// const { Socket } = require('dgram');

io.listen(server);

app.use(cors());
app.get('/test', (req, res) => {
  res.send('Hello From Hiba and Sukina !');
});

io.on('connection', (socket) => {
  console.log('hello connect');

  socket.on('join', (payload) => {
    socket.join(gameRoom);
    socket
      .to(gameRoom)
      .emit('onlineGamers', { name: payload.name, id: socket.id });
  });

  Socket.on('createGame', (payload) => {
    console.log('hello from create backend', payload);
    Socket.in(gameRoom).emit('newGame', {
      ...payload,
      id: uuidv4(),
      socketId: Socket.id,
    });
  });

  Socket.on('claim', (payload) => {
    console.log('hello claim backend');
    socket.to(gameRoom).emit('calimed', { name: payload.name });
  });

  Socket.on('disconnect', () => {
    socket.to(gameRoom).emit('offlineStaff', { id: socket.id });
  });
});

server.listen(port, () => {
  console.log(`Listening on PORT ${port}`);
});
