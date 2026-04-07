const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// 👉 Serve frontend
app.use(express.static(path.join(__dirname, '../public')));
mongoose.connect('mongodb://127.0.0.1:27017/animetoy')
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));
const orderSchema = new mongoose.Schema({
  orderId: String,
  name: String,
  mobile: String,
  address: Object,
  total: Number,
  payment: String,
  items: Array
});

const Order = mongoose.model('Order', orderSchema);
// ===== Dummy data =====
let cart = [];


// ===== ROUTES =====

// Add to cart
app.post('/api/cart', (req, res) => {
  cart.push(req.body);
  res.json({ message: "Added to cart" });
});

// Get cart
app.get('/api/cart', (req, res) => {
  res.json(cart);
});

// Place order
app.post('/api/order', async (req, res) => {
  try {
    console.log("DATA RECEIVED:", req.body); // 🔥 ADD THIS

    const order = new Order(req.body);
    await order.save();

    res.json({ message: "Saved in MongoDB" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error" });
  }
});
// Get orders
app.get('/api/orders', async (req, res) => {
  const data = await Order.find();
  res.json(data);
});
app.get('/api/clear', async (req, res) => {
  await Order.deleteMany({});
  res.send("All orders deleted");
});

// ===== START SERVER =====
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});