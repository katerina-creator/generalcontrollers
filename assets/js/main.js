function contactSubmit(e){
  e.preventDefault();
  const form = e.currentTarget;
  const data = new FormData(form);
  // Minimal placeholder behaviour — replace with backend integration as needed
  alert('Спасибо! Сообщение отправлено.');
  form.reset();
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
