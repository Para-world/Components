// Initial setup
gsap.set('.wrapper', { opacity: 0 });
gsap.set('.container', { y: 50, opacity: 0 });
gsap.set('.main-heading', { y: -50, opacity: 0 });
gsap.set('.form-group', { x: -50, opacity: 0 });
gsap.set('h2', { opacity: 0, scale: 0.8 });

// Create timeline
const tl = gsap.timeline({
    defaults: {
        ease: 'power3.out',
        duration: 0.8
    }
});

// Animation sequence
tl.to('.wrapper', { opacity: 1 })
  .to('.container', { y: 0, opacity: 1 })
  .to('.main-heading', { y: 0, opacity: 1 })
  .to('h2', { opacity: 1, scale: 1 })
  .to('.form-group', {
    x: 0,
    opacity: 1,
    stagger: 0.1
  });

// Add hover animations
const submitBtn = document.querySelector('.submit-btn');
gsap.to(submitBtn, {
    scale: 1.05,
    duration: 0.3,
    paused: true,
    ease: 'power2.out'
});

submitBtn.addEventListener('mouseenter', () => {
    gsap.to(submitBtn, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
    });
});

submitBtn.addEventListener('mouseleave', () => {
    gsap.to(submitBtn, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
    });
});

// Input focus animations
const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
    input.addEventListener('focus', () => {
        gsap.to(input, {
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    input.addEventListener('blur', () => {
        gsap.to(input, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Add cursor glow effect
const cursorGlow = document.querySelector('.cursor-glow');
let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Show cursor glow when mouse is moving
    cursorGlow.style.opacity = '1';
});

// Smooth cursor movement
function updateCursorPosition() {
    const ease = 0.15;
    
    currentX += (mouseX - currentX) * ease;
    currentY += (mouseY - currentY) * ease;
    
    cursorGlow.style.left = `${currentX}px`;
    cursorGlow.style.top = `${currentY}px`;
    
    requestAnimationFrame(updateCursorPosition);
}

updateCursorPosition();

// Hide cursor glow when mouse leaves the window
document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
});

// Add special effects for form elements
const formElements = document.querySelectorAll('input, .submit-btn');
formElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        gsap.to(cursorGlow, {
            width: element.classList.contains('submit-btn') ? 400 : 300,
            height: element.classList.contains('submit-btn') ? 400 : 300,
            duration: 0.3
        });
    });

    element.addEventListener('mouseleave', () => {
        gsap.to(cursorGlow, {
            width: 200,
            height: 200,
            duration: 0.3
        });
    });
});

document.getElementById('registrationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    const formData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: password,
        phone: document.getElementById('phone').value
    };
    
    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        if (result.success) {
            alert('Registration successful!');
            document.querySelector('.data-display-container').style.display = 'block';
        } else {
            alert('Registration failed: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error during registration. Please try again.');
    }
});

document.getElementById('showDataBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    
    try {
        const response = await fetch(`http://localhost:3000/user-data?email=${email}`);
        const result = await response.json();
        
        if (result.success) {
            const userData = result.data;
            document.getElementById('userData').innerHTML = `
                <p><strong>Username:</strong> ${userData.username}</p>
                <p><strong>Email:</strong> ${userData.email}</p>
                <p><strong>Phone:</strong> ${userData.phone}</p>
                <p><strong>Registered on:</strong> ${new Date(userData.createdAt).toLocaleString()}</p>
            `;
        } else {
            alert('Could not fetch data: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching data. Please try again.');
    }
});
