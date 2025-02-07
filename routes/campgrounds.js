const express = require("express");
const router = express.Router();
const { campgroundSchema } = require("../schemas.js");
const ExpressErrors = require("../utils/ExpressErrors");
const Campground = require("../models/campground");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressErrors(msg, 400);
  } else {
    next();
  }
};

router.get("/", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index.ejs", { campgrounds });
});
//Creating new campground by get and post
router.get("/new", (req, res) => {
  res.render("campgrounds/new.ejs");
});
router.post("/", validateCampground, async (req, res, next) => {
  try {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    req.flash("success", "Successfully Added the campground");
    res.redirect(`/campgrounds/${newCampground._id}`);
    console.log("Campground added");
  } catch (e) {
    next(e);
  }
});

// Display information for each campground
router.get("/:id", async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    if (!campground) {
      req.flash("error", "Cannot find that campground!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show.ejs", { campground });
  } catch (e) {
    next(e);
  }
});
// // Editing the campground
router.get("/:id/edit", async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "Cannot find that campground!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit.ejs", { campground });
  } catch (e) {
    next(e);
  }
});
router.put("/:id", validateCampground, async (req, res, next) => {
  try {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/campgrounds/${campground.id}`);
    console.log("Campground edited");
  } catch (e) {
    next(e);
  }
});

// Delete the campground
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    console.log("Campground deleted");
    req.flash("success", "Campground Deleted");
    res.redirect("/campgrounds");
  } catch (e) {
    next(e);
  }
});

module.exports = router;
