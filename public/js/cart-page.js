/* ============================================
   Cart Page — renders cart & wires all CRUD
   ============================================ */

const itemsEl      = document.getElementById("cart-items");
const emptyEl      = document.getElementById("empty-cart");
const contentEl    = document.getElementById("cart-content");
const subtotalEl   = document.getElementById("subtotal");
const totalEl      = document.getElementById("total");
const itemCountEl  = document.getElementById("item-count");

/* ---------- RENDER ---------- */
function renderCart() {
  const items = getCartDetailed(); // from cart.js

  // Toggle empty vs content
  if (items.length === 0) {
    emptyEl.classList.remove("hidden");
    contentEl.classList.add("hidden");
    return;
  }
  emptyEl.classList.add("hidden");
  contentEl.classList.remove("hidden");

  // Build rows
  itemsEl.innerHTML = "";
  items.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item";

    row.innerHTML = `
      <img class="item-img"
           src="${item.image}"
           alt="${item.name}"
           onerror="this.src='https://via.placeholder.com/120x120/fff8f0/d4af37?text=Glow'">

      <div class="item-info">
        <span class="category">${item.category}</span>
        <h3>${item.name}</h3>
        <p class="item-price">KSh ${item.price.toLocaleString()}</p>
      </div>

      <div class="qty-control">
        <button class="qty-btn" data-action="dec" data-id="${item.id}" aria-label="Decrease">−</button>
        <input class="qty-input"
               type="number"
               min="1"
               max="${item.stock}"
               value="${item.qty}"
               data-id="${item.id}">
        <button class="qty-btn" data-action="inc" data-id="${item.id}" aria-label="Increase">+</button>
      </div>

      <div class="item-line-total">
        KSh ${item.lineTotal.toLocaleString()}
      </div>

      <button class="btn-remove" data-id="${item.id}" aria-label="Remove">✕</button>
    `;

    itemsEl.appendChild(row);
  });

  // Wire quantity buttons
  itemsEl.querySelectorAll(".qty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const current = getCart().find(i => i.id === id)?.qty || 0;
      const newQty = btn.dataset.action === "inc" ? current + 1 : current - 1;

      const product = findProduct(id);
      if (newQty > product.stock) {
        showToast(`Only ${product.stock} in stock`, false);
        return;
      }
      updateQty(id, newQty);
      renderCart();
    });
  });

  // Wire quantity inputs (manual typing)
  itemsEl.querySelectorAll(".qty-input").forEach(input => {
    input.addEventListener("change", () => {
      const id = Number(input.dataset.id);
      const qty = parseInt(input.value, 10);
      if (isNaN(qty) || qty < 1) {
        updateQty(id, 0); // triggers removal
      } else {
        updateQty(id, qty);
      }
      renderCart();
    });
  });

  // Wire remove buttons
  itemsEl.querySelectorAll(".btn-remove").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const p = findProduct(id);
      removeFromCart(id);
      showToast(`${p.name} removed`, true);
      renderCart();
    });
  });

  updateSummary();
}

/* ---------- SUMMARY ---------- */
function updateSummary() {
  const items = getCartDetailed();
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  subtotalEl.textContent = `KSh ${subtotal.toLocaleString()}`;
  totalEl.textContent    = `KSh ${subtotal.toLocaleString()}`; // shipping added at checkout
  itemCountEl.textContent = count;
}

/* ---------- CLEAR CART ---------- */
document.getElementById("clear-cart").addEventListener("click", () => {
  if (confirm("Remove all items from your cart?")) {
    clearCart();
    showToast("Cart cleared", true);
    renderCart();
  }
});

/* ---------- TOAST ---------- */
let toastTimer;
function showToast(msg, success = true) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.className = "toast show " + (success ? "ok" : "err");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", renderCart);

// Re-render when cart changes (e.g., from another tab or event)
document.addEventListener("cart:changed", () => {
  // Small delay so storage writes settle
  setTimeout(renderCart, 0);
});