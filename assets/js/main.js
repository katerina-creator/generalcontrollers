async function contactSubmit(e){
  e.preventDefault();
  const form = e.currentTarget || e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const statusEl = document.createElement('p');
  statusEl.style.marginTop = '12px';
  statusEl.style.fontSize = '14px';
  statusEl.style.textAlign = 'center';
  
  const lang = document.documentElement.lang || 'ru';
  const isEn = lang.startsWith('en');
  
  // Remove previous status message if exists
  const oldStatus = form.querySelector('[data-status-message]');
  if(oldStatus) oldStatus.remove();
  
  statusEl.setAttribute('data-status-message', '1');
  
  try {
    // Disable submit button
    if(submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.6';
      submitBtn.style.cursor = 'not-allowed';
    }
    
    const data = {
      name: form.querySelector('input[name="name"]').value || '',
      contact: form.querySelector('input[name="contact"]').value || '',
      message: form.querySelector('textarea[name="message"]').value || '',
      company: form.querySelector('input[name="company"]')?.value || ''
    };
    
    statusEl.textContent = isEn ? 'Sending...' : 'Отправка...';
    statusEl.style.color = 'var(--muted)';
    form.appendChild(statusEl);
    
    const API_BASE = window.CONTACT_API_URL || 'https://generalcontrollers-contact-api.up.railway.app';
    const response = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if(!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send');
    }
    
    statusEl.textContent = isEn ? 'Thank you! We will contact you.' : 'Спасибо! Мы свяжемся с вами.';
    statusEl.style.color = 'var(--accent)';
    form.reset();
    
  } catch(error) {
    statusEl.textContent = isEn ? 'Error. Please try again.' : 'Ошибка. Пожалуйста, попробуйте позже.';
    statusEl.style.color = '#d32f2f';
    console.error('Contact form error:', error);
  } finally {
    // Re-enable submit button
    if(submitBtn) {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.style.cursor = 'pointer';
    }
  }
  
  return false;
}

// Simple scroll reveal
document.addEventListener('DOMContentLoaded',()=>{
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(ent=>{
      if(ent.isIntersecting){ ent.target.classList.add('show'); io.unobserve(ent.target); }
    });
  },{threshold:0.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
});
