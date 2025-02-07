const mongoose = require("mongoose");
const Reviews = require("./reviews");
const Schema = mongoose.Schema; //Creates Mongoose's Schema constructor.

// Define the structure of the Campground in database
const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  image: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Reviews.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});
//generate the collection name as "campgrounds" and export
module.exports = mongoose.model("Campground", CampgroundSchema);
