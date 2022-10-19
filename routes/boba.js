const express = require("express");
const router = express.Router();
const Boba = require("../models/boba");
const Temperature = require("../models/temperature");

/* GET home page. */
router.get("/", async (req, res) => {
  //res.send("bobas home");
  res.render("bobas/index");
});

router.get("/new", async (req, res) => {
  try {
    // must async await anything coming from mongoDB, or it will fail to pass through
    const categories = await Temperature.find({});
    res.render("bobas/new", { boba: new Boba(), categories: categories });
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  const boba = new Boba({
    name: req.body.name,
    description: req.body.description,
    temperature: req.body.temperature,
  });
  try {
    const newBoba = await boba.save();
    //res.redirect(`bobas/${newBoba.id}`)
    res.redirect("bobas");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

module.exports = router;
