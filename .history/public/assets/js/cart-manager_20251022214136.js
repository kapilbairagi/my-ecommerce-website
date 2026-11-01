/*=============== CART FUNCTIONALITY ===============*/

// Add item to cart
function addToCart(product) {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  const baseId = product.id || generateProductId(product.title, product.price, product.img);
  const color = (product.color || "").toString();
  const size = (product.size || "").toString();
  const variantId = `${baseId}|c:${color}|s:${size}`;

  const existingItem = cartItems.find((i) => i.id === variantId);
  if (existingItem) {
    existingItem.quantity += product.quantity || 1;
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
  updateCartCount();
  showNotification("Product added to cart successfully!");
}

/*=============== POPUP FUNCTIONALITY ===============*/
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("cart-popup");
  const overlay = popup?.querySelector(".cart-popup__overlay");
  const closeBtn = popup?.querySelector("#popup-close");
  const confirmBtn = popup?.querySelector("#confirm-add");
  const qtyInput = popup?.querySelector("#popup-quantity");

  let selectedProduct = null;
  let selectedColor = "";
  let selectedSize = "";

  // Build color options
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

  // Build size options
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

  // Open popup
  function openPopup(product) {
    if (!popup) return;
    selectedProduct = product;
    
    // Update popup content
    document.getElementById("popup-title").textContent = product.title;
    document.getElementById("popup-category").textContent = product.category || "Clothing";
    document.getElementById("popup-img").src = product.img;
    
    // Update prices
    const newPriceEl = document.getElementById("popup-new-price");
    const oldPriceEl = document.getElementById("popup-old-price");
    const discountEl = document.getElementById("popup-discount");
    
    newPriceEl.textContent = `$${product.price.toFixed(2)}`;
    
    if (product.oldPrice && product.oldPrice > product.price) {
      oldPriceEl.textContent = `$${product.oldPrice.toFixed(2)}`;
      const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
      discountEl.textContent = `-${discount}%`;
      oldPriceEl.style.display = 'inline';
      discountEl.style.display = 'inline';
    } else {
      oldPriceEl.style.display = 'none';
      discountEl.style.display = 'none';
    }
    
    qtyInput.value = product.quantity || 1;
    selectedColor = "";
    selectedSize = "";
    buildColors();
    buildSizes();
    popup.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  // Get product from card
  function getProductFromCard(card) {
    const title = card.querySelector(".product__title")?.textContent.trim() || "Product";
    const priceText = card.querySelector(".new__price")?.textContent || "0";
    const price = parseFloat(priceText.replace(/[^\d.]/g, "")) || 0;
    const oldPriceEl = card.querySelector('.old__price');
    const oldPrice = oldPriceEl ? parseFloat(oldPriceEl.textContent.replace(/[^\d.]/g, '')) : null;
    const img = card.querySelector(".product__images img")?.src || card.querySelector("img")?.src || "assets/img/default.jpg";
    const category = card.querySelector(".product__category")?.textContent.trim() || "Clothing";

    return { title, price, oldPrice, img, category, quantity: 1 };
  }

  // Handle cart buttons
  document.addEventListener("click", (e) => {
    const cardBtn = e.target.closest(".cart__btn");
    if (cardBtn) {
      e.preventDefault();
      e.stopImmediatePropagation();
      openPopup(getProductFromCard(cardBtn.closest(".product__item")));
    }
  });

  // Confirm button handler
  confirmBtn?.addEventListener("click", () => {
    if (!selectedColor || !selectedSize) {
      showNotification("Please select color and size before adding to cart!", "error");
      return;
    }

    const qty = parseInt(qtyInput.value, 10) || 1;
    const finalProduct = { 
      ...selectedProduct, 
      color: selectedColor, 
      size: selectedSize, 
      quantity: qty 
    };

    addToCart(finalProduct);
    closePopup();
  });

  // Close popup
  function closePopup() {
    popup.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Event listeners for closing popup
  [overlay, closeBtn].forEach((el) => el && el.addEventListener("click", closePopup));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popup?.classList.contains("active")) closePopup();
  });

  // Make openPopup globally available
  window.openPopup = openPopup;
});

