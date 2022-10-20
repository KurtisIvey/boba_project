var createError = require("http-errors");
var express = require("express");
const app = express();

var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const expressLayouts = require("express-ejs-layouts");

var indexRouter = require("./routes/index");
const categoryRouter = require("./routes/category");
const bobaRouter = require("./routes/boba");

// use to allow update methods
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// hide api key
require("dotenv").config();
// API_KEY will come in through process.env as process.env.API_KEY
//console.log(process.env);

//mongodb
var mongoose = require("mongoose");

// setting the uri for the mongodb connection to mongoDB variable to hide user and pass
var mongoDB = process.env.API_KEY;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "layouts/layout");
app.use(expressLayouts);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", indexRouter);
app.use("/categories", categoryRouter);
app.use("/bobas", bobaRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);
  res.render("error", { title: "Error" });
});

module.exports = app;
