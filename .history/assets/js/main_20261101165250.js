/*=============== SHOW MENU ===============*/
function initializeMenu() {
  const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.add('show-menu');
      closeCategoriesDropdown();
    });
  }

  if (navClose && navMenu) {
    navClose.addEventListener('click', () => {
      navMenu.classList.remove('show-menu');
    });
  }
}

/*=============== IMAGE GALLERY ===============*/
function imgGallery() {
  const mainImg = document.querySelector('.details__img'),
    smallImg = document.querySelectorAll('.details__small-img');

  if (mainImg) {
    smallImg.forEach((img) => {
      img.addEventListener('click', function () {
        mainImg.src = this.src;
      });
    });
  }
}

/*=============== SWIPERS ===============*/
function initializeSwipers() {
  if (document.querySelector(".categories__container")) {
    new Swiper(".categories__container", {
      spaceBetween: 24, loop: true,
      navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
      breakpoints: {
        350: { slidesPerView: 2, spaceBetween: 24 }, 768: { slidesPerView: 3, spaceBetween: 24 },
        992: { slidesPerView: 4, spaceBetween: 24 }, 1200:{ slidesPerView: 5, spaceBetween: 40 },
        1400:{ slidesPerView: 6, spaceBetween: 24 },
      },
    });
  }

  const swiperContainers = ['.new__container', '.offers__container'];
  swiperContainers.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      new Swiper(el, {
        spaceBetween: 24, loop: true,
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
        breakpoints: {
          768: { slidesPerView: 2, spaceBetween: 24 }, 992: { slidesPerView: 3, spaceBetween: 24 },
          1400:{ slidesPerView: 4, spaceBetween: 24 },
        },
      });
    });
  });
}

/*=============== PRODUCTS TABS ===============*/
function initializeTabs() {
  const tabs = document.querySelectorAll('.tab__btns [data-target]'),
    tabContents = document.querySelectorAll('.tab__items [content]');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = document.querySelector(tab.dataset.target);
      if (target) {
        tabContents.forEach((tabContent) => tabContent.classList.remove('active-tab'));
        target.classList.add('active-tab');
        tabs.forEach((tab) => tab.classList.remove('active-tab'));
        tab.classList.add('active-tab');
      }
    });
  });
}

/*=============== CATEGORIES DROPDOWN ===============*/
function closeCategoriesDropdown() {
  const dropdownContainer = document.querySelector(".categories-dropdown__container");
  if (dropdownContainer) dropdownContainer.classList.remove("active");
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

  document.addEventListener("click", function (event) {
    if (dropdownContainer && !dropdownContainer.contains(event.target)) {
      dropdownContainer.classList.remove("active");
    }
  });
}

/*=============== PRODUCT ID & DATA EXTRACTION ===============*/
function generateProductId(title, price, imgSrc) {
  const base = (imgSrc || '').split('/').pop() || 'noimg';
  return `${title.toLowerCase().replace(/\s+/g, '-')}-${String(price).replace(/[^\d.]/g, '')}-${base.toLowerCase().replace(/\W+/g, '')}`;
}

function getProductData(productCard) {
  const title = productCard.querySelector('.product__title')?.textContent.trim() || 'Product';
  const priceText = productCard.querySelector('.new__price')?.textContent.trim() || '0';
  const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
  const categoryEl = productCard.querySelector('.product__category');
  const category = categoryEl ? categoryEl.textContent.trim() : '';
  const imgEl = productCard.querySelector('.product__images img');
  const img = imgEl ? imgEl.src : 'assets/img/product-1-1.jpg';

  return { title, price, category, img, id: generateProductId(title, price, img) };
}

/*=============== COUNTER & NOTIFICATION ===============*/
function initializeCounters() {
  if (!localStorage.getItem('cartCount')) localStorage.setItem('cartCount', '0');
  if (!localStorage.getItem('cartItems')) localStorage.setItem('cartItems', JSON.stringify([]));
  updateHeaderCounts();
}

function updateHeaderCounts() {
  const cartCount = localStorage.getItem('cartCount') || '0';
  const cartCountElements = document.querySelectorAll('.header__action-btn[href="cart.html"] .count');
  cartCountElements.forEach(el => {
    el.textContent = cartCount;
    el.style.display = cartCount === '0' ? 'none' : 'flex';
  });
}

function updateCounter(type, count) {
  localStorage.setItem(type, count.toString());
  updateHeaderCounts();
}

