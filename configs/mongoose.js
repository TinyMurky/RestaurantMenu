const mongoose = require("mongoose")
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: ".env" })
}
mongoose.connect(process.env.MONGODB_URL)
const db = mongoose.connection

db.on("error", (error) => console.error(error))
db.once("open", () => console.log("MongoDB connected currectly."))

module.exports = { db, mongoose }
