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
  new: {
    title: "創造您的餐廳",
    stylesheet: "new.css",
    js: "new.js",
    targetRest: null,
  },
}

// handlebar setting
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }))
app.set("view engine", "handlebars")

//app use static and urlencoded
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
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

//Add New Restaurant
//要放在"/restaurants/:id"之前，不然express會以為new是數字
app.get("/restaurants/new", (req, res) => {
  res.render("new", setting.new)
})

app.post("/restaurants", (req, res) => {
  const data = req.body

  //更改:直接取用form的資料不做型態更改
  const newRest = new Restaurant(data)
  return newRest
    .save()
    .then(() => res.redirect("/")) //用新的then才可以在確定新增之後才redirect渲染
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

//Edit restaurant
//Render edit page
app.get("/restaurants/:id/edit", (req, res) => {
  const targetID = req.params.id
  const editSetting = { ...setting.new }
  return Restaurant.findById(targetID)
    .lean()
    .then((targetRest) => {
      if (targetRest) {
        editSetting.targetRest = targetRest
        editSetting.title = "編輯餐廳"
        return res.status(200).render("edit", editSetting)
      } else {
        throw new Error("Restaurant not found")
      }
    })
    .catch((error) => {
      console.log(error)
      return res.status(404).send("<h1>404 Restaurant Not Found</h1>")
    })
})

//Update edit
app.post("/restaurants/:id/edit", (req, res) => {
  const ID = req.params.id
  //更改:直接取用form的資料不做型態更改
  const update = req.body
  return Restaurant.findByIdAndUpdate(ID, update)
    .then(() => res.redirect("/")) //用新的then才可以在確定新增之後才redirect渲染
    .catch((error) => console.error(error))
})

//delete restaurant
app.post("/restaurants/:id/delete", (req, res) => {
  const ID = req.params.id
  return Restaurant.findById(ID)
    .then((targetRest) => {
      targetRest.deleteOne()
    })
    .then(() => res.redirect("/"))
    .catch((error) => console.error(error))
})

//搜尋功能
app.get("/search", (req, res) => {
  const keyword = String(req.query.keyword).trim()
  Restaurant.find({
    $or: [
      { name: { $regex: `${keyword}`, $options: "i" } },
      { name_en: { $regex: `${keyword}`, $options: "i" } },
      { category: { $regex: `${keyword}`, $options: "i" } },
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
