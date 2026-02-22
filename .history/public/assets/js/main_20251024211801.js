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
document.addEventListener("DOMContentLoaded", function () {
    const dropdownBtn = document.getElementById("categoriesDropdownButton");
    const dropdownContainer = document.querySelector(".categories-dropdown__container");

    dropdownBtn.addEventListener("click", function () {
      dropdownContainer.classList.toggle("active");
    });

    // Optional: Close dropdown on outside click
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
  // Remove any existing notifications first
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => notification.remove());

  // Create notification element
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

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Add keyframes for notification animation (only if not already added)
if (!document.querySelector('#notification-styles')) {
  const style = document.createElement('style');
  style.id = 'notification-styles';
  style.textContent = `
    @keyframes slideInRight {
      from { 
        transform: translateX(100%); 
        opacity: 0; 
      }
      to { 
        transform: translateX(0); 
        opacity: 1; 
      }
    }
    @keyframes slideOutRight {
      from { 
        transform: translateX(0); 
        opacity: 1; 
      }
      to { 
        transform: translateX(100%); 
        opacity: 0; 
      }
    }
  `;
  document.head.appendChild(style);
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

/*=============== ENHANCED INITIALIZATION ===============*/
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded - Starting initialization');
  
  // Initialize counters and localStorage first
  initializeCounters();
  
  // Small delay to ensure all DOM is ready
  setTimeout(() => {
    // Initialize page-specific functionality
    initializePageSpecificFeatures();
    
    // Initialize wishlist buttons (for pages other than wishlist page)
    initializeWishlistButtons();
    
    // Initialize cart buttons
    initializeCartButtons();
    
    // Initialize details page buttons
    initializeDetailsPageButtons();
    
    // Initialize color and size selection
    initializeColorSizeSelection();
    
    // Initialize review functionality
    initializeReviewFunctionality();
    
    // Initialize search functionality
    initializeSearchFunctionality();
    
    // Initialize countdown timers
    initializeCountdownTimers();
    
    console.log('Initialization complete');
  }, 100);
});

/*=============== PAGE-SPECIFIC INITIALIZATION ===============*/
function initializePageSpecificFeatures() {
    console.log('Initializing page-specific features');
    
    // Make sure popup functions are available globally
    if (typeof openPopup !== 'function' && typeof window.openPopup !== 'function') {
        console.log('Popup functions not available, ensuring cart-manager is loaded');
    }
    
    // Initialize cart functionality if on cart page
    if (document.querySelector('.cart')) {
        console.log('Cart page detected');
        if (typeof initializeCart === 'function') {
            initializeCart();
        } else {
            console.error('initializeCart function not found');
        }
    }
    
    // Initialize checkout functionality if on checkout page
    if (document.querySelector('.checkout')) {
        console.log('Checkout page detected');
        initializeCheckoutPage();
    }
    
    // Initialize wishlist functionality if on wishlist page
    if (document.querySelector('.wishlist')) {
        console.log('Wishlist page detected - forcing initialization');
        if (typeof initializeWishlist === 'function') {
            setTimeout(() => {
                initializeWishlist();
            }, 200);
        } else {
            console.error('initializeWishlist function not found');
        }
    }
    
    // Initialize details page specific features
    if (document.querySelector('.details')) {
        console.log('Details page detected');
        initializeDetailsCategory();
        calculateAndDisplayDiscount();
    }
    
    // Make sure openPopup is globally available
    if (typeof openPopup === 'function' && !window.openPopup) {
        window.openPopup = openPopup;
    }
}

/*=============== WISHLIST BUTTONS INITIALIZATION ===============*/
function initializeWishlistButtons() {
  console.log('Initializing wishlist buttons');
  
  document.querySelectorAll('.action__btn[aria-label="Add To Wishlist"]').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Wishlist button clicked');
      
      const productCard = this.closest('.product__item');
      if (!productCard) {
        console.error('Product card not found');
        return;
      }
      
      const productData = getProductData(productCard);
      console.log('Product data:', productData);
      
      if (typeof addToWishlist === 'function') {
        addToWishlist(productData);
      } else {
        console.error('addToWishlist function not found');
      }
    });
  });
}

