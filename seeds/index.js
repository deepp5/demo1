const cities = require("./cities.js");
const { descriptors, places } = require("./seedHelpers.js");
const mongoose = require("mongoose");
const Campground = require("../models/campground.js");

//Connecting Mongoose to MongoDB
const uri = "mongodb://localhost:27017/yelp-campground";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// Generating random number usung array length
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  // Generate new Campgrounds
  for (let i = 0; i < 50; i++) {
    const random = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 30) + 10;
    const camp = new Campground({
      location: `${cities[random].city} - ${cities[random].state}`, // Coming from cities.js
      title: `${sample(descriptors)} ${sample(places)}`, // Coming from seedHelper.js
      image: `https://picsum.photos/400?random=${Math.random()}`,
      price: price,
      description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
      Suscipit, sit repellendus minima excepturi sed similique enim, 
      molestias maiores blanditiis itaque iure cum magnam quasi quam
       delectus ad laboriosam fugiat ab.`,
    });
    // Save data in database
    await camp.save();
  }
};
// close the database after implementing the function
seedDB().then(() => {
  mongoose.connection.close();
});
