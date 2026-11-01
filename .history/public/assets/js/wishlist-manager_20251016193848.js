/*=============== WISHLIST FUNCTIONALITY ===============*/

// function addToWishlist(product) {
//   let wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
//   const productId = product.id || generateProductId(product.title, product.price, product.img);

//   const existingIndex = wishlistItems.findIndex(item => item.id === productId);
//   if (existingIndex === -1) {
//     wishlistItems.push({
//       id: productId,
//       title: product.title,
//       category: product.category || '',
//       price: product.price,
//       img: product.img || 'assets/img/product-1-1.jpg'
//     });
//     localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
//     updateCounter('wishlistCount', wishlistItems.length);
//     showNotification('Product added to wishlist successfully!');
//   } else {
//     showNotification('This product is already in your wishlist!');
//   }
// }

function initializeWishlist() {
  loadWishlistItems();
}

function loadWishlistItems() {
  const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
  const table = document.querySelector('.wishlist .table');
  if (!table) return;

  // Clear existing rows except header
  table.querySelectorAll('tr:not(:first-child)').forEach(r => r.remove());

  // Render each item with data-id
  wishlistItems.forEach(item => {
    const tr = document.createElement('tr');
    tr.dataset.id = item.id;
    tr.innerHTML = `
      <td><img src="${item.img}" alt="product image" class="table__img"></td>
      <td>
        <h3 class="table__title">${item.title}</h3>
        <p class="table__description">${item.category}</p>
      </td>
      <td><span class="table__price">$${Number(item.price).toFixed(2)}</span></td>
      <td><span class="table__stock">In Stock</span></td>
      <td><a href="#" class="btn btn--sm add-to-cart-from-wishlist">Add To Cart</a></td>
      <td><i class="fi fi-br-trash table__trash"></i></td>
    `;
    table.appendChild(tr);
  });

  updateCounter('wishlistCount', wishlistItems.length);
  checkEmptyWishlist();
  reattachWishlistEventListeners();
}

function reattachWishlistEventListeners() {
  document.querySelectorAll('.wishlist .table__trash').forEach(btn => {
    btn.addEventListener('click', function() {
      const row = this.closest('tr');
      removeWishlistItem(row);
    });
  });

  document.querySelectorAll('.wishlist .add-to-cart-from-wishlist').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const row = this.closest('tr');
      addToCartFromWishlist(row);
    });
  });
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

function addToCartFromWishlist(row) {
  const id = row.dataset.id;
  const title = row.querySelector('.table__title').textContent;
  const category = row.querySelector('.table__description').textContent;
  const price = parseFloat(row.querySelector('.table__price').textContent.replace(/[^\d.]/g, ''));
  const img = row.querySelector('.table__img').src;

  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const idx = cartItems.findIndex(item => item.id === id);

  if (idx !== -1) {
    cartItems[idx].quantity += 1;
  } else {
    cartItems.push({ id, title, category, price, quantity: 1, img });
  }
  localStorage.setItem('cartItems', JSON.stringify(cartItems));

  const currentCartCount = parseInt(localStorage.getItem('cartCount') || '0', 10);
  updateCounter('cartCount', currentCartCount + 1);

  showNotification('Item added to cart successfully!');
  removeWishlistItem(row);
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
        <a href="shop.html" class="btn btn--md"><i class="fi-br-shopping-bag"></i> Start Shopping</a>
      </div>
    `;
  }
}