/*=============== CART BUTTONS INITIALIZATION ===============*/
function initializeCartButtons() {
  console.log('Initializing cart buttons');
  
  // Cart buttons - ONLY open popup, don't add directly to cart
  document.querySelectorAll('.cart__btn').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      console.log('Cart button clicked');
      
      const productCard = this.closest('.product__item');
      if (!productCard) {
        console.error('Product card not found');
        return;
      }
      
      const productData = getProductData(productCard);
      console.log('Product data for popup:', productData);
      
      // Use the popup functionality
      if (window.openPopup) {
        console.log('Using window.openPopup');
        window.openPopup(productData);
      } else if (typeof openPopup === 'function') {
        console.log('Using openPopup function');
        openPopup(productData);
      } else {
        console.error('Popup function not available');
        // Fallback: add directly to cart
        if (typeof addToCart === 'function') {
          addToCart(productData);
        }
      }
    });
  });
}

/*=============== DETAILS PAGE BUTTONS INITIALIZATION ===============*/
function initializeDetailsPageButtons() {
  if (document.querySelector('.details__action-btn[aria-label="Add To Wishlist"]')) {
    document.querySelector('.details__action-btn[aria-label="Add To Wishlist"]').addEventListener('click', function (e) {
      e.preventDefault();
      console.log('Details page wishlist button clicked');

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
}

/*=============== COLOR & SIZE SELECTION INITIALIZATION ===============*/
function initializeColorSizeSelection() {
  console.log('Initializing color and size selection');
  
  // Color selector
  document.querySelectorAll(".color__link").forEach(color => {
    color.addEventListener("click", e => {
      e.preventDefault();
      document.querySelectorAll(".color__link").forEach(c => c.classList.remove("color-active"));
      color.classList.add("color-active");
    });
  });

  // Size selector
  document.querySelectorAll(".size__link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll(".size__link").forEach(l => l.classList.remove("size-active"));
      link.classList.add("size-active");
    });
  });
}

/*=============== REVIEW FUNCTIONALITY INITIALIZATION ===============*/
function initializeReviewFunctionality() {
  console.log('Initializing review functionality');
  
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
}

/*=============== SEARCH FUNCTIONALITY INITIALIZATION ===============*/
function initializeSearchFunctionality() {
  console.log('Initializing search functionality');
  
  // Handle search button clicks
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

  // Apply search when page loads with search parameter
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
}

/*=============== COUNTDOWN TIMERS INITIALIZATION ===============*/
function initializeCountdownTimers() {
  console.log('Initializing countdown timers');
  
  // Initialize both timers
  const dealDayEnd = new Date().getTime() + (3 * 24 * 60 * 60 * 1000);
  startCountdown(dealDayEnd, "deal-day-timer");

  const womenFashionEnd = new Date().getTime() + (5 * 24 * 60 * 60 * 1000);
  startCountdown(womenFashionEnd, "women-fashion-timer");
}

/*=============== SEARCH PRODUCTS FUNCTION ===============*/
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

/*=============== COUNTDOWN FUNCTION ===============*/
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

/*=============== CHECKOUT PAGE TOTAL CALCULATION ===============*/
function initializeCheckoutTotals() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const tbody = document.getElementById('checkout-items');
  const subtotalEl = document.getElementById('checkout-subtotal');
  const shippingEl = document.getElementById('checkout-shipping');
  const totalEl = document.getElementById('checkout-total');

  if (!tbody || !subtotalEl) return;

  // Clear existing items
  tbody.innerHTML = '';

  // If cart is empty, set all values to 0
  if (cartItems.length === 0) {
    subtotalEl.textContent = '$0.00';
    shippingEl.textContent = '$0.00';
    totalEl.textContent = '$0.00';
    return;
  }

  // Calculate subtotal (same as cart page)
  let subtotal = 0;

  cartItems.forEach(item => {
    const row = document.createElement('tr');
    const itemTotal = Number(item.price) * Number(item.quantity);
    subtotal += itemTotal;

    row.innerHTML = `
      <td><img src="${item.img}" alt="${item.title}" class="order__img"></td>
      <td>
        <div class="checkout__product-info">
          <h3 class="table__title">${item.title}</h3>
          <p class="table__quantity">x ${item.quantity}</p>
          <div class="checkout__attributes flex">
            ${item.color ? `
              <div class="checkout__color-attribute flex">
                <span class="checkout__attribute-label">Color:</span>
                <span class="checkout__color-circle" style="background-color:${item.color || '#ccc'};"></span>
              </div>
            ` : ''}
            ${item.size ? `
              <div class="checkout__size-attribute flex">
                <span class="checkout__attribute-label">Size:</span>
                <span class="checkout__size-value">${item.size}</span>
              </div>
            ` : ''}
          </div>
        </div>
      </td>
      <td><span class="table__price">$${itemTotal.toFixed(2)}</span></td>
    `;

    tbody.appendChild(row);
  });

  // Calculate shipping (same logic as cart page)
  const shipping = subtotal > 50 ? 0 : 5;
  const total = subtotal + shipping;

  // Update display
  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  shippingEl.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
  totalEl.textContent = `$${total.toFixed(2)}`;
}

