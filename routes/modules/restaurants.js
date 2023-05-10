const express = require("express")
const router = express.Router()
const Restaurant = require("../../models/restaurant")
//Setting passs to res.render
const setting = {
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

//Add New Restaurant
//要放在"/restaurants/:id"之前，不然express會以為new是數字
router.get("/new", (req, res) => {
  res.render("new", setting.new)
})

router.post("/", (req, res) => {
  const data = req.body

  //更改:直接取用form的資料不做型態更改
  const newRest = new Restaurant(data)
  return newRest
    .save()
    .then(() => res.redirect("/")) //用新的then才可以在確定新增之後才redirect渲染
    .catch((error) => console.error(error))
})

//restaurant個別網頁介紹
router.get("/:id", (req, res) => {
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
router.get("/:id/edit", (req, res) => {
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
router.put("/:id", (req, res) => {
  const ID = req.params.id
  //更改:直接取用form的資料不做型態更改
  const update = req.body
  return Restaurant.findByIdAndUpdate(ID, update)
    .then(() => res.redirect("/")) //用新的then才可以在確定新增之後才redirect渲染
    .catch((error) => console.error(error))
})

//delete restaurant
router.delete("/:id", (req, res) => {
  const ID = req.params.id
  return Restaurant.findById(ID)
    .then((targetRest) => {
      targetRest.deleteOne()
    })
    .then(() => res.redirect("/"))
    .catch((error) => console.error(error))
})
module.exports = router
