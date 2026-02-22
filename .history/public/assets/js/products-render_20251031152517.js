function generateProductId(title, price, imgSrc) {
  const base = (imgSrc || '').split('/').pop() || 'noimg';
  return `${title.toLowerCase().replace(/\s+/g, '-')}-${String(price).replace(/[^\d.]/g, '')}-${base.toLowerCase().replace(/\W+/g, '')}`;
}

async function fetchAll() {
  const res = await fetch('/api/products');
  return await res.json();
}

function cardHTML(p) {
  const id = generateProductId(p.title, p.price, p.image_url);
  return `
    <div class="product__item">
      <div class="product__images">
        <img src="${p.image_url || 'public\assets\img\product-1-1.jpg'}" alt="${p.title}">
        ${p.badge ? `<span class="product__badge">${p.badge}</span>` : ``}
      </div>
      <div class="product__content">
        <span class="product__category">${p.category || ''}</span>
        <h3 class="product__title">${p.title}</h3>
        <div class="product__price">
          <span class="new__price">$${Number(p.price).toFixed(2)}</span>
        </div>
        <div class="product__actions">
          <a href="#" class="action__btn" aria-label="Add To Wishlist"><i class="fi fi-br-heart"></i></a>
          <a href="#" class="cart__btn btn btn--sm"><i class="fi-br-shopping-bag"></i> Add To Cart</a>
        </div>
      </div>
    </div>
  `;
}

function wireActions(container) {
  container.querySelectorAll('.action__btn[aria-label="Add To Wishlist"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.product__item');
      const title = card.querySelector('.product__title').textContent.trim();
      const price = parseFloat(card.querySelector('.new__price').textContent.replace(/[^\d.]/g, ''));
      const category = (card.querySelector('.product__category')?.textContent || '').trim();
      const img = card.querySelector('.product__images img')?.src || 'assets/img/product-1-1.jpg';
      const product = { id: generateProductId(title, price, img), title, price, category, img };
      if (typeof addToWishlist === 'function') addToWishlist(product);
    });
  });
  container.querySelectorAll('.cart__btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.product__item');
      const title = card.querySelector('.product__title').textContent.trim();
      const price = parseFloat(card.querySelector('.new__price').textContent.replace(/[^\d.]/g, ''));
      const category = (card.querySelector('.product__category')?.textContent || '').trim();
      const img = card.querySelector('.product__images img')?.src || 'assets/img/product-1-1.jpg';
      const product = { id: generateProductId(title, price, img), title, price, category, img, quantity: 1 };
      if (typeof addToCart === 'function') addToCart(product);
    });
  });
}

// HOME: put products into the right sections by target
async function renderHomeTargets() {
  const sections = {
    'featured'     : document.querySelector('#featured, [data-target="#featured"] .grid, [data-target="#featured"]'),
    'popular'      : document.querySelector('#popular, [content="#popular"] .grid, [content="#popular"]'),
    'new-added'    : document.querySelector('#new-added, [data-target="#new-added"] .grid, [data-target="#new-added"]'),
    'new-arrivals' : document.querySelector('#new-arrivals, [data-target="#new-arrivals"] .grid, [data-target="#new-arrivals"]'),
  };

  const products = await fetchAll();

  // Clear sections if they exist
  Object.values(sections).forEach(sec => { if (sec) sec.innerHTML = ''; });

  products.forEach(p => {
    const targetsCSV = p.targets || '';
    const targets = targetsCSV ? targetsCSV.split(',') : [];
    targets.forEach(t => {
      const container = sections[t];
      if (container) {
        const node = document.createElement('div');
        node.innerHTML = cardHTML(p);
        container.appendChild(node.firstElementChild);
      }
    });
  });

  // Wire actions once all DOM inserted
  Object.values(sections).forEach(sec => { if (sec) wireActions(sec); });
}

// SHOP: show all products (or you can add filters later)
async function renderShopAll() {
  const shopContainer = document.querySelector('[data-products-shop], .shop .grid');
  if (!shopContainer) return;
  const products = await fetchAll();
  shopContainer.innerHTML = products.map(cardHTML).join('');
  wireActions(shopContainer);
}

document.addEventListener('DOMContentLoaded', () => {
  renderHomeTargets();
  renderShopAll();
});
