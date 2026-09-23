// MENÚ PARA CELULARES
const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.header nav');

menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.textContent = isOpen ? '✕' : '☰';
});

// Cierra el menú cuando se elige una sección.
navigation.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = '☰';
  });
});

// Mantiene actualizado el año del pie de página.
document.querySelector('#year').textContent = new Date().getFullYear();

// Permite tener abierto un solo proyecto a la vez.
document.querySelectorAll('.project').forEach(project => {
  project.addEventListener('toggle', () => {
    if (!project.open) return;
    document.querySelectorAll('.project[open]').forEach(other => {
      if (other !== project) other.open = false;
    });
  });
});
