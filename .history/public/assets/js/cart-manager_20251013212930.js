let selectedProduct = null;
let selectedColor = "";
let selectedSize = "";

// ========== Build Color Options ==========
function buildColors() {
  const container = document.getElementById("popup-colors");
  container.innerHTML = "";

  const colors = ["#000000", "#F4A261", "#3A86FF", "#FF006E", "#2A9D8F", "#ffffff"];

  colors.forEach(color => {
    const div = document.createElement("div");
    div.className = "rounded-circle border";
    div.style.width = "30px";
    div.style.height = "30px";
    div.style.backgroundColor = color;
    div.style.cursor = "pointer";
    div.title = color;

    div.addEventListener("click", () => {
      container.querySelectorAll("div").forEach(c => c.style.outline = "");
      div.style.outline = "3px solid #333";
      selectedColor = color;
    });

    container.appendChild(div);
  });
}

// ========== Build Size Options ==========
function buildSizes() {
  const container = document.getElementById("popup-sizes");
  container.innerHTML = "";

  const sizes = ["S", "M", "L", "XL", "XXL"];
  sizes.forEach(size => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-dark btn-sm";
    btn.textContent = size;

    btn.addEventListener("click", () => {
      container.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedSize = size;
    });

    container.appendChild(btn);
  });
}

// ========== Open Popup ==========
function openPopup(product) {
  selectedProduct = product;
  selectedColor = "";
  selectedSize = "";

  document.getElementById("popup-title").textContent = product.title;
  document.getElementById("popup-category").textContent = product.category;
  document.getElementById("popup-img").src = product.img;
  document.getElementById("popup-price").textContent = `$${product.price.toFixed(2)}`;
  document.getElementById("popup-quantity").value = product.quantity || 1;

  buildColors();
  buildSizes();

  const modal = new bootstrap.Modal(document.getElementById("cartPopupModal"));
  modal.show();
}

// ========== Add to Cart ==========
function addToCart(product) {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  const baseId = generateProductId(product.title, product.price, product.img);
  const variantId = `${baseId}|c:${product.color}|s:${product.size}`;
  const existingIndex = cartItems.findIndex(i => i.id === variantId);

  if (existingIndex !== -1) {
    cartItems[existingIndex].quantity += product.quantity;
  } else {
    cartItems.push({ ...product, id: variantId });
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  const newCount = cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);
  localStorage.setItem("cartCount", newCount);
  updateCounter("cartCount", newCount);

  showNotification("Product added to cart successfully!", "success");
}

// ========== Confirm Button ==========
document.getElementById("confirm-add").addEventListener("click", () => {
  const qty = parseInt(document.getElementById("popup-quantity").value, 10) || 1;

  if (!selectedColor || !selectedSize) {
    const missing = [];
    if (!selectedColor) missing.push("color");
    if (!selectedSize) missing.push("size");
    showNotification(`Please select ${missing.join(" and ")} before adding to cart!`, "error");
    return;
  }

  const productToAdd = {
    ...selectedProduct,
    color: selectedColor,
    size: selectedSize,
    quantity: qty
  };

  addToCart(productToAdd);
  const modal = bootstrap.Modal.getInstance(document.getElementById("cartPopupModal"));
  modal.hide();
});

// ========== Utility ==========
function updateCounter(type, value) {
  const counters = document.querySelectorAll(`.header__action-btn[href="${type}.html"] .count`);
  counters.forEach(el => {
    el.textContent = value;
    el.style.display = value === 0 ? "none" : "flex";
  });
}

function showNotification(msg, type = "success") {
  let n = document.querySelector(".notification");
  if (!n) {
    n = document.createElement("div");
    n.className = "notification";
    document.body.appendChild(n);
  }
  n.textContent = msg;
  n.className = `notification ${type}`;
  n.style.opacity = "1";
  setTimeout(() => n.style.opacity = "0", 3000);
}

function generateProductId(title, price, img) {
  const base = (img || '').split('/').pop() || 'noimg';
  return `${title.toLowerCase().replace(/\s+/g, '-')}-${String(price).replace(/[^\d.]/g, '')}-${base.toLowerCase().replace(/\W+/g, '')}`;
}

// Make function globally accessible
window.openPopup = openPopup;
