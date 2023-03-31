'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Button scrolling
btnScrollTo.addEventListener('click', function (event) {
  event.preventDefault();
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page Navigation by event delegation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // matching strategy
  if (e.target.classList.contains('nav__link')) {
    const section = document.querySelector(e.target.getAttribute('href'));
    section.scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed component (operations)
tabsContainer.addEventListener('click', function (event) {
  const clicked = event.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // remove active classes for both tab and tab-content
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.getAttribute('data-tab')}`)
    .classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = function (event) {
  if (event.target.classList.contains('nav__link')) {
    const link = event.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
      logo.style.opacity = this;
    });
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky nav bar (header) (the low performance way)
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);
// window.addEventListener('scroll', function () {
//   console.log('scrolled!!!', window.scrollY);
//   if (this.window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// Sticky nav bar (header) using Intersection Observer API
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images
const imageTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  // the image target will emit load event after the image is loaded, so it is best that the blurred class is removed only after the original image is loaded
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imageTargets.forEach(img => imgObserver.observe(img));

// finally - the Sliders section now
const slider = function () {
  //
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let currSlide = 0;
  let totalSlides = slides.length;

  const createDots = function () {
    // console.log(`💎 dotContainer: `, dotContainer);
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}" />`
      );
    });
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
    // activate dot
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const init = function () {
    createDots();
    goToSlide(0);
  };
  init();

  // 0%, 100%, 200%, 300%
  // -100%, 0%, 100%, 200%
  // -200%, -100%, 0%, 100%
  // -300%, -200%, -100%, 0%
  // 0%, 100%, 200%, 300%

  const nextSlide = function () {
    if (currSlide === totalSlides - 1) currSlide = 0;
    else currSlide++;

    goToSlide(currSlide);
  };

  const previousSlide = function () {
    if (currSlide === 0) currSlide = totalSlides - 1;
    else currSlide--;

    goToSlide(currSlide);
  };

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', previousSlide);

  // making keyboard firing work for the slider
  document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') previousSlide();
    if (event.key === 'ArrowRight') nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      console.log(e.target);
      const { slide } = e.target.dataset;
      goToSlide(slide);
    }
  });
};
slider();

////////////////////////////////////////
/////////LEARNING-CODE//////////////////
////////////////////////////////////////

// Creating, inserting and removing elements
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.innerHTML = `We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>`;

// const header = document.querySelector('header');
// header.append(message);
// document
// .querySelector('.btn--close-cookie')
// .addEventListener('click', () => message.remove());

// Styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';
// message.style.height =
// Number.parseFloat(getComputedStyle(message).height, 10) + 20 + 'px';

// functions

// const handleH1MouseEnter = function (event) {
//   event.preventDefault();
//   console.log('handle h1 mouse enter called!');
//   // h1.removeEventListener('mouseenter', handleH1MouseEnter);
// };

// const h1 = document.querySelector('h1');

// h1.addEventListener('mouseenter', handleH1MouseEnter);

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   this.style.padding = `7px 20px 7px 20px`;
//   this.style.borderRadius = `15px`;
//   // console.log(e.target, e.currentTarget);
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   this.style.padding = `7px 20px 7px 20px`;
//   this.style.borderRadius = `15px`;
//   // console.log(e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   this.style.padding = `7px 20px 7px 20px`;
//   this.style.borderRadius = `15px`;
//   // console.log(e.target, e.currentTarget);
// });
// DOM traversing
// const h1 = document.querySelector('h1');

// // Going downwards: child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// // Going downwards: child
// // console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// // Going sideways: siblings
// console.log(h1.previousElementSibling)
// console.log(h1.nextElementSibling)

// lifecycle of DOM

// dom content loaded event

// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log('html parsed and dom tree built!', e);
// });

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);

//   e.returnValue = '';
// });

//Finish: 704 ms
// DOMContentLoaded: 415 ms
// Load: 680 ms

// Finish: 780 ms
// DOMContentLoaded: 448 ms
// Load: 752 ms
