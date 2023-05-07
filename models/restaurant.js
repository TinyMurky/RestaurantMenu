const mongoose = require("mongoose")
const restaurantSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      required: true,
    },
    name: String,
    name_en: String,
    category: String,
    image: String,
    location: String,
    phone: String,
    google_map: String,
    rating: Number,
    description: String,
  },
  { collection: "A7_restaurants" }
)

module.exports = mongoose.model("Restaurant", restaurantSchema)
