/*=============== WISHLIST FUNCTIONALITY ===============*/

// Make sure these global functions are available
if (typeof generateProductId === 'undefined') {
  function generateProductId(title, price, imgSrc) {
    const base = (imgSrc || '').split('/').pop() || 'noimg';
    return `${title.toLowerCase().replace(/\s+/g, '-')}-${String(price).replace(/[^\d.]/g, '')}-${base.toLowerCase().replace(/\W+/g, '')}`;
  }
}

if (typeof updateCounter === 'undefined') {
  function updateCounter(type, count) {
    localStorage.setItem(type, count.toString());
    // Update header counts if function exists
    if (typeof updateHeaderCounts === 'function') {
      updateHeaderCounts();
    }
  }
}

if (typeof showNotification === 'undefined') {
  function showNotification(message, type = 'success') {
    alert(message); // Fallback notification
  }
}

function addToWishlist(product) {
  let wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
  const productId = product.id || generateProductId(product.title, product.price, product.img);

  const existingIndex = wishlistItems.findIndex(item => item.id === productId);
  if (existingIndex === -1) {
    wishlistItems.push({
      id: productId,
      title: product.title,
      category: product.category || '',
      price: product.price,
      img: product.img || 'assets/img/product-1-1.jpg'
    });
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
    updateCounter('wishlistCount', wishlistItems.length);
    showNotification('Product added to wishlist successfully!');
  } else {
    showNotification('This product is already in your wishlist!');
  }
}

function initializeWishlist() {
  console.log('🚀 initializeWishlist called');
  debugWishlistPage();
  loadWishlistItems();
}

function loadWishlistItems() {
  const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
  const table = document.querySelector('.wishlist .table');
  
  console.log('📦 loadWishlistItems called, items:', wishlistItems.length);
  
  if (!table) {
    console.error('❌ Wishlist table not found!');
    return;
  }

  // Clear existing rows except header
  const rowsToRemove = table.querySelectorAll('tr:not(:first-child)');
  console.log('Clearing rows:', rowsToRemove.length);
  rowsToRemove.forEach(r => r.remove());

  // Render each item with data-id
  wishlistItems.forEach(item => {
    const tr = document.createElement('tr');
    tr.dataset.id = item.id;
    tr.innerHTML = `
      <td><img src="${item.img}" alt="product image"></td>
      <td>
        <h3 class="table__title">${item.title}</h3>
        <p class="table__description">${item.category}</p>
      </td>
      <td><span class="table__price">$${Number(item.price).toFixed(2)}</span></td>
      <td><span class="table__stock">In Stock</span></td>
      <td><button class="btn btn--sm add-to-cart-from-wishlist" data-id="${item.id}">Add To Cart</button></td>
      <td><i class="fi fi-br-trash table__trash" style="cursor: pointer;"></i></td>
    `;
    table.appendChild(tr);
  });

  updateCounter('wishlistCount', wishlistItems.length);
  checkEmptyWishlist();
  
  // Reattach event listeners
  setTimeout(() => {
    reattachWishlistEventListeners();
  }, 100);
}

function reattachWishlistEventListeners() {
  console.log('🔗 Reattaching wishlist event listeners');
  
  const trashButtons = document.querySelectorAll('.wishlist .table__trash');
  const addToCartButtons = document.querySelectorAll('.wishlist .add-to-cart-from-wishlist');
  
  console.log('🗑️ Trash buttons found:', trashButtons.length);
  console.log('🛒 Add to cart buttons found:', addToCartButtons.length);

  // Add to Cart buttons
  addToCartButtons.forEach(btn => {
    // Remove any existing listeners
    btn.replaceWith(btn.cloneNode(true));
  });

  // Re-select buttons after cloning
  const newAddToCartButtons = document.querySelectorAll('.wishlist .add-to-cart-from-wishlist');
  
  newAddToCartButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('🎯 Add to cart button clicked from wishlist!');
      console.log('Button data-id:', this.dataset.id);
      
      const row = this.closest('tr');
      if (row && row.dataset.id) {
        console.log('✅ Row found, ID:', row.dataset.id);
        openWishlistItemPopup(row);
      } else {
        console.error('❌ Row not found or missing data-id!');
        alert('Error: Could not find product details.');
      }
    });
  });

  // Trash buttons
  trashButtons.forEach(btn => {
    btn.replaceWith(btn.cloneNode(true));
  });

  const newTrashButtons = document.querySelectorAll('.wishlist .table__trash');
  newTrashButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      console.log('🗑️ Trash button clicked');
      const row = this.closest('tr');
      if (row) {
        removeWishlistItem(row);
      }
    });
  });
}

