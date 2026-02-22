/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
  navToggle = document.getElementById('nav-toggle'),
  navClose = document.getElementById('nav-close');

/*===== Menu Show =====*/
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.add('show-menu');
    closeCategoriesDropdown();
  });
}

/*===== Hide Show =====*/
if (navClose) {
  navClose.addEventListener('click', () => {
    navMenu.classList.remove('show-menu');
  });
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
// function categoriesDropdown() {
//   const dropdownToggle = document.getElementById('categories-toggle');
//   const dropdownList = document.getElementById('categories-list');
//   const dropdownContainer = document.querySelector('.categories-dropdown__container');

//   if (dropdownToggle && dropdownList) {
//     const overlay = document.createElement('div');
//     overlay.className = 'categories-dropdown__overlay';
//     dropdownContainer.parentNode.insertBefore(overlay, dropdownContainer);

//     dropdownToggle.addEventListener('click', function (e) {
//       e.stopPropagation();
//       dropdownList.classList.toggle('active');
//       dropdownContainer.classList.toggle('active');
//       overlay.classList.toggle('active');
//     });

//     const dropdownLinks = dropdownList.querySelectorAll('.categories-dropdown__link');
//     dropdownLinks.forEach(link => link.addEventListener('click', closeCategoriesDropdown));

//     document.addEventListener('click', function (e) {
//       if (!dropdownContainer.contains(e.target) && !dropdownToggle.contains(e.target)) {
//         closeCategoriesDropdown();
//       }
//     });

//     document.addEventListener('keydown', function (e) {
//       if (e.key === 'Escape') closeCategoriesDropdown();
//     });

//     if (navToggle) {
//       navToggle.addEventListener('click', closeCategoriesDropdown);
//     }
//   }
// }

// function closeCategoriesDropdown() {
//   const dropdownList = document.getElementById('categories-list');
//   const dropdownContainer = document.querySelector('.categories-dropdown__container');
//   const overlay = document.querySelector('.categories-dropdown__overlay');
//   if (dropdownList) dropdownList.classList.remove('active');
//   if (dropdownContainer) dropdownContainer.classList.remove('active');
//   if (overlay) overlay.classList.remove('active');
// }
// categoriesDropdown();
/*=============== FIXED CATEGORIES DROPDOWN - MOBILE FIX ===============*/
function categoriesDropdown() {
  const dropdownToggle = document.getElementById('categories-toggle');
  const dropdownList = document.getElementById('categories-list');
  const dropdownContainer = document.querySelector('.categories-dropdown__container');

  if (dropdownToggle && dropdownList) {
    // Create overlay for mobile only
    const overlay = document.createElement('div');
    overlay.className = 'categories-dropdown__overlay';
    document.body.appendChild(overlay); // Append to body for proper z-index stacking

    // Toggle dropdown
    const toggleDropdown = function(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      const isActive = dropdownList.classList.contains('active');
      
      if (!isActive) {
        // Open dropdown
        dropdownList.classList.add('active');
        dropdownContainer.classList.add('active');
        
        // Only show overlay and prevent scroll on mobile
        if (window.innerWidth <= 767) {
          overlay.classList.add('active');
          document.body.style.overflow = 'hidden';
          document.body.style.position = 'fixed'; // Prevent background scroll
        }
      } else {
        // Close dropdown
        closeCategoriesDropdown();
      }
    };

    dropdownToggle.addEventListener('click', toggleDropdown);
    
    // Add touch event for better mobile support
    dropdownToggle.addEventListener('touchstart', toggleDropdown, { passive: true });

    // Close dropdown when clicking on links
    const dropdownLinks = dropdownList.querySelectorAll('.categories-dropdown__link');
    dropdownLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        closeCategoriesDropdown();
        // Optional: Add your navigation logic here
        console.log('Category selected:', this.textContent);
      });
      
      // Add touch support for links
      link.addEventListener('touchstart', function(e) {
        e.preventDefault();
        closeCategoriesDropdown();
        console.log('Category selected:', this.textContent);
      }, { passive: false });
    });

    // Close dropdown when clicking outside (for desktop/tablet) or overlay (for mobile)
    document.addEventListener('click', function (e) {
      if (!dropdownContainer.contains(e.target) && !dropdownToggle.contains(e.target)) {
        closeCategoriesDropdown();
      }
    });
    
    // Close when clicking overlay (mobile)
    overlay.addEventListener('click', function(e) {
      e.preventDefault();
      closeCategoriesDropdown();
    });
    
    // Close when touching overlay (mobile)
    overlay.addEventListener('touchstart', function(e) {
      e.preventDefault();
      closeCategoriesDropdown();
    }, { passive: false });

    // Close dropdown with Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeCategoriesDropdown();
      }
    });

    // Close dropdown when mobile menu opens
    if (navToggle) {
      navToggle.addEventListener('click', closeCategoriesDropdown);
    }

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        // If resizing to larger screen, remove mobile styles
        if (window.innerWidth > 767) {
          document.body.style.overflow = '';
          document.body.style.position = '';
          overlay.classList.remove('active');
        }
        // Close dropdown on resize to avoid layout issues
        closeCategoriesDropdown();
      }, 250);
    });

    // Close dropdown when orientation changes
    window.addEventListener('orientationchange', function() {
      setTimeout(closeCategoriesDropdown, 100);
    });
  }
}

