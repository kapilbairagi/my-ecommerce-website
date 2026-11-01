/*=============== CART FUNCTIONALITY ===============*/

function _fallbackId(title, price, img) {
  const base = (img || "").split("/").pop() || "noimg";
  return `${(title || "")
    .toLowerCase()
    .replace(/\s+/g, "-")}-${String(price || "").replace(/[^\d.]/g, "")}-${base}`;
}

function _baseId(title, price, img) {
  if (typeof generateProductId === "function")
    return generateProductId(title, price, img);
  return _fallbackId(title, price, img);
}

// Add or increment item by unique id - SINGLE VERSION
function addToCart(product) {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  const baseId = product.id || _baseId(product.title, product.price, product.img);
  const color = (product.color || "").toString();
  const size = (product.size || "").toString();
  const variantId = `${baseId}|c:${color}|s:${size}`;

  const idx = cartItems.findIndex((i) => i.id === variantId);
  if (idx !== -1) {
    cartItems[idx].quantity += product.quantity || 1;
  } else {
    cartItems.push({
      id: variantId,
      title: product.title,
      price: product.price,
      img: product.img,
      category: product.category || "",
      color,
      size,
      quantity: product.quantity || 1,
    });
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  const newCount = cartItems.reduce((sum, i) => sum + Number(i.quantity || 0), 0);
  localStorage.setItem('cartCount', newCount);
  updateCounter('cartCount', newCount);

  if (typeof showNotification === "function") {
    showNotification("Product added to cart successfully!");
  }
}

function initializeCart() {
  loadCartItems();

  const updateCartBtn = document.querySelector('.cart__actions .btn:first-child');
  if (updateCartBtn) {
    updateCartBtn.addEventListener('click', function (e) {
      e.preventDefault();
      updateAllSubtotals();
      updateCartTotal();
      updateCartCount();
      updateAllCartItemsInLocalStorage();
      showNotification('Cart updated successfully!');
    });
  }

  updateCartTotal();
}

function loadCartItems() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const table = document.querySelector('.cart .table');
  if (!table) return;

  // Clear existing rows except header
  table.querySelectorAll('tr:not(:first-child)').forEach(r => r.remove());

  // Render all items
  cartItems.forEach(item => {
    const tr = document.createElement('tr');
    tr.dataset.id = item.id;
    tr.innerHTML = `
        <td><img src="${item.img}" alt="product image" class="table__img"></td>
        <td>
            <h3 class="table__title">${item.title}</h3>
            <p class="table__description">${item.category}</p>
        </td>
        <td><span class="table__price">$${Number(item.price).toFixed(2)}</span></td>
        <td><span class="table__size">${item.size || '-'}</span></td>
        <td><span class="table__color" style="background-color:${item.color || '#ccc'};"></span></td>
        <td><input type="number" class="quantity" value="${item.quantity}" min="1"></td>
        <td><span class="table__subtotal">$${(item.price * item.quantity).toFixed(2)}</span></td>
        <td><i class="fi fi-br-trash table__trash"></i></td>
    `;

    table.appendChild(tr);
  });

  updateCounter('cartCount', calculateCartItems());
  checkEmptyCart();
  reattachCartEventListeners();
}

/*=============== EVENT HANDLERS ===============*/
function reattachCartEventListeners() {
  document.querySelectorAll('.cart .table__trash').forEach(btn => {
    btn.addEventListener('click', function () {
      const row = this.closest('tr');
      removeCartItem(row);
    });
  });
    document.getElementById("confirm-add").addEventListener("click", () => {
    console.log("Clicked confirm-add button");
  });


  document.querySelectorAll('.cart .quantity').forEach(input => {
    input.addEventListener('change', function () {
      validateQuantity(this);
      updateSubtotal(this);
      updateCartTotal();
      updateCartCount();
      updateCartInLocalStorage(this);
    });
    input.addEventListener('input', function () {
      if (this.value < 1) this.value = 1;
    });
  });
}

