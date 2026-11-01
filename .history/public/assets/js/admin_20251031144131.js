// toast
const toast = (msg, type = 'success') => {
  const el = document.getElementById('admin-toast');
  el.textContent = msg; 
  el.className = 'notification ' + type;
  el.style.opacity = '1'; 
  setTimeout(() => el.style.opacity = '0', 2200);
};

// preview + d&d - FIXED VERSION
const fileInput = document.getElementById('imageInput');
const uploader = document.querySelector('.admin__uploader'); // Changed to class selector
const thumbImg = document.getElementById('thumbImg');
const thumbPh = document.getElementById('thumbPlaceholder');

const previewFile = (file) => {
  if (!file) { 
    thumbImg.style.display = 'none'; 
    thumbPh.style.display = 'block'; 
    return; 
  }
  const reader = new FileReader();
  reader.onload = e => { 
    thumbImg.src = e.target.result; 
    thumbImg.style.display = 'block'; 
    thumbPh.style.display = 'none'; 
  };
  reader.readAsDataURL(file);
};

// Fix click event - use the uploader div
if (uploader) {
  uploader.addEventListener('click', () => fileInput.click());
}

if (fileInput) {
  fileInput.addEventListener('change', () => previewFile(fileInput.files[0]));
}

// Drag and drop functionality
if (uploader) {
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => 
    uploader.addEventListener(evt, e => { 
      e.preventDefault(); 
      e.stopPropagation(); 
    })
  );

  ['dragenter', 'dragover'].forEach(evt => 
    uploader.addEventListener(evt, () => uploader.classList.add('dragover'))
  );

  ['dragleave', 'drop'].forEach(evt => 
    uploader.addEventListener(evt, () => uploader.classList.remove('dragover'))
  );

  uploader.addEventListener('drop', (e) => {
    const file = e.dataTransfer.files[0]; 
    if (!file) return;
    const dt = new DataTransfer(); 
    dt.items.add(file); 
    fileInput.files = dt.files; 
    previewFile(file);
  });
}

// submit
const form = document.getElementById('product-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    try {
      const res = await fetch('/api/products', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const product = await res.json();
      toast('Product published!');
      form.reset(); 
      previewFile(null);
      prependProduct(product);
    } catch (err) { 
      toast(err.message || 'Something went wrong', 'error'); 
    }
  });
}

// list (for admin page only)
async function loadAdminProducts() {
  try {
    const res = await fetch('/api/products');
    const items = await res.json();
    const wrap = document.getElementById('admin-products');
    wrap.innerHTML = '';
    items.forEach(appendProduct);
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

function productCard(p) {
  return `
    <div class="product__item">
      <div class="product__images">
        <img src="${p.image_url || 'assets/img/product-1-1.jpg'}" alt="${p.title}" />
        ${p.badge ? `<span class="product__badge">${p.badge}</span>` : ``}
      </div>
      <div class="product__content">
        <span class="product__category">${p.category || ''}</span>
        <h3 class="product__title">${p.title}</h3>
        <div class="product__price">
          <span class="new__price">$${Number(p.price).toFixed(2)}</span>
        </div>
      </div>
    </div>
  `;
}

function prependProduct(p){ 
  const wrap = document.getElementById('admin-products'); 
  const div = document.createElement('div'); 
  div.innerHTML = productCard(p); 
  wrap.prepend(div.firstElementChild); 
}

function appendProduct(p){ 
  const wrap = document.getElementById('admin-products'); 
  const div = document.createElement('div'); 
  div.innerHTML = productCard(p); 
  wrap.appendChild(div.firstElementChild); 
}

// Load products when page loads
document.addEventListener('DOMContentLoaded', () => {
  loadAdminProducts();
});