function showNotification(message, type = 'success') {
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => notification.remove());

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed; top: 20px; right: 20px; padding: 15px 25px; border-radius: 8px;
    background: ${type === 'success' ? 'hsl(176,88%,27%)' : '#dc3545'}; color: white;
    z-index: 10000; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    max-width: 400px; animation: slideInRight 0.3s ease forwards;
  `;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(() => { if (notification.parentNode) notification.parentNode.removeChild(notification); }, 300);
  }, 3000);
}

if (!document.querySelector('#notification-styles')) {
  const style = document.createElement('style');
  style.id = 'notification-styles';
  style.textContent = `
    @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
  `;
  document.head.appendChild(style);
}

/*=============== DYNAMICALLY INJECT PRODUCT ACTIONS ===============*/
function injectProductActions() {
  const productBanners = document.querySelectorAll('.product__banner');
  
  productBanners.forEach(banner => {
    // 1. Inject Hover Actions (Quick View + Add to Cart)
    if (!banner.querySelector('.product__actions')) {
      const actionsHTML = `
        <div class="product__actions">
          <a href="#" class="action__btn" aria-label="Quick View">
            <i class="fi fi-br-eye"></i>
          </a>
          <a href="#" class="action__btn cart__btn" aria-label="Add To Cart">
            <i class="fi fi-br-shopping-cart"></i>
          </a>
        </div>
      `;
      const badge = banner.querySelector('.product__badge');
      if (badge) {
        badge.insertAdjacentHTML('beforebegin', actionsHTML);
      } else {
        banner.insertAdjacentHTML('beforeend', actionsHTML);
      }
    }

    // 2. Inject "Buy Now" Button into the content area
    const content = banner.nextElementSibling;
    if (content && content.classList.contains('product__content')) {
      // Remove old cart button if it exists
      const oldCartBtn = content.querySelector('.cart__btn');
      if (oldCartBtn) oldCartBtn.remove();

      // Add the Buy Now button
      if (!content.querySelector('.buy-now-btn')) {
        const buyNowHTML = `
          <button class="action__btn buy-now-btn" aria-label="Buy Now">
            <i class="fi fi-br-shopping-bag"></i>
          </button>
        `;
        content.insertAdjacentHTML('beforeend', buyNowHTML);
      }
    }
  });
}
/*=============== GLOBAL PRODUCT BUTTON CLICKS ===============*/
document.addEventListener('click', function(e) {
    // 1. HOVER CART BUTTON -> Opens the Popup (Select Size/Color)
    const cartBtn = e.target.closest('.action__btn.cart__btn');
    if (cartBtn) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const card = cartBtn.closest('.product__item');
        if (card && typeof openPopup === 'function') {
            const productData = getProductData(card);
            window.openPopup(productData); 
        }
        return;
    }

    // 2. BUY NOW BUTTON (On Product Cards) -> Redirects to Details Page
    const buyNowBtn = e.target.closest('.buy-now-btn');
    if (buyNowBtn) {
        e.preventDefault();
        // Send them to the details page to review everything
        window.location.href = "details.html"; 
    }
});
/*=============== ENHANCED INITIALIZATION ===============*/
document.addEventListener('componentsLoaded', async function() {
  console.log('Components Loaded - Starting initialization');
  
  // 1. Fetch and render dynamic products FIRST
  if (typeof renderAllProducts === 'function') {
      await renderAllProducts(); 
  }

  // 2. Initialize UI elements
  initializeMenu();
  initializeSwipers(); 
  initializeCategoriesDropdown();
  initializeTabs();
  initializeCounters();
  imgGallery();
  updateAuthUI();
  initializePasswordToggles();
  
  // 3. Inject buttons and run page-specific logic
  setTimeout(() => {
    injectProductActions(); 
    initializePageSpecificFeatures();
    initializeQuickView();
    console.log('Initialization complete');
  }, 100);
});

/*=============== PAGE-SPECIFIC INITIALIZATION ===============*/
function initializePageSpecificFeatures() {
    if (document.querySelector('.details')) {
        calculateAndDisplayDiscount();
        initializeDetailsPage();
    }
    
    if (document.querySelector('.cart')) {
        if (typeof initializeCart === 'function') initializeCart();
    }
    
    if (document.querySelector('.checkout')) {
        initializeCheckoutPage();
    }
    
    initializeSearchFunctionality();
    initializeCountdownTimers();
    
    if (typeof openPopup === 'function' && !window.openPopup) {
        window.openPopup = openPopup;
    }
}

/*=============== DETAILS PAGE SPECIFIC FUNCTIONALITY ===============*/
function initializeDetailsPage() {
    initializeColorSizeSelection();
    initializeDetailsPageButtons();
    initializeReviewFunctionality();
}

function initializeColorSizeSelection() {
  const colorLinks = document.querySelectorAll(".color__link");
  colorLinks.forEach(color => {
    const newColor = color.cloneNode(true);
    color.parentNode.replaceChild(newColor, color);
    newColor.addEventListener("click", function(e) {
      e.preventDefault(); e.stopPropagation();
      const allColors = this.closest('.color__list').querySelectorAll('.color__link');
      allColors.forEach(c => c.classList.remove("color-active"));
      this.classList.add("color-active");
    });
  });

  const sizeLinks = document.querySelectorAll(".size__link");
  sizeLinks.forEach(link => {
    const newLink = link.cloneNode(true);
    link.parentNode.replaceChild(newLink, link);
    newLink.addEventListener("click", function(e) {
      e.preventDefault(); e.stopPropagation();
      const allSizes = this.closest('.size__list').querySelectorAll('.size__link');
      allSizes.forEach(l => l.classList.remove("size-active"));
      this.classList.add("size-active");
    });
  });
}

function initializeDetailsPageButtons() {
  const detailsCartBtn = document.querySelector('.details__cart-btn');
  if (detailsCartBtn) {
    const newCartBtn = detailsCartBtn.cloneNode(true);
    detailsCartBtn.parentNode.replaceChild(newCartBtn, detailsCartBtn);
    
    newCartBtn.addEventListener('click', function(e) {
      e.preventDefault(); e.stopPropagation();
      
      const title = document.querySelector('.details__title')?.textContent.trim() || 'Pattern Shirt';
      const priceText = document.querySelector('.new__price')?.textContent.trim() || '$49.99';
      const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
      const img = document.querySelector('.details__img')?.src || 'assets/img/product-8-1.jpg';
      const category = document.querySelector('.details__category')?.textContent.trim() || 'Clothing';
      const selectedColor = document.querySelector('.color__link.color-active')?.style.backgroundColor || '';
      const selectedSize = document.querySelector('.size__link.size-active')?.textContent || '';
      const quantity = parseInt(document.querySelector('.details .quantity')?.value || '1', 10);

      if (!selectedColor || !selectedSize) {
        if (typeof showNotification === 'function') showNotification('Please select color and size!', 'error');
        else alert('Please select color and size!');
        return;
      }

      const product = { title, price, category, img, color: selectedColor, size: selectedSize, quantity, id: generateProductId(title, price, img) };
      
      if (typeof addToCart === 'function') {
        addToCart(product);
        showNotification('Product added to cart successfully!', 'success');
      }
    });
  }
}

/*=============== REVIEW FUNCTIONALITY ===============*/
function initializeReviewFunctionality() {
  const stars = document.querySelectorAll(".rate__product i");
  const reviewForm = document.querySelector(".review__form");
  const submitBtn = reviewForm?.querySelector("button[type='submit']");

  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      stars.forEach((s, i) => s.classList.toggle("active", i <= index));
    });
  });

  const hasPurchased = JSON.parse(localStorage.getItem("hasPurchasedPatternShirt")) || false;

  if (!hasPurchased) {
    if (reviewForm) {
      reviewForm.innerHTML = `<p style="color: var(--error-color, red); font-weight: 600; text-align:center;">Only verified buyers can leave a review. Purchase this item to share your feedback!</p>`;
    }
  } else {
    submitBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      const text = reviewForm.querySelector("textarea").value.trim();
      const rating = document.querySelectorAll(".rate__product i.active").length;
      if (rating === 0 || text === "") return showNotification("Please select a rating and enter your review.", "error");
      
      showNotification("Thanks for your review!", "success");
      reviewForm.reset();
      document.querySelectorAll(".rate__product i").forEach(star => star.classList.remove("active"));
    });
  }
}

/*=============== SEARCH FUNCTIONALITY ===============*/
function initializeSearchFunctionality() {
  document.querySelectorAll('.search__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      const keyword = input.value.trim();
      if (keyword) window.location.href = `shop.html?search=${encodeURIComponent(keyword)}`;
    });
  });

  document.querySelectorAll('.header__search .form__input').forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const keyword = input.value.trim();
        if (keyword) window.location.href = `shop.html?search=${encodeURIComponent(keyword)}`;
      }
    });
  });

  const params = new URLSearchParams(window.location.search);
  const keyword = params.get('search');

  if (window.location.pathname.includes('shop.html')) {
    const totalProductsElement = document.querySelector('.total__products');
    if (keyword && keyword.trim() !== "") {
      if (totalProductsElement) totalProductsElement.style.display = 'block';
      const count = searchProductsExact(keyword);
      const totalProductsText = document.querySelector('.total__products span');
      if (totalProductsText) totalProductsText.textContent = count;
      
      if (totalProductsElement) {
        if (count === 0) totalProductsElement.innerHTML = `No products found for "<strong>${keyword}</strong>".`;
        else totalProductsElement.innerHTML = `We found <span>${count}</span> items for "${keyword}"!`;
      }
    } else {
      if (totalProductsElement) totalProductsElement.style.display = 'none';
    }
  }
}

function searchProductsExact(keyword) {
  const products = document.querySelectorAll('.product__item');
  let count = 0;
  products.forEach(product => {
    const title = product.querySelector('.product__title')?.textContent.toLowerCase() || '';
    if (title.includes(keyword.toLowerCase())) { product.style.display = ''; count++; } 
    else { product.style.display = 'none'; }
  });
  return count;
}

/*=============== COUNTDOWN TIMERS ===============*/
function initializeCountdownTimers() {
  const dealDayEnd = new Date().getTime() + (3 * 24 * 60 * 60 * 1000);
  startCountdown(dealDayEnd, "deal-day-timer");
  const womenFashionEnd = new Date().getTime() + (5 * 24 * 60 * 60 * 1000);
  startCountdown(womenFashionEnd, "women-fashion-timer");
}

function startCountdown(endDate, elementId) {
  const timerElement = document.getElementById(elementId);
  if (!timerElement) return;

  function updateTimer() {
    const now = new Date().getTime();
    const distance = endDate - now;
    if (distance <= 0) { timerElement.innerHTML = "Expired"; clearInterval(interval); return; }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    timerElement.innerHTML = `
      <div class="time-box"><span class="time-value">${String(days).padStart(2, "0")}</span><span class="time-label">Days</span></div><div class="colon">:</div>
      <div class="time-box"><span class="time-value">${String(hours).padStart(2, "0")}</span><span class="time-label">Hours</span></div><div class="colon">:</div>
      <div class="time-box"><span class="time-value">${String(minutes).padStart(2, "0")}</span><span class="time-label">Mins</span></div><div class="colon">:</div>
      <div class="time-box"><span class="time-value">${String(seconds).padStart(2, "0")}</span><span class="time-label">Sec</span></div>
    `;
  }
  updateTimer();
  const interval = setInterval(updateTimer, 1000);
}

/*=============== CHECKOUT PAGE FUNCTIONALITY ===============*/
function initializeCheckoutPage() {
    if (!document.querySelector('.checkout')) return;
    loadCheckoutItems();
    initializeCheckoutTotals();
    initializeOrderButton();
}

function loadCheckoutItems() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const checkoutItemsContainer = document.getElementById('checkout-items');
    if (!checkoutItemsContainer) return;
      
    checkoutItemsContainer.innerHTML = '';
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
                            ${item.color ? `<div class="checkout__color-attribute flex"><span class="checkout__attribute-label">Color:</span><span class="checkout__color-circle" style="background-color:${item.color || '#ccc'};"></span></div>` : ''}
                            ${item.size ? `<div class="checkout__size-attribute flex"><span class="checkout__attribute-label">Size:</span><span class="checkout__size-value">${item.size}</span></div>` : ''}
                            <div class="checkout__quantity-attribute flex"><span class="checkout__attribute-label">Qty:</span><span class="checkout__quantity-value">${item.quantity}</span></div>
                        </div>
                    </div>
                </div>
            </td>
            <td><span class="table__price">$${itemTotal}</span></td>
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
    if (cartItems.length === 0) {
        subtotalEl.textContent = '$0.00'; shippingEl.textContent = 'Free'; totalEl.textContent = '$0.00'; return;
    }
    
    const subtotal = cartItems.reduce((total, item) => total + (Number(item.price) * Number(item.quantity)), 0);
    const shipping = subtotal > 50 ? 0 : 5;
    const total = subtotal + shipping;
    
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    shippingEl.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
}

function initializeOrderButton() {
  const orderBtn = document.querySelector('.checkout .btn');
  if (!orderBtn) return;

  orderBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const formInputs = document.querySelectorAll('.checkout .form__input[required]');
    let isValid = true;
    
    formInputs.forEach(input => {
      if (!input.value.trim()) { isValid = false; input.style.borderColor = 'red'; } 
      else { input.style.borderColor = ''; }
    });

    if (!isValid) return showNotification('Please fill in all required fields', 'error');
    const selectedPayment = document.querySelector('.payment__input:checked');
    if (!selectedPayment) return showNotification('Please select a payment method', 'error');

    processOrder();
  });
}

function processOrder() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  if (cartItems.length === 0) return showNotification('Your cart is empty', 'error');

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

  const subtotal = cartItems.reduce((total, item) => total + (Number(item.price) * Number(item.quantity)), 0);
  const shipping = subtotal > 50 ? 0 : 5;
  const total = subtotal + shipping;

  const order = { id: 'ORD-' + Date.now(), items: cartItems, totals: { subtotal, shipping, total }, customer: formData, date: new Date().toISOString(), status: 'pending' };

  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));

  localStorage.removeItem('cartItems');
  localStorage.setItem('cartCount', '0');
  updateHeaderCounts();

  showNotification('Order placed successfully!', 'success');
  setTimeout(() => { window.location.href = 'order-confirmation.html'; }, 2000);
}

/*=============== DYNAMIC DISCOUNT CALCULATION ===============*/
function calculateAndDisplayDiscount() {
  const newPriceEl = document.querySelector('.details__price .new__price');
  const oldPriceEl = document.querySelector('.details__price .old__price');
  const discountEl = document.getElementById('dynamic-discount');
  
  if (!newPriceEl || !oldPriceEl || !discountEl) return;
  
  const newPrice = parseFloat(newPriceEl.textContent.replace(/[^\d.]/g, ''));
  const oldPrice = parseFloat(oldPriceEl.textContent.replace(/[^\d.]/g, ''));
  
  if (oldPrice > 0 && oldPrice > newPrice) {
    const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
    discountEl.textContent = `${discount}% Off`;
  } else {
    discountEl.textContent = '0% Off'; discountEl.style.display = 'none';
  }
}

/*=============== UPDATE HEADER FOR LOGGED IN USER ===============*/
function updateAuthUI() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        const topAction = document.querySelector('.header__top-action');
        if (topAction) {
            topAction.textContent = `Hi, ${loggedInUser.username}`;
            topAction.href = 'accounts.html';
        }

        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            if (link.textContent.trim() === 'LogIn') {
                link.textContent = 'Logout'; link.href = '#';
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    localStorage.removeItem('loggedInUser');
                    alert("Logged out successfully.");
                    window.location.reload();
                });
            }
        });
    }
}

/*=============== SHOW/HIDE PASSWORD TOGGLE ===============*/
function initializePasswordToggles() {
  const toggleIcons = document.querySelectorAll('.toggle-password');
  toggleIcons.forEach(icon => {
    icon.addEventListener('click', function(e) {
      e.preventDefault(); e.stopPropagation();
      const targetId = this.getAttribute('data-target');
      const inputField = document.getElementById(targetId);
      if (inputField) {
        if (inputField.type === 'password') {
          inputField.type = 'text'; this.classList.remove('fi-br-eye'); this.classList.add('fi-br-eye-crossed'); 
        } else {
          inputField.type = 'password'; this.classList.remove('fi-br-eye-crossed'); this.classList.add('fi-br-eye'); 
        }
      }
    });
  });
}

/*=============== QUICK VIEW FUNCTIONALITY ===============*/
function initializeQuickView() {
  const quickViewModal = document.getElementById('quick-view');
  const quickViewClose = document.getElementById('quick-view-close');
  const quickViewOverlay = document.querySelector('.quick-view__overlay');
  
  if (!quickViewModal) return;

  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.action__btn[aria-label="Quick View"]');
    if (btn) {
      e.preventDefault();
      const card = btn.closest('.product__item');
      if (!card) return;
      
      const title = card.querySelector('.product__title')?.textContent || 'Product';
      const price = card.querySelector('.new__price')?.textContent || '$0.00';
      const img = card.querySelector('.product__images img')?.src || 'assets/img/default.jpg';
      
      document.getElementById('qv-title').textContent = title;
      document.getElementById('qv-price').textContent = price;
      document.getElementById('qv-img').src = img;
      
      quickViewModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });

  function closeQuickView() {
    quickViewModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (quickViewClose) quickViewClose.addEventListener('click', closeQuickView);
  if (quickViewOverlay) quickViewOverlay.addEventListener('click', closeQuickView);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && quickViewModal.classList.contains('active')) closeQuickView();
  });
}