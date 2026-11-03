/* ============================================
   Homepage logic: render grid, filters, add-to-cart
   ============================================ */

const grid = document.getElementById("products");
let activeCategory = "all";

/* ---------- RENDER ---------- */
function renderProducts(list) {
  grid.innerHTML = "";
  if (list.length === 0) {
    grid.innerHTML = `<p class="empty">No products in this category.</p>`;
    return;
  }

  list.forEach((p, index) => {
    const outOfStock = p.stock === 0;
    const card = document.createElement("div");
    card.className = "product-card" + (outOfStock ? " out" : "");
    card.style.animationDelay = `${index * 0.05}s`;
    card.classList.add("animate-in");

    const ratingStars = '★'.repeat(Math.floor(p.rating || 4)) + '☆'.repeat(5 - Math.floor(p.rating || 4));

    card.innerHTML = `
      <div class="card-image">
        <img src="${p.image}" alt="${p.name}"
             onerror="this.src='https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop'">
        ${outOfStock ? '<span class="tag-out">Out of Stock</span>' : ''}
        ${p.price < 1000 ? '<span class="tag-sale">Best Seller</span>' : ''}
      </div>
      <div class="card-body">
        <span class="category">${p.category}</span>
        <h3>${p.name}</h3>
        ${p.rating ? `
        <div class="rating">
          ${ratingStars}
          <span>(${p.reviews || 0})</span>
        </div>` : ''}
        <p class="desc">${p.description}</p>
        <div class="card-footer">
          <span class="price">KSh ${p.price.toLocaleString()}</span>
          <button class="btn-add" ${outOfStock ? "disabled" : ""}>
            ${outOfStock ? "Unavailable" : "Add to Cart"}
          </button>
        </div>
      </div>
    `;

    // Wire the add button
    const btn = card.querySelector(".btn-add");
    if (!outOfStock) {
      btn.addEventListener("click", () => {
        const result = addToCart(p.id);
        showToast(result.msg, result.ok);
      });
    }

    grid.appendChild(card);
  });
}

/* ---------- FILTERS ---------- */
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.dataset.category;
    applyFilter();
  });
});

function applyFilter() {
  const list = getProductsByCategory(activeCategory);
  renderProducts(list);
}

/* ---------- TOAST ---------- */
let toastTimer;
function showToast(msg, success = true) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.className = "toast show " + (success ? "ok" : "err");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(products);
});