/*=============== WISHLIST FUNCTIONALITY ===============*/
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
  console.log('initializeWishlist called');
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
      <td><img src="${item.img}" alt="product image" class="table__img" style="width: 80px; height: 80px; object-fit: cover;"></td>
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
  
  // Reattach event listeners after a small delay to ensure DOM is ready
  setTimeout(() => {
    reattachWishlistEventListeners();
  }, 50);
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
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    
    // Add click event listener
    newBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('🎯 Add to cart button clicked!');
      console.log('Button data-id:', this.dataset.id);
      
      const row = this.closest('tr');
      if (row) {
        console.log('✅ Row found, ID:', row.dataset.id);
        openWishlistItemPopup(row);
      } else {
        console.error('❌ Row not found!');
      }
    });
    
    console.log('✅ Event listener attached to button:', newBtn.dataset.id);
  });

  // Trash buttons
  trashButtons.forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    
    newBtn.addEventListener('click', function() {
      console.log('🗑️ Trash button clicked');
      const row = this.closest('tr');
      if (row) {
        removeWishlistItem(row);
      }
    });
  });
}

// Separate handler functions for proper removal
function handleTrashClick() {
  console.log('Trash button clicked');
  const row = this.closest('tr');
  removeWishlistItem(row);
}

function handleAddToCartClick(e) {
  e.preventDefault();
  console.log('Add to cart button clicked from wishlist');
  const row = this.closest('tr');
  console.log('Row found:', !!row);
  openWishlistItemPopup(row);
}


// In wishlist-manager.js - Update the openWishlistItemPopup function
function openWishlistItemPopup(row) {
  console.log('🎪 openWishlistItemPopup called');
  console.log('Row:', row);
  
  if (!row) {
    console.error('❌ No row provided to openWishlistItemPopup');
    return;
  }

  const id = row.dataset.id;
  const title = row.querySelector('.table__title')?.textContent || 'Product';
  const category = row.querySelector('.table__description')?.textContent || 'Category';
  const priceText = row.querySelector('.table__price')?.textContent || '0';
  const price = parseFloat(priceText.replace(/[^\d.]/g, '')) || 0;
  const img = row.querySelector('.table__img')?.src || 'assets/img/default.jpg';

  console.log('📋 Product data extracted:', { id, title, category, price, img });

  // Calculate old price for discount display
  const oldPrice = price * 1.2;

  const product = {
    id: id,
    title: title,
    category: category,
    price: price,
    oldPrice: Math.round(oldPrice * 100) / 100,
    img: img,
    brand: "Nike",
    description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit...",
    quantity: 1
  };

  console.log('🎁 Final product object:', product);
  console.log('🔍 Checking popup availability...');
  console.log('window.openPopup:', typeof window.openPopup);
  console.log('openPopup:', typeof openPopup);

  // Try multiple ways to open the popup
  if (typeof window.openPopup === 'function') {
    console.log('✅ Using window.openPopup');
    window.openPopup(product);
  } else if (typeof openPopup === 'function') {
    console.log('✅ Using openPopup');
    openPopup(product);
  } else {
    console.error('❌ No popup function available!');
    console.log('🔄 Fallback: adding directly to cart');
    
    // Fallback: add directly to cart
    if (typeof addToCart === 'function') {
      addToCart(product);
      removeWishlistItemById(id);
      showNotification('Product added to cart!');
    } else {
      console.error('❌ addToCart function also not available!');
      alert('Product added to cart!');
    }
  }
}
function removeWishlistItem(row) {
  const id = row.dataset.id;

  row.style.transition = 'opacity 0.3s ease';
  row.style.opacity = '0';

  setTimeout(() => {
    let wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
    wishlistItems = wishlistItems.filter(i => i.id !== id);
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));

    row.remove();
    updateCounter('wishlistCount', wishlistItems.length);
    checkEmptyWishlist();
  }, 300);
}

// This function will be called from the popup to add the wishlist item to cart
function addWishlistItemToCart(productData) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  
  const baseId = productData.id || _baseId(productData.title, productData.price, productData.img);
  const color = (productData.color || "").toString();
  const size = (productData.size || "").toString();
  const variantId = `${baseId}|c:${color}|s:${size}`;

  const idx = cartItems.findIndex((i) => i.id === variantId);
  if (idx !== -1) {
    cartItems[idx].quantity += productData.quantity || 1;
  } else {
    cartItems.push({
      id: variantId,
      title: productData.title,
      price: productData.price,
      img: productData.img,
      category: productData.category || "",
      color,
      size,
      quantity: productData.quantity || 1,
    });
  }

  localStorage.setItem('cartItems', JSON.stringify(cartItems));

  const newCount = cartItems.reduce((sum, i) => sum + Number(i.quantity || 0), 0);
  localStorage.setItem('cartCount', newCount);
  updateCounter('cartCount', newCount);

  showNotification("Product added to cart successfully!");

  // Remove from wishlist after adding to cart
  removeWishlistItemById(productData.id);
}

