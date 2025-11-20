// Future interactivity can be added here
document.querySelector('.cv-btn').addEventListener('click', () => {
  alert('CV download triggered!');
});



// hero-content

  const roles = [
  "Software Developer",
  "Frontend Developer",
  "Full Stack Developer",
  "Web Developer",
  "Data Analyst"
];

let currentIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.querySelector(".typing");

function typeEffect() {
  const currentWord = roles[currentIndex];

  if (!isDeleting && charIndex < currentWord.length) {
    typingElement.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
    setTimeout(typeEffect, 120);
  } else if (isDeleting && charIndex > 0) {
    typingElement.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
    setTimeout(typeEffect, 60);
  } else {
    if (!isDeleting && charIndex === currentWord.length) {
      setTimeout(() => {
        isDeleting = true;
        typeEffect();
      }, 1200); // wait before deleting
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      currentIndex = (currentIndex + 1) % roles.length;
      setTimeout(typeEffect, 300); // short pause before next
    }
  }
}

typeEffect();





  //  Skills
// Animate skill bars on scroll
// Animate skill bars when they appear in view
window.addEventListener("scroll", () => {
  const fills = document.querySelectorAll(".fill");
  
  fills.forEach(fill => {
    const rect = fill.getBoundingClientRect();

    // Animate when bar is visible in viewport
    if (rect.top < window.innerHeight - 100) {
      const targetWidth = fill.getAttribute("data-width");
      fill.style.width = targetWidth + "%";
      fill.textContent = targetWidth + "%";
    }
  });
});




// contact.js
// Initialize EmailJS
// (function() {
//   emailjs.init("8jniiotQrGd4pvjv4");  // ← Your EmailJS public key
// })();

// // Form Submit Event
// document.getElementById("contactForm").addEventListener("submit", function (e) {
//   e.preventDefault();

//   emailjs.sendForm("service_czkm0wd", "template_hwu2def", this)
//     .then(function () {
//       alert("🎉 Thank you! Your message has been sent successfully.");
//       document.getElementById("contactForm").reset();
//     })
//     .catch(function (error) {
//       alert("❌ Failed to send message. Please try again.");
//       console.error("EmailJS Error:", error);
//     });
// });


// Replace the entire EmailJS block with this:

document.getElementById("contactForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const data = {
    first_name: form.first_name.value.trim(),
    last_name:  form.last_name.value.trim(),
    email:      form.email.value.trim(),
    phone:      form.phone.value.trim(),
    address:    form.address.value.trim(),
    message:    form.message.value.trim()
  };

  try {
    // adjust URL if your server runs on another port/origin
    // const res = await fetch('http://localhost:5000/api/contact', {
        const res = await fetch('https://divyanshu-portfolio-xzqo.onrender.com/api/contact', {

      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (res.ok && result.ok) {
      alert("🎉 Thank you! Your message has been saved.");
      form.reset();
    } else {
      alert("❌ Failed to submit: " + (result.error || 'Unknown error'));
    }
  } catch (err) {
    console.error('Fetch error:', err);
    alert("❌ Network error. Please try again later.");
  }
});








// scroll top btn
const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {    // lower value for testing
    scrollTopBtn.style.display = "flex";
  } else {
    scrollTopBtn.style.display = "none";
  }
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

