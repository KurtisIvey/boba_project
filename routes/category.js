const express = require("express");
const router = express.Router();
const Temperature = require("../models/temperature");

/* GET home page. */

router.get("/", async function (req, res) {
  try {
    const categories = await Temperature.find({});
    res.render("categories/index", {
      temperatures: categories,
    });
  } catch {
    res.redirect("/");
  }
});

// get category by temperature page
router.get("/:id", async (req, res) => {
  try {
    const category = await Temperature.findById(req.params.id);
    res.render("categories/show", { category: category });
  } catch {
    res.redirect("/");
  }
});
module.exports = router;