function closeCategoriesDropdown() {
  const dropdownList = document.getElementById('categories-list');
  const dropdownContainer = document.querySelector('.categories-dropdown__container');
  const overlay = document.querySelector('.categories-dropdown__overlay');
  
  if (dropdownList) dropdownList.classList.remove('active');
  if (dropdownContainer) dropdownContainer.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
  
  // Restore body styles
  document.body.style.overflow = '';
  document.body.style.position = '';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  categoriesDropdown();
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

  const cartCountElements = document.querySelectorAll('.header__action-btn[href="cart.html"] .count');
  cartCountElements.forEach(el => {
    el.textContent = cartCount;
    el.style.display = cartCount === '0' ? 'none' : 'flex';
  });

  const wishlistCountElements = document.querySelectorAll('.header__action-btn[href="wishlist.html"] .count');
  wishlistCountElements.forEach(el => {
    el.textContent = wishlistCount;
    el.style.display = wishlistCount === '0' ? 'none' : 'flex';
  });
}

function updateCounter(type, count) {
  localStorage.setItem(type, count.toString());
  updateHeaderCounts();
}

/*=============== NOTIFICATION ===============*/
function showNotification(message, type = 'success') {
  let n = document.querySelector('.notification');
  if (!n) {
    n = document.createElement('div');
    n.className = 'notification';
    document.body.appendChild(n);
  }
  n.textContent = message;
  n.className = `notification ${type}`;
  n.style.opacity = '1';
  setTimeout(() => (n.style.opacity = '0'), 3000);
}

/*=============== PRODUCT DATA EXTRACTION ===============*/
function getProductData(productCard) {
  const title = productCard.querySelector('.product__title').textContent.trim();
  const priceText = productCard.querySelector('.new__price').textContent.trim();
  const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
  const categoryEl = productCard.querySelector('.product__category');
  const category = categoryEl ? categoryEl.textContent.trim() : '';
  const imgEl = productCard.querySelector('.product__images img');
  const img = imgEl ? imgEl.src : 'assets/img/product-1-1.jpg';

  return {
    title,
    price,
    category,
    img,
    id: generateProductId(title, price, img)
  };
}

/*=============== INITIALIZE ===============*/
document.addEventListener('DOMContentLoaded', function() {
  initializeCounters();

  // Initialize page-specific managers if present
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

  // Cart buttons
  document.querySelectorAll('.cart__btn').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const productCard = this.closest('.product__item');
      if (!productCard) return;
      const productData = getProductData(productCard);
      if (typeof addToCart === 'function') addToCart(productData);
    });
  });
});


