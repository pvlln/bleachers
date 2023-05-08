const User = require('./models/users');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mysql = require('mysql2/promise');
const env= require('dotenv').config();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const exphbs = require('express-handlebars');
//serving handlebars  
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

//handles user registration
app.post('/api/users', async (req, res) => {
  try {
    const { nickname, password } = req.body;

    // Create a new user using the User model
    const newUser = await User.create({ nickname, password });

    res.json({ success: true, message: 'User registration successful.' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'User registration failed.' });
  }
});

// redirect to signup page
app.get('/', (req, res) => {
  res.redirect('/signup');
});
// signup route
app.get('/signup', (req, res) => {
  res.render('signup');
});
// login route
app.get('/login', (req, res) => {
  res.render('login');
});
// chat route
app.get('/chat', (req, res) => {
  res.render('chatroom', {
    room: { name: 'Sample Room' },
    message: { sender: 'User', content: 'Welcome to the chatroom!' },
  });
});


//signup route

// login route

app.post('/api/users/login', async (req, res) => {
  try {
    const { nickname, password } = req.body;
    const user = await User.findOne({ where: { nickname } });

    if (user && user.checkPassword(password)) {
     
      res.json({ success: true, message: 'Login successful.' });
    } else {
      res.json({ success: false, message: 'Invalid nickname or password.' });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Login failed.' });
  }
});


io.on('connection', (socket) => {
  console.log('User has Connected' + socket.id);

  // Emit new-user event when a user connects
  io.emit('new-user', socket.id);

  // Join room event
  socket.on('join-room', (roomName) => {
    socket.join(roomName);
    io.to(roomName).emit('message', socket.id + ' has joined the room: ' + roomName);
  });

  // Leave room event
  socket.on('leave-room', (roomName) => {
    socket.leave(roomName);
    io.to(roomName).emit('message', socket.id + ' has left the room: ' + roomName);
  });

  socket.on('disconnect', () => {
    console.log('User has Disconnected');

    // Emit user-disconnected event when a user disconnects
    io.emit('user-disconnected', socket.id);
  });


  // Receive messages and send them only to users in the same room
  socket.on('message', (data) => {
    io.to(data.room).emit('message', data.message, data.room);
  });
});

http.listen(port, () => {
  console.log('Server is listening on', port);
});
