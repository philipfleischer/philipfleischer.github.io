const sections = document.querySelectorAll('.section');
const controlsWrapper = document.querySelector('.controls');
const themeBtn = document.querySelector('.theme-btn');

function PageTransitions() {
  // Controls click
  if (controlsWrapper) {
    controlsWrapper.addEventListener('click', (e) => {
      const btn = e.target.closest('.control');
      if (!btn) return;

      const id = btn.dataset.id;
      if (!id) return;

      // Active button
      const current = document.querySelector('.active-btn');
      if (current) current.classList.remove('active-btn');
      btn.classList.add('active-btn');

      // Show correct section
      sections.forEach((section) => section.classList.remove('active'));
      const element = document.getElementById(id);
      if (element) element.classList.add('active');
    });
  }

  // Toggle theme
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
    });
  }
}

// EmailJS
if (window.emailjs) {
  emailjs.init('3K18TZ8aXoxyLCCBF');
} else {
  console.error('EmailJS not loaded');
}
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('success-message');

if (contactForm) {
  contactForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const btnText = submitBtn?.querySelector('.btn-text');

    if (submitBtn && btnText) {
      submitBtn.disabled = true;
      btnText.textContent = 'Sending...';
    }

    // Build form data
    const fromName = document.getElementById('name')?.value?.trim() || '';
    const fromEmail = document.getElementById('email')?.value?.trim() || '';
    const subject = document.getElementById('subject')?.value?.trim() || '';
    const message = document.getElementById('message')?.value?.trim() || '';

    const formData = {
      to_name: 'Philip Elias Fleischer',
      from_name: fromName,
      from_email: fromEmail,
      subject,
      message,
      reply_to: fromEmail,
    };

    try {
      await emailjs.send('service_x7hkxhk', 'template_4k960p8', formData);

      // Show success message on screen
      if (successMessage) {
        successMessage.classList.remove('hidden');
        setTimeout(() => successMessage.classList.add('hidden'), 5000);
      }

      contactForm.reset();
    } catch (err) {
      alert('Failed to send your message. Please try again in a moment.');
      console.error('EmailJS error:', err);
    } finally {
      if (submitBtn && btnText) {
        submitBtn.disabled = false;
        btnText.textContent = 'Send message';
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const autoScrollDetails = (detailsId) => {
    const details = document.querySelector(detailsId);
    if (!details) return;

    const summary = details.querySelector('summary');
    if (!summary) return;

    summary.addEventListener('click', () => {
      requestAnimationFrame(() => {
        details.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => window.scrollBy({ top: 80, behavior: 'smooth' }), 200);
      });
    });
  };

  autoScrollDetails('#other-projects');
  autoScrollDetails('#other-coursework');
});

PageTransitions();
