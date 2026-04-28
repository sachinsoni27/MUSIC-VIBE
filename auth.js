// Authentication JavaScript

// Handle Login Form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Validate inputs
        if (!email || !password) {
            showMessage('Please fill in all fields', 'error');
            return;
        }
        
        // Get stored users from localStorage
        const users = JSON.parse(localStorage.getItem('jamifyUsers')) || [];
        
        // Find user
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Store login session
            if (rememberMe) {
                localStorage.setItem('jamifyLoggedIn', 'true');
                localStorage.setItem('jamifyCurrentUser', JSON.stringify(user));
            } else {
                sessionStorage.setItem('jamifyLoggedIn', 'true');
                sessionStorage.setItem('jamifyCurrentUser', JSON.stringify(user));
            }
            
            showMessage('Login successful! Redirecting...', 'success');
            
            // Redirect to home page after 1 second
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showMessage('Invalid email or password', 'error');
        }
    });
}

// Handle Signup Form
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullname = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        // Validate inputs
        if (!fullname || !email || !password || !confirmPassword) {
            showMessage('Please fill in all fields', 'error');
            return;
        }
        
        if (!agreeTerms) {
            showMessage('Please agree to the terms and conditions', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showMessage('Passwords do not match', 'error');
            return;
        }
        
        if (password.length < 6) {
            showMessage('Password must be at least 6 characters long', 'error');
            return;
        }
        
        // Get existing users
        const users = JSON.parse(localStorage.getItem('jamifyUsers')) || [];
        
        // Check if user already exists
        if (users.some(u => u.email === email)) {
            showMessage('Email already registered', 'error');
            return;
        }
        
        // Create new user
        const newUser = {
            fullname: fullname,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        };
        
        // Add to users array
        users.push(newUser);
        
        // Save to localStorage
        localStorage.setItem('jamifyUsers', JSON.stringify(users));
        
        showMessage('Account created successfully! Redirecting to login...', 'success');
        
        // Redirect to login page after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    });
}

// Social login buttons (placeholder functionality)
const socialButtons = document.querySelectorAll('.social-btn');
socialButtons.forEach(button => {
    button.addEventListener('click', function() {
        const provider = this.classList.contains('google-btn') ? 'Google' : 'Facebook';
        showMessage(`${provider} login coming soon!`, 'info');
    });
});

// Show message function
function showMessage(message, type) {
    // Remove existing message if any
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message ${type}`;
    messageDiv.textContent = message;
    
    // Add styles
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: #fff;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    `;
    
    // Set background color based on type
    if (type === 'success') {
        messageDiv.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    } else if (type === 'error') {
        messageDiv.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    } else {
        messageDiv.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    }
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add to body
    document.body.appendChild(messageDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 3000);
}

