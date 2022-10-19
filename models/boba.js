const mongoose = require("mongoose");

const bobaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  temperature: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Temperature",
  },
});

module.exports = mongoose.model("Boba", bobaSchema);
