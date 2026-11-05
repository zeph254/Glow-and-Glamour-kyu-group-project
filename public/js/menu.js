/* ============================================
   Mobile Menu Toggle
   ============================================ */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const closeMenu = document.getElementById('close-menu');
const navItems = document.querySelectorAll('.nav-links a');

function toggleMenu() {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
  document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
}

hamburger.addEventListener('click', toggleMenu);
closeMenu.addEventListener('click', toggleMenu);

// Close menu when a link is clicked
navItems.forEach(item => {
  item.addEventListener('click', () => {
    if (navLinks.classList.contains('active')) {
      toggleMenu();
    }
  });
});