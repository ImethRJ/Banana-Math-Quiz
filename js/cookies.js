// Theme utility functions
const Cookies = {
    set: function(name, value, days = 30, path = '/') {
      let expires = '';
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
      }
      
      document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=' + path + '; SameSite=Strict';
    },
    
    get: function(name) {
      const nameEQ = name + '=';
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
          return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
      }
      return null;
    }
  };
  
  // Initialize theme based on cookie
  function initializeTheme() {
    const savedTheme = Cookies.get('user_theme');
    if (savedTheme) {
      document.body.setAttribute('data-theme', savedTheme);
    } else {
      // Check if user prefers dark mode at system level
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.setAttribute('data-theme', 'dark');
        Cookies.set('user_theme', 'dark', 90);
      } else {
        document.body.setAttribute('data-theme', 'light');
        Cookies.set('user_theme', 'light', 90);
      }
    }
  }
  
  // Theme toggle functionality
  function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', function() {
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Update the DOM
        document.body.setAttribute('data-theme', newTheme);
        
        // Save to cookies
        Cookies.set('user_theme', newTheme, 90);
        
        // Optional animation effect
        document.body.classList.add('theme-transition');
        setTimeout(() => {
          document.body.classList.remove('theme-transition');
        }, 1000);
        
        // Log the theme change if analytics consent is given
        if (Cookies.get('analytics_consent') === 'true') {
          console.log('Theme changed to', newTheme);
        }
      });
    }
  }
  
  // Add theme-related CSS styles
  function addThemeStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Variables for theme colors */
      :root {
        --primary-color: #f4c244;
        --secondary-color: #ff9a00;
        --text-color: #333;
        --bg-color: #f8f8f8;
        --card-bg: #ffffff;
        --shadow-color: rgba(0, 0, 0, 0.1);
        --header-color: #333;
      }
      
      /* Dark theme variables */
      [data-theme="dark"] {
        --primary-color: #ffcc00;
        --secondary-color: #ff9a00;
        --text-color: #f8f8f8;
        --bg-color: #222;
        --card-bg: #333;
        --shadow-color: rgba(0, 0, 0, 0.3);
        --header-color: #f8f8f8;
      }
  
      /* Theme transition */
      body.theme-transition {
        transition: background-color 0.5s ease, color 0.5s ease;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Initialize theme-related functionality when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Add theme styles
    addThemeStyles();
    
    // Initialize theme
    initializeTheme();
    
    // Setup theme toggle if present
    setupThemeToggle();
  });
  
  // Make Cookies object accessible globally
  window.Cookies = Cookies;