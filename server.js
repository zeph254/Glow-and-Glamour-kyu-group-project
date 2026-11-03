const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- DATA & CONFIG ---
const DATA_DIR = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, '[]');

// Paystack Secret Key (Use environment variable in production!)
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "sk_test_1312315a496cf9321f6632340095df68df7b0fc0"; // Replace with your actual test/live key

// Product Database (Backend needs this to generate invoices)
const PRODUCTS_CACHE = [
  { id: 1, name: "Rose Glow Vitamin C Serum", price: 1200 },
  { id: 2, name: "Matte Liquid Lipstick - Ruby", price: 650 },
  { id: 3, name: "Moroccan Argan Hair Oil", price: 950 },
  { id: 4, name: "Velvet Matte Foundation", price: 1500 },
  { id: 5, name: "Organic Shea Body Butter", price: 800 },
  { id: 6, name: "Jasmine Eau de Parfum", price: 2800 },
  { id: 7, name: "Soothing Aloe Face Mask", price: 550 },
  { id: 8, name: "Keratin Silk Hair Mask", price: 1100 },
  { id: 9, name: "Golden Glow Highlighter", price: 750 },
  { id: 10, name: "Coconut Sugar Body Scrub", price: 700 },
  { id: 11, name: "Vanilla Dream Body Mist", price: 900 },
  { id: 12, name: "Precision Brow Pencil - Brown", price: 450 }
];

// --- HELPERS ---
function readOrders() {
  try { return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8')); } 
  catch { return []; }
}

function saveOrders(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

// --- API ROUTES ---

// 1. Verify Payment & Save Order
app.post("/api/verify-payment", async (req, res) => {
  const { reference, orderDraft } = req.body;

  try {
    const paystackRes = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` }
    });

    if (paystackRes.data.data.status === "success") {
      const orders = readOrders();
      
      const finalOrder = {
        ...orderDraft,
        paymentStatus: "paid",
        paymentReference: reference,
        paystackAmount: paystackRes.data.data.amount,
        status: "Confirmed"
      };

      orders.push(finalOrder);
      saveOrders(orders);

      return res.json({ success: true, orderId: finalOrder.id });
    } else {
      return res.status(400).json({ success: false, message: "Payment not successful." });
    }
  } catch (error) {
    console.error("Paystack verification error:", error.message);
    return res.status(500).json({ success: false, message: "Verification failed." });
  }
});

// 2. Get Invoice
app.get("/api/orders/:id/invoice", (req, res) => {
  try {
    const orders = readOrders();
    const order = orders.find(o => o.id === req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    if (order.paymentStatus !== "paid") {
      return res.status(400).json({ success: false, message: "Invoice only for paid orders." });
    }

    const invoice = {
      invoiceId: "INV-" + Date.now() + "-" + Math.floor(Math.random() * 10000),
      orderId: order.id,
      customer: { name: order.customer, email: order.email },
      items: order.items.map(item => {
        const product = PRODUCTS_CACHE.find(p => p.id === item.id) || { name: "Unknown", price: 0 };
        return {
          productName: product.name,
          quantity: item.qty,
          unitPrice: product.price,
          subtotal: product.price * item.qty
        };
      }),
      subtotal: order.subtotal,
      shippingFee: order.shippingFee || 0,
      total: order.total,
      payment: {
        reference: order.paymentReference,
        amount: order.paystackAmount,
        status: order.paymentStatus,
        method: "paystack"
      },
      shipping: {
        pickup: order.pickup,
        delivery: order.delivery,
        packageDescription: order.package
      },
      orderDate: order.date,
      status: order.status
    };

    res.json({ success: true, invoice });
  } catch (error) {
    console.error("Invoice error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// 3. Catch-all for frontend routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});