/*=============== ADMIN DASHBOARD FUNCTIONALITY ===============*/

// Toast notification for admin
function showAdminToast(message, type = 'success') {
    // Remove any existing notifications first
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        background: ${type === 'success' ? 'hsl(176,88%,27%)' : '#dc3545'};
        color: white;
        z-index: 10000;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-width: 400px;
        animation: slideInRight 0.3s ease forwards;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/*=============== ADMIN FILE UPLOAD ===============*/
function initializeAdminFileUpload() {
    console.log('Initializing admin file upload...');
    
    const fileInput = document.getElementById('imageInput');
    const uploader = document.getElementById('uploader');
    const thumbImg = document.getElementById('thumbImg');
    const thumbPh = document.getElementById('thumbPlaceholder');

    if (!fileInput || !uploader) {
        console.error('Admin file upload elements not found');
        return;
    }

    console.log('Admin file upload elements found');

    // Make uploader clearly clickable
    uploader.style.cursor = 'pointer';
    uploader.setAttribute('role', 'button');
    uploader.setAttribute('tabindex', '0');
    uploader.setAttribute('aria-label', 'Click to select product image');

    // Enhanced click handler
    uploader.addEventListener('click', function(e) {
        console.log('Admin uploader clicked');
        e.preventDefault();
        e.stopPropagation();
        fileInput.click();
    });

    // Also allow keyboard activation
    uploader.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInput.click();
        }
    });

    // File selection handler
    fileInput.addEventListener('change', function(e) {
        console.log('Admin file selected:', this.files[0]);
        if (this.files && this.files[0]) {
            const file = this.files[0];
            
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showAdminToast('Please select a valid image file (JPEG, PNG, GIF, etc.)', 'error');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showAdminToast('Image size should be less than 5MB', 'error');
                return;
            }

            previewAdminImage(file);
        }
    });

    // Image preview function
    function previewAdminImage(file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            console.log('Admin image preview loaded');
            if (thumbImg) {
                thumbImg.src = e.target.result;
                thumbImg.style.display = 'block';
                thumbImg.style.maxWidth = '100%';
                thumbImg.style.maxHeight = '100%';
                thumbImg.style.objectFit = 'cover';
            }
            if (thumbPh) {
                thumbPh.style.display = 'none';
            }
            
            // Visual feedback
            uploader.style.borderColor = 'var(--first-color)';
            uploader.style.backgroundColor = 'var(--first-color-alt)';
        };
        
        reader.onerror = function() {
            console.error('Admin image preview error');
            showAdminToast('Error reading image file', 'error');
        };
        
        reader.readAsDataURL(file);
    }

    // Enhanced drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploader.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploader.addEventListener(eventName, function() {
            this.classList.add('dragover');
            this.style.borderColor = 'var(--first-color)';
            this.style.backgroundColor = 'var(--second-color)';
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploader.addEventListener(eventName, function() {
            this.classList.remove('dragover');
            this.style.borderColor = '';
            this.style.backgroundColor = '';
        }, false);
    });

    uploader.addEventListener('drop', function(e) {
        console.log('Admin file dropped');
        const files = e.dataTransfer.files;
        if (files && files[0]) {
            fileInput.files = files;
            const event = new Event('change');
            fileInput.dispatchEvent(event);
        }
    });

    console.log('Admin file upload initialized successfully');
}

/*=============== ADMIN FORM SUBMISSION ===============*/
function initializeAdminForm() {
    const form = document.getElementById('product-form');
    
    if (!form) {
        console.error('Admin form not found');
        return;
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Admin form submission started');

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        try {
            // Show loading state
            submitBtn.innerHTML = '<i class="fi-br-loading"></i> Publishing...';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            
            // Validate required fields
            const title = formData.get('title');
            const price = formData.get('price');
            const imageFile = document.getElementById('imageInput').files[0];

            if (!title || !title.trim()) {
                throw new Error('Product title is required');
            }

            if (!price || parseFloat(price) <= 0) {
                throw new Error('Valid product price is required');
            }

            if (!imageFile) {
                throw new Error('Product image is required');
            }

            // Log form data for debugging
            console.log('Admin form data:', {
                title: formData.get('title'),
                price: formData.get('price'),
                category: formData.get('category'),
                badge: formData.get('badge'),
                description: formData.get('description'),
                targets: formData.getAll('targets'),
                image: imageFile.name
            });

            // Simulate API call (replace with actual API endpoint)
            const product = await submitProductToAPI(formData);
            
            showAdminToast('Product published successfully!');
            
            // Reset form
            form.reset();
            resetAdminImagePreview();
            
            // Add to products list
            addProductToAdminList(product);
            
        } catch (error) {
            console.error('Admin form submission error:', error);
            showAdminToast(error.message, 'error');
        } finally {
            // Restore button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Simulate API submission
async function submitProductToAPI(formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate API call with 90% success rate
            if (Math.random() > 0.1) {
                resolve({
                    id: 'prod_' + Date.now(),
                    title: formData.get('title'),
                    price: formData.get('price'),
                    category: formData.get('category') || 'Uncategorized',
                    badge: formData.get('badge') || '',
                    description: formData.get('description') || '',
                    image_url: URL.createObjectURL(formData.get('image')) || 'assets/img/product-1-1.jpg',
                    targets: formData.getAll('targets'),
                    created_at: new Date().toISOString()
                });
            } else {
                reject(new Error('Server error: Unable to publish product. Please try again.'));
            }
        }, 2000);
    });
}

