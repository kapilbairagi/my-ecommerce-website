async function loadComponents() {
  const components = [
    { id: 'header-placeholder', url: 'components/header.html' },
    { id: 'footer-placeholder', url: 'components/footer.html' },
    { id: 'newsletter-placeholder', url: 'components/newsletter.html' },
    { id: 'categories-placeholder', url: 'components/categories-dropdown.html' },
    { id: 'popup-placeholder', url: 'components/cart-popup.html' },
    { id: 'breadcrumb-placeholder', url: 'components/breadcrumb.html' },
    { id: 'quick-view-placeholder', url: 'components/quick-view.html' }
  ];

  for (const comp of components) {
    const element = document.getElementById(comp.id);
    if (element) {
      try {
        const response = await fetch(comp.url);
        if (response.ok) {
          const html = await response.text();
          element.outerHTML = html; 
        }
      } catch (error) {
        console.error(`Error loading ${comp.url}:`, error);
      }
    }
  }

  // NEW: Highlight the active navigation link
  setActiveNavLink();
  
  // Generate breadcrumb links
  generateBreadcrumbLinks();

  // Tell main.js that the HTML is fully loaded
  document.dispatchEvent(new Event('componentsLoaded'));
}

// Function to highlight the active link
function setActiveNavLink() {
  // Get the current page name from the URL (e.g., "shop.html" or "index.html")
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  
  // Find all navigation links
  const navLinks = document.querySelectorAll('.nav__link');

  navLinks.forEach(link => {
    // Remove active-link from all links first
    link.classList.remove('active-link');
    
    // Get the href of the link (e.g., "shop.html")
    const linkPath = link.getAttribute('href');
    
    // If the link matches the current page, add the active class
    if (linkPath === currentPath) {
      link.classList.add('active-link');
    }
  });
}

// Function to generate breadcrumb links (keep your existing function below)
function generateBreadcrumbLinks() {
  // ... (Your existing breadcrumb code) ...
}

loadComponents();