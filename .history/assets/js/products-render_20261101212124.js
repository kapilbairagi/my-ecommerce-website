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