// Reset image preview
function resetAdminImagePreview() {
    const thumbImg = document.getElementById('thumbImg');
    const thumbPh = document.getElementById('thumbPlaceholder');
    
    if (thumbImg) {
        thumbImg.style.display = 'none';
        thumbImg.src = '';
    }
    if (thumbPh) {
        thumbPh.style.display = 'block';
    }
    
    // Reset uploader style
    const uploader = document.getElementById('uploader');
    if (uploader) {
        uploader.style.borderColor = '';
        uploader.style.backgroundColor = '';
    }
}

/*=============== ADMIN PRODUCTS MANAGEMENT ===============*/
function addProductToAdminList(product) {
    const productGrid = document.getElementById('admin-products');
    if (!productGrid) return;

    const productHTML = `
        <div class="product__item" data-product-id="${product.id}">
            <div class="product__images">
                <img src="${product.image_url}" alt="${product.title}" />
                ${product.badge ? `<span class="product__badge">${product.badge}</span>` : ''}
            </div>
            <div class="product__content">
                <span class="product__category">${product.category}</span>
                <h3 class="product__title">${product.title}</h3>
                <div class="product__price">
                    <span class="new__price">$${parseFloat(product.price).toFixed(2)}</span>
                </div>
                <div class="product__meta" style="font-size: 0.75rem; color: var(--text-color-light); margin-top: 0.5rem;">
                    ${product.targets && product.targets.length > 0 ? 
                      `Targets: ${product.targets.join(', ')}` : 'No targets'}
                </div>
            </div>
        </div>
    `;

    productGrid.insertAdjacentHTML('afterbegin', productHTML);
}

async function loadAdminProducts() {
    try {
        // This would typically fetch from your API
        // const response = await fetch('/api/admin/products');
        // const products = await response.json();
        
        // For demo purposes, load sample products
        const sampleProducts = [
            {
                id: 'prod_1',
                title: "Wireless Headphones",
                price: "89.99",
                category: "Electronics",
                badge: "New",
                image_url: "assets/img/product-1-1.jpg",
                targets: ["featured", "popular"]
            },
            {
                id: 'prod_2',
                title: "Sports Running Shoes",
                price: "129.99", 
                category: "Footwear",
                badge: "Hot",
                image_url: "assets/img/product-2-1.jpg",
                targets: ["new-arrivals"]
            }
        ];
        
        const productGrid = document.getElementById('admin-products');
        if (productGrid) {
            productGrid.innerHTML = '';
            sampleProducts.forEach(product => {
                addProductToAdminList(product);
            });
        }
        
        console.log('Admin products loaded successfully');
    } catch (error) {
        console.error('Error loading admin products:', error);
        showAdminToast('Error loading products', 'error');
    }
}

/*=============== ADMIN PAGE INITIALIZATION ===============*/
function initializeAdminPage() {
    console.log('Initializing admin page...');
    
    // Initialize admin-specific functionality
    initializeAdminFileUpload();
    initializeAdminForm();
    loadAdminProducts();
    
    console.log('Admin page initialized successfully');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Starting admin initialization');
    
    // Check if we're on the admin page
    if (document.getElementById('product-form')) {
        initializeAdminPage();
    }
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAdminPage);
} else {
    initializeAdminPage();
}

// Make admin functions available globally for debugging
window.admin = {
    resetForm: function() {
        const form = document.getElementById('product-form');
        if (form) {
            form.reset();
            resetAdminImagePreview();
            showAdminToast('Form reset successfully');
        }
    },
    testUpload: function() {
        const uploader = document.getElementById('uploader');
        if (uploader) {
            uploader.click();
        }
    },
    simulateProduct: function() {
        const mockProduct = {
            id: 'test_' + Date.now(),
            title: 'Test Product',
            price: '49.99',
            category: 'Test Category',
            badge: 'Test',
            image_url: 'public\assets\img\product-1-1.jpg',
            targets: ['featured']
        };
        addProductToAdminList(mockProduct);
        showAdminToast('Test product added');
    }
};

console.log('Admin JavaScript loaded successfully');