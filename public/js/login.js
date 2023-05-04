const bcrypt = require('bcrypt');
// Login function (async- pending request)
const login = async (e) => {
    // Prevent form submission default
    e.preventDefault();
  
    // Collect values from the login form
    var username = document.querySelector('#username').value.trim();
    var password = document.querySelector('#password').value.trim();
    var encryptedpass = bcrypt.hash(password, 10);
  
    if (username && password) {
      // POST request
      var response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({username, encryptedpass}),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        // If successful, redirect the browser to the profile page
        document.location.replace('/rooms');
      } else {
        console.log(response.statusText);
        alert("Login failed. Please try again");
      }
    }
  };
  
  const signup = async (e) => {
    e.preventDefault();
  
    const username = document.querySelector('#username').value.trim();
    const password = document.querySelector('#password').value.trim();
    var encryptedpass = bcrypt.hash(password, 10);
  
    if (username && password) {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({username, encryptedpass}),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace('/rooms');
      } else {
        console.log(response.statusText);
        alert("Login failed. Please try again");
      }
    }
  };
  
document.querySelector('.login-form').addEventListener('submit', login);
document.querySelector('.signup-form').addEventListener('submit', signup);
  