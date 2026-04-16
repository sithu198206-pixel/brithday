// ===== PARTICLE SYSTEM =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 100;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = this.getRandomColor();
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    getRandomColor() {
        const colors = ['#ff6b6b', '#ffb6c1', '#ffd700', '#ff69b4', '#ff1493'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.speedY = -this.speedY;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    
    connectParticles();
    requestAnimationFrame(animateParticles);
}

function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.strokeStyle = `rgba(255, 107, 107, ${0.2 - distance / 500})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

initParticles();
animateParticles();

// ===== MOUSE INTERACTION =====
let mouse = {
    x: null,
    y: null
};

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
    
    // Create heart trail
    if (Math.random() < 0.1) {
        createHeartTrail(e.x, e.y);
    }
});

function createHeartTrail(x, y) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.pointerEvents = 'none';
    heart.style.fontSize = '20px';
    heart.style.zIndex = '9999';
    heart.style.animation = 'heartFade 1s ease-out forwards';
    heart.style.transform = `translate(-50%, -50%)`;
    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 1000);
}

// Add heart fade animation
const heartFadeStyle = document.createElement('style');
heartFadeStyle.innerHTML = `
    @keyframes heartFade {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -100px) scale(0.5);
        }
    }
`;
document.head.appendChild(heartFadeStyle);

// ===== COUNTDOWN TIMER =====
function updateCountdown() {
    const now = new Date();
    let birthday = new Date(now.getFullYear(), 8, 28); // September 28
    
    // If birthday has passed this year, set to next year
    if (now > birthday) {
        birthday = new Date(now.getFullYear() + 1, 8, 28);
    }
    
    const timeDifference = birthday - now;
    
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ===== AGE CALCULATOR =====
function calculateAge() {
    const birthDate = new Date(2005, 8, 28); // September 28, 2005
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    document.getElementById('ageNumber').textContent = age;
}

calculateAge();

// ===== SCROLL ANIMATIONS =====
const fadeElements = document.querySelectorAll('.fade-in');

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

fadeElements.forEach(element => {
    observer.observe(element);
});

// ===== CAKE INTERACTION =====
const candles = document.querySelectorAll('.candle');
let candlesBlown = 0;

candles.forEach(candle => {
    candle.addEventListener('click', () => {
        const flame = candle.querySelector('.flame');
        if (!flame.classList.contains('out')) {
            flame.classList.add('out');
            candlesBlown++;
            
            // Create smoke effect
            createSmokeEffect(candle);
            
            // Check if all candles are blown
            if (candlesBlown === candles.length) {
                setTimeout(() => {
                    document.getElementById('wishMessage').classList.remove('hidden');
                    createConfetti();
                }, 500);
            }
        }
    });
});

function createSmokeEffect(candle) {
    for (let i = 0; i < 5; i++) {
        const smoke = document.createElement('div');
        smoke.style.position = 'absolute';
        smoke.style.width = '10px';
        smoke.style.height = '10px';
        smoke.style.background = 'rgba(200, 200, 200, 0.5)';
        smoke.style.borderRadius = '50%';
        smoke.style.left = '50%';
        smoke.style.top = '-30px';
        smoke.style.transform = 'translateX(-50%)';
        smoke.style.animation = 'smokeRise 1s ease-out forwards';
        candle.appendChild(smoke);
        
        setTimeout(() => smoke.remove(), 1000);
    }
}

// Add smoke animation
const smokeStyle = document.createElement('style');
smokeStyle.innerHTML = `
    @keyframes smokeRise {
        0% {
            opacity: 0.8;
            transform: translateX(-50%) translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-50px) scale(2);
        }
    }
