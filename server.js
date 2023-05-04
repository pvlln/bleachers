const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

const http = require('http').createServer(app);
const io = require('socket.io')(http);

//Serving the static folders in public
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));

//Serving the html in views
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('User has Connected' + socket.id);

  // Emit new-user event when a user connects
  io.emit('new-user', socket.id);

  socket.on('disconnect', () => {
    console.log('User has Disconnected');
    
    // Emit user-disconnected event when a user disconnects
    io.emit('user-disconnected', socket.id);
  });

  socket.on('message', (data) => {
    io.emit('message', data);
  });
});

http.listen(port, () => {
  console.log('Server is listening on', port);
});