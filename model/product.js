const mongoose = require("mongoose");
const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");
const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    brand: {
      type: String,
    },
    category: {
      type: String,
    },
    description: {
      type: String,
    },
    discountPercentage: {
      type: Number,
    },
    images: {
      type: Array,
    },
    price: {
      type: Number,
    },
    stock: {
      type: Number,
      default: 1,
    },
    thumbnail: {
      type: String,
    },
    title: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
