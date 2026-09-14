/**
 * Rohit Kumar Portfolio - Interactive Scripts
 * Features: Background Particle Mesh, Live Chart.js Visualizations, 
 * Animated Counters, Typing Effect, Clipboard & Form Handlers.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Interactive Data Canvas Mesh
  initParticleCanvas();

  // 3. Subheading Typing Effect
  initTypingEffect();

  // 4. Counter Animation on Scroll
  initCounters();

  // 5. Initialize Live Project Dashboards (Chart.js)
  initCharts();

  // 6. Mobile Navigation
  initMobileNav();

  // 7. Cookie Consent & Preferences
  initCookieConsent();

  // 8. Voice-Enabled AI Assistant (Aria)
  initAiAssistant();

  // 9. Privacy-Friendly Visitor Telemetry & Analytics
  initVisitorTelemetry();
});

/* ==========================================================================
   Interactive Background Canvas (Data Mesh)
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 18), 70);

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 1.8 + 1;
      this.baseAlpha = Math.random() * 0.4 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(6, 182, 212, ${this.baseAlpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Connect particles with distance check
  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = (1 - dist / 130) * 0.18;
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   Typing Subheading Effect
   ========================================================================== */
function initTypingEffect() {
  const target = document.getElementById('typed-text');
  if (!target) return;

  const phrases = [
    'Actionable Business Insights.',
    'Interactive Power BI Dashboards.',
    'Predictive RFM Segmentations.',
    'Scalable Python & SQL Pipelines.',
    'Impactful Data Stories.'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      target.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 35;
    } else {
      target.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 75;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 1800; // Pause at end of text
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   Counters on Scroll
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target'));
          const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
          const duration = 1600;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = easeOut * target;

            counter.textContent = currentVal.toFixed(decimals);

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target.toFixed(decimals);
            }
          }

          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.3 });

  const heroStats = document.getElementById('hero');
  if (heroStats) observer.observe(heroStats);
}

/* ==========================================================================
   Live Project Dashboards (Chart.js)
   ========================================================================== */
let rfmChartInstance = null;
let salesChartInstance = null;

function initCharts() {
  initRfmChart();
  initSalesChart();
}

// 1. RFM Segmentation Chart
function initRfmChart() {
  const ctx = document.getElementById('rfmChart');
  if (!ctx) return;

  const segmentData = {
    labels: ['Champions (Top 18%)', 'Loyal Customers (26%)', 'Potential Loyalists (22%)', 'At-Risk Churn (20%)', 'Hibernating (14%)'],
    datasets: [{
      label: 'Customers (%)',
      data: [18, 26, 22, 20, 14],
      backgroundColor: [
        '#06b6d4', // cyan
        '#10b981', // emerald
        '#3b82f6', // blue
        '#f43f5e', // rose (churn)
        '#64748b'  // slate
      ],
      borderColor: '#0b1120',
      borderWidth: 2,
      hoverOffset: 6
    }]
  };

  rfmChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: segmentData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#cbd5e1',
            font: { family: '"Plus Jakarta Sans"', size: 12 },
            boxWidth: 12,
            padding: 14
          }
        },
        tooltip: {
          backgroundColor: '#0f172a',
          titleColor: '#38bdf8',
          bodyColor: '#e2e8f0',
          borderColor: '#1e293b',
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: function(context) {
              const count = Math.round(50000 * (context.parsed / 100)).toLocaleString();
              return ` ${context.label}: ${context.parsed}% (~${count} users)`;
            }
          }
        }
      },
      cutout: '62%'
    }
  });
}

// Switch RFM Views (Segments vs Churn)
window.switchRfmView = function(view) {
  const title = document.getElementById('rfm-chart-title');
  const btnSegments = document.getElementById('btn-rfm-segments');
  const btnChurn = document.getElementById('btn-rfm-churn');

  if (!rfmChartInstance) return;

  if (view === 'segments') {
    title.textContent = 'Live RFM Segmentation Distribution';
    btnSegments.className = 'px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs shadow-md transition-all';
    btnChurn.className = 'px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 transition-all';

    rfmChartInstance.data.labels = ['Champions (18%)', 'Loyal (26%)', 'Potential (22%)', 'At-Risk Churn (20%)', 'Hibernating (14%)'];
    rfmChartInstance.data.datasets[0].data = [18, 26, 22, 20, 14];
    rfmChartInstance.data.datasets[0].backgroundColor = ['#06b6d4', '#10b981', '#3b82f6', '#f43f5e', '#64748b'];
  } else {
    title.textContent = 'Customer Retention vs Churn Breakdown (20% Churn Rate)';
    btnChurn.className = 'px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs shadow-md transition-all';
    btnSegments.className = 'px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 transition-all';

    rfmChartInstance.data.labels = ['Retained Active Customers (80%)', 'At-Risk Churn Segment (20%)'];
    rfmChartInstance.data.datasets[0].data = [80, 20];
    rfmChartInstance.data.datasets[0].backgroundColor = ['#10b981', '#f43f5e'];
  }
  rfmChartInstance.update();
};

// 2. Superstore Regional Sales Chart
const regionalData = {
  all: {
    labels: ['West Region ★', 'East Region', 'Central Region', 'South Region'],
    sales: [0.71, 0.68, 0.50, 0.37], // in Millions
    profit: [71.0, 91.5, 39.7, 24.0] // in Thousands ($K)
  },
  West: {
    labels: ['West: Technology', 'West: Office Supplies', 'West: Furniture'],
    sales: [0.32, 0.22, 0.17],
    profit: [38.0, 24.5, 8.5]
  },
  East: {
    labels: ['East: Technology', 'East: Office Supplies', 'East: Furniture'],
    sales: [0.30, 0.21, 0.17],
    profit: [45.0, 28.0, 18.5]
  },
  Central: {
    labels: ['Central: Technology', 'Central: Office Supplies', 'Central: Furniture'],
    sales: [0.22, 0.17, 0.11],
    profit: [20.0, 14.5, 5.2]
  },
  South: {
    labels: ['South: Technology', 'South: Office Supplies', 'South: Furniture'],
    sales: [0.16, 0.13, 0.08],
    profit: [12.0, 9.0, 3.0]
  }
};

function initSalesChart() {
  const ctx = document.getElementById('salesChart');
  if (!ctx) return;

  salesChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: regionalData.all.labels,
      datasets: [
        {
          label: 'Total Sales ($M)',
          data: regionalData.all.sales,
          backgroundColor: 'rgba(6, 182, 212, 0.85)', // cyan
          borderRadius: 6,
          yAxisID: 'ySales'
        },
        {
          label: 'Profit ($K)',
          data: regionalData.all.profit,
          backgroundColor: 'rgba(16, 185, 129, 0.85)', // emerald
          borderRadius: 6,
          yAxisID: 'yProfit'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#cbd5e1',
            font: { family: '"Plus Jakarta Sans"', size: 12 },
            boxWidth: 12
          }
        },
        tooltip: {
          backgroundColor: '#0f172a',
          titleColor: '#38bdf8',
          bodyColor: '#e2e8f0',
          borderColor: '#1e293b',
          borderWidth: 1,
          padding: 10
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8', font: { family: '"JetBrains Mono"', size: 11 } }
        },
        ySales: {
          type: 'linear',
          position: 'left',
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: {
            color: '#06b6d4',
            font: { family: '"JetBrains Mono"', size: 10 },
            callback: value => '$' + value + 'M'
          }
        },
        yProfit: {
          type: 'linear',
          position: 'right',
          grid: { drawOnChartArea: false },
          ticks: {
            color: '#10b981',
            font: { family: '"JetBrains Mono"', size: 10 },
            callback: value => '$' + value + 'K'
          }
        }
      }
    }
  });
}

// Filter Regional Superstore Chart
window.filterRegionChart = function(regionKey) {
  if (!salesChartInstance) return;

  const buttons = ['all', 'west', 'east', 'central', 'south'];
  buttons.forEach(k => {
    const btn = document.getElementById(`btn-reg-${k}`);
    if (btn) {
      if (k === regionKey.toLowerCase()) {
        btn.className = 'px-2.5 py-1 rounded bg-cyan-500 text-slate-950 font-bold text-xs';
      } else {
        btn.className = 'px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs';
      }
    }
  });

  const chartTitle = document.getElementById('sales-chart-title');
  const dataObj = regionalData[regionKey] || regionalData.all;

  chartTitle.textContent = regionKey === 'all' 
    ? 'Superstore Regional Sales & Profit ($M / $K)' 
    : `Superstore Category Breakdown: ${regionKey} Region`;

  salesChartInstance.data.labels = dataObj.labels;
  salesChartInstance.data.datasets[0].data = dataObj.sales;
  salesChartInstance.data.datasets[1].data = dataObj.profit;
  salesChartInstance.update();
};

/* ==========================================================================
   Clipboard Copy & Notification Toast
   ========================================================================== */
window.copyToClipboard = function(text, message = 'Copied to clipboard!') {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showToast(message));
  } else {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(message);
  }
};

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.remove('translate-y-24', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-24', 'opacity-0');
  }, 3200);
}

/* ==========================================================================
   Contact / Hire Me Handler (WhatsApp +91 8210916738 & Gmail raj079851@gmail.com)
   ========================================================================== */

// Toggle custom role input if 'Custom Role' selected
window.handleRoleChange = function(select) {
  const customRoleWrapper = document.getElementById('custom-role-wrapper');
  if (!customRoleWrapper) return;
  if (select.value === 'Custom Role') {
    customRoleWrapper.classList.remove('hidden');
    const input = document.getElementById('custom-role');
    if (input) input.focus();
  } else {
    customRoleWrapper.classList.add('hidden');
  }
};

// Populate message textarea when HR picks a template or custom message
window.handleMessageTemplateChange = function(select) {
  const messageArea = document.getElementById('message');
  if (!messageArea) return;
  
  const templates = {
    'custom': '',
    'interview': `Hi Rohit,

We thoroughly reviewed your portfolio and were very impressed by your analytical projects and live dashboards. We would love to invite you for an interview regarding an open position on our team.

Could you please let us know your availability this week for an introductory conversation?

Best regards,`,
    'shortlist': `Hello Rohit,

Your background in Python, SQL, Power BI, and Machine Learning aligns well with our team's requirements. We have shortlisted your profile and would like to connect to discuss potential next steps.

Looking forward to speaking with you.

Best regards,`,
    'freelance': `Hi Rohit,

We have an upcoming Business Intelligence & Dashboard project and are looking for a skilled data analyst to clean our datasets, build KPI models, and design interactive executive dashboards.

Let's discuss project scope, deliverables, and timeline.

Best regards,`,
    'networking': `Hi Rohit,

I came across your data analytics portfolio and wanted to reach out. I'm impressed by your analytical rigor, and I'd like to connect for a quick discussion on data and AI opportunities.

Best regards,`
  };

  if (templates[select.value] !== undefined) {
    messageArea.value = templates[select.value];
    messageArea.focus();
    if (select.value !== 'custom') {
      showToast('Template inserted! Feel free to edit or personalize your message.');
    }
  }
};