`;
document.head.appendChild(smokeStyle);

// ===== CONFETTI EFFECT =====
function createConfetti() {
    const confettiColors = ['#ff6b6b', '#ffb6c1', '#ffd700', '#ff69b4', '#ff1493', '#00ff00', '#00ffff'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.zIndex = '9999';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 5000);
        }, i * 30);
    }
}

// Add confetti animation
const confettiStyle = document.createElement('style');
confettiStyle.innerHTML = `
    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// ===== TYPEWRITER EFFECT =====
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== PARALLAX EFFECT =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-content');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===== DYNAMIC BACKGROUND =====
// ===== MUSIC CONTROL (YouTube Link) =====
const musicToggle = document.getElementById('musicToggle');
const youtubeURL = 'https://youtu.be/acgqcvERIBg?si=n0ajjd5b79N3Xqsr';

musicToggle.addEventListener('click', () => {
    window.open(youtubeURL, '_blank');
});

// ===== INITIAL CONFETTI BURST =====
window.addEventListener('load', () => {
    setTimeout(() => {
        createConfetti();
    }, 1000);
});

// ===== HEART RAIN EFFECT =====
function createHeartRain() {
    setInterval(() => {
        const heart = document.createElement('div');
        heart.innerHTML = ['❤️', '💕', '💖', '💗', '💝'][Math.floor(Math.random() * 5)];
        heart.style.position = 'fixed';
        heart.style.left = Math.random() * window.innerWidth + 'px';
        heart.style.top = '-50px';
        heart.style.fontSize = Math.random() * 20 + 20 + 'px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1';
        heart.style.animation = `heartRain ${Math.random() * 5 + 5}s linear forwards`;
        document.body.appendChild(heart);
        
        setTimeout(() => heart.remove(), 10000);
    }, 500);
}

// Add heart rain animation
const heartRainStyle = document.createElement('style');
heartRainStyle.innerHTML = `
    @keyframes heartRain {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(heartRainStyle);

createHeartRain();

// ===== SPARKLE CURSOR EFFECT =====
document.addEventListener('click', (e) => {
    for (let i = 0; i < 10; i++) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.position = 'fixed';
        sparkle.style.left = e.clientX + 'px';
        sparkle.style.top = e.clientY + 'px';
        sparkle.style.fontSize = '15px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '9999';
        sparkle.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;
        sparkle.style.animation = 'sparkleBurst 0.8s ease-out forwards';
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 800);
    }
});

// Add sparkle burst animation
const sparkleStyle = document.createElement('style');
sparkleStyle.innerHTML = `
    @keyframes sparkleBurst {
        0% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(2) rotate(180deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(sparkleStyle);

// ===== RESIZE HANDLER =====
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ===== NAVBAR BACKGROUND ON SCROLL =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(26, 26, 46, 0.98)';
    } else {
        navbar.style.background = 'rgba(26, 26, 46, 0.95)';
    }
});

// ===== SPECIAL EFFECTS =====
// Easter egg: Type "love" for special effect
let loveCode = '';
const loveMessage = 'love';

document.addEventListener('keydown', (e) => {
    loveCode += e.key.toLowerCase();
    
    if (loveCode.includes(loveMessage)) {
        loveCode = '';
        triggerLoveExplosion();
    }
    
    // Keep only last 4 characters
    if (loveCode.length > 4) {
        loveCode = loveCode.slice(-4);
    }
});

function triggerLoveExplosion() {
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = '❤️';
            heart.style.position = 'fixed';
            heart.style.left = '50%';
            heart.style.top = '50%';
            heart.style.fontSize = '30px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '9999';
            heart.style.transform = 'translate(-50%, -50%)';
            
            const angle = (Math.PI * 2 * i) / 50;
            const velocity = 200 + Math.random() * 200;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            
            heart.style.animation = 'loveExplosion 2s ease-out forwards';
            heart.style.setProperty('--tx', `${tx}px`);
            heart.style.setProperty('--ty', `${ty}px`);
            
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 2000);
        }, i * 20);
    }
}

// Add love explosion animation
const loveExplosionStyle = document.createElement('style');
loveExplosionStyle.innerHTML = `
    @keyframes loveExplosion {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(loveExplosionStyle);

console.log('%c❤️ Happy Birthday YinNweOo! ❤️', 'font-size: 24px; color: #ff6b6b; font-weight: bold;');
console.log('%cMade with love for the most amazing girl in the world!', 'font-size: 14px; color: #ffb6c1;');
