const express = require("express");
const router = express.Router();
const Boba = require("../models/boba");

/* GET home page. */
router.get("/", async function (req, res, next) {
  const bobas = await Boba.find({}).limit(8);
  res.render("index", { title: "Home", bobas: bobas });
});

module.exports = router;
