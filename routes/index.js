const express = require("express");
const router = express.Router();

const bobas = [
  {
    name: "strawberry",
    description: "strawberry boba with ice and yogurt",
    number_in_stock: 5,
    temp: "cold",
    type: "smoothie",
    price: 4.99,
  },
  {
    name: "banana",
    description: "banana boba with ice and yogurt",
    number_in_stock: 2,
    temp: "cold",
    type: "smoothie",
    price: 3.99,
  },
];

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Home", bobas: bobas });
});

module.exports = router;
