import './scss/style.scss'
import modal from './modules/modal';
import navigation from './modules/navigation';
import animation from './modules/animation';
import contactForm from './modules/contactForm';

window.addEventListener('DOMContentLoaded', () => {
  modal('.menu', '.hamburger', ['.menu__close', '.menu__link', '.menu__overlay'], '.promo__arrow'); // меню
  navigation();
  animation();
  contactForm();
});
