const mongoose = require("mongoose");

const temperatureSchema = new mongoose.Schema({
  temperature: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Temperature", temperatureSchema);