/*=============== CART PAGE FUNCTIONALITY ===============*/
function calculateCartTotal() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5;
  const total = subtotal + shipping;

  const subtotalEl = document.querySelector('.cart__total-table tr:first-child .cart__total-price');
  const shippingEl = document.querySelector('.cart__total-table tr:nth-child(2) .cart__total-price');
  const totalEl = document.querySelector('.cart__total-table tr:last-child .cart__total-price');
  
  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

  return { subtotal, shipping, total };
}

function initializeCart() {
  loadCartItems();
  calculateCartTotal();
  
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
}

function loadCartItems() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const table = document.querySelector('.cart .table');
  if (!table) return;

  table.querySelectorAll('tr:not(:first-child)').forEach(r => r.remove());

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
        <td><span class="table__price">$${item.price.toFixed(2)}</span></td>
        <td><span class="table__size">${item.size || '-'}</span></td>
        <td><span class="table__color-circle" style="background-color:${item.color || '#ccc'};"></span></td>
        <td><input type="number" class="quantity" value="${item.quantity}" min="1"></td>
        <td><span class="table__subtotal">$${itemSubtotal}</span></td>
        <td><i class="fi fi-br-trash table__trash"></i></td>
    `;

    table.appendChild(tr);
  });

  updateCartCount();
  checkEmptyCart();
  attachCartEventListeners();
  calculateCartTotal();
}

function attachCartEventListeners() {
  // Remove items
  document.querySelectorAll('.cart .table__trash').forEach(btn => {
    btn.addEventListener('click', function () {
      const row = this.closest('tr');
      removeCartItem(row);
    });
  });

  // Quantity changes
  document.querySelectorAll('.cart .quantity').forEach(input => {
    input.addEventListener('change', function () {
      if (this.value < 1) this.value = 1;
      updateSubtotal(this);
      calculateCartTotal();
      updateCartInLocalStorage(this);
    });
  });
}

function updateCartInLocalStorage(input) {
  const row = input.closest('tr');
  const id = row.dataset.id;
  const qty = parseInt(input.value, 10);

  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const itemIndex = cartItems.findIndex(i => i.id === id);

  if (itemIndex !== -1) {
    if (qty > 0) {
      cartItems[itemIndex].quantity = qty;
    } else {
      cartItems.splice(itemIndex, 1);
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }
}

function removeCartItem(row) {
  const id = row.dataset.id;
  row.style.opacity = '0';

  setTimeout(() => {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems = cartItems.filter(i => i.id !== id);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    row.remove();
    calculateCartTotal();
    updateCartCount();
    checkEmptyCart();
  }, 300);
}

function updateSubtotal(input) {
  const row = input.closest('tr');
  const price = parseFloat(row.querySelector('.table__price').textContent.replace('$', ''));
  const quantity = parseInt(input.value, 10);
  row.querySelector('.table__subtotal').textContent = '$' + (price * quantity).toFixed(2);
}

function updateAllSubtotals() {
  document.querySelectorAll('.cart .table tr:not(:first-child)').forEach(row => {
    const price = parseFloat(row.querySelector('.table__price').textContent.replace('$', ''));
    const quantity = parseInt(row.querySelector('.quantity').value, 10);
    row.querySelector('.table__subtotal').textContent = '$' + (price * quantity).toFixed(2);
  });
}

function updateCartCount() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  localStorage.setItem('cartCount', count);
  
  const cartCount = localStorage.getItem('cartCount') || '0';
  document.querySelectorAll('.header__action-btn[href="cart.html"] .count').forEach(el => {
    el.textContent = cartCount;
    el.style.display = cartCount === '0' ? 'none' : 'flex';
  });
}

function checkEmptyCart() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const container = document.querySelector('.cart .table__container');

  if (container && cartItems.length === 0) {
    localStorage.setItem('cartCount', '0');
    updateCartCount();
    calculateCartTotal();

    container.innerHTML = `
      <div class="empty-cart">
        <i class="fi fi-br-shopping-cart empty-cart__icon"></i>
        <h2 class="empty-cart__title">Your cart is empty</h2>
        <p class="empty-cart__description">Looks like you haven't added any items to your cart yet.</p>
        <a href="shop.html" class="btn btn--md flex">
          <i class="fi-br-shopping-bag"></i> 
          Continue Shopping
        </a>
      </div>
    `;
  }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelector('.cart')) initializeCart();
  updateCartCount();
});