/*=============== LOCAL STORAGE UPDATES ===============*/
function updateCartInLocalStorage(input) {
  const row = input.closest('tr');
  const id = row.dataset.id;
  const qty = parseInt(input.value, 10);

  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const idx = cartItems.findIndex(i => i.id === id);

  if (idx !== -1) {
    if (qty > 0) {
      cartItems[idx].quantity = qty;
    } else {
      cartItems.splice(idx, 1);
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }
}

function updateAllCartItemsInLocalStorage() {
  const rows = document.querySelectorAll('.cart .table tr:not(:first-child)');
  const cartItems = [];

  rows.forEach(row => {
    const id = row.dataset.id;
    const title = row.querySelector('.table__title').textContent;
    const category = row.querySelector('.table__description').textContent;
    const price = parseFloat(row.querySelector('.table__price').textContent.replace(/[^\d.]/g, ''));
    const quantity = parseInt(row.querySelector('.quantity').value, 10);
    const img = row.querySelector('.table__img').src;
    const color = row.querySelector('.table__color').style.backgroundColor;
    const size = row.querySelector('.table__size').textContent;

    if (quantity > 0) {
      cartItems.push({ id, title, category, price, quantity, img, color, size });
    }
  });

  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

/*=============== COUNT & TOTAL ===============*/
function calculateCartItems() {
  return (JSON.parse(localStorage.getItem('cartItems')) || [])
    .reduce((sum, item) => sum + Number(item.quantity || 0), 0);
}

function updateCartTotal() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const subtotal = cartItems.reduce((s, i) => s + (Number(i.price) * Number(i.quantity)), 0);
  const shipping = cartItems.length > 0 ? 5.00 : 0.00;
  localStorage.setItem('shippingCost', shipping.toFixed(2));

  const total = subtotal + shipping;

  const subtotalEl = document.querySelector('.cart__total-table tr:first-child .cart__total-price');
  const totalEl = document.querySelector('.cart__total-table tr:last-child .cart__total-price');

  if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
  if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
}

function updateCartCount() {
  const count = calculateCartItems();
  localStorage.setItem('cartCount', count);
  updateCounter('cartCount', count);
}

function updateCounter(key, val) {
  const el = document.querySelector(`[data-counter='${key}']`);
  if (el) el.textContent = val;
}

/*=============== REMOVE ITEM ===============*/
function removeCartItem(row) {
  const id = row.dataset.id;
  const quantity = parseInt(row.querySelector('.quantity').value, 10) || 1;

  row.style.transition = 'opacity 0.3s ease';
  row.style.opacity = '0';

  setTimeout(() => {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems = cartItems.filter(i => i.id !== id);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    row.remove();
    updateCartTotal();

    const newCount = cartItems.reduce((sum, i) => sum + Number(i.quantity || 0), 0);
    localStorage.setItem('cartCount', newCount);
    updateCounter('cartCount', newCount);

    // ✅ If no items left, clear localStorage cartCount completely
    if (cartItems.length === 0) {
      localStorage.removeItem('cartCount');
      updateCounter('cartCount', 0);
    }

    checkEmptyCart();
  }, 300);
}

/*=============== SUBTOTAL HELPERS ===============*/
function validateQuantity(input) {
  if (input.value < 1 || isNaN(input.value)) input.value = 1;
}

function updateSubtotal(input) {
  const row = input.closest('tr');
  const price = parseFloat(row.querySelector('.table__price').textContent.replace(/[^\d.]/g, ''));
  const quantity = parseInt(input.value, 10);
  const subtotalEl = row.querySelector('.table__subtotal');
  subtotalEl.textContent = '$' + (price * quantity).toFixed(2);
}

function updateAllSubtotals() {
  document.querySelectorAll('.cart .table tr:not(:first-child)').forEach(row => {
    const price = parseFloat(row.querySelector('.table__price').textContent.replace(/[^\d.]/g, ''));
    const quantity = parseInt(row.querySelector('.quantity').value, 10);
    row.querySelector('.table__subtotal').textContent = '$' + (price * quantity).toFixed(2);
  });
}

/*=============== EMPTY CART DISPLAY ===============*/
function checkEmptyCart() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const container = document.querySelector('.cart .table__container');

  if (container && cartItems.length === 0) {
    // ✅ Reset cart counter if empty
    localStorage.removeItem('cartCount');
    updateCounter('cartCount', 0);

    container.innerHTML = `
      <div class="empty-cart">
        <i class="fi fi-br-shopping-cart empty-cart__icon"></i>
        <h2 class="empty-cart__title">Your cart is empty</h2>
        <p class="empty-cart__description">Looks like you haven't added any items to your cart yet. Start shopping to find amazing products!</p>
        <a href="shop.html" class="btn btn--md"><i class="fi-br-shopping-bag"></i> Continue Shopping</a>
      </div>
    `;
  }
}

