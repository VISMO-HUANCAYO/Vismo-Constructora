// VISMO — navegación y galería
const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.header nav');
if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));
}
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

document.querySelectorAll('.project').forEach(project => {
  project.addEventListener('toggle', () => {
    if (!project.open) return;
    document.querySelectorAll('.project[open]').forEach(other => {
      if (other !== project) other.open = false;
    });
  });
});

(() => {
  const track = document.querySelector('.gallery-track');
  const viewport = document.querySelector('.gallery-viewport');
  const prev = document.querySelector('.gallery-prev');
  const next = document.querySelector('.gallery-next');
  const dots = document.querySelector('.gallery-dots');
  if (!track || !viewport || !prev || !next || !dots) return;
  let page = 0;
  const perPage = () => window.innerWidth <= 600 ? 2 : (window.innerWidth <= 900 ? 3 : 5);
  const pageCount = () => Math.max(1, Math.ceil(track.children.length / perPage()));
  function renderDots() {
    dots.innerHTML = '';
    for (let i=0; i<pageCount(); i++) {
      const b=document.createElement('button');
      b.type='button'; b.setAttribute('aria-label',`Ir al grupo ${i+1}`);
      if(i===page) b.classList.add('active');
      b.addEventListener('click',()=>{page=i;move();});
      dots.appendChild(b);
    }
  }
  function move() {
    const max=pageCount()-1;
    page=Math.max(0,Math.min(page,max));
    const first=track.children[0];
    if(!first) return;
    const gap=parseFloat(getComputedStyle(track).gap)||0;
    const step=(first.getBoundingClientRect().width+gap)*perPage();
    track.style.transform=`translate3d(-${page*step}px,0,0)`;
    renderDots();
  }
  next.addEventListener('click',()=>{page=(page+1)%pageCount();move();});
  prev.addEventListener('click',()=>{page=(page-1+pageCount())%pageCount();move();});
  window.addEventListener('resize',move);
  requestAnimationFrame(move);
})();
