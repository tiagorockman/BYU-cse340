document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger-menu');
  const primaryNav = document.getElementById('primary-nav');
  
  if (hamburger) {
    hamburger.addEventListener('click', function() {
      primaryNav.classList.toggle('active');
      this.classList.toggle('active');
    });
  }
  
  document.addEventListener('click', function(event) {
    if (!primaryNav.contains(event.target) && !hamburger.contains(event.target) && primaryNav.classList.contains('active')) {
      primaryNav.classList.remove('active');
      hamburger.classList.remove('active');
    }
  });
});