/* ---------- Popup + Add Flow ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("cart-popup");
  const overlay = popup?.querySelector(".cart-popup__overlay");
  const closeBtn = popup?.querySelector("#popup-close");
  const confirmBtn = popup?.querySelector("#confirm-add");
  const qtyInput = popup?.querySelector("#popup-quantity");

  let selectedProduct = null;
  let selectedColor = "";
  let selectedSize = "";

  // ========== Build popup options ==========
  function buildColors() {
    const container = document.getElementById("popup-colors");
    if (!container) return;
    container.innerHTML = "";
    ["hsl(0, 0%, 0%)", "hsl(37, 100%, 65%)", "hsl(220, 100%, 65%)", "hsl(340, 100%, 65%)", "hsl(126, 61%, 52%)", "hsl(0, 0%, 100%)"].forEach(
      (color) => {
        const el = document.createElement("div");
        el.className = "color__link";
        el.style.background = color;
        if (color === "hsl(0, 0%, 100%)") el.classList.add("color-white");
        el.addEventListener("click", () => {
          container.querySelectorAll(".color__link").forEach((x) => x.classList.remove("color-active"));
          el.classList.add("color-active");
          selectedColor = color;
        });
        container.appendChild(el);
      }
    );
  }

  function buildSizes() {
    const container = document.getElementById("popup-sizes");
    if (!container) return;
    container.innerHTML = "";
    ["S", "M", "L", "XL", "XXL"].forEach((size) => {
      const el = document.createElement("div");
      el.className = "size__link";
      el.textContent = size;
      el.addEventListener("click", () => {
        container.querySelectorAll(".size__link").forEach((x) => x.classList.remove("size-active"));
        el.classList.add("size-active");
        selectedSize = size;
      });
      container.appendChild(el);
    });
  }

  // ========== Open popup ==========
  function openPopup(product) {
    if (!popup) return;
    selectedProduct = product;
    document.getElementById("popup-title").textContent = product.title;
    document.getElementById("popup-category").textContent = product.category;
    document.getElementById("popup-img").src = product.img;
    document.getElementById("popup-price").textContent = `$${product.price.toFixed(2)}`;
    qtyInput.value = product.quantity || 1;
    selectedColor = "";
    selectedSize = "";
    buildColors();
    buildSizes();
    popup.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  
  // ========== Get product info ==========
  function getProductFromCard(card) {
    return {
      title: card.querySelector(".product__title")?.textContent.trim() || "Product",
      price: parseFloat((card.querySelector(".new__price")?.textContent || "0").replace(/[^\d.]/g, "")) || 0,
      img: card.querySelector("img")?.src || "assets/img/default.jpg",
      category: card.querySelector(".product__category")?.textContent.trim() || "",
      quantity: 1,
    };
  }

  function getProductFromDetails() {
    return {
      title: document.querySelector(".details__title")?.textContent.trim() || "Product",
      price: parseFloat((document.querySelector(".new__price")?.textContent || "0").replace(/[^\d.]/g, "")) || 0,
      img: document.querySelector(".details__img")?.src || "assets/img/default.jpg",
      category: document.querySelector(".details__brand")?.textContent.trim() || "",
      quantity: parseInt(document.querySelector(".quantity")?.value || "1", 10) || 1,
    };
  }

  // ========== Handle Add To Cart Buttons ==========
  document.addEventListener("click", (e) => {
    const cardBtn = e.target.closest(".cart__btn");
    const detailsBtn = e.target.closest(".details__cart-btn");

    // From Home / Shop pages
    if (cardBtn) {
      e.preventDefault();
      e.stopImmediatePropagation();
      openPopup(getProductFromCard(cardBtn.closest(".product__item")));
    }

    // From Details page
    if (detailsBtn) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const product = getProductFromDetails();

      const colorSelected = document.querySelector(".details__color .color-active")?.style.backgroundColor || "";
      const sizeSelected = document.querySelector(".details__size .size-active")?.textContent || "";

      if (!colorSelected || !sizeSelected) {
        if (typeof showNotification === "function") {
          showNotification("Please select color and size before adding to cart!", "error");
        } else {
          alert("Please select color and size before adding to cart!");
        }
        return;
      }

      addToCart({
        ...product,
        color: colorSelected,
        size: sizeSelected,
      });

      // ✅ Show success message
      if (typeof showNotification === "function") {
        showNotification("Product added to cart successfully!");
      } else {
        alert("Product added to cart successfully!");
      }
    }
  });

  // ========== Popup confirm ==========
  confirmBtn?.addEventListener("click", () => {
    if (!selectedColor || !selectedSize) {
      const missingFields = [];
      if (!selectedColor) missingFields.push("color");
      if (!selectedSize) missingFields.push("size");
      
      const message = `Please select ${missingFields.join(" and ")} before adding to cart!`;
      
      if (typeof showNotification === "function") {
        showNotification(message, "error");
      } else {
        alert(message);
      }
      return;
    }

  const qty = parseInt(qtyInput.value, 10) || 1;
  const finalProduct = { ...selectedProduct, color: selectedColor, size: selectedSize, quantity: qty };

  addToCart(finalProduct);

  // Show success message
  if (typeof showNotification === "function") {
    showNotification("Product added to cart successfully!");
  }

  popup.classList.remove("active");
  document.body.style.overflow = "";
});
  // ========== Enhanced Close Popup Functionality ==========
  function closePopup() {
    popup.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Close button and overlay
  [overlay, closeBtn].forEach((el) =>
    el && el.addEventListener("click", closePopup)
  );

  // Touch support for mobile
  document.addEventListener("touchstart", function(e) {
    if (popup?.classList.contains("active") && e.target === overlay) {
      closePopup();
    }
  });

  // Escape key support
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popup?.classList.contains("active")) {
      closePopup();
    }
  });

  // Prevent popup content from closing when clicking inside
  popup?.querySelector('.cart-popup__content')?.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Make openPopup function globally available
  window.openPopup = openPopup;
});

/*=============== RESPONSIVE POPUP HELPERS ===============*/

// Function to handle viewport changes
function handlePopupResize() {
  const popup = document.getElementById("cart-popup");
  const content = popup?.querySelector('.cart-popup__content');
  
  if (!popup || !content) return;

  // Add responsive class based on viewport width
  if (window.innerWidth <= 768) {
    content.classList.add('mobile-view');
  } else {
    content.classList.remove('mobile-view');
  }
}

// Initialize responsive behavior
window.addEventListener('load', handlePopupResize);
window.addEventListener('resize', handlePopupResize);

/*=============== UTILITY FUNCTIONS ===============*/

// Show notification function (if not defined elsewhere)
if (typeof showNotification === 'undefined') {
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
      background: ${type === 'success' ? '#28a745' : '#dc3545'};
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

  // Add keyframes for notification animation
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
}

/*=============== INITIALIZE CART ON PAGE LOAD ===============*/
document.addEventListener('DOMContentLoaded', function() {
  // Initialize cart functionality
  if (document.querySelector('.cart')) {
    initializeCart();
  }
  
  // Update cart count on all pages
  updateCartCount();
});

/*=============== END OF CART + POPUP FUNCTIONALITY ===============*/