function removeWishlistItemById(id) {
  console.log('Removing wishlist item with ID:', id);
  
  let wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
  const initialLength = wishlistItems.length;
  
  wishlistItems = wishlistItems.filter(i => i.id !== id);
  localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  
  // Update the wishlist count
  updateCounter('wishlistCount', wishlistItems.length);
  
  // Refresh the wishlist display
  if (document.querySelector('.wishlist')) {
    loadWishlistItems();
  }
  
  console.log(`Wishlist item removed. Before: ${initialLength}, After: ${wishlistItems.length}`);
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

// Helper function from cart-manager.js
function _baseId(title, price, img) {
  if (typeof generateProductId === "function")
    return generateProductId(title, price, img);
  return _fallbackId(title, price, img);
}

function _fallbackId(title, price, img) {
  const base = (img || "").split("/").pop() || "noimg";
  return `${(title || "")
    .toLowerCase()
    .replace(/\s+/g, "-")}-${String(price || "").replace(/[^\d.]/g, "")}-${base}`;
}
// In wishlist-manager.js - Add debugging
function openWishlistItemPopup(row) {
  console.log('Opening popup for wishlist item');
  console.log('Row data:', row);
  
  // ... rest of the function code
  
  console.log('Product data:', product);
  console.log('Window.openPopup available:', typeof window.openPopup);
  console.log('openPopup function available:', typeof openPopup);
}

// Enhanced debug function
function debugWishlistPage() {
  console.log('=== WISHLIST DEBUG INFO ===');
  console.log('Wishlist page detected:', !!document.querySelector('.wishlist'));
  console.log('Add to cart buttons found:', document.querySelectorAll('.wishlist .add-to-cart-from-wishlist').length);
  console.log('Table rows with data-id:', document.querySelectorAll('.wishlist tr[data-id]').length);
  console.log('initializeWishlist function available:', typeof initializeWishlist);
  console.log('openWishlistItemPopup function available:', typeof openWishlistItemPopup);
  console.log('window.openPopup available:', typeof window.openPopup);
  console.log('openPopup function available:', typeof openPopup);
  console.log('addToCart function available:', typeof addToCart);
  console.log('Wishlist items in localStorage:', JSON.parse(localStorage.getItem('wishlistItems') || '[]').length);
  console.log('==========================');
}

// Enhanced initializeWishlist with better debugging
function initializeWishlist() {
  console.log('🚀 initializeWishlist called');
  debugWishlistPage();
  
  // Force reload wishlist items
  loadWishlistItems();
  
  // Additional debug after loading
  setTimeout(() => {
    console.log('After loadWishlistItems - Buttons:', document.querySelectorAll('.wishlist .add-to-cart-from-wishlist').length);
    console.log('After loadWishlistItems - Rows:', document.querySelectorAll('.wishlist tr[data-id]').length);
  }, 100);
}
// Add to wishlist-manager.js
function verifyPopupFunctionality() {
  console.log('=== POPUP FUNCTIONALITY VERIFICATION ===');
  console.log('openPopup function available:', typeof openPopup);
  console.log('window.openPopup available:', typeof window.openPopup);
  console.log('addToCart function available:', typeof addToCart);
  console.log('Wishlist items:', JSON.parse(localStorage.getItem('wishlistItems') || '[]').length);
  console.log('========================================');
}

// Call this in initializeWishlist
function initializeWishlist() {
  console.log('initializeWishlist called');
  verifyPopupFunctionality();
  debugWishlistPage();
  loadWishlistItems();
}
// Direct popup fallback for wishlist
function openWishlistPopupDirectly(product) {
  console.log('🔄 Using direct popup fallback');
  
  const popup = document.getElementById("cart-popup");
  if (!popup) {
    console.error('❌ Popup element not found!');
    return false;
  }

  // Basic popup setup (simplified version)
  document.getElementById("popup-title").textContent = product.title;
  document.getElementById("popup-category").textContent = product.category;
  document.getElementById("popup-img").src = product.img;
  document.getElementById("popup-new-price").textContent = `$${product.price.toFixed(2)}`;
  document.getElementById("popup-old-price").textContent = `$${product.oldPrice.toFixed(2)}`;
  document.getElementById("popup-discount").textContent = `-${Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%`;

  // Show popup
  popup.classList.add("active");
  document.body.style.overflow = "hidden";

  // Setup confirm button
  const confirmBtn = document.getElementById("confirm-add");
  if (confirmBtn) {
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    newConfirmBtn.addEventListener("click", function() {
      // Add to cart logic here
      if (typeof addToCart === 'function') {
        addToCart({
          ...product,
          color: "hsl(0, 0%, 100%)", // default color
          size: "M" // default size
        });
        removeWishlistItemById(product.id);
        showNotification("Product moved to cart successfully!");
      }
      
      // Close popup
      popup.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  // Close button
  const closeBtn = document.getElementById("popup-close");
  if (closeBtn) {
    closeBtn.onclick = function() {
      popup.classList.remove("active");
      document.body.style.overflow = "";
    };
  }

  return true;
}