const mongoose = require("mongoose")
if (!process.env.NODE_ENV || process.env.NODE_ENV !== "production") {
  //when using npm run seed
  //path should be ".env" not "../../.env"
  require("dotenv").config({ path: ".env" })
}
mongoose.connect(process.env.MONGODB_URL)
const db = mongoose.connection
const Restaurant = require("../restaurant")

const restJSON = require("./restaurant.json")

db.on("error", (error) => {
  console.error(`Mongodb has Error: ${error}`)
})

db.once("open", () => {
  console.log("MongoDB creating seed data")
  for (let rest of restJSON.results) {
    Restaurant.create({
      _id: rest.id,
      name: rest.name,
      name_en: rest.name_en,
      category: rest.category,
      image: rest.image,
      location: rest.location,
      phone: rest.phone,
      google_map: rest.google_map,
      rating: rest.rating,
      description: rest.description,
    })
  }
  console.log("done")
})
