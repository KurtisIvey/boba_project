const express = require("express");
const router = express.Router();
const Boba = require("../models/boba");
const Temperature = require("../models/temperature");
const multer = require("multer");
const uuid = require("uuid").v4;

//
// aws s3 v3
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const storage = multer.memoryStorage();

async function s3Uploadv3(file, fileName) {
  const s3client = new S3Client();

  const param = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/${fileName}`,
    Body: file.buffer,
  };
  return s3client.send(new PutObjectCommand(param));
}

function handleFile(file) {
  const fileName = `${uuid()}-${file.originalname}`;
  const fileUrl = `https://practiceki92.s3.us-east-2.amazonaws.com/uploads/${fileName}`;

  s3Uploadv3(file, fileName);
  return fileUrl;
}

function fileFilter(req, file, cb) {
  // ['image', 'jpeg]
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1000000, files: 1 },
});
//
//

/* GET home page. */
router.get("/", async (req, res) => {
  //res.send("bobas home");
  const bobas = await Boba.find({}).populate("temperature").exec();
  res.render("bobas/index", { bobas: bobas });
});

// add new boba router
router.get("/new", async (req, res) => {
  try {
    // must async await anything coming from mongoDB, or it will fail to pass through
    const categories = await Temperature.find({});
    res.render("bobas/new", { boba: new Boba(), categories: categories });
  } catch (error) {
    console.log(error);
  }
});

// show individual boba router
router.get("/:id", async (req, res) => {
  try {
    const boba = await Boba.findById(req.params.id)
      .populate("temperature")
      .exec();
    //console.log(boba);
    res.render("bobas/show.ejs", { boba: boba });
  } catch {
    res.redirect("/");
  }
});

// edit boba router
router.get("/:id/edit", async (req, res) => {
  try {
    const categories = await Temperature.find({});
    const boba = await Boba.findById(req.params.id)
      .populate("temperature")
      .exec();
    res.render("bobas/edit", { boba: boba, categories: categories });
  } catch {
    res.redirect("/");
  }
});

// add new boba post req to mongodb
router.post("/", upload.array("file"), async (req, res) => {
  const file = req.files[0];
  const boba = new Boba({
    name: req.body.name,
    description: req.body.description,
    temperature: req.body.temperature,
  });
  try {
    const boba = new Boba({
      name: req.body.name,
      description: req.body.description,
      temperature: req.body.temperature,
    });
    if (file != null) {
      let uploadedFile = handleFile(file);
      boba.url = uploadedFile;
    }
    const newBoba = await boba.save();
    res.redirect(`bobas/${newBoba.id}`);
    //res.redirect("bobas");
  } catch (err) {
    const bobas = await Boba.find({}).populate("temperature").exec();
    console.log(err);
    res.render("bobas/index", {
      bobas: bobas,
      message: "Error Adding New Boba",
    });
  }
});

// update boba router
router.put("/:id", upload.array("file"), async (req, res) => {
  let boba;
  const file = req.files[0];

  try {
    boba = await Boba.findById(req.params.id);
    boba.name = req.body.name;
    boba.temperature = req.body.temperature;
    boba.description = req.body.description;

    if (file != null) {
      let uploadedFile = handleFile(file);
      boba.url = uploadedFile;
    }
    await boba.save();
    const bobas = await Boba.find({}).populate("temperature").exec();
    res.render("bobas/index", {
      bobas: bobas,
      message: "Update Successful",
    });
  } catch (err) {
    const bobas = await Boba.find({}).populate("temperature").exec();
    console.log(err);
    res.render("bobas/index", {
      bobas: bobas,
      message: "Update Unsuccessful",
    });
  }
});

// delete confirmation page router
router.get("/:id/deleteconfirm", async (req, res) => {
  try {
    const boba = await Boba.findById(req.params.id);
    res.render("bobas/deleteConfirmation", { boba: boba });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

// delete boba request
router.delete("/:id", async (req, res) => {
  let boba;
  try {
    boba = await Boba.findById(req.params.id);
    await boba.remove();
    res.redirect("/bobas");
  } catch {
    res.redirect("/");
  }
});

module.exports = router;
