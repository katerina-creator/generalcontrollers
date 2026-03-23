// =======================
// CONTACT FORM (EmailJS)
// =======================

function contactSubmit(event) {
  event.preventDefault();

  const form = event.target;

  // Инициализация EmailJS
  emailjs.init("S3_v4AnUAq7_M4_Ex");

  emailjs.send("service_65qz9bu", "template_yotcolw", {
    name: form.name.value,
    contact: form.contact.value,
    message: form.message.value
  })
    .then(() => {
      showMessage("✅ Заявка отправлена!");
      form.reset();
    })
    .catch((error) => {
      console.error("Ошибка:", error);
      showMessage("❌ Ошибка отправки", true);
    });

  return false;
}


// =======================
// TOAST MESSAGE
// =======================

function showMessage(text, isError = false) {
  const el = document.getElementById("form-message");

  if (!el) {
    console.error("❌ #form-message не найден");
    return;
  }

  el.textContent = text;
  el.classList.add("show");

  if (isError) {
    el.classList.add("error");
  } else {
    el.classList.remove("error");
  }

  setTimeout(() => {
    el.classList.remove("show");
  }, 3000);
}


// =======================
// INIT AFTER LOAD
// =======================

document.addEventListener('DOMContentLoaded', () => {

  // ТЕСТ уведомления (можешь удалить потом)
  showMessage("ТЕСТ");

  // Scroll reveal (твоя анимация)
  const io = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if (ent.isIntersecting) {
        ent.target.classList.add('show');
        io.unobserve(ent.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
});