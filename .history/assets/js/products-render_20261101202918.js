/*=============== DYNAMIC PRODUCT RENDERING ===============*/

async function fetchAll() {
  try {
    // ADD { cache: 'no-store' } HERE
    const res = await fetch('http://localhost:3000/api/products', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

function cardHTML(p) {
  // If image_url is missing or broken, use a default image
  const image = p.image_url || 'assets/img/product-1-1.jpg';
  const badge = p.badge ? `<div class="product__badge light-pink">${p.badge}</div>` : '';
  
  return `
    <div class="product__item">
      <div class="product__banner">
        <a href="details.html" class="product__images">
          <img src="${image}" alt="${p.title}" onerror="this.src='assets/img/product-1-1.jpg'">
          <img src="${image}" alt="" class="product__img hover" onerror="this.src='assets/img/product-1-1.jpg'">
        </a>
        ${badge}
      </div>
      <div class="product__content">
        <span class="product__category">${p.category || 'Clothing'}</span>
        <a href="details.html"><h3 class="product__title">${p.title}</h3></a>
        <div class="product__rating">
          <i class="fi fi-br-star"></i><i class="fi fi-br-star"></i><i class="fi fi-br-star"></i><i class="fi fi-br-star"></i><i class="fi fi-br-star"></i>
        </div>
          <div class="product__price flex">
            <span class="new__price">$${Number(p.price).toFixed(2)}</span>
            ${p.old_price ? `<span class="old__price">$${Number(p.old_price).toFixed(2)}</span>` : ''}
          </div>
      </div>
    </div>
  `;
}

async function renderAllProducts() {
  const products = await fetchAll();
  if (products.length === 0) return;

  // 1. HOME PAGE TABS
  const homeSections = {
    'featured': document.querySelector('#featured .products__container'),
    'popular': document.querySelector('#popular .products__container'),
    'new-added': document.querySelector('#new-added .products__container'),
    'new-trending': document.querySelector('#new-trending')
  };

  if (homeSections.featured) {
    Object.values(homeSections).forEach(sec => { if (sec) sec.innerHTML = ''; });
    products.forEach(p => {
      const targets = Array.isArray(p.targets) ? p.targets : [];
      targets.forEach(t => {
        const container = homeSections[t.trim()];
        if (container) {
          const node = document.createElement('div');
          node.innerHTML = cardHTML(p);
          const el = node.firstElementChild;
          if (t.trim() === 'new-trending') el.classList.add('swiper-slide');
          container.appendChild(el);
        }
      });
    });
  }

  // 2. SHOP PAGE
  const shopContainer = document.querySelector('.shop .products__container') || document.querySelector('.products.section--lg .products__container');
  if (shopContainer && window.location.pathname.includes('shop.html')) {
    shopContainer.innerHTML = '';
    products.forEach(p => {
      const node = document.createElement('div');
      node.innerHTML = cardHTML(p);
      shopContainer.appendChild(node.firstElementChild);
    });
  }

  // 3. OFFERS PAGE (Puts all products into the first Swiper)
  if (window.location.pathname.includes('offers.html')) {
    const offersContainer = document.querySelector('#offers');
    if (offersContainer) {
      offersContainer.innerHTML = '';
      products.forEach(p => {
        const node = document.createElement('div');
        node.innerHTML = cardHTML(p);
        const el = node.firstElementChild;
        el.classList.add('swiper-slide'); // Required for Swiper
        offersContainer.appendChild(el);
      });
    }
  }
}

