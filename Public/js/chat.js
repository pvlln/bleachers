//For button:
var input = document.getElementById("name");
//For chat:
const socket = io();

socket.on('connect', () => {
    console.log(socket.id);
});
//listening for message from server
socket.on('message', (data) => {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = data;
    document.getElementById('chat').appendChild(messageDiv);
});
//sends message to html
const sendMessage = () => {
    const message = document.getElementById('name').value;
    socket.emit('message', message);
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


document.getElementById('submit').addEventListener('click', sendMessage);