// assets/js/component-loader.js

async function loadComponents() {
  const components = [
    { id: 'header-placeholder', url: 'components/header.html' },
    { id: 'footer-placeholder', url: 'components/footer.html' },
    { id: 'newsletter-placeholder', url: 'components/newsletter.html' },
    { id: 'categories-placeholder', url: 'components/categories-dropdown.html' },
    { id: 'popup-placeholder', url: 'com' }
  ];

  for (const comp of components) {
    const element = document.getElementById(comp.id);
    if (element) {
      try {
        const response = await fetch(comp.url);
        if (response.ok) {
          const html = await response.text();
          element.outerHTML = html; // Replace the div with the actual HTML
        }
      } catch (error) {
        console.error(`Error loading ${comp.url}:`, error);
      }
    }
  }

  // Dispatch an event to tell main.js that the HTML is fully loaded
  document.dispatchEvent(new Event('componentsLoaded'));
}

// Run immediately
loadComponents();