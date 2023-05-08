const User = require('./models/users');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mysql = require('mysql2/promise');
const env = require('dotenv').config();
const session = require('express-session');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

const exphbs = require('express-handlebars');
//serving handlebars  
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));
function isAuthenticated(req, res, next) {
  if (req.session.nickname) {
    next();
  } else {
    res.redirect('/login');
  }
}


//handles user registration
app.post('/api/users', async (req, res) => {
  try {
    const { nickname, password } = req.body;

    // Check if the user with the provided nickname already exists
    const existingUser = await User.findOne({ where: { nickname } });

    if (existingUser) {
      res.status(409).json({ success: false, message: 'Nickname already in use. Please choose another one.' });
    } else {
      // Create a new user using the User model
      const newUser = await User.create({ nickname, password });

      // Save the user's nickname in the session
      req.session.nickname = newUser.nickname;

      res.json({ success: true, message: 'User registration successful.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'User registration failed.' });
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
app.get('/chat', isAuthenticated, (req, res) => {
  res.render('chatroom', {});
});

// login route
app.post('/api/users/login', async (req, res) => {
  try {
    const { nickname, password } = req.body;
    const user = await User.findOne({ where: { nickname } });

    if (user && user.checkPassword(password)) {
      req.session.nickname = user.nickname; // Save the user's nickname in the session
      res.json({ success: true, message: 'Login successful.' });
    } else {
      res.json({ success: false, message: 'Invalid nickname or password.' });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Login failed.' });
  }
});


//Chat functionality------------------------------------------------------------

//Pulls nickname from db
app.get("/api/getNickname/:userId", async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findByPk(userId);
  if (user) {
    res.json({ nickname: user.nickname });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});


io.on("connection", (socket) => {
  console.log("User has Connected " + socket.id);

  socket.on("message", (data) => {
    console.log("Message received:", data);
    socket.broadcast.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("User has Disconnected");
  });
});

http.listen(port, () => {
  console.log('Server is listening on', port);
})

 

/*
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

  
    // Emit user-disconnected event when a user disconnects
    io.emit('user-disconnected', socket.id);
  });


  // Receive messages and send them only to users in the same room
  socket.on('message', (data) => {
    io.to(data.room).emit('message', data.message, data.room);
  });
});*/

