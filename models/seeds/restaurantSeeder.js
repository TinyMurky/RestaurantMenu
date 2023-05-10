const { db, mongoose } = require("../../configs/mongoose")
const Restaurant = require("../restaurant")

const restJSON = require("./restaurant.json")

db.on("open", async function () {
  await Restaurant.insertMany(restJSON.results)
  console.log("sample data created complete")
  return mongoose.disconnect()
})
