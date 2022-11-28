// Cart Icon
(function refreshCart() {
  const cartIcon = document.querySelector('.link .cart-number');
  const cart = new Map(JSON.parse(window.localStorage.getItem('cart')));
  const cartSize = [...cart.values()].reduce((total, productInfo) => total + productInfo.quantity, 0);
  cartIcon.textContent = cartSize;
})()

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links li");

hamburger.addEventListener('click', () => {
  //Animate Links
  document.body.classList.toggle("hidden");
  navLinks.classList.toggle("open");
  links.forEach(link => {
    link.classList.toggle("fade");
  });

  //Hamburger Animation
  hamburger.classList.toggle("toggle");
});