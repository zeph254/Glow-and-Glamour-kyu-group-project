/* ============================================
   GLOW & GLAMOUR — Cart Module (CRUD)
   Data shape: [{ id: number, qty: number }]
   Persisted in localStorage under key "cart"
   ============================================ */

const CART_KEY = "cart";

/* ---------- READ ---------- */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function getCartDetailed() {
  // Joins cart items with product data → useful for cart page & totals
  return getCart().map(i => {
    const p = findProduct(i.id);
    return p ? { ...p, qty: i.qty, lineTotal: p.price * i.qty } : null;
  }).filter(Boolean);
}

function getCartTotal() {
  return getCartDetailed().reduce((sum, i) => sum + i.lineTotal, 0);
}

/* ---------- CREATE ---------- */
function addToCart(id, qty = 1) {
  const product = findProduct(id);
  if (!product) return { ok: false, msg: "Product not found" };
  if (product.stock === 0) return { ok: false, msg: "Out of stock" };

  const cart = getCart();
  const existing = cart.find(i => i.id === id);
  const currentQty = existing ? existing.qty : 0;

  // Don't exceed stock
  if (currentQty + qty > product.stock) {
    return { ok: false, msg: `Only ${product.stock} in stock` };
  }

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, qty });
  }
  saveCart(cart);
  return { ok: true, msg: `${product.name} added to cart` };
}

/* ---------- UPDATE ---------- */
function updateQty(id, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return false;

  const product = findProduct(id);
  if (qty <= 0) {
    removeFromCart(id);
    return true;
  }
  if (product && qty > product.stock) {
    item.qty = product.stock;           // clamp to stock
  } else {
    item.qty = qty;
  }
  saveCart(cart);
  return true;
}

/* ---------- DELETE ---------- */
function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
}

/* ---------- INTERNAL ---------- */
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  document.dispatchEvent(new CustomEvent("cart:changed"));
  
  // Bounce the badge
  const badge = document.getElementById("cart-count");
  if (badge) {
    badge.classList.add("bump");
    setTimeout(() => badge.classList.remove("bump"), 300);
  }
}

/* ---------- UI BADGE (shared across pages) ---------- */
function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = getCartCount();
}

document.addEventListener("cart:changed", updateCartBadge);
document.addEventListener("DOMContentLoaded", updateCartBadge);