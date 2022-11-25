const mongoose = require("mongoose");

const googleUserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    displayName: {
      type: String,
    },
    photo: {
      type: String,
    },
    profile: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model("googleUser", googleUserSchema);
