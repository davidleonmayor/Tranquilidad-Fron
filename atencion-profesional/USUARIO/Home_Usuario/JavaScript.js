const servicesButton = document.getElementById('services-button');
const submenu = document.querySelector('.submenu');

servicesButton.addEventListener('click', () => {
  submenu.classList.toggle('show');
});

submenu.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    submenu.classList.remove('show');
  }
});

