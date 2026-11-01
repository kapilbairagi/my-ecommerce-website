// pagination.js
document.addEventListener("DOMContentLoaded", () => {
  const itemsPerPage = 16;
  const productContainer = document.querySelector(".products__container");
  const productItems = Array.from(
    productContainer.querySelectorAll(".product__item")
  );
  const paginationContainer = document.querySelector(".pagination");

  let currentPage = 1;
  const totalPages = Math.ceil(productItems.length / itemsPerPage);

  // Render items for given page
  function renderPage(page, scrollToTop = true) {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    currentPage = page;

    // show/hide products
    productItems.forEach((item, index) => {
      item.style.display =
        index >= (page - 1) * itemsPerPage && index < page * itemsPerPage
          ? "block"
          : "none";
    });

    // update pagination UI
    renderPagination();

    // scroll to top of product list only when triggered by pagination clicks
    if (scrollToTop) {
      const yOffset = -80; // adjust offset for header height / spacing
      const y =
        productContainer.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }

  // Render pagination numbers
  function renderPagination() {
    paginationContainer.innerHTML = "";

    // Prev button
    if (currentPage > 1) {
      const prev = createPageLink("«", currentPage - 1);
      prev.classList.add("icon");
      paginationContainer.appendChild(prev);
    }

    // Numbered pages with ellipsis
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 2 && i <= currentPage + 2)
      ) {
        const pageLink = createPageLink(i, i);
        if (i === currentPage) pageLink.classList.add("active");
        paginationContainer.appendChild(pageLink);
      } else if (
        (i === currentPage - 3 && currentPage > 4) ||
        (i === currentPage + 3 && currentPage < totalPages - 3)
      ) {
        const dots = document.createElement("span");
        dots.textContent = "...";
        dots.classList.add("pagination__link");
        paginationContainer.appendChild(dots);
      }
    }

    // Next button
    if (currentPage < totalPages) {
      const next = createPageLink("»", currentPage + 1);
      next.classList.add("icon");
      paginationContainer.appendChild(next);
    }
  }

  // Helper: create page link
  function createPageLink(text, page) {
    const link = document.createElement("a");
    link.href = "#";
    link.textContent = text;
    link.classList.add("pagination__link");

    link.addEventListener("click", (e) => {
      e.preventDefault();
      renderPage(page, true); // 👈 pagination click should scroll
    });

    return link;
  }

  // Init (no scroll on first load)
  renderPage(1, false);
});
