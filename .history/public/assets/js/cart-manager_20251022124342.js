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

/*=============== CART TOTAL CALCULATION ===============*/
function calculateCartTotal() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  
  // If cart is empty, set all values to 0
  if (cartItems.length === 0) {
    updateCartTotalDisplay(0, 0, 0);
    return {
      subtotal: 0,
      shipping: 0,
      total: 0
    };
  }
  
  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => {
    return total + (Number(item.price) * Number(item.quantity));
  }, 0);
  
  // Calculate shipping (free if subtotal > 50, otherwise $5)
  const shipping = subtotal > 50 ? 0 : 5;
  
  // Calculate total
  const total = subtotal + shipping;
  
  // Update the display
  updateCartTotalDisplay(subtotal, shipping, total);
  
  return {
    subtotal: subtotal,
    shipping: shipping,
    total: total
  };
}

function updateCartTotalDisplay(subtotal, shipping, total) {
  const subtotalEl = document.querySelector('.cart__total-table tr:first-child .cart__total-price');
  const shippingEl = document.querySelector('.cart__total-table tr:nth-child(2) .cart__total-price');
  const totalEl = document.querySelector('.cart__total-table tr:last-child .cart__total-price');
  
  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

function initializeCart() {
  loadCartItems();
  calculateCartTotal(); // Calculate totals on page load
  
  const updateCartBtn = document.querySelector('.cart__actions .btn:first-child');
  if (updateCartBtn) {
    updateCartBtn.addEventListener('click', function (e) {
      e.preventDefault();
      updateAllSubtotals();
      calculateCartTotal();
      updateCartCount();
      updateAllCartItemsInLocalStorage();
      showNotification('Cart updated successfully!');
    });
  }
  
  updateCartTotalsOnQuantityChange(); // Add event listeners for quantity changes
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
    const itemSubtotal = (item.price * item.quantity).toFixed(2);
    
    tr.innerHTML = `
        <td><img src="${item.img}" alt="product image" class="table__img"></td>
        <td>
            <h3 class="table__title">${item.title}</h3>
            <p class="table__description">${item.category}</p>
        </td>
        <td><span class="table__price">$${Number(item.price).toFixed(2)}</span></td>
        <td><span class="table__size">${item.size || '-'}</span></td>
        <td>
          <span class="table__color-circle" style="background-color:${item.color || '#ccc'};"></span>
        </td>
        <td><input type="number" class="quantity" value="${item.quantity}" min="1"></td>
        <td><span class="table__subtotal">$${itemSubtotal}</span></td>
        <td><i class="fi fi-br-trash table__trash"></i></td>
    `;

    table.appendChild(tr);
  });

  updateCounter('cartCount', calculateCartItems());
  checkEmptyCart();
  reattachCartEventListeners();
  
  // Calculate totals after loading items
  calculateCartTotal();
}

/*=============== EVENT HANDLERS ===============*/
function reattachCartEventListeners() {
  document.querySelectorAll('.cart .table__trash').forEach(btn => {
    btn.addEventListener('click', function () {
      const row = this.closest('tr');
      removeCartItem(row);
    });
  });

  document.querySelectorAll('.cart .quantity').forEach(input => {
    input.addEventListener('change', function () {
      validateQuantity(this);
      updateSubtotal(this);
      calculateCartTotal(); // Use the new function
      updateCartCount();
      updateCartInLocalStorage(this);
    });
    input.addEventListener('input', function () {
      if (this.value < 1) this.value = 1;
    });
  });
}