// SIMPLIFIED VERSION - Direct popup opening
function openWishlistItemPopup(row) {
  console.log('🎪 openWishlistItemPopup called');
  
  if (!row) {
    console.error('❌ No row provided');
    return;
  }

  const id = row.dataset.id;
  const title = row.querySelector('.table__title')?.textContent || 'Product';
  const category = row.querySelector('.table__description')?.textContent || 'Category';
  const priceText = row.querySelector('.table__price')?.textContent || '0';
  const price = parseFloat(priceText.replace(/[^\d.]/g, '')) || 0;
  const img = row.querySelector('.table__img')?.src || 'assets/img/default.jpg';

  console.log('📋 Product data:', { id, title, category, price, img });

  const product = {
    id: id,
    title: title,
    category: category,
    price: price,
    oldPrice: price * 1.2, // 20% higher for discount display
    img: img,
    fromWishlist: true
  };

  console.log('🎁 Final product:', product);
  
  // DIRECT APPROACH: Try to open popup immediately
  openPopupDirect(product);
}

// Direct popup function that doesn't rely on external dependencies
function openPopupDirect(product) {
  console.log('🔄 openPopupDirect called');
  
  const popup = document.getElementById("cart-popup");
  if (!popup) {
    console.error('❌ Popup element not found!');
    alert('Popup not available. Adding directly to cart.');
    addToCartDirect(product);
    return;
  }

  // Update popup content
  const titleEl = document.getElementById("popup-title");
  const categoryEl = document.getElementById("popup-category");
  const imgEl = document.getElementById("popup-img");
  const newPriceEl = document.getElementById("popup-new-price");
  const oldPriceEl = document.getElementById("popup-old-price");
  const discountEl = document.getElementById("popup-discount");

  if (titleEl) titleEl.textContent = product.title;
  // FIX 1: Remove "Category:" text, just show the category name
  if (categoryEl) categoryEl.innerHTML = `<span>${product.category}</span>`;
  if (imgEl) imgEl.src = product.img;
  if (newPriceEl) newPriceEl.textContent = `$${product.price.toFixed(2)}`;
  if (oldPriceEl) oldPriceEl.textContent = `$${product.oldPrice.toFixed(2)}`;
  
  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  if (discountEl) discountEl.textContent = `${discount}% Off`;

  // Build color options (FIX 2: No pre-selected color)
  buildColorOptions();
  
  // Build size options (FIX 3: No pre-selected size)  
  buildSizeOptions();

  // Setup confirm button
  const confirmBtn = document.getElementById("confirm-add");
  if (confirmBtn) {
    // Remove existing listeners
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    newConfirmBtn.addEventListener("click", function() {
      const selectedColor = document.querySelector('#popup-colors .color-active')?.style.backgroundColor;
      const selectedSize = document.querySelector('#popup-sizes .size-active')?.textContent;
      const quantity = parseInt(document.getElementById("popup-quantity")?.value || "1", 10);

      // Validate color and size selection
      if (!selectedColor || !selectedSize) {
        const missingFields = [];
        if (!selectedColor) missingFields.push("color");
        if (!selectedSize) missingFields.push("size");
        
        const message = `Please select ${missingFields.join(" and ")} before adding to cart!`;
        
        if (typeof showNotification === 'function') {
          showNotification(message, "error");
        } else {
          alert(message);
        }
        return;
      }

      const finalProduct = {
        ...product,
        color: selectedColor,
        size: selectedSize,
        quantity: quantity
      };

      console.log('✅ Adding to cart:', finalProduct);
      
      // Add to cart
      if (typeof addToCart === 'function') {
        addToCart(finalProduct);
      } else {
        addToCartDirect(finalProduct);
      }
      
      // Remove from wishlist
      removeWishlistItemById(product.id);
      
      // Show notification
      if (typeof showNotification === 'function') {
        showNotification("Product moved to cart successfully!");
      } else {
        alert("Product moved to cart successfully!");
      }

      // Close popup
      closePopupDirect();
    });
  }

  // Setup close button
  const closeBtn = document.getElementById("popup-close");
  if (closeBtn) {
    closeBtn.onclick = closePopupDirect;
  }

  // Setup overlay
  const overlay = document.querySelector('.cart-popup__overlay');
  if (overlay) {
    overlay.onclick = closePopupDirect;
  }

  // Show popup
  popup.classList.add("active");
  document.body.style.overflow = "hidden";
  
  console.log('✅ Popup opened successfully');
}

