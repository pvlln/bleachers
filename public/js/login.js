// Login function (async- pending request)
const login = async (e) => {
  // Prevent form submission default
  e.preventDefault();

  // Collect values from the login form
  var username = document.querySelector('#nickname-login').value.trim();
  var password = document.querySelector('#password-login').value.trim();

  if (username && password) {
    // POST request
    var response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      // If successful, redirect the browser to the profile page
      document.location.replace('/chat');
    } else {
      console.log(response.statusText);
      alert("Login failed. Please try again");
    }
  }
};

const signup = async (e) => {
  e.preventDefault();

  const username = document.querySelector('#nickname-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();

  if (username && password) {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/chat');
    } else {
      console.log(response.statusText);
      alert("Login failed. Please try again");
    }
  }
};

document.querySelector('.login-form').addEventListener('submit', login);
document.querySelector('.signup-form').addEventListener('submit', signup);
