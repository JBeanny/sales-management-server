const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  pid: {
    type: String,
    required: [true, "PID is required"],
  },
  name: {
    type: String,
    required: [true, "Product Name Is Required"],
  },
  subname: {
    type: String,
    required: [true, "Product Subname Is Required"],
  },
  price: {
    type: Number,
    default: 0,
  },
  unit: {
    type: String,
    required: [true, "Product Unit Is Required"],
  },
  added_date: {
    type: Date,
    required: [true, "Added Date Is Required"],
  },
  category: {
    type: String,
    required: [true, "Category Id Is Required"],
  },
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;
