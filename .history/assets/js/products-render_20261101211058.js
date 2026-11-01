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
  function showcaseHTML(p) {
  const image = p.image_url || 'assets/img/product-1-1.jpg';
  return `
    <div class="showcase__item">
      <a href="details.html" class="showcase__img-box">
        <img src="${image}" alt="${p.title}" class="showcase__img" onerror="this.src='assets/img/product-1-1.jpg'">
      </a>
      <div class="showcase__content">
        <a href="details.html">
          <h4 class="showcase__title">${p.title}</h4>
        </a>
        <div class="showcase__price flex">
          <span class="new__price">$${Number(p.price).toFixed(2)}</span>
          ${(p.old_price && Number(p.old_price) > 0) ? `<span class="old__price">$${Number(p.old_price).toFixed(2)}</span>` : ''}
        </div>
      </div>
    </div>
  `;
}
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

  // 1. HOME PAGE TABS & SHOWCASE
  const sections = {
    'featured': document.querySelector('#featured .products__container'),
    'popular': document.querySelector('#popular .products__container'),
    'new-added': document.querySelector('#new-added .products__container'),
    'new-trending': document.querySelector('#new-trending'),
    'showcase-hot': document.querySelector('#showcase-hot'),
    'showcase-deals': document.querySelector('#showcase-deals'),
    'showcase-top': document.querySelector('#showcase-top'),
    'showcase-trendy': document.querySelector('#showcase-trendy')
  };

  if (sections.featured) {
    // Clear all sections first
    Object.values(sections).forEach(sec => { if (sec) sec.innerHTML = ''; });

    products.forEach(p => {
      const targets = Array.isArray(p.targets) ? p.targets : [];
      
      targets.forEach(t => {
        const targetKey = t.trim();
        const container = sections[targetKey];
        
        if (container) {
          const node = document.createElement('div');
          
          // Check if it's a showcase section
          if (targetKey.includes('showcase')) {
            node.innerHTML = showcaseHTML(p);
            container.appendChild(node.firstElementChild);
          } 
          // Otherwise it's a normal product tab
          else {
            node.innerHTML = cardHTML(p);
            const el = node.firstElementChild;
            if (targetKey === 'new-trending') el.classList.add('swiper-slide');
            container.appendChild(el);
          }
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
