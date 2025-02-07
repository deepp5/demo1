const express = require("express");
const router = express.Router({ mergeParams: true });
// const catchAsync = require('../utils/catchAsync');
const { reviewSchema } = require("../schemas.js");
const ExpressErrors = require("../utils/ExpressErrors");
const Campground = require("../models/campground.js");
const Review = require("../models/reviews.js");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressErrors(msg, 400);
  } else {
    next();
  }
};

router.post("/", validateReview, async (req, res, next) => {
  try {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    // req.flash("success", "Created new review!");
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (e) {
    next(e);
  }
});

router.delete("/:reviewId", async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  // req.flash("success", "Successfully deleted review");
  res.redirect(`/campgrounds/${id}`);
});

module.exports = router;