/*=============== ORDER BUTTON FUNCTIONALITY ===============*/
function initializeOrderButton() {
  const orderBtn = document.querySelector('.checkout .btn');
  if (!orderBtn) return;

  orderBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Validate form
    const formInputs = document.querySelectorAll('.checkout .form__input[required]');
    let isValid = true;
    
    formInputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = 'red';
      } else {
        input.style.borderColor = '';
      }
    });

    if (!isValid) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    // Validate payment method
    const selectedPayment = document.querySelector('.payment__input:checked');
    if (!selectedPayment) {
      showNotification('Please select a payment method', 'error');
      return;
    }

    // Process order
    processOrder();
  });
}

function processOrder() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  
  if (cartItems.length === 0) {
    showNotification('Your cart is empty', 'error');
    return;
  }

  // Get form data
  const formData = {
    name: document.querySelector('.checkout input[placeholder="Name"]').value,
    address: document.querySelector('.checkout input[placeholder="Address"]').value,
    city: document.querySelector('.checkout input[placeholder="City/District"]').value,
    postcode: document.querySelector('.checkout input[placeholder="Postcode"]').value,
    phone: document.querySelector('.checkout input[placeholder="Phone"]').value,
    email: document.querySelector('.checkout input[placeholder="Email"]').value,
    note: document.querySelector('.checkout textarea').value,
    paymentMethod: document.querySelector('.payment__input:checked').nextElementSibling.textContent
  };

  // Calculate totals (same as cart page)
  const subtotal = cartItems.reduce((total, item) => 
    total + (Number(item.price) * Number(item.quantity)), 0);
  const shipping = subtotal > 50 ? 0 : 5;
  const total = subtotal + shipping;

  // Create order object
  const order = {
    id: 'ORD-' + Date.now(),
    items: cartItems,
    totals: { subtotal, shipping, total },
    customer: formData,
    date: new Date().toISOString(),
    status: 'pending'
  };

  // Save order to localStorage
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));

  // Clear cart
  localStorage.removeItem('cartItems');
  localStorage.setItem('cartCount', '0');
  updateHeaderCounts();

  // Show success message and redirect
  showNotification('Order placed successfully!', 'success');
  
  setTimeout(() => {
    window.location.href = 'order-confirmation.html';
  }, 2000);
}
/*=============== DYNAMIC DISCOUNT CALCULATION ===============*/
function calculateAndDisplayDiscount() {
  const newPriceEl = document.querySelector('.details__price .new__price');
  const oldPriceEl = document.querySelector('.details__price .old__price');
  const discountEl = document.getElementById('dynamic-discount');
  
  if (!newPriceEl || !oldPriceEl || !discountEl) return;
  
  // Extract numeric values from price text
  const newPrice = parseFloat(newPriceEl.textContent.replace(/[^\d.]/g, ''));
  const oldPrice = parseFloat(oldPriceEl.textContent.replace(/[^\d.]/g, ''));
  
  // Calculate discount percentage
  if (oldPrice > 0 && oldPrice > newPrice) {
    const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
    discountEl.textContent = `${discount}% Off`;
  } else {
    discountEl.textContent = '0% Off';
    discountEl.style.display = 'none';
  }
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', function() {
  calculateAndDisplayDiscount();
});

/*=============== CHECKOUT PAGE FUNCTIONALITY ===============*/
function initializeCheckoutPage() {
    console.log('Initializing checkout page');
    
    if (!document.querySelector('.checkout')) return;
    
    loadCheckoutItems();
    initializeCheckoutTotals();
    initializeOrderButton();
}

