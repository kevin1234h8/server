const mongoose = require("mongoose");

const subBlogSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    title: {
      type: String,
    },
    subtitle: {
      type: Array,
    },
    author: {
      type: String,
    },
    content: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubBlog", subBlogSchema);
