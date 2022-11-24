const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    author: {
      type: String,
    },
    blogImage: {
      type: String,
    },
    title: {
      type: String,
    },
    subtitle: {
      type: Array,
    },
    content: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
