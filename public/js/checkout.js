/* ============================================
   Checkout — renders summary, handles Paystack
   ============================================ */

const SHIPPING_FEE = 200; // flat rate for Nairobi
const PAYSTACK_PUBLIC_KEY = "pk_test_1312315a496cf9321f6632340095df68df7b0fc0"; // ← replace with live key when ready

const summaryItemsEl = document.getElementById("summary-items");
const subtotalEl     = document.getElementById("subtotal");
const totalEl        = document.getElementById("total");
const form           = document.getElementById("checkoutForm");
const payBtn         = document.getElementById("payBtn");

/* ---------- RENDER ORDER SUMMARY ---------- */
function renderSummary() {
  const items = getCartDetailed();

  if (items.length === 0) {
    window.location.href = "cart.html";
    return;
  }

  summaryItemsEl.innerHTML = "";
  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "summary-item";
    div.innerHTML = `
      <span class="si-qty">${item.qty}×</span>
      <span class="si-name">${item.name}</span>
      <span class="si-price">KSh ${item.lineTotal.toLocaleString()}</span>
    `;
    summaryItemsEl.appendChild(div);
  });

  const subtotal = getCartTotal();
  const total = subtotal + SHIPPING_FEE;

  subtotalEl.textContent = `KSh ${subtotal.toLocaleString()}`;
  totalEl.textContent    = `KSh ${total.toLocaleString()}`;

  return { subtotal, total };
}

/* ---------- TOAST ---------- */
let toastTimer;
function showToast(msg, success = true) {
  const toast = document.getElementById("toast");
  if (!toast) return; // Safety check
  toast.textContent = msg;
  toast.className = "toast show " + (success ? "ok" : "err");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

/* ---------- GENERATE UNIQUE REFERENCE ---------- */
function generateReference() {
  return "GG-" + Date.now() + "-" + Math.floor(Math.random() * 100000);
}

/* ---------- PAYSTACK CHECKOUT ---------- */
function startPaystackPayment(orderData) {
  const popup = new PaystackPop();

  popup.newTransaction({
    key: PAYSTACK_PUBLIC_KEY,
    email: orderData.email,
    amount: Math.round(orderData.total * 100), // cents for KES (must be integer)
    currency: "KES", // ✅ FIXED: Changed from "NGN" to "KES"
    reference: orderData.id,

    onSuccess: async (transaction) => {
      payBtn.textContent = "Verifying payment...";

      try {
        const res = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference: transaction.reference,
            orderDraft: orderData
          })
        });

        const result = await res.json();

        if (result.success) {
          // 1. Clear the cart
          clearCart();
          
          // 2. Save to Local Order History (for the "My Orders" page)
          const orderHistory = JSON.parse(localStorage.getItem('my_orders') || '[]');
          orderHistory.unshift({
            id: orderData.id,
            date: orderData.date,
            total: orderData.total,
            status: "Paid",
            reference: transaction.reference,
            customerEmail: orderData.email
          });
          localStorage.setItem('my_orders', JSON.stringify(orderHistory));

          // 3. Show success message and redirect
          showToast("Payment verified! Generating invoice...", true);
          setTimeout(() => {
            const finalOrderId = result.orderId || orderData.id;
            window.location.href = `invoice.html?order=${finalOrderId}`;
          }, 1500);
          
        } else {
          showToast(result.message || "Payment could not be verified", false);
          payBtn.disabled = false;
          payBtn.textContent = "Pay Now";
        }
      } catch (err) {
        console.error("Verification error:", err);
        showToast("Server error during verification", false);
        payBtn.disabled = false;
        payBtn.textContent = "Pay Now";
      }
    },

    onCancel: () => {
      showToast("Payment cancelled. Your cart is still saved.", false);
      payBtn.disabled = false;
      payBtn.textContent = "Pay Now";
    },

    onError: (error) => {
      console.error("Paystack error:", error);
      showToast("Payment failed: " + (error.message || "Unknown error"), false);
      payBtn.disabled = false;
      payBtn.textContent = "Pay Now";
    }
  });
}

/* ---------- FORM SUBMIT ---------- */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const { subtotal, total } = renderSummary();
  
  const emailInput = document.getElementById("email").value.trim();
  const nameInput = document.getElementById("name").value.trim();

  // ✅ FIXED: Validate required fields before hitting Paystack
  if (!nameInput) {
    showToast("Please enter your name", false);
    return;
  }
  
  if (!emailInput || !emailInput.includes('@')) {
    showToast("Please enter a valid email address", false);
    return;
  }

  const orderData = {
    id: generateReference(),
    customer: nameInput,
    email: emailInput,
    pickup: document.getElementById("pickup").value.trim(),
    delivery: document.getElementById("delivery").value.trim(),
    package: document.getElementById("package").value.trim(),
    items: getCart(),
    subtotal,
    shippingFee: SHIPPING_FEE,
    total,
    status: "Pending",
    paymentStatus: "unpaid",
    date: new Date().toISOString()
  };

  payBtn.disabled = true;
  payBtn.textContent = "Processing...";

  startPaystackPayment(orderData);
});

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderSummary();
});