const mongoose = require("mongoose");

const googleUserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    profile: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model("googleUser", googleUserSchema);