/*=============== DETAILS PAGE BUTTONS ===============*/
if (document.querySelector('.details__action-btn[aria-label="Add To Wishlist"]')) {
  document.querySelector('.details__action-btn[aria-label="Add To Wishlist"]').addEventListener('click', function (e) {
    e.preventDefault();

    const title = document.querySelector('.details__title')?.textContent.trim();
    const priceText = document.querySelector('.new__price')?.textContent.trim();
    const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
    const img = document.querySelector('.details__img')?.src;

    const product = {
      title,
      price,
      category: '',
      img,
      id: generateProductId(title, price, img)
    };

    if (typeof addToWishlist === 'function') {
      addToWishlist(product);
    }
  });
}
/*=============== DETAILS PAGE: COLOR & SIZE SELECTION ===============*/
document.addEventListener("DOMContentLoaded", () => {
  const colorLinks = document.querySelectorAll(".color__link");
  const sizeLinks = document.querySelectorAll(".size__link");

  // Color selector
  document.querySelectorAll(".color__link").forEach(color => {
    color.addEventListener("click", e => {
      e.preventDefault();
      document.querySelectorAll(".color__link").forEach(c => c.classList.remove("color-active"));
      color.classList.add("color-active");
    });
  });


  // Handle size selection
  sizeLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      sizeLinks.forEach(l => l.classList.remove("size-active"));
      link.classList.add("size-active");
    });
  });
});

/*=============== INTERACTIVE STAR RATING + VERIFIED BUYER REVIEW ===============*/
document.addEventListener("DOMContentLoaded", () => {
  const stars = document.querySelectorAll(".rate__product i");
  const reviewForm = document.querySelector(".review__form");
  const submitBtn = reviewForm?.querySelector("button[type='submit']");

  // Make stars clickable
  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      stars.forEach((s, i) => {
        s.classList.toggle("active", i <= index);
      });
    });
  });

  // Check verified buyer status
  const hasPurchased = JSON.parse(localStorage.getItem("hasPurchasedPatternShirt")) || false;

  if (!hasPurchased) {
    if (reviewForm) {
      reviewForm.innerHTML = `
        <p style="color: var(--error-color, red); font-weight: 600; text-align:center;">
          Only verified buyers can leave a review. Purchase this item to share your feedback!
        </p>`;
    }
  } else {
    submitBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      const text = reviewForm.querySelector("textarea").value.trim();
      const rating = document.querySelectorAll(".rate__product i.active").length;

      if (rating === 0 || text === "") {
        showNotification("Please select a rating and enter your review.", "error");
        return;
      }

      showNotification("Thanks for your review!", "success");
      reviewForm.reset();
      document.querySelectorAll(".rate__product i").forEach(star => star.classList.remove("active"));
    });
  }
});

//==================== CHECKOUT PAGE WITH SHIPPING ====================//
  document.addEventListener('DOMContentLoaded', function () {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const shippingCost = parseFloat(localStorage.getItem('shippingCost')) || 0;

    const tbody = document.getElementById('checkout-items');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const shippingEl = document.getElementById('checkout-shipping');
    const totalEl = document.getElementById('checkout-total');

    let subtotal = 0;

    cartItems.forEach(item => {
      const row = document.createElement('tr');
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      row.innerHTML = `
        <td><img src="${item.img}" alt="${item.title}" class="order__img"></td>
        <td>
          <h3 class="table__title">${item.title}</h3>
          <p class="table__quantity">x ${item.quantity}</p>
        </td>
        <td><span class="table__price">$${itemTotal.toFixed(2)}</span></td>
      `;

      tbody.appendChild(row);
    });

    // Update totals
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    shippingEl.textContent = shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'Free Shipping';
    totalEl.textContent = `$${(subtotal + shippingCost).toFixed(2)}`;
  });

 //==================== HANDLE SEARCH CLICK ON ANY PAGE ====================//
// Step 1: Handle search action
document.querySelectorAll('.search__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.previousElementSibling;
    const keyword = input.value.trim();
    if (keyword) {
      window.location.href = `shop.html?search=${encodeURIComponent(keyword)}`;
    }
  });
});

// Allow pressing Enter to search
document.querySelectorAll('.header__search .form__input').forEach(input => {
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const keyword = input.value.trim();
      if (keyword) {
        window.location.href = `shop.html?search=${encodeURIComponent(keyword)}`;
      }
    }
  });
});

