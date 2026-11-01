// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin page loaded - initializing...');
    
    // Initialize all admin functionality
    initializeAdminFeatures();
});

function initializeAdminFeatures() {
    initializeFileUpload();
    initializeFormSubmission();
    loadAdminProducts();
}

// File upload functionality
function initializeFileUpload() {
    const fileInput = document.getElementById('imageInput');
    const uploader = document.getElementById('uploader');
    const thumbImg = document.getElementById('thumbImg');
    const thumbPh = document.getElementById('thumbPlaceholder');

    console.log('File upload elements:', { fileInput, uploader, thumbImg, thumbPh });

    if (!fileInput || !uploader) {
        console.error('File upload elements not found');
        return;
    }

    // Make uploader clearly clickable
    uploader.style.cursor = 'pointer';
    uploader.style.position = 'relative';
    
    // Add visual feedback on hover
    uploader.addEventListener('mouseenter', function() {
        this.style.borderColor = 'var(--first-color)';
        this.style.backgroundColor = 'var(--first-color-alt)';
    });
    
    uploader.addEventListener('mouseleave', function() {
        this.style.borderColor = '';
        this.style.backgroundColor = '';
    });

    // Click to select file - SIMPLE AND RELIABLE
    uploader.addEventListener('click', function(e) {
        console.log('Upload area clicked');
        e.preventDefault();
        e.stopPropagation();
        fileInput.click();
    });

    // Handle file selection
    fileInput.addEventListener('change', function(e) {
        console.log('File selected:', this.files[0]);
        if (this.files && this.files[0]) {
            previewFile(this.files[0]);
        }
    });

    // Preview file function
    function previewFile(file) {
        if (!file.type.match('image.*')) {
            showToast('Please select an image file', 'error');
            return;
        }

        const reader = new FileReader();
        
        reader.onload = function(e) {
            console.log('File preview loaded');
            if (thumbImg) {
                thumbImg.src = e.target.result;
                thumbImg.style.display = 'block';
            }
            if (thumbPh) {
                thumbPh.style.display = 'none';
            }
        };
        
        reader.onerror = function() {
            console.error('Error reading file');
            showToast('Error reading image file', 'error');
        };
        
        reader.readAsDataURL(file);
    }

    // Drag and drop functionality
    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        uploader.classList.add('dragover');
    }

    function handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        uploader.classList.remove('dragover');
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        uploader.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files && files[0]) {
            console.log('File dropped:', files[0]);
            fileInput.files = files;
            previewFile(files[0]);
        }
    }

    // Add drag and drop event listeners
    uploader.addEventListener('dragover', handleDragOver);
    uploader.addEventListener('dragleave', handleDragLeave);
    uploader.addEventListener('drop', handleDrop);

    console.log('File upload initialized successfully');
}

// Form submission
function initializeFormSubmission() {
    const form = document.getElementById('product-form');
    
    if (!form) {
        console.error('Product form not found');
        return;
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submission started');

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        try {
            // Show loading state
            submitBtn.innerHTML = 'Publishing...';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            
            // Log form data for debugging
            console.log('Form data collected:');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }

            // Check if image is selected
            const imageFile = document.getElementById('imageInput').files[0];
            if (!imageFile) {
                throw new Error('Please select an image for the product');
            }

            // Here you would typically send to your backend API
            // For now, we'll simulate a successful response
            await simulateApiCall(formData);
            
            showToast('Product published successfully!');
            
            // Reset form
            form.reset();
            resetImagePreview();
            
            // Add product to the list
            addProductToList(formData);
            
        } catch (error) {
            console.error('Form submission error:', error);
            showToast(error.message || 'Error publishing product', 'error');
        } finally {
            // Restore button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Simulate API call (replace with actual API call)
function simulateApiCall(formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate random success/failure for demo
            if (Math.random() > 0.1) { // 90% success rate for demo
                resolve({
                    id: Date.now(),
                    title: formData.get('title'),
                    price: formData.get('price'),
                    category: formData.get('category'),
                    badge: formData.get('badge'),
                    image_url: 'assets/img/product-1-1.jpg' // Default image
                });
            } else {
                reject(new Error('Server error: Please try again'));
            }
        }, 1500);
    });
}

// Reset image preview
function resetImagePreview() {
    const thumbImg = document.getElementById('thumbImg');
    const thumbPh = document.getElementById('thumbPlaceholder');
    
    if (thumbImg) {
        thumbImg.style.display = 'none';
        thumbImg.src = '';
    }
    if (thumbPh) {
        thumbPh.style.display = 'block';
    }
}

// Add product to the products list
function addProductToList(formData) {
    const product = {
        title: formData.get('title') || 'New Product',
        price: formData.get('price') || '0.00',
        category: formData.get('category') || 'Uncategorized',
        badge: formData.get('badge') || '',
        image_url: 'assets/img/product-1-1.jpg'
    };
    
    prependProduct(product);
}

// Toast notification system
function showToast(message, type = 'success') {
    const toast = document.getElementById('admin-toast');
    if (!toast) {
        console.error('Toast element not found');
        return;
    }
    
    toast.textContent = message;
    toast.className = `notification ${type}`;
    toast.style.opacity = '1';
    
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 3000);
}

// Product card template
function productCard(product) {
    return `
        <div class="product__item">
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
            </div>
        </div>
    `;
}

// Add product to the beginning of the list
function prependProduct(product) {
    const productsGrid = document.getElementById('admin-products');
    if (productsGrid) {
        const productElement = document.createElement('div');
        productElement.innerHTML = productCard(product);
        productsGrid.insertBefore(productElement.firstElementChild, productsGrid.firstChild);
    }
}

// Add product to the end of the list
function appendProduct(product) {
    const productsGrid = document.getElementById('admin-products');
    if (productsGrid) {
        const productElement = document.createElement('div');
        productElement.innerHTML = productCard(product);
        productsGrid.appendChild(productElement.firstElementChild);
    }
}

// Load existing products
async function loadAdminProducts() {
    try {
        // This would typically fetch from your API
        // const response = await fetch('/api/products');
        // const products = await response.json();
        
        // For demo, use sample products
        const sampleProducts = [
            {
                title: "Sample Product 1",
                price: "29.99",
                category: "Electronics",
                badge: "New",
                image_url: "assets/img/product-1-1.jpg"
            },
            {
                title: "Sample Product 2", 
                price: "49.99",
                category: "Clothing",
                badge: "Hot",
                image_url: "assets/img/product-2-1.jpg"
            }
        ];
        
        const productsGrid = document.getElementById('admin-products');
        if (productsGrid) {
            productsGrid.innerHTML = '';
            sampleProducts.forEach(product => {
                appendProduct(product);
            });
        }
        
        console.log('Sample products loaded');
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Make functions available globally for debugging
window.adminDebug = {
    resetUpload: function() {
        resetImagePreview();
        document.getElementById('imageInput').value = '';
    },
    testUpload: function() {
        document.getElementById('uploader').click();
    }
};

console.log('Admin JavaScript loaded successfully');