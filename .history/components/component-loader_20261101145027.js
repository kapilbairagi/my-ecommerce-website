async function loadComponents() {
  const components = [
    { id: 'header-placeholder', url: 'components/header.html' },
    { id: 'footer-placeholder', url: 'components/footer.html' },
    { id: 'newsletter-placeholder', url: 'components/newsletter.html' },
    { id: 'categories-placeholder', url: 'components/categories-dropdown.html' },
    { id: 'popup-placeholder', url: 'components/cart-popup.html' },
    { id: 'breadcrumb-placeholder', url: 'components/breadcrumb.html' } // <-- ADDED
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

  // Once HTML is loaded, generate the specific breadcrumb links
  generateBreadcrumbLinks();

  // Tell main.js that the HTML is fully loaded
  document.dispatchEvent(new Event('componentsLoaded'));
}

// Function to generate breadcrumb links based on current page
function generateBreadcrumbLinks() {
  const breadcrumbList = document.getElementById('dynamic-breadcrumb');
  if (!breadcrumbList) return; // Exit if not on a page with breadcrumbs

  // Get the current page name from URL (e.g., "cart.html")
  const path = window.location.pathname.split('/').pop() || 'index.html';
  
  // Don't show breadcrumbs on the home page
  if (path === 'index.html' || path === '') return;

  const homeLink = `<li><a href="index.html" class="breadcrumb__link">Home</a></li><li><span class="breadcrumb__link">></span></li>`;
  const shopLink = `<li><a href="shop.html" class="breadcrumb__link">Shop</a></li><li><span class="breadcrumb__link">></span></li>`;

  let innerHTML = homeLink;

  switch(path) {
    case 'shop.html':
      innerHTML += `<li><span class="breadcrumb__link">Shop</span></li>`;
      break;
    case 'offers.html':
      innerHTML += `<li><span class="breadcrumb__link">Offers</span></li>`;
      break;
    case 'details.html':
      innerHTML += `<li><span class="breadcrumb__link">Fashion</span></li><li><span class="breadcrumb__link">></span></li><li><span class="breadcrumb__link">Pattern Shirt</span></li>`;
      break;
    case 'cart.html':
      innerHTML += shopLink + `<li><span class="breadcrumb__link">Cart</span></li>`;
      break;
    case 'checkout.html':
      innerHTML += shopLink + `<li><span class="breadcrumb__link">Checkout</span></li>`;
      break;
    case 'wishlist.html':
      innerHTML += shopLink + `<li><span class="breadcrumb__link">Wishlist</span></li>`;
      break;
    default:
      // Fallback for any other pages
      innerHTML += `<li><span class="breadcrumb__link">${path.replace('.html', '')}</span></li>`;
  }

  breadcrumbList.innerHTML = innerHTML;
}

// Run immediately
loadComponents();