function loadCheckoutItems() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const checkoutItemsContainer = document.getElementById('checkout-items');
    
    if (!checkoutItemsContainer) return;
      
    // Render each cart item
    cartItems.forEach(item => {
        const itemTotal = (Number(item.price) * Number(item.quantity)).toFixed(2);
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td colspan="2">
                <div class="checkout__product flex">
                    <img src="${item.img}" alt="${item.title}" class="checkout__product-img">
                    <div class="checkout__product-info">
                        <h4 class="checkout__product-title">${item.title}</h4>
                        <p class="checkout__product-category">${item.category}</p>
                        <div class="checkout__attributes flex">
                            ${item.color ? `
                                <div class="checkout__color-attribute flex">
                                    <span class="checkout__attribute-label">Color:</span>
                                    <span class="checkout__color-circle" style="background-color:${item.color || '#ccc'};"></span>
                                </div>
                            ` : ''}
                            ${item.size ? `
                                <div class="checkout__size-attribute flex">
                                    <span class="checkout__attribute-label">Size:</span>
                                    <span class="checkout__size-value">${item.size}</span>
                                </div>
                            ` : ''}
                            <div class="checkout__quantity-attribute flex">
                                <span class="checkout__attribute-label">Qty:</span>
                                <span class="checkout__quantity-value">${item.quantity}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </td>
            <td>
                <span class="table__price">$${itemTotal}</span>
            </td>
        `;
        
        checkoutItemsContainer.appendChild(row);
    });
}

function initializeCheckoutTotals() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const subtotalEl = document.getElementById('checkout-subtotal');
    const shippingEl = document.getElementById('checkout-shipping');
    const totalEl = document.getElementById('checkout-total');
    
    if (!subtotalEl || !shippingEl || !totalEl) return;
    
    // If cart is empty, set all values to 0
    if (cartItems.length === 0) {
        subtotalEl.textContent = '$0.00';
        shippingEl.textContent = 'Free';
        totalEl.textContent = '$0.00';
        return;
    }
    
    // Calculate subtotal (same as cart page)
    const subtotal = cartItems.reduce((total, item) => {
        return total + (Number(item.price) * Number(item.quantity));
    }, 0);
    
    // Calculate shipping (free if subtotal > 50, otherwise $5)
    const shipping = subtotal > 50 ? 0 : 5;
    
    // Calculate total
    const total = subtotal + shipping;
    
    // Update the display
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    shippingEl.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
}

function initializeOrderButton() {
    const orderBtn = document.querySelector('.checkout .btn');
    if (!orderBtn) return;
    
    orderBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Validate form
        const formInputs = document.querySelectorAll('.checkout .form__input[required]');
        let isValid = true;
        
        formInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'red';
            } else {
                input.style.borderColor = '';
            }
        });
        
        // Validate payment method
        const selectedPayment = document.querySelector('.payment__input:checked');
        if (!selectedPayment) {
            showNotification('Please select a payment method', 'error');
            isValid = false;
        }
        
        // Check if cart has items
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        if (cartItems.length === 0) {
            showNotification('Your cart is empty', 'error');
            isValid = false;
        }
        
        if (!isValid) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Process order
        processOrder();
    });
}

function processOrder() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    if (cartItems.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    // Get form data
    const formData = {
        name: document.querySelector('.checkout input[placeholder="Name"]').value,
        address: document.querySelector('.checkout input[placeholder="Address"]').value,
        city: document.querySelector('.checkout input[placeholder="City/District"]').value,
        postcode: document.querySelector('.checkout input[placeholder="Postcode"]').value,
        phone: document.querySelector('.checkout input[placeholder="Phone"]').value,
        email: document.querySelector('.checkout input[placeholder="Email"]').value,
        note: document.querySelector('.checkout textarea').value,
        paymentMethod: document.querySelector('.payment__input:checked').nextElementSibling.textContent
    };
    
    // Calculate totals (same as cart page)
    const subtotal = cartItems.reduce((total, item) => 
        total + (Number(item.price) * Number(item.quantity)), 0);
    const shipping = subtotal > 50 ? 0 : 5;
    const total = subtotal + shipping;
    
    // Create order object
    const order = {
        id: 'ORD-' + Date.now(),
        items: cartItems,
        totals: { subtotal, shipping, total },
        customer: formData,
        date: new Date().toISOString(),
        status: 'pending'
    };
    
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    localStorage.removeItem('cartItems');
    localStorage.setItem('cartCount', '0');
    updateHeaderCounts();
    
    // Show success message and redirect
    showNotification('Order placed successfully!', 'success');
    
    setTimeout(() => {
        window.location.href = 'order-confirmation.html';
    }, 2000);
}