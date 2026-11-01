/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
  navToggle = document.getElementById('nav-toggle'),
  navClose = document.getElementById('nav-close');

if (navToggle) navToggle.addEventListener('click', () => navMenu.classList.add('show-menu'));
if (navClose) navClose.addEventListener('click', () => navMenu.classList.remove('show-menu'));

/*=============== IMAGE GALLERY ===============*/
function imgGallery() {
  const mainImg = document.querySelector('.details__img'),
    smallImg = document.querySelectorAll('.details__small-img');

  smallImg.forEach((img) => {
    img.addEventListener('click', function () {
      mainImg.src = this.src;
    });
  });
}
imgGallery();

/*=============== SWIPER CATEGORIES ===============*/
var swiperCategories = new Swiper(".categories__container", {
  spaceBetween: 24,
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    350: { slidesPerView: 2, spaceBetween: 24 },
    768: { slidesPerView: 3, spaceBetween: 24 },
    992: { slidesPerView: 4, spaceBetween: 24 },
    1200:{ slidesPerView: 5, spaceBetween: 40 },
    1400:{ slidesPerView: 6, spaceBetween: 24 },
  },
});

/*=============== SWIPER PRODUCTS ===============*/
const swiperContainers = ['.new__container', '.offers__container'];
swiperContainers.forEach(selector => {
  new Swiper(selector, {
    spaceBetween: 24,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      768: { slidesPerView: 2, spaceBetween: 24 },
      992: { slidesPerView: 3, spaceBetween: 24 },
      1400:{ slidesPerView: 4, spaceBetween: 24 },
    },
  });
});

/*=============== PRODUCTS TABS ===============*/
const tabs = document.querySelectorAll('[data-target]'),
  tabContents = document.querySelectorAll('[content]');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const target = document.querySelector(tab.dataset.target);
    tabContents.forEach((tabContent) => tabContent.classList.remove('active-tab'));
    target.classList.add('active-tab');
    tabs.forEach((tab) => tab.classList.remove('active-tab'));
    tab.classList.add('active-tab');
  });
});

/*=============== CATEGORIES DROPDOWN ===============*/
document.addEventListener("DOMContentLoaded", function () {
  const dropdownBtn = document.getElementById("categoriesDropdownButton");
  const dropdownContainer = document.querySelector(".categories-dropdown__container");

  dropdownBtn.addEventListener("click", function () {
    dropdownContainer.classList.toggle("active");
  });

  document.addEventListener("click", function (event) {
    if (!dropdownContainer.contains(event.target)) {
      dropdownContainer.classList.remove("active");
    }
  });
});

/*=============== PRODUCT ID GENERATION ===============*/
function generateProductId(title, price, imgSrc) {
  const base = (imgSrc || '').split('/').pop() || 'noimg';
  return `${title.toLowerCase().replace(/\s+/g, '-')}-${String(price).replace(/[^\d.]/g, '')}-${base.toLowerCase().replace(/\W+/g, '')}`;
}

/*=============== COUNTER MANAGEMENT ===============*/
function initializeCounters() {
  if (!localStorage.getItem('cartCount')) localStorage.setItem('cartCount', '0');
  if (!localStorage.getItem('wishlistCount')) localStorage.setItem('wishlistCount', '0');
  if (!localStorage.getItem('cartItems')) localStorage.setItem('cartItems', JSON.stringify([]));
  if (!localStorage.getItem('wishlistItems')) localStorage.setItem('wishlistItems', JSON.stringify([]));
  updateHeaderCounts();
}

function updateHeaderCounts() {
  const cartCount = localStorage.getItem('cartCount') || '0';
  const wishlistCount = localStorage.getItem('wishlistCount') || '0';

  document.querySelectorAll('.header__action-btn[href="cart.html"] .count').forEach(el => {
    el.textContent = cartCount;
    el.style.display = cartCount === '0' ? 'none' : 'flex';
  });

  document.querySelectorAll('.header__action-btn[href="wishlist.html"] .count').forEach(el => {
    el.textContent = wishlistCount;
    el.style.display = wishlistCount === '0' ? 'none' : 'flex';
  });
}

/*=============== NOTIFICATION ===============*/
function showNotification(message, type = 'success') {
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => notification.remove());

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    border-radius: 8px;
    background: ${type === 'success' ? 'hsl(176,88%,27%)' : '#dc3545'};
    color: white;
    z-index: 10000;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    max-width: 400px;
    animation: slideInRight 0.3s ease forwards;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add keyframes for notification animation
if (!document.querySelector('#notification-styles')) {
  const style = document.createElement('style');
  style.id = 'notification-styles';
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

/*=============== PRODUCT DATA EXTRACTION ===============*/
function getProductData(productCard) {
  const title = productCard.querySelector('.product__title').textContent.trim();
  const priceText = productCard.querySelector('.new__price').textContent.trim();
  const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
  const oldPriceEl = productCard.querySelector('.old__price');
  const oldPrice = oldPriceEl ? parseFloat(oldPriceEl.textContent.replace(/[^\d.]/g, '')) : null;
  const category = productCard.querySelector('.product__category')?.textContent.trim() || '';
  const img = productCard.querySelector('.product__images img')?.src || 'assets/img/product-1-1.jpg';

  return {
    title,
    price,
    oldPrice,
    category,
    img,
    id: generateProductId(title, price, img)
  };
}

/*=============== INITIALIZE ===============*/
document.addEventListener('DOMContentLoaded', function() {
  initializeCounters();

  // Initialize page-specific managers
  if (document.querySelector('.cart') && typeof initializeCart === 'function') initializeCart();
  if (document.querySelector('.wishlist') && typeof initializeWishlist === 'function') initializeWishlist();

  // Wishlist buttons
  document.querySelectorAll('.action__btn[aria-label="Add To Wishlist"]').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const productCard = this.closest('.product__item');
      if (!productCard) return;
      const productData = getProductData(productCard);
      if (typeof addToWishlist === 'function') addToWishlist(productData);
    });
  });

  // Cart buttons - open popup
  document.querySelectorAll('.cart__btn').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const productCard = this.closest('.product__item');
      if (!productCard) return;
      const productData = getProductData(productCard);
      if (window.openPopup) window.openPopup(productData);
    });
  });
});