function closePopupDirect() {
  const popup = document.getElementById("cart-popup");
  if (popup) {
    popup.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function buildColorOptions() {
  const container = document.getElementById("popup-colors");
  if (!container) return;
  
  container.innerHTML = '';
  const colors = [
    { value: "hsl(0, 0%, 100%)", name: "white" },
    { value: "hsl(37, 100%, 65%)", name: "orange" },
    { value: "hsl(220, 100%, 65%)", name: "blue" },
    { value: "hsl(340, 100%, 65%)", name: "pink" },
    { value: "hsl(126, 61%, 52%)", name: "green" },
    { value: "hsl(0, 100%, 65%)", name: "red" }
  ];

  // FIX 2: No pre-selected color - remove the "color-active" class from all
  colors.forEach((color) => {
    const el = document.createElement("div");
    el.className = "color__link"; // No color-active class
    el.style.background = color.value;
    if (color.value === "hsl(0, 0%, 100%)") el.classList.add("color-white");
    el.addEventListener("click", () => {
      container.querySelectorAll(".color__link").forEach(c => c.classList.remove("color-active"));
      el.classList.add("color-active");
    });
    container.appendChild(el);
  });
}

function buildSizeOptions() {
  const container = document.getElementById("popup-sizes");
  if (!container) return;
  
  container.innerHTML = '';
  const sizes = ["S", "M", "L", "XL", "XXL"];

  // FIX 3: No pre-selected size - remove the "size-active" class from all
  sizes.forEach((size) => {
    const el = document.createElement("div");
    el.className = "size__link"; // No size-active class
    el.textContent = size;
    el.addEventListener("click", () => {
      container.querySelectorAll(".size__link").forEach(s => s.classList.remove("size-active"));
      el.classList.add("size-active");
    });
    container.appendChild(el);
  });
}

// Fallback addToCart function
function addToCartDirect(product) {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  
  const baseId = product.id || generateProductId(product.title, product.price, product.img);
  const color = (product.color || "").toString();
  const size = (product.size || "").toString();
  const variantId = `${baseId}|c:${color}|s:${size}`;

  const existingItem = cartItems.find(item => item.id === variantId);
  if (existingItem) {
    existingItem.quantity += product.quantity || 1;
  } else {
    cartItems.push({
      id: variantId,
      title: product.title,
      price: product.price,
      img: product.img,
      category: product.category || "",
      color: color,
      size: size,
      quantity: product.quantity || 1,
    });
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  
  const newCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  localStorage.setItem('cartCount', newCount.toString());
  
  console.log('✅ Product added to cart. New count:', newCount);
}

function removeWishlistItem(row) {
  const id = row.dataset.id;
  row.style.opacity = '0.5';

  setTimeout(() => {
    let wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
    wishlistItems = wishlistItems.filter(i => i.id !== id);
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));

    row.remove();
    updateCounter('wishlistCount', wishlistItems.length);
    checkEmptyWishlist();
    
    if (typeof showNotification === 'function') {
      showNotification('Product removed from wishlist!');
    }
  }, 300);
}

function removeWishlistItemById(id) {
  console.log('Removing wishlist item:', id);
  
  let wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
  const initialLength = wishlistItems.length;
  
  wishlistItems = wishlistItems.filter(i => i.id !== id);
  localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  
  updateCounter('wishlistCount', wishlistItems.length);
  
  // Refresh display if on wishlist page
  if (document.querySelector('.wishlist')) {
    loadWishlistItems();
  }
  
  console.log(`✅ Wishlist item removed. Before: ${initialLength}, After: ${wishlistItems.length}`);
  return true;
}

function checkEmptyWishlist() {
  const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
  const container = document.querySelector('.wishlist .table__container');

  if (container && wishlistItems.length === 0) {
    container.innerHTML = `
      <div class="empty-wishlist">
        <i class="fi fi-br-heart empty-wishlist__icon"></i>
        <h2 class="empty-wishlist__title">Your wishlist is empty</h2>
        <p class="empty-wishlist__description">Looks like you haven't added any items to your wishlist yet. Start browsing to find amazing products!</p>
        <a href="shop.html" class="btn btn--md flex">
          <i class="fi-br-shopping-bag"></i> 
          Start Shopping
        </a>
      </div>
    `;
  }
}

function debugWishlistPage() {
  console.log('=== WISHLIST DEBUG INFO ===');
  console.log('Wishlist container:', document.querySelector('.wishlist'));
  console.log('Wishlist table:', document.querySelector('.wishlist .table'));
  console.log('Popup element:', document.getElementById('cart-popup'));
  console.log('Wishlist items in localStorage:', JSON.parse(localStorage.getItem('wishlistItems') || '[]').length);
  console.log('openPopup function:', typeof openPopup);
  console.log('window.openPopup:', typeof window.openPopup);
  console.log('addToCart function:', typeof addToCart);
  console.log('==========================');
}

// Make functions globally available
window.addToWishlist = addToWishlist;
window.initializeWishlist = initializeWishlist;
window.openWishlistItemPopup = openWishlistItemPopup;
window.removeWishlistItemById = removeWishlistItemById;

// Auto-initialize if on wishlist page
if (document.querySelector('.wishlist')) {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
      if (typeof initializeWishlist === 'function') {
        initializeWishlist();
      }
    }, 100);
  });
}