window.handleFormSubmit = async function(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = document.getElementById('submit-btn');
  const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '<span>Send Message to raj079851@gmail.com</span>';

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const customRoleInput = document.getElementById('custom-role');
  const messageInput = document.getElementById('message');

  const name = nameInput ? nameInput.value.trim() : 'Guest';
  const email = emailInput ? emailInput.value.trim() : '';
  let subject = subjectInput ? subjectInput.value : 'Role / Opportunity Inquiry';
  
  if (subject === 'Custom Role' && customRoleInput && customRoleInput.value.trim()) {
    subject = `Custom: ${customRoleInput.value.trim()}`;
  }

  const message = messageInput ? messageInput.value.trim() : '';

  if (!email || !message) {
    showToast('Please enter your Email and Message before sending.');
    return;
  }

  // Visual loading state
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-80');
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      <span>Sending to raj079851@gmail.com...</span>
    `;
  }

  try {
    const payload = {
      _subject: `🚀 New Hire Inquiry: ${subject} from ${name}`,
      "Sender Name": name,
      "Sender Email": email,
      "Role / Opportunity": subject,
      "Message Content": message,
      "Submission Time": new Date().toLocaleString(),
      "_template": "table",
      "_captcha": "false"
    };

    let response = null;
    // 1. Try local server proxy endpoint first (active when running start_server.bat)
    try {
      const localEndpoint = (window.location.origin && window.location.origin.includes('8080')) 
        ? '/api/send-hire' 
        : 'http://localhost:8080/api/send-hire';
      const localRes = await fetch(localEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (localRes.ok) {
        response = localRes;
      }
    } catch (e) {
      // Local server not running, will use direct endpoint
    }

    // 2. Direct FormSubmit endpoint (used in production on GitHub Pages/Netlify/Vercel)
    if (!response) {
      response = await fetch('https://formsubmit.co/ajax/raj079851@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    }

    const result = await response.json();
    if (result.success === 'true' || result.success === true) {
      showToast('✅ Message successfully sent to raj079851@gmail.com!');
      form.reset();
      const customRoleWrapper = document.getElementById('custom-role-wrapper');
      if (customRoleWrapper) customRoleWrapper.classList.add('hidden');
    } else if (result.message && result.message.includes('Activation')) {
      showToast('⚠️ FormSubmit activation needed: Check raj079851@gmail.com and click "Activate Form"');
      console.warn('FormSubmit activation required for raj079851@gmail.com:', result.message);
    } else {
      throw new Error(result.message || 'Submission error');
    }
  } catch (err) {
    console.warn('Direct fetch note, opening email client fallback:', err);
    const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nRole: ${subject}\n\nMessage:\n${message}`);
    const mailtoUrl = `mailto:raj079851@gmail.com?subject=${encodeURIComponent(`[Portfolio] ${subject} from ${name}`)}&body=${mailtoBody}`;
    window.location.href = mailtoUrl;
    showToast('Redirecting to your email client for raj079851@gmail.com...');
    form.reset();
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-80');
      submitBtn.innerHTML = originalBtnHTML;
      if (window.lucide) window.lucide.createIcons();
    }
  }
};

window.sendViaWhatsApp = function(e) {
  if (e && typeof e.preventDefault === 'function') {
    e.preventDefault();
  }
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const customRoleInput = document.getElementById('custom-role');
  const messageInput = document.getElementById('message');

  const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Recruiter / Hiring Manager';
  const email = emailInput && emailInput.value.trim() ? emailInput.value.trim() : '';
  let subject = subjectInput ? subjectInput.value : 'Role / Opportunity Inquiry';
  if (subject === 'Custom Role' && customRoleInput && customRoleInput.value.trim()) {
    subject = `Custom: ${customRoleInput.value.trim()}`;
  }
  const message = messageInput ? messageInput.value.trim() : '';

  if (!message) {
    showToast('Please enter your message before opening WhatsApp.');
    return false;
  }

  const emailLine = email ? `\n📧 *Email:* ${email}` : '';
  const whatsappText = 
`👋 *New Hiring Inquiry from Portfolio*

👤 *Name:* ${name}${emailLine}
💼 *Role / Opportunity:* ${subject}
📝 *Message:*
${message}

— Sent via Rohit Kumar's Portfolio`;

  const whatsappUrl = `https://wa.me/918210916738?text=${encodeURIComponent(whatsappText)}`;
  showToast(`Opening WhatsApp with Rohit Kumar (+91 8210916738)...`);
  window.open(whatsappUrl, '_blank');
  return false;
};

// Backwards compatibility
window.sendViaEmail = window.handleFormSubmit;

/* ==========================================================================
   Mobile Nav Drawer Toggle
   ========================================================================== */
function initMobileNav() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  // Close menu when clicking a link
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
    });
  });
}

/* ==========================================================================
   Resume Modal Preview Handlers
   ========================================================================== */
window.openResumeModal = function() {
  const modal = document.getElementById('resume-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
};

window.closeResumeModal = function() {
  const modal = document.getElementById('resume-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
};

window.handleModalBackdropClick = function(event) {
  if (event.target.id === 'resume-modal') {
    closeResumeModal();
  }
};

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeResumeModal();
    closeCookieModal();
    closeAnalyticsModal();
  }
});

/* ==========================================================================
   Cookie Consent & Preferences Handlers
   ========================================================================== */
function initCookieConsent() {
  const consent = localStorage.getItem('portfolio_cookie_consent');
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  if (!consent) {
    setTimeout(() => {
      banner.classList.remove('translate-y-32', 'opacity-0', 'pointer-events-none');
      banner.classList.add('translate-y-0', 'opacity-100');
    }, 1200);
  }
}

function hideCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  if (banner) {
    banner.classList.remove('translate-y-0', 'opacity-100');
    banner.classList.add('translate-y-32', 'opacity-0', 'pointer-events-none');
  }
}

window.acceptAllCookies = function() {
  localStorage.setItem('portfolio_cookie_consent', 'all');
  localStorage.setItem('cookie_pref_analytics', 'true');
  localStorage.setItem('cookie_pref_functional', 'true');
  hideCookieBanner();
  closeCookieModal();
  showToast('Cookie preferences saved: All Accepted');
};

window.acceptEssentialCookies = function() {
  localStorage.setItem('portfolio_cookie_consent', 'essential');
  localStorage.setItem('cookie_pref_analytics', 'false');
  localStorage.setItem('cookie_pref_functional', 'false');
  hideCookieBanner();
  closeCookieModal();
  showToast('Cookie preferences saved: Essential Only');
};

window.saveCustomCookiePreferences = function() {
  const analytics = document.getElementById('cookie-pref-analytics')?.checked ?? true;
  const functional = document.getElementById('cookie-pref-functional')?.checked ?? true;
  
  localStorage.setItem('portfolio_cookie_consent', 'custom');
  localStorage.setItem('cookie_pref_analytics', analytics ? 'true' : 'false');
  localStorage.setItem('cookie_pref_functional', functional ? 'true' : 'false');
  
  hideCookieBanner();
  closeCookieModal();
  showToast('Custom cookie preferences saved');
};

