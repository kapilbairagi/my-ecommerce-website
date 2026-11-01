
// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
        
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
          
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
              if (otherItem !== item) {
                otherItem.classList.remove('active');
              }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
        
    // Form submission handling
    const sellerForm = document.querySelector('.seller-form');
        if (sellerForm) {
          sellerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const requiredFields = sellerForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
              if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = 'var(--error-color)';
              } else {
                field.style.borderColor = '';
              }
            });
            
            if (isValid) {
              // In a real application, you would send the form data to a server
              alert('Thank you for your application! We will review it and get back to you soon.');
              sellerForm.reset();
            } else {
              alert('Please fill in all required fields.');
            }
          });
        }
        
    // Update header counts if needed
    if (typeof updateHeaderCounts === 'function') {
          updateHeaderCounts();
    }
});
