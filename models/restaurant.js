const mongoose = require("mongoose")
const restaurantSchema = new mongoose.Schema(
  {
    //Delete id implement
    name: {
      type: String,
      required: true,
    },
    //Remove name_en lowercase and category lowercase
    name_en: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    google_map: {
      type: String,
      required: true,
    },
    //Rating type changed from string to number
    rating: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { collection: "A7_restaurants" }
)

module.exports = mongoose.model("Restaurant", restaurantSchema)
