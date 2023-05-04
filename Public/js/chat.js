//For button:
var input = document.getElementById("name");
//For chat:
const socket = io();

socket.on('connect', () => {
    console.log(socket.id);
});
//listening for message from server
socket.on('message', (data) => {
    if (data.room === currentRoom) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = data.message;
        document.getElementById('chat').appendChild(messageDiv);
    }
});

//sends message to html
const sendMessage = () => {
    const message = document.getElementById('name').value;
    socket.emit('message', { message: message, room: currentRoom });
};


//Logs whoever joined server
socket.on('new-user', (user) => {
    const usersContainer = document.getElementById('users-container');
    const newUserDiv = document.createElement('div');
    newUserDiv.textContent = user;
    newUserDiv.id = user;
    usersContainer.appendChild(newUserDiv);
});

socket.on('user-disconnected', (user) => {
    const userDiv = document.getElementById(user);
    if (userDiv) {
        userDiv.remove();
    }
});

// Store the current room name
let currentRoom = null;


// To join room
const joinRoom = (roomName) => {
    currentRoom = roomName;
    socket.emit('join-room', roomName);
};


// Add event listeners to room links
const roomLinks = document.querySelectorAll('.room-link');
roomLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const roomName = event.target.getAttribute('data-room-name');
        joinRoom(roomName);
    });
});


document.getElementById('submit').addEventListener('click', sendMessage);

