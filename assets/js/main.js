function contactSubmit(e){
  e.preventDefault();
  const form = e.currentTarget || e.target;
  const data = new FormData(form);
  const name = data.get('name') || '';
  const contact = data.get('contact') || data.get('email') || '';
  const message = data.get('message') || '';
  const lang = document.documentElement.lang || 'ru';
  const subject = encodeURIComponent((lang.startsWith('en')? 'Website contact: ':'Запрос с сайта: ') + (name || 'No name'));
  const bodyPlain = (lang.startsWith('en')? 'Name: ':'Имя: ') + name + '\n' + (lang.startsWith('en')? 'Contact: ':'Контакт: ') + contact + '\n\n' + message;
  const body = encodeURIComponent(bodyPlain);
  const mailto = 'mailto:info@generalcontrollers.com?subject=' + subject + '&body=' + body;
  // Try to open mail client; fallback to alert after short delay
  window.location.href = mailto;
  setTimeout(()=>{
    if(lang.startsWith('en')) alert('Thank you! We will contact you.');
    else alert('Спасибо! Мы свяжемся с вами.');
    form.reset();
  },700);
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
