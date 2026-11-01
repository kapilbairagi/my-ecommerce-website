/*=============== SHOW MENU ===============*/
function initializeMenu() {
  const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.add('show-menu');
      closeCategoriesDropdown();
    });
  }

  if (navClose) {
    navClose.addEventListener('click', () => {
      navMenu.classList.remove('show-menu');
    });
  }
}

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

/*=============== SWIPERS ===============*/
function initializeSwipers() {
  // Only initialize if the container exists on the page
  if (document.querySelector(".categories__container")) {
    new Swiper(".categories__container", {
      spaceBetween: 24,
      loop: true,
      navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
      breakpoints: {
        350: { slidesPerView: 2, spaceBetween: 24 },
        768: { slidesPerView: 3, spaceBetween: 24 },
        992: { slidesPerView: 4, spaceBetween: 24 },
        1200:{ slidesPerView: 5, spaceBetween: 40 },
        1400:{ slidesPerView: 6, spaceBetween: 24 },
      },
    });
  }

  const swiperContainers = ['.new__container', '.offers__container'];
  swiperContainers.forEach(selector => {
    if (document.querySelector(selector)) {
      // Initialize every instance found (e.g., all the .offers__container on offers.html)
      document.querySelectorAll(selector).forEach(container => {
        new Swiper(container, {
          spaceBetween: 24,
          loop: true,
          navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
          breakpoints: {
            768: { slidesPerView: 2, spaceBetween: 24 },
            992: { slidesPerView: 3, spaceBetween: 24 },
            1400:{ slidesPerView: 4, spaceBetween: 24 },
          },
        });
      });
    }
  });
}

/*=============== CATEGORIES DROPDOWN ===============*/
function closeCategoriesDropdown() {
  const dropdownContainer = document.querySelector(".categories-dropdown__container");
  if (dropdownContainer) {
    dropdownContainer.classList.remove("active");
  }
}

function initializeCategoriesDropdown() {
  const dropdownBtn = document.getElementById("categoriesDropdownButton");
  const dropdownContainer = document.querySelector(".categories-dropdown__container");

  if (dropdownBtn && dropdownContainer) {
    dropdownBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdownContainer.classList.toggle("active");
    });
  }

  // CLOSE ON OUTSIDE CLICK - Added null check to prevent crashing
  document.addEventListener("click", function (event) {
    if (dropdownContainer && !dropdownContainer.contains(event.target)) {
      dropdownContainer.classList.remove("active");
    }
  });
}

/*=============== PRODUCTS TABS ===============*/
function initializeTabs() {
  const tabs = document.querySelectorAll('.tab__btns [data-target]'),
    tabContents = document.querySelectorAll('.tab__items [content]');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = document.querySelector(tab.dataset.target);
      tabContents.forEach((tabContent) => tabContent.classList.remove('active-tab'));
      target.classList.add('active-tab');
      tabs.forEach((tab) => tab.classList.remove('active-tab'));
      tab.classList.add('active-tab');
    });
  });
}

/*=============== ENHANCED INITIALIZATION ===============*/
document.addEventListener('componentsLoaded', function() {
  console.log('Components Loaded - Starting initialization');
  
  // 1. Initialize UI elements that depend on dynamically loaded HTML
  initializeMenu();
  initializeSwipers();
  initializeCategoriesDropdown();
  initializeTabs();
  
  // 2. Initialize counters and localStorage
  initializeCounters();
  
  // 3. Initialize image gallery
  imgGallery();
  
  // 4. Small delay to ensure all DOM is ready, then run page-specific logic
  setTimeout(() => {
    initializePageSpecificFeatures();
    initializeQuickView();
    console.log('Initialization complete');
  }, 300);
});