/*=============== UPDATE CART TOTALS WHEN QUANTITY CHANGES ===============*/
function updateCartTotalsOnQuantityChange() {
  document.querySelectorAll('.cart .quantity').forEach(input => {
    input.addEventListener('change', function() {
      // Update the subtotal for this specific row
      updateSubtotal(this);
      
      // Recalculate and update all cart totals
      calculateCartTotal();
      
      // Update localStorage
      updateCartInLocalStorage(this);
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
    const color = row.querySelector('.table__color-circle').style.backgroundColor;
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

  row.style.transition = 'opacity 0.3s ease';
  row.style.opacity = '0';

  setTimeout(() => {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems = cartItems.filter(i => i.id !== id);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    row.remove();
    
    // Recalculate totals after removal
    calculateCartTotal();

    const newCount = cartItems.reduce((sum, i) => sum + Number(i.quantity || 0), 0);
    localStorage.setItem('cartCount', newCount);
    updateCounter('cartCount', newCount);

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
    
    // ✅ Reset cart totals to 0
    calculateCartTotal();

    container.innerHTML = `
      <div class="empty-cart">
        <i class="fi fi-br-shopping-cart empty-cart__icon"></i>
        <h2 class="empty-cart__title">Your cart is empty</h2>
        <p class="empty-cart__description">Looks like you haven't added any items to your cart yet. Start shopping to find amazing products!</p>
        <a href="shop.html" class="btn btn--md flex">
          <i class="fi-br-shopping-bag"></i> 
          Continue Shopping
        </a>
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
    ["hsl(0, 0%, 100%)", "hsl(37, 100%, 65%)", "hsl(220, 100%, 65%)", "hsl(340, 100%, 65%)", "hsl(126, 61%, 52%)", "hsl(0, 100%, 65%)"].forEach(
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
  window.openPopup = openPopup;

  
  // Update basic product info
  document.getElementById("popup-title").textContent = product.title;
  document.getElementById("popup-category").textContent = product.category || "Clothing";
  document.getElementById("popup-img").src = product.img;
  
  // Always show new price
  const newPriceEl = document.getElementById("popup-new-price");
  newPriceEl.textContent = `$${product.price.toFixed(2)}`;
  
  // Handle old price and discount
  const oldPriceEl = document.getElementById("popup-old-price");
  const discountEl = document.getElementById("popup-discount");
  
  // For testing - always show discount. Replace with your actual logic
  const oldPrice = product.oldPrice || (product.price * 1.2); // 20% higher for demo
  const discount = Math.round(((oldPrice - product.price) / oldPrice) * 100);
  
  oldPriceEl.textContent = `$${oldPrice.toFixed(2)}`;
  discountEl.textContent = `-${discount}%`;
  
  // Make sure elements are visible
  oldPriceEl.style.display = 'inline';
  discountEl.style.display = 'inline';
  
  qtyInput.value = product.quantity || 1;
  selectedColor = "";
  selectedSize = "";
  buildColors();
  buildSizes();
  popup.classList.add("active");
  document.body.style.overflow = "hidden";
  
  // Handle the confirm button
  handleWishlistItemAdd(product);
}

// Enhanced getProductFromCard function
function getProductFromCard(card) {
  // Try to get old price from the product card
  let oldPrice = null;
  const oldPriceElement = card.querySelector('.old__price');
  
  if (oldPriceElement && oldPriceElement.textContent) {
    const oldPriceText = oldPriceElement.textContent.trim();
    oldPrice = parseFloat(oldPriceText.replace(/[^\d.]/g, ""));
  }
  
  // Get new price
  const newPriceElement = card.querySelector('.new__price');
  const priceText = newPriceElement?.textContent || "0";
  const price = parseFloat(priceText.replace(/[^\d.]/g, "")) || 0;
  
  // If no old price found, calculate one for demo
  if (!oldPrice || oldPrice <= price) {
    oldPrice = price * 1.2; // 20% higher for demonstration
  }
  
  return {
    title: card.querySelector(".product__title")?.textContent.trim() || "Product",
    price: price,
    oldPrice: oldPrice,
    img: card.querySelector(".product__images img")?.src || card.querySelector("img")?.src || "assets/img/default.jpg",
    category: card.querySelector(".product__category")?.textContent.trim() || "Clothing",
    brand: "Nike",
    description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit...",
    quantity: 1,
  };
}
  // ========== Handle wishlist items in popup ==========
  function handleWishlistItemAdd(product) {
    const confirmBtn = popup?.querySelector("#confirm-add");
    
    if (!confirmBtn) return;

    // Remove any existing event listeners
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    // Add new event listener for wishlist items
    newConfirmBtn.addEventListener("click", () => {
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
      const finalProduct = { 
        ...product, 
        color: selectedColor, 
        size: selectedSize, 
        quantity: qty 
      };

      // Check if this is a wishlist item (has a simple ID without color/size)
      if (product.id && !product.id.includes('|c:')) {
        // Use the wishlist function to add to cart and remove from wishlist
        if (typeof addWishlistItemToCart === 'function') {
          addWishlistItemToCart(finalProduct);
        } else {
          // Fallback to regular addToCart
          addToCart(finalProduct);
        }
      } else {
        // Regular product from shop/home page
        addToCart(finalProduct);
      }

      // Show success message
      if (typeof showNotification === "function") {
        showNotification("Product added to cart successfully!");
      }

      popup.classList.remove("active");
      document.body.style.overflow = "";
    });
  }
  
  // ========== Get product info ==========
  function getProductFromCard(card) {
  console.log('Product card found:', card);
  
  const oldPriceEl = card.querySelector('.old__price');
  console.log('Old price element:', oldPriceEl);
  
  const oldPriceText = oldPriceEl?.textContent || "";
  console.log('Old price text:', oldPriceText);
  
  const oldPrice = oldPriceText ? parseFloat(oldPriceText.replace(/[^\d.]/g, "")) : null;
  console.log('Parsed old price:', oldPrice);
  
  const newPriceEl = card.querySelector('.new__price');
  const priceText = newPriceEl?.textContent || "0";
  const price = parseFloat(priceText.replace(/[^\d.]/g, "")) || 0;
  console.log('New price:', price);
  
  return {
    title: card.querySelector(".product__title")?.textContent.trim() || "Product",
    price: price,
    oldPrice: oldPrice,
    img: card.querySelector(".product__images img")?.src || card.querySelector("img")?.src || "assets/img/default.jpg",
    category: card.querySelector(".product__category")?.textContent.trim() || "Clothing",
    brand: "Nike",
    description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit...",
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

/*=============== INITIALIZE CART ON PAGE LOAD ===============*/
document.addEventListener('DOMContentLoaded', function() {
  // Initialize cart functionality
  if (document.querySelector('.cart')) {
    initializeCart();
  }
  
  // Update cart count on all pages
  updateCartCount();
});
// Enhanced openPopup function for no-scroll design
function openPopup(product) {
  if (!popup) return;
  selectedProduct = product;
  
  // Update product info
  document.getElementById("popup-title").textContent = product.title;
  document.getElementById("popup-category").textContent = product.category || "Clothing";
  document.getElementById("popup-img").src = product.img;
  
  // Price handling
  const newPriceEl = document.getElementById("popup-new-price");
  const oldPriceEl = document.getElementById("popup-old-price");
  const discountEl = document.getElementById("popup-discount");
  
  newPriceEl.textContent = `$${product.price.toFixed(2)}`;
  
  // Calculate discount for demo
  const oldPrice = product.oldPrice || (product.price * 1.17); // 17% higher
  const discount = Math.round(((oldPrice - product.price) / oldPrice) * 100);
  
  oldPriceEl.textContent = `$${oldPrice.toFixed(2)}`;
  discountEl.textContent = `-${discount}%`;
  
  // Reset and build options
  qtyInput.value = product.quantity || 1;
  selectedColor = "";
  selectedSize = "";
  buildColors();
  buildSizes();
  
  // Open popup and prevent body scroll
  popup.classList.add("active");
  document.body.classList.add('popup-open');
  document.body.style.overflow = 'hidden';
}

// Enhanced closePopup function
function closePopup() {
  const popup = document.getElementById("cart-popup");
  if (popup) {
    popup.classList.remove("active");
    document.body.classList.remove('popup-open');
    document.body.style.overflow = '';
  }
}
/*=============== END OF CART + POPUP FUNCTIONALITY ===============*/