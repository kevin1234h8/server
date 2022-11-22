const mongoose = require("mongoose");

const orderSchema = new mongoose.connect({
  orderId: {
    type: String,
  },
  product: {
    type: String,
  },
  price: {
    type: Number,
  },
  quantity: {
    type: Number,
  },
});

module.exports = mongoose.model("Order", orderSchema);