window.openCookieModal = function() {
  const modal = document.getElementById('cookie-modal');
  if (modal) {
    const analytics = localStorage.getItem('cookie_pref_analytics');
    const functional = localStorage.getItem('cookie_pref_functional');
    if (analytics !== null) {
      const el = document.getElementById('cookie-pref-analytics');
      if (el) el.checked = (analytics === 'true');
    }
    if (functional !== null) {
      const el = document.getElementById('cookie-pref-functional');
      if (el) el.checked = (functional === 'true');
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
};

window.closeCookieModal = function() {
  const modal = document.getElementById('cookie-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
};

window.handleCookieModalBackdropClick = function(event) {
  if (event.target.id === 'cookie-modal') {
    closeCookieModal();
  }
};

/* ==========================================================================
   Privacy-Friendly Visitor Telemetry & Geolocation Analytics
   ========================================================================== */
let currentVisitorSession = null;

function detectClientMetadata() {
  const ua = navigator.userAgent || '';
  
  // 1. Device Type
  let device = 'Desktop';
  if (/mobile/i.test(ua)) device = 'Mobile';
  else if (/tablet|ipad/i.test(ua)) device = 'Tablet';
  else if (/android/i.test(ua) && !/mobile/i.test(ua)) device = 'Tablet';

  // 2. Operating System
  let os = 'Unknown OS';
  if (/windows nt 10\.0/i.test(ua)) os = 'Windows 10/11';
  else if (/windows nt 6\.3/i.test(ua)) os = 'Windows 8.1';
  else if (/windows nt 6\.1/i.test(ua)) os = 'Windows 7';
  else if (/windows/i.test(ua)) os = 'Windows';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';
  else if (/cros/i.test(ua)) os = 'Chrome OS';

  // 3. Browser
  let browser = 'Unknown Browser';
  if (/edg\//i.test(ua)) browser = 'Microsoft Edge';
  else if (/chrome|crios/i.test(ua) && !/edg/i.test(ua)) browser = 'Google Chrome';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/firefox|fxios/i.test(ua)) browser = 'Mozilla Firefox';
  else if (/opera|opr\//i.test(ua)) browser = 'Opera';

  // 4. Screen Resolution
  const screen = `${window.screen.width}x${window.screen.height} (${window.devicePixelRatio || 1}x DPR)`;

  // 5. Language & Timezone
  const language = navigator.language || navigator.userLanguage || 'en-US';
  let timezone = 'Unknown';
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';
  } catch (e) {}

  // 6. Referrer
  let referrer = document.referrer ? document.referrer : 'Direct / Bookmark';
  if (referrer.includes('linkedin.com')) referrer = 'LinkedIn';
  else if (referrer.includes('github.com')) referrer = 'GitHub';
  else if (referrer.includes('google.com')) referrer = 'Google Search';
  else if (referrer.includes('wa.me') || referrer.includes('whatsapp')) referrer = 'WhatsApp';

  return { device, os, browser, screen, language, timezone, referrer };
}

async function fetchVisitorGeo() {
  // Primary: ipwho.is (Free, HTTPS, CORS enabled, high accuracy)
  try {
    const res = await fetch('https://ipwho.is/');
    if (res.ok) {
      const data = await res.json();
      if (data && data.success !== false) {
        return {
          ip: data.ip || 'Unknown IP',
          city: data.city || 'Unknown City',
          region: data.region || '',
          country: data.country || 'Unknown Country',
          countryCode: data.country_code || '',
          flag: data.flag?.emoji || '🌐',
          postal: data.postal || '',
          latitude: data.latitude,
          longitude: data.longitude,
          isp: data.connection?.isp || data.connection?.org || 'N/A',
          timezone: data.timezone?.id || 'N/A'
        };
      }
    }
  } catch (err) {
    console.debug('ipwho.is lookup info:', err);
  }

  // Fallback: ipapi.co
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      if (data && !data.error) {
        return {
          ip: data.ip || 'Unknown IP',
          city: data.city || 'Unknown City',
          region: data.region || '',
          country: data.country_name || 'Unknown Country',
          countryCode: data.country_code || '',
          flag: '🌐',
          postal: data.postal || '',
          latitude: data.latitude,
          longitude: data.longitude,
          isp: data.org || 'N/A',
          timezone: data.timezone || 'N/A'
        };
      }
    }
  } catch (err) {
    console.debug('ipapi.co fallback info:', err);
  }

  return {
    ip: 'Masked / Local',
    city: 'Location Masked',
    region: '',
    country: 'Unknown',
    countryCode: '',
    flag: '🌐',
    postal: '',
    latitude: null,
    longitude: null,
    isp: 'Standard Provider',
    timezone: 'Local'
  };
}

async function initVisitorTelemetry() {
  const clientMeta = detectClientMetadata();
  const geoMeta = await fetchVisitorGeo();

  const now = new Date();
  const timestamp = now.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  const isoTime = now.toISOString();

  const sessionData = {
    ...geoMeta,
    ...clientMeta,
    timestamp,
    isoTime,
    mapsUrl: (geoMeta.latitude && geoMeta.longitude)
      ? `https://www.google.com/maps?q=${geoMeta.latitude},${geoMeta.longitude}`
      : null
  };

  currentVisitorSession = sessionData;

  // Save current session & update history in localStorage
  try {
    localStorage.setItem('portfolio_current_session', JSON.stringify(sessionData));
    
    let history = [];
    try {
      history = JSON.parse(localStorage.getItem('portfolio_visitor_history') || '[]');
    } catch (e) {
      history = [];
    }
    
    // Add current session to front of history (max 30 entries)
    history = [sessionData, ...history.filter(h => h.ip !== sessionData.ip || Math.abs(new Date(h.isoTime || 0) - now) > 60000)].slice(0, 30);
    localStorage.setItem('portfolio_visitor_history', JSON.stringify(history));
  } catch (e) {}

  // Update modal UI if open or pre-rendered
  renderAnalyticsModalUI(sessionData);

  // Send single notification email per browser session to unwantedmailusage@gmail.com
  const isReported = sessionStorage.getItem('portfolio_visit_reported');
  if (!isReported && geoMeta.ip !== 'Masked / Local' && geoMeta.ip !== 'Unavailable') {
    dispatchVisitorAlertEmail(sessionData).then(sent => {
      if (sent) {
        sessionStorage.setItem('portfolio_visit_reported', 'true');
      }
    });
  }
}

async function dispatchVisitorAlertEmail(data, isManualTest = false) {
  if (!data) return false;
  try {
    const payload = {
      _subject: `🌐 Portfolio Visitor: ${data.city || 'Unknown City'}, ${data.country || 'Global'} (${data.device || 'Device'} • ${data.os || 'OS'})`,
      "Visitor IP": data.ip || 'Unknown',
      "Location": `${data.city ? data.city + ', ' : ''}${data.region ? data.region + ', ' : ''}${data.country || ''}${data.postal ? ' (PIN: ' + data.postal + ')' : ''}`,
      "Coordinates (Lat, Long)": (data.latitude && data.longitude) ? `${data.latitude}, ${data.longitude}` : 'N/A',
      "Google Maps Pin": data.mapsUrl || 'N/A',
      "Internet Provider (ISP)": data.isp || 'N/A',
      "Device Category": data.device || 'Unknown',
      "Operating System": data.os || 'Unknown',
      "Browser": data.browser || 'Unknown',
      "Screen Size": data.screen || 'Unknown',
      "Traffic Referrer": data.referrer || 'Direct',
      "Visit Time": `${data.timestamp || 'N/A'} (${data.timezone || ''})`,
      "_template": "table",
      "_captcha": "false"
    };

    let response = null;
    // 1. Try local server proxy endpoint first (active when running start_server.bat)
    try {
      const localEndpoint = (window.location.origin && window.location.origin.includes('8080')) 
        ? '/api/send-visitor' 
        : 'http://localhost:8080/api/send-visitor';
      const localRes = await fetch(localEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (localRes.ok) {
        response = localRes;
      }
    } catch (e) {
      // Local server not running, will use direct endpoint
    }

    // 2. Direct FormSubmit endpoint (used in production on GitHub Pages/Netlify/Vercel)
    if (!response) {
      response = await fetch('https://formsubmit.co/ajax/unwantedmailusage@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    }

    const result = await response.json();
    if (result.success === 'true' || result.success === true) {
      if (isManualTest) showToast('✅ Alert email delivered to unwantedmailusage@gmail.com!');
      return true;
    } else if (result.message && result.message.includes('Activation')) {
      showToast('⚠️ FormSubmit activation needed: Click "Activate Form" in unwantedmailusage@gmail.com');
      console.warn('FormSubmit activation notice for unwantedmailusage@gmail.com:', result.message);
    } else if (result.message && result.message.includes('HTML files')) {
      if (isManualTest) {
        showToast('ℹ️ Notice: FormSubmit requires hosting on a web server (e.g. GitHub Pages / Vercel / Localhost) to send emails.');
      }
    }
    return false;
  } catch (err) {
    console.debug('Visitor notification dispatch:', err);
    if (isManualTest) {
      showToast('⚠️ Notice: When opened as a local file (file:///), email endpoints require a web server to deliver.');
    }
    return false;
  }
}

function renderAnalyticsModalUI(data) {
  if (!data) return;

  const flagEl = document.getElementById('visitor-flag');
  const cityCountryEl = document.getElementById('visitor-city-country');
  const ipBadgeEl = document.getElementById('visitor-ip-badge');
  const locationDetailEl = document.getElementById('visitor-location-detail');
  const coordsEl = document.getElementById('visitor-coordinates');
  const deviceOsEl = document.getElementById('visitor-device-os');
  const browserScreenEl = document.getElementById('visitor-browser-screen');
  const ispEl = document.getElementById('visitor-isp');
  const refTimeEl = document.getElementById('visitor-referrer-time');
  const mapsBtnContainer = document.getElementById('visitor-maps-btn-container');
  const historyListEl = document.getElementById('analytics-history-list');

  if (flagEl) flagEl.textContent = data.flag || '🌐';
  if (cityCountryEl) {
    const parts = [data.city, data.region, data.country].filter(Boolean);
    cityCountryEl.textContent = parts.length > 0 ? parts.join(', ') : 'Location Detected';
  }
  if (ipBadgeEl) {
    ipBadgeEl.textContent = `IP: ${data.ip || 'Masked'} • Timezone: ${data.timezone || 'Local'}`;
  }
  if (locationDetailEl) {
    locationDetailEl.textContent = `${data.city || 'Unknown City'}, ${data.region || ''} ${data.country || 'Global'}${data.postal ? ' (Postal: ' + data.postal + ')' : ''}`;
  }
  if (coordsEl) {
    if (data.latitude && data.longitude) {
      coordsEl.textContent = `${data.latitude.toFixed(4)}, ${data.longitude.toFixed(4)}`;
    } else {
      coordsEl.textContent = 'Coarse / Region Level';
    }
  }
  if (deviceOsEl) {
    deviceOsEl.textContent = `${data.device || 'Desktop'} • ${data.os || 'OS'}`;
  }
  if (browserScreenEl) {
    browserScreenEl.textContent = `${data.browser || 'Browser'} • ${data.screen || 'Screen'}`;
  }
  if (ispEl) {
    ispEl.textContent = data.isp || 'Standard Internet Provider';
  }
  if (refTimeEl) {
    refTimeEl.textContent = `${data.referrer || 'Direct'} • ${data.timestamp || 'Just now'}`;
  }

  if (mapsBtnContainer) {
    if (data.mapsUrl) {
      mapsBtnContainer.innerHTML = `
        <a href="${data.mapsUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all shrink-0">
          <span>View on Google Maps</span>
          <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
        </a>
      `;
    } else {
      mapsBtnContainer.innerHTML = '';
    }
  }

  // Render recent recorded history
  if (historyListEl) {
    let history = [];
    try {
      history = JSON.parse(localStorage.getItem('portfolio_visitor_history') || '[]');
    } catch (e) {
      history = [];
    }

    if (history.length === 0) {
      historyListEl.innerHTML = `
        <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-500 font-mono">
          No past visitor records stored yet.
        </div>
      `;
    } else {
      historyListEl.innerHTML = history.map((item) => `
        <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800/90 flex items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2.5 min-w-0">
            <span class="text-base">${item.flag || '🌐'}</span>
            <div class="min-w-0">
              <div class="font-bold text-slate-200 truncate">
                ${item.city || 'Unknown City'}, ${item.country || 'Global'}
              </div>
              <div class="text-[10px] text-slate-400 font-mono flex items-center gap-2 mt-0.5 truncate">
                <span>${item.device || 'Device'} (${item.os || 'OS'})</span>
                <span>•</span>
                <span>${item.timestamp || 'Past'}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            ${item.mapsUrl ? `
              <a href="${item.mapsUrl}" target="_blank" rel="noopener noreferrer" class="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-slate-700 text-xs transition-colors" title="View Location Map">
                <i data-lucide="map-pin" class="w-3.5 h-3.5"></i>
              </a>
            ` : ''}
            <span class="px-2 py-0.5 rounded-md font-mono text-[10px] bg-slate-950 text-slate-400 border border-slate-800">
              ${item.ip ? item.ip.slice(0, 15) + (item.ip.length > 15 ? '…' : '') : 'Masked'}
            </span>
          </div>
        </div>
      `).join('');
    }
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

window.openAnalyticsModal = function() {
  const modal = document.getElementById('analytics-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (currentVisitorSession) {
      renderAnalyticsModalUI(currentVisitorSession);
    }
  }
};

window.closeAnalyticsModal = function() {
  const modal = document.getElementById('analytics-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
};

window.handleAnalyticsModalBackdropClick = function(event) {
  if (event.target.id === 'analytics-modal') {
    closeAnalyticsModal();
  }
};

window.clearVisitorAnalyticsHistory = function() {
  localStorage.removeItem('portfolio_visitor_history');
  renderAnalyticsModalUI(currentVisitorSession);
  showToast('Visitor history log cleared');
};

window.copyVisitorAnalyticsData = function() {
  if (!currentVisitorSession) return;
  navigator.clipboard.writeText(JSON.stringify(currentVisitorSession, null, 2)).then(() => {
    showToast('Visitor telemetry copied to clipboard!');
  });
};

window.sendTestVisitorEmail = async function() {
  if (!currentVisitorSession) {
    showToast('Session telemetry not ready yet. Please try in a moment.');
    return;
  }
  showToast('Sending test visitor alert to unwantedmailusage@gmail.com...');
  await dispatchVisitorAlertEmail(currentVisitorSession, true);
};

/* ==========================================================================
   Voice-Enabled AI Assistant (Aria & Alex) - Male/Female Voice & Multilingual
   ========================================================================== */
let isVoiceActive = true;
let isVoiceSpeaking = false;
let currentVoiceGender = 'female'; // 'female' (Aria) or 'male' (Alex)
let currentAiLanguage = 'en';     // 'en', 'hi', 'es', 'fr', 'de'
let speechRecognitionInstance = null;
let isRecordingMic = false;
let cachedSystemVoices = [];

const langLocaleMap = {
  'en': 'en-US',
  'hi': 'hi-IN',
  'es': 'es-ES',
  'fr': 'fr-FR',
  'de': 'de-DE'
};

const inputPlaceholders = {
  'en': "Ask about Rohit's experience, skills, projects...",
  'hi': "रोहित के अनुभव, कौशल और प्रोजेक्ट्स के बारे में पूछें...",
  'es': "Pregunta sobre las habilidades y proyectos de Rohit...",
  'fr': "Posez une question sur le parcours de Rohit...",
  'de': "Fragen Sie nach Rohits Projekten und Fähigkeiten..."
};

function refreshSystemVoices() {
  if ('speechSynthesis' in window) {
    const list = window.speechSynthesis.getVoices();
    if (list && list.length > 0) {
      cachedSystemVoices = list;
    }
  }
}

function initAiAssistant() {
  initSpeechToText();
  if ('speechSynthesis' in window) {
    refreshSystemVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        refreshSystemVoices();
      };
    }
    // Periodic check in first 2.5s for browsers where onvoiceschanged is delayed
    let attempts = 0;
    const interval = setInterval(() => {
      refreshSystemVoices();
      attempts++;
      if (cachedSystemVoices.length > 0 || attempts > 10) {
        clearInterval(interval);
      }
    }, 250);
  }
}

// 1. Voice Gender Switcher
window.setVoiceGender = function(gender) {
  // If user tries to set male while Hindi is selected, keep Hindi on high-quality female voice
  if (currentAiLanguage === 'hi' && gender === 'male') {
    showToast('हिंदी भाषा में सर्वश्रेष्ठ अनुभव के लिए आरिया (Female Voice) सक्रिय है।');
    speakWithAria('हिंदी भाषा में आरिया फीमेल आवाज सक्रिय है।');
    return;
  }

  currentVoiceGender = gender;
  stopSpeaking();

  const femaleBtn = document.getElementById('voice-female-btn');
  const maleBtn = document.getElementById('voice-male-btn');
  const nameEl = document.getElementById('ai-assistant-name');
  const badgeEl = document.getElementById('ai-voice-badge');

  if (gender === 'female') {
    if (femaleBtn) {
      femaleBtn.className = 'px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm';
    }
    if (maleBtn) {
      maleBtn.className = 'px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all text-slate-400 hover:text-slate-200';
    }
    if (nameEl) nameEl.textContent = 'Aria — AI Assistant';
    if (badgeEl) {
      badgeEl.textContent = 'Female Voice';
      badgeEl.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-violet-500/15 border border-violet-500/30 text-violet-300';
    }

    const confirmations = {
      'en': 'Aria female voice activated.',
      'hi': 'आरिया फीमेल आवाज सक्रिय हो गई है।',
      'es': 'Voz femenina de Aria activada.',
      'fr': 'Voix féminine d\'Aria activée.',
      'de': 'Aria weibliche Stimme aktiviert.'
    };
    showToast(confirmations[currentAiLanguage] || confirmations['en']);
    speakWithAria(confirmations[currentAiLanguage] || confirmations['en']);
  } else {
    if (maleBtn) {
      maleBtn.className = 'px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm';
    }
    if (femaleBtn) {
      femaleBtn.className = 'px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all text-slate-400 hover:text-slate-200';
    }
    if (nameEl) nameEl.textContent = 'Alex — AI Assistant';
    if (badgeEl) {
      badgeEl.textContent = 'Male Voice';
      badgeEl.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300';
    }

    const confirmations = {
      'en': 'Alex male voice activated.',
      'hi': 'एलेक्स मेल आवाज सक्रिय हो गई है।',
      'es': 'Voz masculina de Alex activada.',
      'fr': 'Voix masculine d\'Alex activée.',
      'de': 'Alex männliche Stimme aktiviert.'
    };
    showToast(confirmations[currentAiLanguage] || confirmations['en']);
    speakWithAria(confirmations[currentAiLanguage] || confirmations['en']);
  }
};

// 2. Language Switcher
window.setAiLanguage = function(langCode) {
  currentAiLanguage = langCode;
  stopSpeaking();

  // If Hindi is selected, automatically switch to Female voice (Aria) for natural and fluent speech
  if (langCode === 'hi') {
    currentVoiceGender = 'female';
    const femaleBtn = document.getElementById('voice-female-btn');
    const maleBtn = document.getElementById('voice-male-btn');
    const nameEl = document.getElementById('ai-assistant-name');
    const badgeEl = document.getElementById('ai-voice-badge');
    if (femaleBtn) {
      femaleBtn.className = 'px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm';
    }
    if (maleBtn) {
      maleBtn.className = 'px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all text-slate-400 hover:text-slate-200';
    }
    if (nameEl) nameEl.textContent = 'Aria — AI Assistant';
    if (badgeEl) {
      badgeEl.textContent = 'Female Voice';
      badgeEl.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-violet-500/15 border border-violet-500/30 text-violet-300';
    }
  }

  // Update input placeholder
  const input = document.getElementById('ai-query-input');
  if (input) {
    input.placeholder = inputPlaceholders[langCode] || inputPlaceholders['en'];
  }

  // Update Speech-to-Text Recognition language
  if (speechRecognitionInstance) {
    speechRecognitionInstance.lang = langLocaleMap[langCode] || 'en-US';
  }

  const langNames = {
    'en': 'English',
    'hi': 'हिंदी (Hindi)',
    'es': 'Español (Spanish)',
    'fr': 'Français (French)',
    'de': 'Deutsch (German)'
  };

  const welcomeGreetings = {
    'en': `Language switched to English. How can I assist you with Rohit Kumar's portfolio?`,
    'hi': `भाषा बदलकर हिंदी कर दी गई है। मैं आरिया हूँ, रोहित कुमार के पोर्टफोलियो के बारे में आप क्या जानना चाहते हैं?`,
    'es': `Idioma cambiado a español. ¿En qué puedo ayudarte sobre el portafolio de Rohit Kumar?`,
    'fr': `Langue définie sur le français. Comment puis-je vous aider au sujet du portfolio de Rohit Kumar ?`,
    'de': `Sprache auf Deutsch umgestellt. Wie kann ich Ihnen bei Rohit Kumars Portfolio helfen?`
  };

  showToast(`Language: ${langNames[langCode] || langCode}`);
  speakWithAria(welcomeGreetings[langCode] || welcomeGreetings['en']);
};

// 3. Robust Voice Selector & Acoustic Gender Profiler
const maleVoiceKeywords = [
  'male', 'david', 'george', 'guy', 'daniel', 'alex', 'mark', 'james', 'brian', 'christopher', 'eric', 'ryan',
  'hemant', 'madhur', 'tarun', 'ajay', 'deep', 'amit', 'mohan', 'purush',
  'pablo', 'jorge', 'raul', 'alvaro', 'enrique', 'alonso', 'diego', 'manuel', 'mateo',
  'paul', 'claude', 'henri', 'alain', 'nicolas', 'jerome', 'mathieu', 'antoine', 'jean',
  'stefan', 'martin', 'bernd', 'michael', 'klaus', 'conrad', 'killian', 'hans', 'dieter', 'markus',
  'standard-b', 'standard-d', 'wavenet-b', 'wavenet-d', 'neural-b', 'neural-d', 'online (natural) - male'
];

const femaleVoiceKeywords = [
  'female', 'zira', 'jenny', 'samantha', 'victoria', 'karen', 'aria', 'hazel', 'susan', 'catherine',
  'kalpana', 'swara', 'anjali', 'aditi', 'priya', 'neerja',
  'helena', 'laura', 'monica', 'paulina', 'lucia', 'sabina', 'elvira', 'paloma',
  'julie', 'hortense', 'denise', 'celine', 'amelie', 'brigitte',
  'hedda', 'katja', 'gudrun', 'marlene',
  'standard-a', 'standard-c', 'wavenet-a', 'wavenet-c', 'neural-a', 'neural-c', 'online (natural) - female'
];

const hindiPhoneticReplacements = [
  [/रोहित कुमार/g, 'Rohit Kumar'],
  [/रोहित/g, 'Rohit'],
  [/कुमार/g, 'Kumar'],
  [/एलेक्स/g, 'Alex'],
  [/आरिया/g, 'Aria'],
  [/मेल/g, 'male'],
  [/फीमेल/g, 'female'],
  [/आवाज/g, 'aawaz'],
  [/वॉइस/g, 'voice'],
  [/सक्रिय हो गई है/g, 'sakriya ho gayi hai'],
  [/सक्रिय/g, 'sakriya'],
  [/सहायता कर सकता हूँ/g, 'sahayata kar sakta hoon'],
  [/सहायता/g, 'sahayata'],
  [/सहायक हूँ/g, 'sahayak hoon'],
  [/सहायक/g, 'sahayak'],
  [/नमस्ते/g, 'Namaste!'],
  [/प्रणाम/g, 'Pranaam!'],
  [/का मुख्य तकनीकी कौशल/g, 'ka mukhya takneeki kaushal'],
  [/तकनीकी कौशल/g, 'takneeki kaushal'],
  [/कौशल/g, 'kaushal'],
  [/पायथन/g, 'Python'],
  [/एसक्यूएल/g, 'SQL'],
  [/पावर बीआई/g, 'Power BI'],
  [/टेबल्यू/g, 'Tableau'],
  [/एक्सेल/g, 'Excel'],
  [/डेटा क्लीनिंग/g, 'data cleaning'],
  [/डेटा एनालिस्ट/g, 'Data Analyst'],
  [/डेटा पाइपलाइन्स/g, 'data pipelines'],
  [/डेटा/g, 'data'],
  [/एनालिस्ट/g, 'Analyst'],
  [/डैशबोर्ड्स/g, 'dashboards'],
  [/सुपरस्टोर सेल्स परफॉरमेंस प्रोजेक्ट/g, 'Superstore sales performance project'],
  [/सुपरस्टोर/g, 'Superstore'],
  [/प्रोजेक्ट/g, 'project'],
  [/बिक्री/g, 'bikri'],
  [/मुनाफा/g, 'munafa'],
  [/लाभ/g, 'laabh'],
  [/ग्राहक व्यवहार/g, 'grahak vyavahaar'],
  [/ग्राहक/g, 'grahak'],
  [/आरएफएम सेगमेंटेशन/g, 'RFM segmentation'],
  [/सेगमेंटेशन/g, 'segmentation'],
  [/अल्फिडो टेक/g, 'Alfido Tech'],
  [/इंटर्न/g, 'intern'],
  [/सर्टिफिकेट्स/g, 'certificates'],
  [/सर्टिफिकेट/g, 'certificate'],
  [/प्रमाणपत्र/g, 'pramaan patra'],
  [/संपर्क एवं हायरिंग/g, 'sampark evam hiring'],
  [/संपर्क/g, 'sampark'],
  [/हायरिंग/g, 'hiring'],
  [/ईमेल/g, 'email'],
  [/व्हाट्सएप/g, 'WhatsApp'],
  [/स्थान/g, 'sthaan'],
  [/नोएडा/g, 'Noida'],
  [/दिल्ली एनसीआर/g, 'Delhi NCR'],
  [/भारत/g, 'Bharat'],
  [/भाषा बदलकर हिंदी कर दी गई है/g, 'bhaasha badal kar Hindi kar di gayi hai'],
  [/पोर्टफोलियो के बारे में आप क्या जानना चाहते हैं/g, 'portfolio ke baare me aap kya jaan-na chaahte hain'],
  [/पोर्टफोलियो/g, 'portfolio'],
  [/बातचीत इतिहास साफ कर दिया गया है/g, 'baat-cheet itihaas saaf kar diya gaya hai'],
  [/सुन रहा हूँ... कृपया अपना प्रश्न बोलें/g, 'sun raha hoon... kripya apna prashna bolein']
];

// Devanagari to Phonetic Latin transliterator (for fallback when OS lacks native Hindi voice)
function devanagariToPhonetic(text) {
  if (!text) return '';

  let converted = text;
  // First apply clean dictionary mappings for key terms
  for (const [pattern, replacement] of hindiPhoneticReplacements) {
    converted = converted.replace(pattern, replacement);
  }

  const charMap = {
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ऋ': 'ri',
    'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'an', 'अः': 'ah',
    'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
    'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
    'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
    'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
    'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
    'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
    'ड़': 'd', 'ढ़': 'dh', 'ज़': 'z', 'फ़': 'f', 'क़': 'q', 'ख़': 'kh', 'ग़': 'gh'
  };
  const matraMap = {
    'ा': 'aa', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'ृ': 'ri',
    'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'n', 'ँ': 'n', 'ः': 'h'
  };
  const virama = '्';
  const consonants = 'कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसहड़ढ़ज़फ़क़ख़ग़';

  let result = '';
  for (let i = 0; i < converted.length; i++) {
    const c = converted[i];
    const next = converted[i + 1];

    if (charMap[c]) {
      result += charMap[c];
      if (consonants.includes(c)) {
        if (!next || (!matraMap[next] && next !== virama && consonants.includes(next))) {
          result += 'a';
        }
      }
    } else if (matraMap[c]) {
      result += matraMap[c];
    } else if (c === virama) {
      // virama suppresses inherent vowel
    } else {
      result += c;
    }
  }
  return result.replace(/\s+/g, ' ').trim();
}

function getBestVoiceProfile(langCode, gender) {
  if (!('speechSynthesis' in window)) {
    return { voice: null, pitch: gender === 'male' ? 0.85 : 1.18, rate: 0.96, isPhoneticFallback: false };
  }

  refreshSystemVoices();
  const voices = (cachedSystemVoices && cachedSystemVoices.length > 0) ? cachedSystemVoices : window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) {
    return { voice: null, pitch: gender === 'male' ? 0.85 : 1.18, rate: 0.96, isPhoneticFallback: false };
  }

  const langPrefix = langCode.toLowerCase().split('-')[0];

  // --- SPECIAL HANDLING FOR HINDI (Exclusively Native Female Voice Aria) ---
  if (langPrefix === 'hi') {
    const hiVoices = voices.filter(v => {
      const l = (v.lang || '').toLowerCase();
      const n = (v.name || '').toLowerCase();
      return l.startsWith('hi') || l.includes('-hi') || l.includes('_hi') || n.includes('hindi') || n.includes('हिन्दी');
    });

    if (hiVoices.length > 0) {
      const femaleHiKeywords = ['google', 'swara', 'kalpana', 'neerja', 'anjali', 'aditi', 'priya', 'female', 'mahila', 'woman', 'girl', 'standard-a', 'wavenet-a', 'neural-a'];
      const femaleVoice = hiVoices.find(v => femaleHiKeywords.some(k => (v.name || '').toLowerCase().includes(k))) || hiVoices[0];
      return { voice: femaleVoice, pitch: 1.05, rate: 1.0, isPhoneticFallback: false };
    } else {
      const enVoices = voices.filter(v => (v.lang || '').toLowerCase().startsWith('en'));
      const enFemale = enVoices.find(v => femaleVoiceKeywords.some(k => (v.name || '').toLowerCase().includes(k))) || enVoices[0] || voices[0];
      return { voice: enFemale, pitch: 1.15, rate: 1.0, isPhoneticFallback: true };
    }
  }

  // --- HANDLING FOR ENGLISH, SPANISH, FRENCH, GERMAN ---
  const langVoices = voices.filter(v => (v.lang || '').toLowerCase().startsWith(langPrefix));

  if (gender === 'male') {
    let matched = langVoices.find(v => maleVoiceKeywords.some(k => (v.name || '').toLowerCase().includes(k)));
    if (matched) {
      return { voice: matched, pitch: 0.85, rate: 0.96, isPhoneticFallback: false };
    }
    matched = langVoices.find(v => !femaleVoiceKeywords.some(k => (v.name || '').toLowerCase().includes(k)));
    if (matched) {
      return { voice: matched, pitch: 0.82, rate: 0.94, isPhoneticFallback: false };
    }
    if (langVoices.length > 0) {
      return { voice: langVoices[0], pitch: 0.80, rate: 0.92, isPhoneticFallback: false };
    }
    const enVoices = voices.filter(v => (v.lang || '').toLowerCase().startsWith('en'));
    matched = enVoices.find(v => maleVoiceKeywords.some(k => (v.name || '').toLowerCase().includes(k)));
    return { voice: matched || voices[0], pitch: 0.85, rate: 0.95, isPhoneticFallback: false };
  } else {
    let matched = langVoices.find(v => femaleVoiceKeywords.some(k => (v.name || '').toLowerCase().includes(k)));
    if (matched) {
      return { voice: matched, pitch: 1.18, rate: 1.02, isPhoneticFallback: false };
    }
    matched = langVoices.find(v => !maleVoiceKeywords.some(k => (v.name || '').toLowerCase().includes(k)));
    if (matched) {
      return { voice: matched, pitch: 1.18, rate: 1.02, isPhoneticFallback: false };
    }
    if (langVoices.length > 0) {
      return { voice: langVoices[0], pitch: 1.25, rate: 1.02, isPhoneticFallback: false };
    }
    const enVoices = voices.filter(v => (v.lang || '').toLowerCase().startsWith('en'));
    matched = enVoices.find(v => femaleVoiceKeywords.some(k => (v.name || '').toLowerCase().includes(k)));
    return { voice: matched || voices[0], pitch: 1.20, rate: 1.02, isPhoneticFallback: false };
  }
}

// 4. Speak Aloud with Selected Voice & Cadence
function speakWithAria(text) {
  if (!('speechSynthesis' in window) || !isVoiceActive) return;

  try {
    window.speechSynthesis.cancel();
  } catch (e) {}

  // Small delay prevents Chromium drop/deadlock on rapid cancel -> speak
  setTimeout(() => {
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      let cleanSpeech = text
        .replace(/<[^>]*>/g, ' ')
        .replace(/[*_#`~•]/g, ' ')
        .replace(/https?:\/\/\S+/g, 'link provided in chat')
        .replace(/\+91\s*8210916738/g, 'plus 9 1, 8 2 1 0 9 1 6 7 3 8')
        .replace(/\$([0-9.]+)([MK])/g, '$$$1 $2')
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanSpeech) return;

      const profile = getBestVoiceProfile(currentAiLanguage, currentVoiceGender);

      // If no native Hindi voice exists on this machine, transliterate to phonetic Latin
      // so English SAPI voices (like Microsoft David) can speak Hindi fluently without staying silent
      if (profile.isPhoneticFallback && currentAiLanguage === 'hi') {
        cleanSpeech = devanagariToPhonetic(cleanSpeech);
      }

      const utterance = new SpeechSynthesisUtterance(cleanSpeech);
      if (profile.voice) {
        utterance.voice = profile.voice;
        utterance.lang = profile.voice.lang || (profile.isPhoneticFallback ? 'en-US' : (langLocaleMap[currentAiLanguage] || 'en-US'));
      } else {
        utterance.lang = langLocaleMap[currentAiLanguage] || 'en-US';
      }
      utterance.pitch = profile.pitch;
      utterance.rate = profile.rate;

      utterance.onstart = () => {
        isVoiceSpeaking = true;
        updateSpeakingStateUI(true);
      };
      utterance.onend = () => {
        isVoiceSpeaking = false;
        updateSpeakingStateUI(false);
      };
      utterance.onerror = (err) => {
        console.warn('Speech synthesis utterance error:', err);
        isVoiceSpeaking = false;
        updateSpeakingStateUI(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis invocation warning:', err);
      isVoiceSpeaking = false;
      updateSpeakingStateUI(false);
    }
  }, 70);
}

window.stopSpeaking = function() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  isVoiceSpeaking = false;
  updateSpeakingStateUI(false);
};

function updateSpeakingStateUI(speaking) {
  const banner = document.getElementById('speaking-banner');
  const soundwave = document.getElementById('soundwave-container');
  const voiceIcon = document.getElementById('voice-icon');

  if (banner) {
    if (speaking) {
      banner.classList.remove('hidden');
    } else {
      banner.classList.add('hidden');
    }
  }

  if (soundwave && voiceIcon) {
    if (speaking) {
      soundwave.classList.remove('hidden');
      soundwave.classList.add('flex');
      voiceIcon.classList.add('hidden');
    } else {
      soundwave.classList.add('hidden');
      soundwave.classList.remove('flex');
      voiceIcon.classList.remove('hidden');
    }
  }
}

window.toggleVoiceSpeech = function() {
  isVoiceActive = !isVoiceActive;
  const vBtn = document.getElementById('voice-toggle-btn');
  const vIcon = document.getElementById('voice-icon');

  if (!isVoiceActive) {
    stopSpeaking();
    if (vBtn) vBtn.classList.add('text-slate-500', 'border-slate-800');
    if (vIcon) vIcon.setAttribute('data-lucide', 'volume-x');
    showToast('Voice Muted');
  } else {
    if (vBtn) vBtn.classList.remove('text-slate-500', 'border-slate-800');
    if (vIcon) vIcon.setAttribute('data-lucide', 'volume-2');
    showToast(`Voice Active (${currentVoiceGender === 'female' ? 'Aria Female' : 'Alex Male'})`);
  }
  if (window.lucide) window.lucide.createIcons();
};

window.speakMessageText = function(btn) {
  const container = btn.closest('.flex-1');
  if (!container) return;
  const paragraphs = container.querySelectorAll('p, li');
  let fullText = '';
  paragraphs.forEach(p => fullText += ' ' + p.textContent);
  if (fullText) {
    speakWithAria(fullText);
  }
};

// 5. Speech-to-Text Microphone Dictation (Respects Current Language)
function initSpeechToText() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    const micBtn = document.getElementById('mic-btn');
    if (micBtn) micBtn.title = 'Speech-to-text not supported by this browser';
    return;
  }

  speechRecognitionInstance = new SpeechRec();
  speechRecognitionInstance.lang = langLocaleMap[currentAiLanguage] || 'en-US';
  speechRecognitionInstance.interimResults = false;
  speechRecognitionInstance.maxAlternatives = 1;

  speechRecognitionInstance.onstart = () => {
    isRecordingMic = true;
    const micBtn = document.getElementById('mic-btn');
    if (micBtn) {
      micBtn.classList.add('bg-rose-500/20', 'border-rose-500', 'text-rose-400', 'animate-pulse');
    }
    const prompts = {
      'en': 'Listening... Speak your query now.',
      'hi': 'सुन रहा हूँ... कृपया अपना प्रश्न बोलें।',
      'bho': 'सुन रहल बानी... अब अपन सवाल बोलीं।',
      'es': 'Escuchando... Di tu pregunta ahora.',
      'fr': 'À l\'écoute... Posez votre question maintenant.',
      'de': 'Ich höre zu... Stellen Sie jetzt Ihre Frage.'
    };
    showToast(prompts[currentAiLanguage] || prompts['en']);
  };

  speechRecognitionInstance.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const input = document.getElementById('ai-query-input');
    if (input) {
      input.value = transcript;
      submitAiQuery();
    }
  };

  speechRecognitionInstance.onend = () => {
    isRecordingMic = false;
    const micBtn = document.getElementById('mic-btn');
    if (micBtn) {
      micBtn.classList.remove('bg-rose-500/20', 'border-rose-500', 'text-rose-400', 'animate-pulse');
    }
  };

  speechRecognitionInstance.onerror = () => {
    isRecordingMic = false;
    const micBtn = document.getElementById('mic-btn');
    if (micBtn) {
      micBtn.classList.remove('bg-rose-500/20', 'border-rose-500', 'text-rose-400', 'animate-pulse');
    }
  };
}

window.toggleSpeechRecognition = function() {
  if (!speechRecognitionInstance) {
    initSpeechToText();
  }
  if (!speechRecognitionInstance) {
    showToast('Speech dictation is not supported by your browser.');
    return;
  }

  // Ensure current language is set on speech recognition instance
  speechRecognitionInstance.lang = currentAiLanguage === 'bho' ? 'hi-IN' : (langLocaleMap[currentAiLanguage] || 'en-US');

  if (isRecordingMic) {
    speechRecognitionInstance.stop();
  } else {
    try {
      speechRecognitionInstance.start();
    } catch (e) {
      speechRecognitionInstance.stop();
    }
  }
};

// 6. Chat Dialog Window Toggles & Actions
window.toggleAiChat = function() {
  const chatWindow = document.getElementById('ai-chat-window');
  if (!chatWindow) return;

  const isHidden = chatWindow.classList.contains('hidden');
  if (isHidden) {
    chatWindow.classList.remove('hidden');
    const input = document.getElementById('ai-query-input');
    if (input) setTimeout(() => input.focus(), 150);
  } else {
    chatWindow.classList.add('hidden');
    stopSpeaking();
  }
};

window.clearAiChat = function() {
  stopSpeaking();
  const messages = document.getElementById('ai-messages');
  if (!messages) return;

  const currentAssistantName = currentVoiceGender === 'female' ? 'Aria' : 'Alex';
  const resetTexts = {
    'en': `Chat history cleared. How else may I assist you with Rohit Kumar's portfolio?`,
    'hi': `बातचीत इतिहास साफ कर दिया गया है। मैं रोहित कुमार के बारे में आपकी क्या सहायता कर सकता हूँ?`,
    'bho': `बातचीत के इतिहास साफ हो गइल बा। हम रोहित कुमार के बारे में रउआ खातिर अउरी का मदद कर सकीं?`,
    'es': `Historial de chat borrado. ¿En qué más puedo ayudarte sobre Rohit Kumar?`,
    'fr': `Historique effacé. Comment puis-je vous aider au sujet de Rohit Kumar ?`,
    'de': `Chat-Verlauf gelöscht. Wie kann ich Ihnen bei Rohit Kumars Portfolio weiterhelfen?`
  };

  messages.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
        <i data-lucide="bot" class="w-4 h-4"></i>
      </div>
      <div class="flex-1 bg-slate-900/85 border border-slate-800 rounded-2xl rounded-tl-sm p-4 space-y-2 text-slate-200 shadow-sm">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-bold text-cyan-400">${currentAssistantName}</span>
          <button onclick="speakMessageText(this)" class="text-slate-400 hover:text-cyan-400 text-xs inline-flex items-center gap-1 transition-colors" title="Listen with Audio">
            <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
            <span class="text-[10px] font-mono">Speak</span>
          </button>
        </div>
        <p class="text-xs sm:text-[13px] leading-relaxed">
          ${resetTexts[currentAiLanguage] || resetTexts['en']}
        </p>
      </div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();
  showToast('Chat history cleared');
};

window.handleAiInputKey = function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    submitAiQuery();
  }
};

