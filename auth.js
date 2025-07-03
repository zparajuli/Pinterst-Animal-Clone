// Redirect profile picture based on login state
document.addEventListener('DOMContentLoaded', () => {
  const profileLink = document.getElementById('profile-link');
  const logoutBtn = document.getElementById('logoutBtn');

  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';

  if (profileLink) {
    profileLink.href = isLoggedIn ? 'profile.html' : 'login.html';
  }

  if (logoutBtn) {
    if (isLoggedIn) {
      logoutBtn.style.display = 'inline-block';
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('loggedIn');
        window.location.reload();
      });
    }
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      // Fake login validation
      if (email && password) {
        localStorage.setItem('loggedIn', 'true');
        window.location.href = 'index.html';
      } else {
        alert('Please enter email and password.');
      }
    });
  }
});
