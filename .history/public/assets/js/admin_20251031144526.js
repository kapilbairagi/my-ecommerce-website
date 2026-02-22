// toast
const toast = (msg, type = 'success') => {
    const el = document.getElementById('admin-toast');
    if (el) {
        el.textContent = msg;
        el.className = 'notification ' + type;
        el.style.opacity = '1';
        setTimeout(() => el.style.opacity = '0', 2200);
    }
};

// Initialize file upload functionality
function initializeFileUpload() {
    const fileInput = document.getElementById('imageInput');
    const uploader = document.querySelector('.admin__uploader');
    const thumbImg = document.getElementById('thumbImg');
    const thumbPh = document.getElementById('thumbPlaceholder');

    console.log('File upload elements:', { fileInput, uploader, thumbImg, thumbPh });

    if (!fileInput || !uploader) {
        console.error('Required file upload elements not found');
        return;
    }

    const previewFile = (file) => {
        if (!file) {
            if (thumbImg) thumbImg.style.display = 'none';
            if (thumbPh) thumbPh.style.display = 'block';
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            if (thumbImg) {
                thumbImg.src = e.target.result;
                thumbImg.style.display = 'block';
            }
            if (thumbPh) thumbPh.style.display = 'none';
        };
        reader.readAsDataURL(file);
    };

    // Click to select file
    uploader.addEventListener('click', (e) => {
        e.preventDefault();
        fileInput.click();
    });

    // File selection change
    fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files[0]) {
            previewFile(fileInput.files[0]);
        }
    });

    // Drag and drop functionality
    const preventDefaults = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploader.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        uploader.addEventListener(eventName, () => {
            uploader.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploader.addEventListener(eventName, () => {
            uploader.classList.remove('dragover');
        }, false);
    });

    uploader.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files && files[0]) {
            fileInput.files = files;
            previewFile(files[0]);
        }
    });
}

// Form submission
function initializeForm() {
    const form = document.getElementById('product-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            try {
                submitBtn.innerHTML = 'Publishing...';
                submitBtn.disabled = true;

                const fd = new FormData(form);
                
                // Log form data for debugging
                for (let [key, value] of fd.entries()) {
                    console.log(key + ': ' + value);
                }

                const res = await fetch('/api/products', {
                    method: 'POST',
                    body: fd
                });

                if (!res.ok) {
                    throw new Error(`Upload failed: ${res.status} ${res.statusText}`);
                }

                const product = await res.json();
                toast('Product published successfully!');
                
                // Reset form
                form.reset();
                const thumbImg = document.getElementById('thumbImg');
                const thumbPh = document.getElementById('thumbPlaceholder');
                if (thumbImg) thumbImg.style.display = 'none';
                if (thumbPh) thumbPh.style.display = 'block';
                
                // Add to product list
                prependProduct(product);

            } catch (err) {
                console.error('Upload error:', err);
                toast(err.message || 'Something went wrong while publishing the product', 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Product list management
function productCard(p) {
    return `
        <div class="product__item">
            <div class="product__images">
                <img src="${p.image_url || 'assets/img/product-1-1.jpg'}" alt="${p.title}" />
                ${p.badge ? `<span class="product__badge">${p.badge}</span>` : ''}
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

function prependProduct(p) {
    const wrap = document.getElementById('admin-products');
    if (wrap) {
        const div = document.createElement('div');
        div.innerHTML = productCard(p);
        wrap.prepend(div.firstElementChild);
    }
}

function appendProduct(p) {
    const wrap = document.getElementById('admin-products');
    if (wrap) {
        const div = document.createElement('div');
        div.innerHTML = productCard(p);
        wrap.appendChild(div.firstElementChild);
    }
}

async function loadAdminProducts() {
    try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to load products');
        const items = await res.json();
        const wrap = document.getElementById('admin-products');
        if (wrap) {
            wrap.innerHTML = '';
            items.forEach(appendProduct);
        }
    } catch (error) {
        console.error('Error loading products:', error);
        toast('Failed to load products', 'error');
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin page loaded');
    
    initializeFileUpload();
    initializeForm();
    loadAdminProducts();
});