window.askAiPrompt = function(promptText) {
  const input = document.getElementById('ai-query-input');
  if (input) {
    input.value = promptText;
    submitAiQuery();
  }
};

window.submitAiQuery = function() {
  const input = document.getElementById('ai-query-input');
  if (!input) return;
  const query = input.value.trim();
  if (!query) return;

  // Append user message
  appendUserMessage(query);
  input.value = '';

  // Show typing indicator
  showTypingIndicator();

  // Generate response after small natural delay
  setTimeout(() => {
    removeTypingIndicator();
    const response = generateAriaResponse(query, currentAiLanguage);
    appendAssistantMessage(response);
    speakWithAria(response);
  }, 450);
};

function appendUserMessage(text) {
  const container = document.getElementById('ai-messages');
  if (!container) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = 'flex items-start justify-end gap-2.5 animate-fade-in';
  msgDiv.innerHTML = `
    <div class="max-w-[85%] bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-md text-xs sm:text-[13px] leading-relaxed">
      ${escapeHtml(text)}
    </div>
    <div class="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 text-xs mt-0.5">
      <i data-lucide="user" class="w-3.5 h-3.5"></i>
    </div>
  `;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
  if (window.lucide) window.lucide.createIcons();
}

function showTypingIndicator() {
  const container = document.getElementById('ai-messages');
  if (!container) return;

  const typingDiv = document.createElement('div');
  typingDiv.id = 'ai-typing-indicator';
  typingDiv.className = 'flex items-start gap-3 animate-fade-in';
  typingDiv.innerHTML = `
    <div class="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
      <i data-lucide="bot" class="w-4 h-4"></i>
    </div>
    <div class="bg-slate-900/85 border border-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 text-slate-400 flex items-center gap-1.5">
      <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"></span>
      <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
      <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
    </div>
  `;
  container.appendChild(typingDiv);
  container.scrollTop = container.scrollHeight;
  if (window.lucide) window.lucide.createIcons();
}

