const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);
const users= {};

app.use(express.static(join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../index.html'));
});

io.on('connection', (socket) => {
  socket.on('new-user-joined', name=>{
    console.log("New user",name);
    users[socket.id]=name;
    socket.broadcast.emit('user-joined',name);
  });

  socket.on('send',message=>{
    socket.broadcast.emit('receive',{message: message, name: users[socket.id]})
  });

  socket.on('disconnect', ()=>{
    const userName = users[socket.id];
    if (userName) {
      socket.broadcast.emit('leave', userName);
      delete users[socket.id]; // Remove user from the list
    }
    console.log(userName, "disconnected");
  }); 


});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});