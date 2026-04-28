// Contact Page JavaScript

// Handle Contact Form Submission
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Validate form
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Create contact object
        const contactData = {
            name: name,
            email: email,
            phone: phone,
            subject: subject,
            message: message,
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage (in a real app, this would be sent to a server)
        const contacts = JSON.parse(localStorage.getItem('jamifyContacts') || '[]');
        contacts.push(contactData);
        localStorage.setItem('jamifyContacts', JSON.stringify(contacts));
        
        // Show success message
        showNotification('Thank you for contacting us! We will get back to you soon.', 'success');
        
        // Reset form
        contactForm.reset();
        
        // Optional: Send email notification (would require backend)
        console.log('Contact form submitted:', contactData);
    });
}

// Show notification function
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        padding: 20px 30px;
        border-radius: 10px;
        color: #fff;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        font-size: 1rem;
    `;
    
    // Set background color based on type
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    }
    
    // Add animation styles
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
    if (!document.querySelector('style[data-notification]')) {
        style.setAttribute('data-notification', 'true');
        document.head.appendChild(style);
    }
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Add smooth scroll animation for FAQ items
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `all 0.5s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 100);
    });
    
    // Add click animation to FAQ items
    faqItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
});

// Form field validation with real-time feedback
const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');

formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value) {
            this.style.borderColor = '#f5576c';
        } else {
            this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
    });
    
    input.addEventListener('focus', function() {
        this.style.borderColor = 'rgb(13, 118, 199)';
    });
});

// Phone number formatting (optional)
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        e.target.value = value;
    });
}

// Social media link handlers
const socialIcons = document.querySelectorAll('.social-icon');
socialIcons.forEach(icon => {
    icon.addEventListener('click', function(e) {
        e.preventDefault();
        const platform = this.classList[1]; // facebook, twitter, etc.
        showNotification(`${platform.charAt(0).toUpperCase() + platform.slice(1)} link coming soon!`, 'info');
    });
});

// Add hover effect to info items
const infoItems = document.querySelectorAll('.info-item');
infoItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.info-icon');
        icon.style.transform = 'rotate(360deg)';
        icon.style.transition = 'transform 0.5s ease';
    });
    
    item.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.info-icon');
        icon.style.transform = 'rotate(0deg)';
    });
});

// Character counter for message textarea
const messageTextarea = document.getElementById('message');
if (messageTextarea) {
    const maxLength = 500;
    
    // Create counter element
    const counter = document.createElement('div');
    counter.style.cssText = `
        text-align: right;
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.9rem;
        margin-top: 5px;
    `;
    messageTextarea.parentElement.appendChild(counter);
    
    messageTextarea.addEventListener('input', function() {
        const remaining = maxLength - this.value.length;
        counter.textContent = `${this.value.length} / ${maxLength} characters`;
        
        if (remaining < 50) {
            counter.style.color = '#f5576c';
        } else {
            counter.style.color = 'rgba(255, 255, 255, 0.5)';
        }
        
        if (this.value.length > maxLength) {
            this.value = this.value.slice(0, maxLength);
        }
    });
    
    // Initialize counter
    messageTextarea.dispatchEvent(new Event('input'));
}

// Add animation to form on load
const formCard = document.querySelector('.form-card');
const infoCard = document.querySelector('.info-card');

if (formCard && infoCard) {
    formCard.style.opacity = '0';
    formCard.style.transform = 'translateX(-30px)';
    infoCard.style.opacity = '0';
    infoCard.style.transform = 'translateX(30px)';
    
    setTimeout(() => {
        formCard.style.transition = 'all 0.8s ease';
        infoCard.style.transition = 'all 0.8s ease';
        formCard.style.opacity = '1';
        formCard.style.transform = 'translateX(0)';
        infoCard.style.opacity = '1';
        infoCard.style.transform = 'translateX(0)';
    }, 100);
}

console.log('Contact page loaded successfully!');

