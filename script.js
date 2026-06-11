// ===== NAV SCROLL =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== TERMINAL TYPEWRITER =====
const lines = [
  'git push origin main',
  'npm run deploy',
  'python -m uvicorn main:app',
  'select * from projects;',
  'node server.js --port 3000',
];
let lineIdx = 0;
let charIdx = 0;
let deleting = false;
const tw = document.getElementById('typewriter');

function type() {
  const current = lines[lineIdx];
  if (!deleting) {
    tw.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    tw.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      lineIdx = (lineIdx + 1) % lines.length;
    }
  }
  setTimeout(type, deleting ? 40 : 70);
}
setTimeout(type, 1400);

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll(
  '.project-card, .skill-pill, .stat, .about-card, .about-left, .contact-inner'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger sibling cards
      const siblings = [...entry.target.parentElement.children];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 60}ms`;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => observer.observe(el));

// ===== CONTACT FORM WITH NETLIFY + TELEGRAM =====
document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  
  const form = this;
  const btn = form.querySelector('.form-submit');
  const originalText = btn.textContent;
  
  btn.textContent = 'Sending...';
  btn.style.pointerEvents = 'none';

  // Gather field values for Telegram text formatting
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const projectType = document.getElementById('project').value || 'Not Specified';
  const message = document.getElementById('message').value;

  // Automatically packages all form fields into the format Netlify expects
  const formData = new FormData(form);

  try {
    // 1. Submit to Netlify background receiver (No page reload)
    const netlifyPromise = fetch('/', {
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString()
    });

    // 2. Simultaneously fire the Telegram API notification
    const botToken = "YOUR_BOT_TOKEN_HERE"; // Put your BotFather token here
    const chatId = "YOUR_CHAT_ID_HERE";     // Put your personal Chat ID here
    
    const telegramText = `🚀 *New Portfolio Message!*\n\n` +
                         `👤 *Name:* ${name}\n` +
                         `📧 *Email:* ${email}\n` +
                         `📂 *Project:* ${projectType}\n` +
                         `💬 *Message:* ${message}`;

    const telegramPromise = fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramText,
        parse_mode: 'Markdown'
      })
    });

    // Fire both actions simultaneously
    await Promise.all([netlifyPromise, telegramPromise]);

    // Update button styling to show completion success
    btn.textContent = 'Message Sent ✓';
    btn.style.background = '#28C840';

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.pointerEvents = 'all';
      form.reset(); // Resets the input fields
    }, 3000);

  } catch (error) {
    console.error('Submission tracking failed:', error);
    btn.textContent = 'Error sending';
    btn.style.background = '#DC2626';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.pointerEvents = 'all';
    }, 3000);
  }
});