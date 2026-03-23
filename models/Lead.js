const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: String,
  phone: String,
  status: {
    type: String,
    default: "New"
  },
  notes: String
}, { timestamps: true });
module.exports = mongoose.model("Lead", leadSchema);
