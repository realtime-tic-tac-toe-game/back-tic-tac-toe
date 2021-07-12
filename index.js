'use strict';

const express = require ('express');
const cors = require ('cors');
require('dotenv').config();
const http = require ('http');
const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);

const io = require ('socket.io')(http);
const gameRoom ='game';
const {v4:uuid} = require('uuid');
const { Socket } = require('dgram');

io.listen(server);

app.use (cors());
app.get('/test', (req,res) => {
  res.send ('Hello From Heba and Sukina !');
});

io.on('connection',(Socket) => {
  Socket.on('createGame',(payload) => {
    Socket
      .in(gameRoom)
      .emit('newGame', {...payload, id :uuidv4(), socketId :Socket.id});
  });
})

server.listen (port, () => {
  console.log(`Listening on PORT ${port}`);
});
