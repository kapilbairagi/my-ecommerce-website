/*=============== ADMIN DASHBOARD FUNCTIONALITY ===============*/

function showAdminToast(message, type = 'success') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; padding: 15px 25px; border-radius: 8px;
        background: ${type === 'success' ? 'hsl(176,88%,27%)' : '#dc3545'}; color: white;
        z-index: 10000; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-width: 400px; animation: slideInRight 0.3s ease forwards;
    `;

    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => { if (notification.parentNode) notification.parentNode.removeChild(notification); }, 300);
    }, 3000);
}

/*=============== ADMIN FILE UPLOAD ===============*/
let uploadedImageBase64 = ""; // Store base64 image here

function initializeAdminFileUpload() {
    const fileInput = document.getElementById('imageInput');
    const uploader = document.getElementById('uploader');
    const thumbImg = document.getElementById('thumbImg');
    const thumbPh = document.getElementById('thumbPlaceholder');

    if (!fileInput || !uploader) return;

    

    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            if (!file.type.startsWith('image/')) return showAdminToast('Please select a valid image file', 'error');
            if (file.size > 5 * 1024 * 1024) return showAdminToast('Image size should be less than 5MB', 'error');

            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedImageBase64 = e.target.result; // Save base64 string
                if (thumbImg) {
                    thumbImg.src = uploadedImageBase64;
                    thumbImg.style.display = 'block';
                    thumbImg.style.maxWidth = '100%';
                    thumbImg.style.maxHeight = '100%';
                    thumbImg.style.objectFit = 'cover';
                }
                if (thumbPh) thumbPh.style.display = 'none';
                uploader.style.borderColor = 'var(--first-color)';
                uploader.style.backgroundColor = 'var(--first-color-alt)';
            };
            reader.readAsDataURL(file);
        }
    });
}

/*=============== ADMIN FORM SUBMISSION ===============*/
function initializeAdminForm() {
    const form = document.getElementById('product-form');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        try {
            submitBtn.innerHTML = '<i class="fi-br-loading"></i> Publishing...';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            
            if (!formData.get('title') || !formData.get('price') || !document.getElementById('imageInput').files[0]) {
                throw new Error('Title, Price, and Image are required!');
            }

            // Send to your Node.js backend API
            const response = await fetch('/api/products', {
                method: 'POST',
                body: formData // Backend should handle multipart/form-data (using multer)
            });

            if (!response.ok) {
                throw new Error('Server error: Could not upload product.');
            }

            showAdminToast('Product published successfully!');
            
            form.reset();
            resetAdminImagePreview();
            
            // Optionally refresh the admin list
            loadAdminProducts(); 
            
        } catch (error) {
            showAdminToast(error.message, 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

function resetAdminImagePreview() {
    const thumbImg = document.getElementById('thumbImg');
    const thumbPh = document.getElementById('thumbPlaceholder');
    if (thumbImg) { thumbImg.style.display = 'none'; thumbImg.src = ''; }
    if (thumbPh) { thumbPh.style.display = 'block'; }
    const uploader = document.getElementById('uploader');
    if (uploader) { uploader.style.borderColor = ''; uploader.style.backgroundColor = ''; }
}

/*=============== ADMIN PRODUCTS LIST ===============*/
function addProductToAdminList(product) {
    const productGrid = document.getElementById('admin-products');
    if (!productGrid) return;

    const productHTML = `
        <div class="product__item" data-product-id="${product.id}">
            <div class="product__images" style="padding: 1rem; text-align: center;">
                <img src="${product.image_url}" alt="${product.title}" style="height: 150px; object-fit: contain;" />
            </div>
            <div class="product__content">
                <span class="product__category">${product.category}</span>
                <h3 class="product__title" style="font-size: 1rem;">${product.title}</h3>
                <div class="product__price">
                    <span class="new__price">$${parseFloat(product.price).toFixed(2)}</span>
                </div>
                <div style="font-size: 0.75rem; color: gray; margin-top: 5px;">
                    Targets: ${product.targets.join(', ') || 'None'}
                </div>
            </div>
        </div>
    `;
    productGrid.insertAdjacentHTML('afterbegin', productHTML);
}

function loadAdminProducts() {
    const adminProducts = JSON.parse(localStorage.getItem('adminProducts')) || [];
    const productGrid = document.getElementById('admin-products');
    if (productGrid) {
        productGrid.innerHTML = '';
        adminProducts.forEach(product => addProductToAdminList(product));
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('product-form')) {
        initializeAdminFileUpload();
        initializeAdminForm();
        loadAdminProducts();
    }
});