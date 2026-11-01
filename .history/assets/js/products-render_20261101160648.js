/*=============== DYNAMIC PRODUCT RENDERING ===============*/

async function fetchAll() {
  try {
    // Change this URL to your Node.js backend port!
    const res = await fetch('http://localhost:3000/api/products');
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Updated HTML structure to match the new design
function cardHTML(p) {
  const image = p.image_url || 'assets/img/product-1-1.jpg';
  const badge = p.badge ? `<div class="product__badge light-pink">${p.badge}</div>` : '';
  
  return `
    <div class="product__item">
      <div class="product__banner">
        <a href="details.html" class="product__images">
          <img src="${image}" alt="${p.title}">
          <img src="${image}" alt="" class="product__img hover">
        </a>
        ${badge}
        <!-- Note: product__actions will be automatically injected by main.js -->
      </div>

      <div class="product__content">
        <span class="product__category">${p.category || 'Clothing'}</span>
        <a href="details.html">
          <h3 class="product__title">${p.title}</h3>
        </a>
        <div class="product__rating">
          <i class="fi fi-br-star"></i><i class="fi fi-br-star"></i>
          <i class="fi fi-br-star"></i><i class="fi fi-br-star"></i>
          <i class="fi fi-br-star"></i>
        </div>
        <div class="product__price flex">
          <span class="new__price">$${Number(p.price).toFixed(2)}</span>
          <span class="old__price">$${(Number(p.price) * 1.2).toFixed(2)}</span>
        </div>
      </div>
    </div>
  `;
}

// HOME PAGE: Distribute products into their target tabs
async function renderHomeTargets() {
  // Find all the target containers on the home page
  const sections = {
    'featured': document.querySelector('#featured .products__container'),
    'popular': document.querySelector('#popular .products__container'),
    'new-added': document.querySelector('#new-added .products__container'),
    'new-trending': document.querySelector('#new-trending')
  };

  // If we aren't on the home page, skip
  if (!sections.featured) return;

  const products = await fetchAll();

  // Clear existing hardcoded products
  Object.values(sections).forEach(sec => { if (sec) sec.innerHTML = ''; });

  // Insert dynamic products
  products.forEach(p => {
    // Ensure targets is an array
    const targets = typeof p.targets === 'string' ? p.targets.split(',') : (p.targets || []);
    
    targets.forEach(t => {
      const targetKey = t.trim();
      const container = sections[targetKey];
      
      if (container) {
        const node = document.createElement('div');
        node.innerHTML = cardHTML(p);
        const productElement = node.firstElementChild;

        // Add swiper-slide class if it's going into the trending slider
        if (targetKey === 'new-trending') {
          productElement.classList.add('swiper-slide');
        }
        
        container.appendChild(productElement);
      }
    });
  });
}

// SHOP PAGE: Show all products
async function renderShopAll() {
  const shopContainer = document.querySelector('.shop .products__container') || document.querySelector('.products.section--lg .products__container');
  if (!shopContainer) return;

  const products = await fetchAll();
  
  // Clear existing hardcoded products
  shopContainer.innerHTML = '';
  
  // Insert dynamic products
  products.forEach(p => {
    const node = document.createElement('div');
    node.innerHTML = cardHTML(p);
    shopContainer.appendChild(node.firstElementChild);
  });
}

// Run only after components (header, footer, etc.) have loaded so the DOM is ready
document.addEventListener('componentsLoaded', () => {
  renderHomeTargets();
  renderShopAll();
});