function removeTypingIndicator() {
  const typing = document.getElementById('ai-typing-indicator');
  if (typing) typing.remove();
}

function appendAssistantMessage(htmlContent) {
  const container = document.getElementById('ai-messages');
  if (!container) return;

  const currentAssistantName = currentVoiceGender === 'female' ? 'Aria' : 'Alex';
  const badgeColor = currentVoiceGender === 'female' ? 'bg-violet-500' : 'bg-cyan-500';

  const msgDiv = document.createElement('div');
  msgDiv.className = 'flex items-start gap-3 animate-fade-in';
  msgDiv.innerHTML = `
    <div class="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
      <i data-lucide="bot" class="w-4 h-4"></i>
    </div>
    <div class="flex-1 bg-slate-900/85 border border-slate-800 rounded-2xl rounded-tl-sm p-4 space-y-2 text-slate-200 shadow-sm text-xs sm:text-[13px] leading-relaxed">
      <div class="flex items-center justify-between mb-1 pb-1 border-b border-slate-800/60">
        <span class="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
          <span>${currentAssistantName}</span>
          <span class="w-1.5 h-1.5 rounded-full ${badgeColor}"></span>
        </span>
        <button onclick="speakMessageText(this)" class="text-slate-400 hover:text-cyan-400 text-xs inline-flex items-center gap-1 transition-colors" title="Listen Aloud">
          <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
          <span class="text-[10px] font-mono">Speak</span>
        </button>
      </div>
      <div>
        ${htmlContent}
      </div>
    </div>
  `;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
  if (window.lucide) window.lucide.createIcons();
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// 7. Multilingual Knowledge Base Response Engine
function generateAriaResponse(query, lang = 'en') {
  const q = query.toLowerCase();

  // Helper for topic detection across languages
  const isSkills = q.includes('skill') || q.includes('stack') || q.includes('tool') || q.includes('python') || q.includes('sql') || q.includes('power bi') || q.includes('कौशल') || q.includes('habilidad') || q.includes('compétence') || q.includes('fähigkeit');
  const isSuperstore = q.includes('superstore') || q.includes('sales') || q.includes('profit') || q.includes('2.26') || q.includes('बिक्री') || q.includes('मुनाफा') || q.includes('venta') || q.includes('beneficio');
  const isRfm = q.includes('rfm') || q.includes('segment') || q.includes('customer') || q.includes('cohort') || q.includes('churn') || q.includes('loyal') || q.includes('ग्राहक') || q.includes('cliente');
  const isExperience = q.includes('experience') || q.includes('alfido') || q.includes('intern') || q.includes('job') || q.includes('work') || q.includes('अनुभव') || q.includes('काम') || q.includes('experiencia') || q.includes('expérience') || q.includes('erfahrung');
  const isCertifications = q.includes('certif') || q.includes('credential') || q.includes('google') || q.includes('ibm') || q.includes('bootcamp') || q.includes('launchpad') || q.includes('सर्टिफिकेट') || q.includes('प्रमाणपत्र') || q.includes('certificado') || q.includes('zertifikat');
  const isContact = q.includes('hire') || q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('whatsapp') || q.includes('reach') || q.includes('interview') || q.includes('available') || q.includes('संपर्क') || q.includes('हायर') || q.includes('contacto') || q.includes('kontakt');
  const isResume = q.includes('resume') || q.includes('cv') || q.includes('download') || q.includes('रिज्यूमे') || q.includes('currículum') || q.includes('lebenslauf');
  const isGreeting = q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('who are you') || q.includes('about rohit') || q.includes('नमस्ते') || q.includes('hola') || q.includes('bonjour') || q.includes('hallo');

  // --- HINDI RESPONSES ---
  if (lang === 'hi') {
    if (isSkills) {
      return `
        <p class="font-semibold text-white mb-1.5">रोहित कुमार का मुख्य तकनीकी कौशल:</p>
        <ul class="space-y-1 text-slate-300">
          <li>• <strong class="text-cyan-300">पायथन (Python):</strong> Pandas, NumPy, Scikit-Learn, डेटा क्लीनिंग और ईटीएल (ETL) पाइपलाइन्स।</li>
          <li>• <strong class="text-cyan-300">एसक्यूएल (SQL):</strong> कॉम्प्लेक्स जॉइन्स (Joins), सीटीई (CTEs), विंडो फंक्शंस और डेटाबेस आर्किटेक्चर।</li>
          <li>• <strong class="text-cyan-300">बिजनेस इंटेलिजेंस:</strong> पावर बीआई (Power BI) और टेबल्यू (Tableau) में एग्जीक्यूटिव डैशबोर्ड्स।</li>
          <li>• <strong class="text-cyan-300">एक्सेल (Excel):</strong> पिवट टेबल्स, एडवांस फॉर्मूले और सांख्यिकीय मॉडलिंग।</li>
        </ul>
        <p class="mt-2 text-slate-400 text-[11px]">आप प्रोजेक्ट्स सेक्शन में लाइव डैशबोर्ड्स देख सकते हैं!</p>
      `;
    }
    if (isSuperstore) {
      return `
        <p class="font-semibold text-white mb-1.5">सुपरस्टोर सेल्स परफॉरमेंस प्रोजेक्ट:</p>
        <ul class="space-y-1 text-slate-300">
          <li>• 50,000+ ट्रांजेक्शन रिकॉर्ड्स का विश्लेषण कर <strong class="text-emerald-400">$2.26M बिक्री</strong> और 10% प्रॉफिट मार्जिन ($226K लाभ) दर्ज किया।</li>
          <li>• <strong class="text-cyan-300">वेस्ट रीजन (West):</strong> सबसे बड़ा प्रॉफिट सेंटर साबित हुआ ($0.71M बिक्री, $71K लाभ)।</li>
        </ul>
        <p class="mt-2 text-cyan-300 text-[11px]">GitHub और LinkedIn लिंक प्रोजेक्ट्स सेक्शन में उपलब्ध हैं।</p>
      `;
    }
    if (isRfm) {
      return `
        <p class="font-semibold text-white mb-1.5">ग्राहक व्यवहार और आरएफएम (RFM) सेगमेंटेशन:</p>
        <ul class="space-y-1 text-slate-300">
          <li>• 50,000 ग्राहकों और 250,000 ऑर्डर्स ($681M रेवेन्यू) का विश्लेषण किया गया।</li>
          <li>• <strong class="text-emerald-400">18% चैंपियंस</strong> और <strong class="text-cyan-300">26% लॉयल ग्राहक</strong> वर्गीकृत किए गए।</li>
          <li>• <strong class="text-rose-400">20% चर्न सेगमेंट</strong> की पहचान कर कस्टमर रिटेंशन रणनीति तैयार की गई।</li>
        </ul>
      `;
    }
    if (isExperience) {
      return `
        <p class="font-semibold text-white mb-1.5">अल्फिडो टेक (Alfido Tech) — डेटा एनालिस्ट इंटर्न:</p>
        <ul class="space-y-1 text-slate-300">
          <li>• 2 बिज़नेस डेटासेट्स के लिए स्वचालित एंड-टू-एंड डेटा पाइपलाइन्स बनाई।</li>
          <li>• 50,000+ रिकॉर्ड्स को पायथन (Pandas, NumPy) द्वारा क्लीन और ट्रांसफॉर्म किया।</li>
          <li>• प्रमुख केपीआई (KPI) ट्रैक करने हेतु पावर बीआई में 2+ इंटरएक्टिव डैशबोर्ड्स बनाए।</li>
        </ul>
        <div class="mt-2 pt-2 border-t border-slate-800">
          <a href="https://drive.google.com/file/d/1Nph_YHfDdMyU8ZSmQ7YWye-nCRompt_M/view?usp=drive_link" target="_blank" class="text-cyan-300 text-xs underline">📄 सत्यापित इंटर्नशिप सर्टिफिकेट पीडीएफ देखें ↗</a>
        </div>
      `;
    }
    if (isCertifications) {
      return `
        <p class="font-semibold text-white mb-1.5">रोहित के पास 6 सत्यापित प्रमाणपत्र हैं:</p>
        <ul class="space-y-1 text-slate-300">
          <li>1. Google Data Analytics (Coursera)</li>
          <li>2. IBM Machine Learning</li>
          <li>3. AI/ML Launchpad Bootcamp</li>
          <li>4. SQL Foundations (Coursera)</li>
          <li>5. Python Programming (Infosys)</li>
          <li>6. Advanced IoT (IIMT)</li>
        </ul>
      `;
    }
    if (isContact) {
      return `
        <p class="font-semibold text-white mb-1.5">रोहित कुमार से संपर्क एवं हायरिंग विवरण:</p>
        <ul class="space-y-1 text-slate-300">
          <li>📧 ईमेल: <strong class="text-cyan-400">raj079851@gmail.com</strong></li>
          <li>💬 व्हाट्सएप: <strong class="text-emerald-400">+91 8210916738</strong></li>
          <li>📍 स्थान: नोएडा / दिल्ली एनसीआर, भारत</li>
        </ul>
        <p class="mt-2 text-slate-400 text-xs">रोहित फुल-टाइम डेटा एनालिस्ट और मशीन लर्निंग रोल्स के लिए तुरंत उपलब्ध हैं।</p>
      `;
    }
    if (isGreeting) {
      return `
        <p class="font-semibold text-white mb-1">नमस्ते! मैं रोहित कुमार का एआई सहायक हूँ।</p>
        <p>रोहित डेटा एनालिस्ट हैं जो पायथन, एसक्यूएल और पावर बीआई द्वारा डेटा इनसाइट्स और स्वचालित पाइपलाइन्स तैयार करते हैं। आप मुझसे उनके कौशल, प्रोजेक्ट्स या इंटर्नशिप के बारे में पूछ सकते हैं!</p>
      `;
    }
    return `
      <p class="font-semibold text-white mb-1">मैं आपकी सहायता के लिए तैयार हूँ!</p>
      <p>आप मुझसे रोहित के <strong class="text-cyan-300">कौशल</strong>, <strong class="text-cyan-300">सुपरस्टोर प्रोजेक्ट</strong>, <strong class="text-cyan-300">आरएफएम सेगमेंटेशन</strong>, या <strong class="text-emerald-400">संपर्क विवरण</strong> के बारे में पूछ सकते हैं।</p>
    `;
  }


  // --- SPANISH RESPONSES ---
  if (lang === 'es') {
    if (isSkills) {
      return `
        <p class="font-semibold text-white mb-1.5">Habilidades Técnicas de Rohit Kumar:</p>
        <ul class="space-y-1 text-slate-300">
          <li>• <strong class="text-cyan-300">Python:</strong> Pandas, NumPy, Scikit-Learn y automatización de pipelines ETL.</li>
          <li>• <strong class="text-cyan-300">SQL:</strong> Consultas complejas, CTEs, subconsultas y modelado de bases de datos.</li>
          <li>• <strong class="text-cyan-300">Power BI & Tableau:</strong> Dashboards ejecutivos interactivos y métricas KPI.</li>
          <li>• <strong class="text-cyan-300">Machine Learning:</strong> Segmentación de clientes RFM y análisis predictivo.</li>
        </ul>
      `;
    }
    if (isSuperstore) {
      return `
        <p class="font-semibold text-white mb-1.5">Proyecto de Ventas Superstore:</p>
        <p>Rohit analizó más de 50.000 transacciones, reportando <strong class="text-emerald-400">$2.26M en ventas</strong> y un margen de beneficio del <strong class="text-emerald-400">10.0%</strong> ($226.2K beneficio).</p>
      `;
    }
    if (isContact) {
      return `
        <p class="font-semibold text-white mb-1.5">Contacto y Contratación:</p>
        <ul class="space-y-1 text-slate-300">
          <li>📧 Email: <strong class="text-cyan-400">raj079851@gmail.com</strong></li>
          <li>💬 WhatsApp: <strong class="text-emerald-400">+91 8210916738</strong></li>
        </ul>
        <p class="mt-2 text-slate-400 text-xs">Disponible para oportunidades de Analista de Datos a tiempo completo.</p>
      `;
    }
    if (isGreeting) {
      return `
        <p class="font-semibold text-white mb-1">¡Hola! Soy el asistente de IA de Rohit Kumar.</p>
        <p>Rohit es un analista de datos especializado en Python, SQL y Power BI. ¡Pregúntame lo que desees sobre sus proyectos y experiencia!</p>
      `;
    }
    return `
      <p class="font-semibold text-white mb-1">¿En qué puedo ayudarte?</p>
      <p>Puedes preguntarme sobre las <strong class="text-cyan-300">habilidades</strong> de Rohit, sus proyectos de <strong class="text-cyan-300">Superstore</strong> o <strong class="text-emerald-400">cómo contactarlo</strong>.</p>
    `;
  }

  // --- FRENCH RESPONSES ---
  if (lang === 'fr') {
    if (isSkills) {
      return `
        <p class="font-semibold text-white mb-1.5">Compétences Techniques de Rohit Kumar :</p>
        <ul class="space-y-1 text-slate-300">
          <li>• <strong class="text-cyan-300">Python :</strong> Pandas, NumPy, Scikit-Learn et pipelines ETL automatisés.</li>
          <li>• <strong class="text-cyan-300">SQL :</strong> Requêtes avancées, jointures complexes, CTEs et fenêtrage.</li>
          <li>• <strong class="text-cyan-300">Power BI & Tableau :</strong> Tableaux de bord exécutifs interactifs et suivi des KPIs.</li>
          <li>• <strong class="text-cyan-300">Machine Learning :</strong> Segmentation client RFM et analyses prédictives.</li>
        </ul>
      `;
    }
    if (isContact) {
      return `
        <p class="font-semibold text-white mb-1.5">Contacter & Recruter Rohit :</p>
        <ul class="space-y-1 text-slate-300">
          <li>📧 E-mail : <strong class="text-cyan-400">raj079851@gmail.com</strong></li>
          <li>💬 WhatsApp : <strong class="text-emerald-400">+91 8210916738</strong></li>
        </ul>
        <p class="mt-2 text-slate-400 text-xs">Disponible immédiatement pour des postes d'analyste de données à temps plein.</p>
      `;
    }
    if (isGreeting) {
      return `
        <p class="font-semibold text-white mb-1">Bonjour ! Je suis l'assistant IA de Rohit Kumar.</p>
        <p>Rohit est un analyste de données expert en Python, SQL et Power BI. Posez-moi vos questions sur ses projets ou son parcours !</p>
      `;
    }
    return `
      <p class="font-semibold text-white mb-1">Comment puis-je vous renseigner ?</p>
      <p>Vous pouvez m'interroger sur les <strong class="text-cyan-300">compétences</strong> de Rohit, ses projets <strong class="text-cyan-300">Superstore / RFM</strong> ou <strong class="text-emerald-400">comment le recruter</strong>.</p>
    `;
  }

  // --- GERMAN RESPONSES ---
  if (lang === 'de') {
    if (isSkills) {
      return `
        <p class="font-semibold text-white mb-1.5">Technische Fähigkeiten von Rohit Kumar:</p>
        <ul class="space-y-1 text-slate-300">
          <li>• <strong class="text-cyan-300">Python:</strong> Pandas, NumPy, Scikit-Learn und ETL-Pipeline-Automatisierung.</li>
          <li>• <strong class="text-cyan-300">SQL:</strong> Komplexe Abfragen, CTEs, Joins und Datenbank-Architektur.</li>
          <li>• <strong class="text-cyan-300">Power BI & Tableau:</strong> Interaktive Executive-Dashboards und KPI-Monitoring.</li>
          <li>• <strong class="text-cyan-300">Machine Learning:</strong> RFM-Kundensegmentierung und prädiktive Modelle.</li>
        </ul>
      `;
    }
    if (isContact) {
      return `
        <p class="font-semibold text-white mb-1.5">Kontakt & Einstellung:</p>
        <ul class="space-y-1 text-slate-300">
          <li>📧 E-Mail: <strong class="text-cyan-400">raj079851@gmail.com</strong></li>
          <li>💬 WhatsApp: <strong class="text-emerald-400">+91 8210916738</strong></li>
        </ul>
        <p class="mt-2 text-slate-400 text-xs">Offen für Vollzeitstellen als Data Analyst und BI-Entwickler.</p>
      `;
    }
    if (isGreeting) {
      return `
        <p class="font-semibold text-white mb-1">Hallo! Ich bin der KI-Assistent von Rohit Kumar.</p>
        <p>Rohit ist ein Datenanalyst mit Schwerpunkt auf Python, SQL und Power BI. Fragen Sie mich gerne nach seinen Projekten und Qualifikationen!</p>
      `;
    }
    return `
      <p class="font-semibold text-white mb-1">Wie kann ich Ihnen weiterhelfen?</p>
      <p>Fragen Sie nach Rohits <strong class="text-cyan-300">Fähigkeiten</strong>, seinen <strong class="text-cyan-300">Projekten</strong> oder nach <strong class="text-emerald-400">Kontaktmöglichkeiten</strong>.</p>
    `;
  }

  // --- DEFAULT: ENGLISH RESPONSES ---
  if (isSkills) {
    return `
      <p class="font-semibold text-white mb-1.5">Here is Rohit's Core Technical Stack:</p>
      <ul class="space-y-1 text-slate-300">
        <li>• <strong class="text-cyan-300">Python:</strong> Pandas, NumPy, Scikit-Learn, data wrangling & ETL automation.</li>
        <li>• <strong class="text-cyan-300">SQL:</strong> Complex joins, subqueries, CTEs, window functions, and database schema design.</li>
        <li>• <strong class="text-cyan-300">Business Intelligence:</strong> Power BI (DAX, executive KPI dashboards) & Tableau.</li>
        <li>• <strong class="text-cyan-300">Spreadsheets:</strong> Advanced Excel, Pivot Tables, VLOOKUP/XLOOKUP, and statistical modeling.</li>
        <li>• <strong class="text-cyan-300">Machine Learning:</strong> RFM Customer Segmentation, predictive churn analysis, and regression modeling.</li>
      </ul>
      <p class="mt-2 text-slate-400 text-[11px]">You can view live interactive project dashboards directly in the Projects section!</p>
    `;
  }

  if (isSuperstore) {
    return `
      <p class="font-semibold text-white mb-1.5">Superstore Sales Performance Project:</p>
      <p>Rohit analyzed a 50,000+ transaction enterprise retail dataset to uncover regional revenue trends and profitability leaks:</p>
      <ul class="space-y-1 text-slate-300 mt-1">
        <li>• <strong class="text-emerald-400">$2.26M</strong> Total Superstore Sales analyzed with an overall <strong class="text-emerald-400">10.0% profit margin</strong> ($226.2K profit).</li>
        <li>• <strong class="text-cyan-300">Top Performer:</strong> West Region generated <strong class="text-white">$0.71M sales</strong> and $71K profit.</li>
        <li>• <strong class="text-amber-400">Actionable Finding:</strong> Identified discount vulnerabilities in Central Furniture sub-categories.</li>
      </ul>
      <p class="mt-2 text-cyan-300 text-[11px]">
        🔗 Code & LinkedIn post links with glowing badges are available in the <a href="#projects" class="underline hover:text-white">Projects Section</a>!
      </p>
    `;
  }

  if (isRfm) {
    return `
      <p class="font-semibold text-white mb-1.5">Customer Behavior & RFM Segmentation:</p>
      <p>Rohit built a behavioral segmentation model classifying 50,000 customers across 250,000 transactions ($681M revenue scope):</p>
      <ul class="space-y-1 text-slate-300 mt-1">
        <li>• <strong class="text-emerald-400">Champions:</strong> 18% highest-value advocates.</li>
        <li>• <strong class="text-cyan-300">Loyal Customers:</strong> 26% consistent repeat buyers.</li>
        <li>• <strong class="text-blue-300">Potential Loyalists:</strong> 22% high-upsell candidates.</li>
        <li>• <strong class="text-rose-400">At-Risk Churn:</strong> 20.0% critical churn segment targeted with automated reactivation campaigns.</li>
        <li>• <strong class="text-slate-400">Hibernating:</strong> 14% low engagement profiles.</li>
      </ul>
      <p class="mt-2 text-cyan-300 text-[11px]">Explore the interactive cohort toggle in the <a href="#projects" class="underline hover:text-white">Projects Section</a>!</p>
    `;
  }

  if (isExperience) {
    return `
      <p class="font-semibold text-white mb-1.5">Alfido Tech — Data Analyst Intern:</p>
      <p class="text-cyan-400 text-xs font-mono mb-1">Aug 2026 – Sep 2026 • Verified Credential</p>
      <ul class="space-y-1 text-slate-300">
        <li>• <strong class="text-white">End-to-End Data Pipelines:</strong> Standardized 2 multi-variable business datasets, streamlining data flow and reporting consistency.</li>
        <li>• <strong class="text-white">Cleaned 50,000+ Records:</strong> Automated transformation and validation using Python (Pandas & NumPy).</li>
        <li>• <strong class="text-white">Executive BI Dashboards:</strong> Designed 2+ interactive Power BI dashboards monitoring critical sales and engagement KPIs.</li>
      </ul>
      <div class="mt-2 pt-2 border-t border-slate-800 flex items-center gap-2">
        <a href="https://drive.google.com/file/d/1Nph_YHfDdMyU8ZSmQ7YWye-nCRompt_M/view?usp=drive_link" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono hover:bg-cyan-500/20 transition-all">
          📄 View Verified Certificate PDF ↗
        </a>
      </div>
    `;
  }

  if (isCertifications) {
    return `
      <p class="font-semibold text-white mb-1.5">Rohit holds 6 Verified Professional Credentials:</p>
      <ul class="space-y-1.5 text-slate-300">
        <li>1. <strong class="text-cyan-300">Google Data Analytics</strong> (Coursera Professional Certificate)</li>
        <li>2. <strong class="text-violet-300">IBM Machine Learning</strong> (Supervised learning, classification & regression)</li>
        <li>3. <strong class="text-fuchsia-300">AI/ML Launchpad Bootcamp</strong> (Intensive AI model engineering)</li>
        <li>4. <strong class="text-emerald-300">SQL Foundations</strong> (Coursera - complex joins, CTEs, schema)</li>
        <li>5. <strong class="text-blue-300">Python Programming</strong> (Infosys Springboard - ETL pipelines & OOP)</li>
        <li>6. <strong class="text-amber-300">Advanced IoT</strong> (IIMT College of Engineering - sensor telemetry & edge logic)</li>
      </ul>
      <p class="mt-2 text-slate-400 text-[11px]">All certifications feature direct Google Drive PDF verification in the <a href="#certifications" class="underline hover:text-white">Certifications Section</a>.</p>
    `;
  }

  if (isContact) {
    return `
      <p class="font-semibold text-white mb-1.5">How to Contact & Hire Rohit Kumar:</p>
      <p>Rohit is <strong class="text-emerald-400">actively available</strong> for Full-time Data Analyst, Machine Learning, and BI Engineering roles:</p>
      <ul class="space-y-1.5 text-slate-300 mt-2">
        <li>📧 <strong class="text-white">Email:</strong> <button onclick="copyToClipboard('raj079851@gmail.com', 'Email copied!')" class="underline text-cyan-400 font-mono hover:text-white">raj079851@gmail.com</button></li>
        <li>💬 <strong class="text-white">WhatsApp:</strong> <a href="https://wa.me/918210916738" target="_blank" class="underline text-emerald-400 font-mono hover:text-white">+91 8210916738</a></li>
        <li>📍 <strong class="text-white">Location:</strong> Noida / Delhi NCR, India (open to remote & relocation)</li>
      </ul>
      <div class="mt-3 flex items-center gap-2">
        <a href="#contact" class="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-md">
          Open Hire Me Form
        </a>
      </div>
    `;
  }

  if (isResume) {
    return `
      <p class="font-semibold text-white mb-1.5">Rohit Kumar's Resume:</p>
      <p>You can preview Rohit's comprehensive 1-page Data Analyst resume right here in the modal or download a copy:</p>
      <div class="mt-3 flex items-center gap-2 flex-wrap">
        <button onclick="openResumeModal()" class="px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-xs hover:bg-cyan-500/30 transition-all">
          📄 Preview Resume PDF
        </button>
        <a href="./Resume.pdf" download="Rohit_Kumar_Resume.pdf" class="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-medium text-xs hover:bg-slate-700 transition-all">
          ⬇️ Download PDF
        </a>
      </div>
    `;
  }

  if (isGreeting) {
    const assistantName = currentVoiceGender === 'female' ? 'Aria' : 'Alex';
    return `
      <p class="font-semibold text-white mb-1">Hello! I'm ${assistantName}, Rohit Kumar's AI Assistant.</p>
      <p>Rohit is a data-driven <strong class="text-cyan-300">Data Analyst</strong> who specializes in transforming messy datasets into scalable SQL/Python pipelines, predictive RFM cohorts, and executive Power BI dashboards.</p>
      <p class="mt-2 text-slate-300">Feel free to ask me about his <span class="text-cyan-400 font-semibold">technical skills, Superstore Sales project, Alfido Tech internship, or how to hire him</span>!</p>
    `;
  }

  // DEFAULT / FALLBACK
  return `
    <p class="font-semibold text-white mb-1">I can certainly help you with that!</p>
    <p>Regarding Rohit Kumar, here are key areas you can explore:</p>
    <ul class="space-y-1 text-slate-300 mt-1.5">
      <li>• Ask about his <button onclick="askAiPrompt('What are Rohit\\'s technical skills?')" class="text-cyan-400 underline hover:text-white">core technical skills</button> (Python, SQL, Power BI, Excel).</li>
      <li>• Explore the <button onclick="askAiPrompt('Tell me about the Superstore Sales project')" class="text-cyan-400 underline hover:text-white">Superstore Sales</button> or <button onclick="askAiPrompt('Explain the RFM Segmentation project')" class="text-cyan-400 underline hover:text-white">RFM Segmentation</button> projects.</li>
      <li>• Ask about his <button onclick="askAiPrompt('What was Rohit\\'s role at Alfido Tech?')" class="text-cyan-400 underline hover:text-white">Alfido Tech internship</button> or <button onclick="askAiPrompt('What certifications does Rohit hold?')" class="text-cyan-400 underline hover:text-white">6 verified certifications</button>.</li>
      <li>• Or ask how to <button onclick="askAiPrompt('How can I contact or hire Rohit?')" class="text-emerald-400 underline hover:text-white">contact and hire him</button>!</li>
    </ul>
  `;
}



