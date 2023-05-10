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
  //use insertMany instead create to have
  Restaurant.insertMany(restJSON.results)
  console.log("done")
  //leave node js
  process.exit()
})
