const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ExpressErrors = require("./utils/ExpressErrors.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const campgrounds = require("./routes/campgrounds.js");
const review = require("./routes/reviews.js");

// Connecting Mongoose to MongoDB
const uri = "mongodb://localhost:27017/yelp-campground";
mongoose
  .connect(uri)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("Connection error:", err);
  });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
// Apply flash message when something is updated and deleted
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
// Routes
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", review);

app.all("*", (req, res, next) => {
  next(new ExpressErrors("Page Not Found", 404));
});
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error.ejs", { err });
});

app.listen(3300, () => {
  console.log("App started on port 3300");
});