// Step 2: Enhanced search function to filter products on shop page
function searchProductsExact(keyword) {
  const products = document.querySelectorAll('.product__item');
  let count = 0;
  
  // Define keyword mappings for better matching
  const keywordMappings = {
    'hot': ['hot', 'trending'],
    'trendy': ['trendy', 'fashionable', 'style'],
    'popular': ['popular', 'bestseller'],
    'new': ['new', 'new arrival', 'newadded', 'latest'],
    'newadded': ['new', 'new arrival', 'newadded', 'latest'],
    'newarrivals': ['new', 'new arrival', 'newadded', 'latest'],
    'offers': ['offer', 'sale', 'discount'],
    'offer': ['offer', 'sale', 'discount']
  };

  products.forEach(product => {
    const title = product.querySelector('.product__title')?.textContent.toLowerCase() || '';
    const category = product.querySelector('.product__category')?.textContent.toLowerCase() || '';
    
    // Get product badges/tags
    const badge = product.querySelector('.product__badge');
    const badgeText = badge ? badge.textContent.toLowerCase() : '';
    
    // Get all possible tags for this product
    const productTags = [];
    
    // Add badge text as tag
    if (badgeText) productTags.push(badgeText);
    
    // Add category as tag
    if (category) productTags.push(category);
    
    // Add title words as tags
    title.split(' ').forEach(word => {
      if (word.length > 2) productTags.push(word);
    });
    
    // Add mapped keywords based on badge
    if (badgeText.includes('hot')) productTags.push('hot', 'trending');
    if (badgeText.includes('popular')) productTags.push('popular', 'bestseller');
    if (badgeText.includes('trendy')) productTags.push('trendy', 'fashionable');
    if (badgeText.includes('new')) productTags.push('new', 'new arrival', 'newadded');
    if (badgeText.includes('arrival')) productTags.push('new', 'new arrival', 'newadded');

    // Check for EXACT match with search keyword
    const searchTerms = keyword.toLowerCase().split(' ');
    let matches = false;
    
    searchTerms.forEach(term => {
      // Check direct matches
      if (productTags.some(tag => tag === term)) {
        matches = true;
      }
      
      // Check mapped keyword matches
      if (keywordMappings[term]) {
        if (productTags.some(tag => keywordMappings[term].includes(tag))) {
          matches = true;
        }
      }
      
      // Check if keyword matches any product tag exactly
      if (productTags.some(tag => tag.includes(term) || term.includes(tag))) {
        matches = true;
      }
    });

    if (matches) {
      product.style.display = '';
      count++;
    } else {
      product.style.display = 'none';
    }
  });

  return count;
}

// Step 3: Apply search when page loads
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const keyword = params.get('search');

  if (keyword && window.location.pathname.includes('shop.html')) {
    const count = searchProductsExact(keyword);
    
    // Update the total product count
    const totalProductsText = document.querySelector('.total__products span');
    if (totalProductsText) totalProductsText.textContent = count;
    
    // Update the search results message
    const totalProductsElement = document.querySelector('.total__products');
    if (totalProductsElement) {
      if (count === 0) {
        totalProductsElement.innerHTML = `No products found for "<strong>${keyword}</strong>". Try: hot, trendy, popular, new, offers`;
      } else {
        totalProductsElement.innerHTML = `We found <span>${count}</span> items for "${keyword}"!`;
      }
    }
  }
});


//==================== DEALS SECTION ====================//

