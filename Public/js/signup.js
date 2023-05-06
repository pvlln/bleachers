const signup = async (e) => {
    e.preventDefault();
  
    const nickname = document.querySelector('#nickname-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();
  
    if (nickname && password) {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ nickname, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        // If successful, redirect the browser to the chatrooms page
        document.location.replace('/chat');
      } else {
        console.log(response.statusText);
        alert("Signup failed. Please try again");
      }    
    }
  };
  
  document.querySelector('#signup-form').addEventListener('submit', signup);
  