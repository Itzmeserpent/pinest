let passcode = '';
const correctPasscode = '1984';

const lockScreen = document.getElementById('lockScreen');
const dashboard = document.getElementById('dashboard');
const settingsPanel = document.getElementById('settingsPanel');
const errorMessage = document.getElementById('errorMessage');
const rippleContainer = document.getElementById('rippleContainer');

const keyButtons = document.querySelectorAll('.key-btn');
const dots = document.querySelectorAll('.dot');

const lockBtn = document.getElementById('lockBtn');
const backBtn = document.getElementById('backBtn');
const dashboardButtons = document.querySelectorAll('.dashboard-btn');

const brightnessSlider = document.getElementById('brightnessSlider');
const volumeSlider = document.getElementById('volumeSlider');
const brightnessValue = document.getElementById('brightnessValue');
const volumeValue = document.getElementById('volumeValue');
const nightModeToggle = document.getElementById('nightModeToggle');

const headerTime = document.getElementById('headerTime');

const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 480;
canvas.height = 320;

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = Math.random() * 1.5 + 0.5;
    this.opacity = Math.random() * 0.5 + 0.3;
    this.hue = Math.random() * 60 + 160;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.opacity})`;
    ctx.fill();
  }
}

const particles = [];
for (let i = 0; i < 50; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();

    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 80) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 212, 255, ${0.15 * (1 - distance / 80)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animateParticles);
}

animateParticles();

function updateTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  headerTime.textContent = `${hours}:${minutes}`;
}

setInterval(updateTime, 1000);
updateTime();

function showScreen(screen, fromScreen) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active', 'slide-in');
  });

  if (fromScreen === lockScreen && screen === dashboard) {
    setTimeout(() => {
      screen.classList.add('active');
      createSuccessParticles();
    }, 100);
  } else {
    screen.classList.add('active');
  }
}

function createSuccessParticles() {
  const centerX = 240;
  const centerY = 160;

  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const angle = (Math.PI * 2 * i) / 30;
      const velocity = 3 + Math.random() * 2;
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';
      particle.style.width = '4px';
      particle.style.height = '4px';
      particle.style.borderRadius = '50%';
      particle.style.background = `hsl(${Math.random() * 60 + 160}, 100%, 60%)`;
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '1000';
      document.body.appendChild(particle);

      let x = centerX;
      let y = centerY;
      let vx = Math.cos(angle) * velocity;
      let vy = Math.sin(angle) * velocity;
      let opacity = 1;

      const animate = () => {
        x += vx;
        y += vy;
        vy += 0.1;
        opacity -= 0.02;

        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.opacity = opacity;

        if (opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          particle.remove();
        }
      };

      animate();
    }, i * 10);
  }
}

function updateDots() {
  dots.forEach((dot, index) => {
    setTimeout(() => {
      if (index < passcode.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
      }
    }, index * 50);
  });
}

function createRipple(x, y) {
  const ripple = document.createElement('div');
  ripple.className = 'ripple';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.style.width = '20px';
  ripple.style.height = '20px';
  rippleContainer.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 800);
}

function shakeElement(element) {
  element.style.animation = 'none';
  setTimeout(() => {
    element.style.animation = 'shake 0.5s';
  }, 10);
}

function handleKeyPress(key) {
  if (key === 'clear') {
    passcode = '';
    errorMessage.classList.remove('show');
    updateDots();
    return;
  }

  if (key === 'enter') {
    if (passcode === correctPasscode) {
      errorMessage.classList.remove('show');

      dots.forEach(dot => {
        dot.style.background = '#00ff88';
        dot.style.borderColor = '#00ff88';
        dot.style.boxShadow = '0 0 15px #00ff88';
      });

      setTimeout(() => {
        showScreen(dashboard, lockScreen);
        passcode = '';

        setTimeout(() => {
          dots.forEach(dot => {
            dot.style.background = '';
            dot.style.borderColor = '';
            dot.style.boxShadow = '';
            dot.classList.remove('filled');
          });
        }, 500);
      }, 400);
    } else {
      errorMessage.classList.add('show');
      shakeElement(errorMessage);

      dots.forEach(dot => {
        dot.style.background = '#ff4757';
        dot.style.borderColor = '#ff4757';
        dot.style.boxShadow = '0 0 10px #ff4757';
      });

      setTimeout(() => {
        errorMessage.classList.remove('show');
        passcode = '';
        dots.forEach(dot => {
          dot.style.background = '';
          dot.style.borderColor = '';
          dot.style.boxShadow = '';
          dot.classList.remove('filled');
        });
      }, 1500);
    }
    return;
  }

  if (passcode.length < 4) {
    passcode += key;
    updateDots();
  }
}

keyButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const key = btn.getAttribute('data-key');
    handleKeyPress(key);

    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    createRipple(x, y);
  });
});

lockBtn.addEventListener('click', () => {
  showScreen(lockScreen);
  passcode = '';
  updateDots();
});

backBtn.addEventListener('click', () => {
  showScreen(dashboard);
});

dashboardButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const action = btn.getAttribute('data-action');
    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    createRipple(x, y);

    if (action === 'settings') {
      setTimeout(() => {
        showScreen(settingsPanel);
      }, 200);
    } else {
      console.log(`Action: ${action}`);
    }
  });
});

brightnessSlider.addEventListener('input', (e) => {
  brightnessValue.textContent = `${e.target.value}%`;
  const brightness = e.target.value / 100;
  canvas.style.opacity = 0.3 + (brightness * 0.3);
});

volumeSlider.addEventListener('input', (e) => {
  volumeValue.textContent = `${e.target.value}%`;
});

nightModeToggle.addEventListener('change', (e) => {
  if (e.target.checked) {
    document.body.style.transition = 'filter 0.5s ease';
    document.body.style.filter = 'brightness(0.7)';
  } else {
    document.body.style.transition = 'filter 0.5s ease';
    document.body.style.filter = 'brightness(1)';
  }
});

document.addEventListener('touchstart', function(e) {
  if (e.target.tagName !== 'INPUT' && !e.target.classList.contains('slider')) {
    e.preventDefault();
  }
}, { passive: false });

dashboardButtons.forEach((btn, index) => {
  btn.style.opacity = '0';
  btn.style.transform = 'translateY(20px)';
  setTimeout(() => {
    btn.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    btn.style.opacity = '1';
    btn.style.transform = 'translateY(0)';
  }, 100 + (index * 80));
});