function startCountdown(endDate, elementId) {
  const timerElement = document.getElementById(elementId);

  function updateTimer() {
    const now = new Date().getTime();
    const distance = endDate - now;

    if (distance <= 0) {
      timerElement.innerHTML = "Expired";
      clearInterval(interval);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Build timer (NO trailing colon after seconds)
    timerElement.innerHTML = `
      <div class="time-box">
        <span class="time-value">${String(days).padStart(2, "0")}</span>
        <span class="time-label">Days</span>
      </div>
      <div class="colon">:</div>
      <div class="time-box">
        <span class="time-value">${String(hours).padStart(2, "0")}</span>
        <span class="time-label">Hours</span>
      </div>
      <div class="colon">:</div>
      <div class="time-box">
        <span class="time-value">${String(minutes).padStart(2, "0")}</span>
        <span class="time-label">Mins</span>
      </div>
      <div class="colon">:</div>
      <div class="time-box">
        <span class="time-value">${String(seconds).padStart(2, "0")}</span>
        <span class="time-label">Sec</span>
      </div>
    `;
  }

  updateTimer();
  const interval = setInterval(updateTimer, 1000);
}

// Initialize both timers
document.addEventListener("DOMContentLoaded", () => {
  // Deal of the Day → 3 days from now
  const dealDayEnd = new Date().getTime() + (3 * 24 * 60 * 60 * 1000);
  startCountdown(dealDayEnd, "deal-day-timer");

  // Women's Fashion → 5 days from now
  const womenFashionEnd = new Date().getTime() + (5 * 24 * 60 * 60 * 1000);
  startCountdown(womenFashionEnd, "women-fashion-timer");
});

//=============== ADD TO CART POPUP ===============
document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('cart-popup');
  const closePopup = document.getElementById('popup-close');
  const confirmBtn = document.getElementById('confirm-add');
  const overlay = popup.querySelector('.cart-popup__overlay');
  const quantityInput = document.getElementById('popup-quantity');
  
  let selectedColor = '';
  let selectedSize = '';
  let selectedProduct = null;

  // Open popup on Add to Cart click
  document.querySelectorAll('.cart__btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const productCard = btn.closest('.product__item');
      if (!productCard) return;

      selectedProduct = {
        title: productCard.querySelector('.product__title')?.textContent || "Product",
        category: productCard.querySelector('.product__category')?.textContent || "",
        img: productCard.querySelector('img')?.src || "assets/img/default.jpg",
        price: parseFloat(productCard.querySelector('.new__price')?.textContent.replace('$', '') || 0),
      };

      document.getElementById('popup-title').textContent = selectedProduct.title;
      document.getElementById('popup-category').textContent = selectedProduct.category;
      document.getElementById('popup-img').src = selectedProduct.img;
      document.getElementById('popup-price').textContent = `$${selectedProduct.price.toFixed(2)}`;

      // Reset selections
      selectedColor = '';
      selectedSize = '';
      quantityInput.value = 1;

      // Populate color options
      const colors = ['#000000', '#ff6f61', '#4285f4', '#34a853', '#fbbc05', '#ffffff'];
      const colorContainer = document.getElementById('popup-colors');
      colorContainer.innerHTML = '';

      colors.forEach(color => {
        const colorEl = document.createElement('div');
        colorEl.classList.add('color__link');
        if (color === '#ffffff') colorEl.classList.add('white');
        colorEl.style.backgroundColor = color;
        colorEl.addEventListener('click', () => {
          document.querySelectorAll('.color__link').forEach(c => c.classList.remove('color-active'));
          colorEl.classList.add('color-active');
          selectedColor = color;
        });
        colorContainer.appendChild(colorEl);
      });

      // Populate size options
      const sizes = ['S', 'M', 'L', 'XL'];
      const sizeContainer = document.getElementById('popup-sizes');
      sizeContainer.innerHTML = '';

      sizes.forEach(size => {
        const sizeEl = document.createElement('div');
        sizeEl.classList.add('size__link');
        sizeEl.textContent = size;
        sizeEl.addEventListener('click', () => {
          document.querySelectorAll('.size__link').forEach(s => s.classList.remove('size-active'));
          sizeEl.classList.add('size-active');
          selectedSize = size;
        });
        sizeContainer.appendChild(sizeEl);
      });

      popup.classList.add('active');
    });
  });

  // Close popup
  [closePopup, overlay].forEach(el => el.addEventListener('click', () => popup.classList.remove('active')));

  // Confirm Add to Cart
  confirmBtn.addEventListener('click', () => {
    if (!selectedColor || !selectedSize) {
      alert('Please select color and size.');
      return;
    }

    const quantity = parseInt(quantityInput.value) || 1;

    const newItem = {
      ...selectedProduct,
      color: selectedColor,
      size: selectedSize,
      quantity,
    };

    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    cart.push(newItem);
    localStorage.setItem('cartItems', JSON.stringify(cart));

    popup.classList.remove('active');
    alert('Item added to cart!');
  });
});