// Simple Admin JavaScript - Guaranteed to work
console.log('Admin JS loaded');

// Wait for the page to fully load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing file upload');
    initializeFileUpload();
});

function initializeFileUpload() {
    const fileInput = document.getElementById('imageInput');
    const uploader = document.getElementById('uploader');
    
    console.log('File input found:', fileInput);
    console.log('Uploader found:', uploader);

    if (!fileInput || !uploader) {
        console.error('Required elements not found');
        return;
    }

    // Make uploader clearly clickable
    uploader.style.cursor = 'pointer';
    uploader.style.border = '2px dashed var(--first-color)';
    uploader.style.padding = '2rem';
    uploader.style.borderRadius = '12px';
    uploader.style.textAlign = 'center';
    uploader.style.backgroundColor = 'var(--first-color-alt)';
    uploader.style.transition = 'all 0.3s ease';

    // Add hover effects
    uploader.addEventListener('mouseenter', function() {
        this.style.backgroundColor = 'var(--second-color)';
        this.style.borderColor = 'var(--first-color)';
    });

    uploader.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'var(--first-color-alt)';
        this.style.borderColor = 'var(--first-color)';
    });

    // SIMPLE CLICK HANDLER - This will definitely work
    uploader.addEventListener('click', function(event) {
        console.log('Uploader clicked!');
        event.preventDefault();
        event.stopPropagation();
        
        // Directly trigger the file input click
        fileInput.click();
    });

    // Handle file selection
    fileInput.addEventListener('change', function(event) {
        console.log('File selected:', event.target.files[0]);
        if (event.target.files && event.target.files[0]) {
            previewImage(event.target.files[0]);
        }
    });

    // Image preview function
    function previewImage(file) {
        const thumbImg = document.getElementById('thumbImg');
        const thumbPh = document.getElementById('thumbPlaceholder');
        
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file (JPEG, PNG, etc.)');
            return;
        }

        const reader = new FileReader();
        
        reader.onload = function(e) {
            console.log('Image loaded for preview');
            if (thumbImg) {
                thumbImg.src = e.target.result;
                thumbImg.style.display = 'block';
                thumbImg.style.maxWidth = '100%';
                thumbImg.style.maxHeight = '100%';
            }
            if (thumbPh) {
                thumbPh.style.display = 'none';
            }
        };
        
        reader.onerror = function() {
            console.error('Error reading file');
            alert('Error reading the image file. Please try another image.');
        };
        
        reader.readAsDataURL(file);
    }

    // Drag and drop functionality
    uploader.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.style.backgroundColor = 'var(--second-color)';
        this.style.borderColor = 'var(--first-color)';
    });

    uploader.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.style.backgroundColor = 'var(--first-color-alt)';
        this.style.borderColor = 'var(--first-color)';
    });

    uploader.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.style.backgroundColor = 'var(--first-color-alt)';
        this.style.borderColor = 'var(--first-color)';
        
        const files = e.dataTransfer.files;
        if (files && files[0]) {
            console.log('File dropped:', files[0]);
            fileInput.files = files;
            previewImage(files[0]);
        }
    });

    console.log('File upload initialized successfully');
}

// Simple form handling
document.getElementById('product-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Form submitted');
    
    const fileInput = document.getElementById('imageInput');
    if (!fileInput.files[0]) {
        alert('Please select an image before publishing');
        return;
    }
    
    alert('Product published successfully! (This is a demo)');
    
    // Reset form
    this.reset();
    document.getElementById('thumbImg').style.display = 'none';
    document.getElementById('thumbPlaceholder').style.display = 'block';
});

console.log('Admin JavaScript setup complete');