//express setup
const express = require("express")
const app = express()
//handlebars setup
const exphbs = require("express-handlebars")
//Setting MongoDB Connection
const mongoose = require("mongoose")
if (process.env.NODE_ENV !== "Production") {
  require("dotenv").config({ path: ".env" })
}
mongoose.connect(process.env.MONGODB_URL)
const db = mongoose.connection

//setup db model
const Restaurant = require("./models/restaurant")
//const restaurant = require("./restaurant.json")

//setip port and hostname
const port = 3000
const hostname = "localhost"

// Render page Setting
const setting = {
  index: {
    title: "我的餐廳",
    stylesheet: "index.css",
    restaurantList: null,
  },
  show: {
    title: null,
    stylesheet: "show.css",
    restaurantList: null,
    targetRest: null,
  },
}

// handlebar setting
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }))
app.set("view engine", "handlebars")

app.use(express.static("public"))

//db connection Listener
db.on("error", (error) => console.error(error))
db.once("open", () => console.log("MongoDB connected currectly."))
//index render
app.get("/", (req, res) => {
  return Restaurant.find()
    .sort("_id")
    .lean()
    .then((restaurants) => {
      return (setting.index.restaurantList = restaurants)
    })
    .then(() => res.status(200).render("index", setting.index))
    .catch((error) => console.error(error))
})

//restaurant個別網頁介紹
app.get("/restaurants/:id", (req, res) => {
  const targetID = req.params.id
  return Restaurant.findById(targetID)
    .lean()
    .then((targetRest) => {
      if (targetRest) {
        setting.show.targetRest = targetRest
        setting.show.title = String(targetRest.name)
        return res.status(200).render("show", setting.show)
      } else {
        throw new Error("Restaurant not found")
      }
    })
    .catch((error) => {
      console.log(error)
      return res.status(404).send("<h1>404 Restaurant Not Found</h1>")
    })
})

//搜尋功能
app.get("/search", (req, res) => {
  const keyword = req.query.keyword
  const keywordLower = keyword.toLowerCase().trim()
  Restaurant.find({
    $or: [
      { name: { $regex: `${keyword}`, $options: "i" } },
      { name: { $regex: `${keywordLower}`, $options: "i" } },
      { name_en_lowercase: { $regex: `${keywordLower}`, $options: "i" } },
      { category: { $regex: `${keyword}`, $options: "i" } },
      { category_lowercase: { $regex: `${keywordLower}`, $options: "i" } },
    ],
  })
    .sort("_id")
    .lean()
    .then((searchResults) => {
      //複製一個自己的setting
      //但是不能複製nest的object要小心
      const searchSetting = { ...setting.index }
      searchSetting.restaurantList = searchResults
      searchSetting.keyword = keyword

      if (searchResults.length) {
        res.status(200).render("index", searchSetting)
      } else {
        //if searchResults裡面是空的跑這行
        res.status(200).render("emptySearch", searchSetting)
      }
    })
    .catch((error) => console.error(error))
})

app.listen(port, hostname, () => {
  console.log(`Server http://${hostname}:${port} started.`)
})
