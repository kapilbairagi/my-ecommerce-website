/*=============== WISHLIST FUNCTIONALITY ===============*/

function addToWishlist(product) {
  let wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
  const productId = product.id || generateProductId(product.title, product.price, product.img);

  if (!wishlistItems.find(item => item.id === productId)) {
    wishlistItems.push({
      id: productId,
      title: product.title,
      category: product.category || '',
      price: product.price,
      oldPrice: product.oldPrice || null,
      img: product.img || 'assets/img/product-1-1.jpg'
    });
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
    updateWishlistCount();
    showNotification('Product added to wishlist successfully!');
  } else {
    showNotification('This product is already in your wishlist!');
  }
}

function initializeWishlist() {
  loadWishlistItems();
}

function loadWishlistItems() {
  const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
  const table = document.querySelector('.wishlist .table');
  if (!table) return;

  table.querySelectorAll('tr:not(:first-child)').forEach(r => r.remove());

  wishlistItems.forEach(item => {
    const tr = document.createElement('tr');
    tr.dataset.id = item.id;
    
    let discountHtml = '';
    if (item.oldPrice && item.oldPrice > item.price) {
      const discount = Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100);
      discountHtml = `<span class="table__discount">-${discount}%</span>`;
    }
    
    tr.innerHTML = `
      <td><img src="${item.img}" alt="product image" class="table__img"></td>
      <td>
        <h3 class="table__title">${item.title}</h3>
        <p class="table__description">${item.category}</p>
      </td>
      <td>
        <div class="table__price-group">
          <span class="table__price">$${item.price.toFixed(2)}</span>
          ${discountHtml}
        </div>
      </td>
      <td><span class="table__stock in-stock">In Stock</span></td>
      <td><button class="btn btn--sm add-to-cart-from-wishlist">Add To Cart</button></td>
      <td><i class="fi fi-br-trash table__trash"></i></td>
    `;
    table.appendChild(tr);
  });

  updateWishlistCount();
  checkEmptyWishlist();
  attachWishlistEventListeners();
}

function attachWishlistEventListeners() {
  // Remove items
  document.querySelectorAll('.wishlist .table__trash').forEach(btn => {
    btn.addEventListener('click', function() {
      const row = this.closest('tr');
      removeWishlistItem(row);
    });
  });

  // Add to cart - open popup
  document.querySelectorAll('.wishlist .add-to-cart-from-wishlist').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const row = this.closest('tr');
      openWishlistItemPopup(row);
    });
  });
}

function openWishlistItemPopup(row) {
  const id = row.dataset.id;
  const title = row.querySelector('.table__title').textContent;
  const category = row.querySelector('.table__description').textContent;
  const price = parseFloat(row.querySelector('.table__price').textContent.replace('$', ''));
  const img = row.querySelector('.table__img').src;

  // Calculate old price from discount
  const discountEl = row.querySelector('.table__discount');
  let oldPrice = null;
  if (discountEl) {
    const discountPercent = parseInt(discountEl.textContent.replace(/[^\d]/g, ''));
    oldPrice = price / (1 - discountPercent / 100);
  }

  const product = {
    id,
    title,
    category,
    price,
    oldPrice,
    img,
    fromWishlist: true
  };

  if (window.openPopup) {
    window.openPopup(product);
    overrideConfirmForWishlist(product, id);
  }
}

function overrideConfirmForWishlist(product, wishlistItemId) {
  const confirmBtn = document.querySelector('#confirm-add');
  if (!confirmBtn) return;

  const newConfirmBtn = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

  newConfirmBtn.addEventListener('click', function() {
    const selectedColor = document.querySelector('.color__link.color-active')?.style.backgroundColor;
    const selectedSize = document.querySelector('.size__link.size-active')?.textContent;
    const quantity = parseInt(document.querySelector('#popup-quantity').value) || 1;

    if (!selectedColor || !selectedSize) {
      showNotification('Please select color and size before adding to cart!', 'error');
      return;
    }

    addToCartFromWishlist({
      ...product,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity
    }, wishlistItemId);
  });
}

function addToCartFromWishlist(productData, wishlistItemId) {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  const baseId = productData.id;
  const color = productData.color;
  const size = productData.size;
  const variantId = `${baseId}|c:${color}|s:${size}`;

  const existingItem = cartItems.find((i) => i.id === variantId);
  if (existingItem) {
    existingItem.quantity += productData.quantity || 1;
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

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  updateCartCount();

  // Remove from wishlist
  removeWishlistItemById(wishlistItemId);
  showNotification('Product added to cart successfully!');
  
  // Close popup
  const popup = document.getElementById('cart-popup');
  if (popup) {
    popup.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function removeWishlistItem(row) {
  const id = row.dataset.id;
  row.style.opacity = '0';

  setTimeout(() => {
    removeWishlistItemById(id);
  }, 300);
}

function removeWishlistItemById(id) {
  let wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
  wishlistItems = wishlistItems.filter(i => i.id !== id);
  localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  updateWishlistCount();
  loadWishlistItems();
}

function updateWishlistCount() {
  const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
  const count = wishlistItems.length;
  localStorage.setItem('wishlistCount', count);
  
  const wishlistCount = localStorage.getItem('wishlistCount') || '0';
  document.querySelectorAll('.header__action-btn[href="wishlist.html"] .count').forEach(el => {
    el.textContent = wishlistCount;
    el.style.display = wishlistCount === '0' ? 'none' : 'flex';
  });
}

function checkEmptyWishlist() {
  const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
  const container = document.querySelector('.wishlist .table__container');

  if (container && wishlistItems.length === 0) {
    localStorage.setItem('wishlistCount', '0');
    updateWishlistCount();

    container.innerHTML = `
      <div class="empty-wishlist">
        <i class="fi fi-br-heart empty-wishlist__icon"></i>
        <h2 class="empty-wishlist__title">Your wishlist is empty</h2>
        <p class="empty-wishlist__description">Looks like you haven't added any items to your wishlist yet.</p>
        <a href="shop.html" class="btn btn--md flex">
          <i class="fi-br-shopping-bag"></i> 
          Start Shopping
        </a>
      </div>
    `;
  }
}

// Make functions globally available
window.addToWishlist = addToWishlist;
window.initializeWishlist = initializeWishlist;