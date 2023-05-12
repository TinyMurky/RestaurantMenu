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
    errorMessage: null,
  },
  new: {
    title: "創造您的餐廳",
    stylesheet: "new.css",
    js: "new.js",
    targetRest: null,
    renderErrorMessage: null,
    createErrorMessage: null,
    errorData: null,
  },
  emptyPage: {
    title: "我的餐廳",
    stylesheet: "index.css",
    errorMessage: null,
  },
}

//Add New Restaurant
//要放在"/restaurants/:id"之前，不然express會以為new是數字
router.get("/new", (req, res) => {
  Promise.resolve()
    .then(() => {
      setting.new.renderErrorMessage = null
      res.render("new", setting.new)
    })
    .catch((error) => {
      setting.new.renderErrorMessage = error.message
      return res.status(404).render("new", setting.new)
      console.log(error)
    }) // Errors will be passed to Express.
})

router.post("/", (req, res) => {
  const data = req.body
  //更改:直接取用form的資料不做型態更改
  const newRest = new Restaurant(data)
  return newRest
    .save()
    .then(() => {
      setting.new.createErrorMessage = null
      setting.new.errorData = null
      res.redirect("/")
    }) //用新的then才可以在確定新增之後才redirect渲染
    .catch((error) => {
      setting.new.createErrorMessage = error.errors
      setting.new.errorData = data
      for (let stuff in error.errors) {
        console.error("[Data Create Error]: ", error.errors[stuff].message)
      }
      return res.status(404).render("new", setting.new)
    })
})

//restaurant個別網頁介紹
router.get("/:id", (req, res) => {
  const targetID = req.params.id
  return Restaurant.findById(targetID)
    .lean()
    .then((targetRest) => {
      if (targetRest) {
        setting.show.errorMessage = null //reset error message
        setting.show.targetRest = targetRest
        setting.show.title = String(targetRest.name)
        return res.status(200).render("show", setting.show)
      } else {
        throw new Error("Sorry but restaurant not found")
      }
    })
    .catch((error) => {
      setting.show.errorMessage = "Sorry but restaurant not found"
      console.error(error)
      return res.status(404).render("show", setting.show)
    })
})

//Edit restaurant
//Render edit page
router.get("/:id/edit", (req, res) => {
  const targetID = req.params.id
  const editSetting = { ...setting.new }
  editSetting.title = "編輯您的餐廳"
  return Restaurant.findById(targetID)
    .lean()
    .then((targetRest) => {
      if (targetRest) {
        editSetting.targetRest = targetRest
        return res.status(200).render("edit", editSetting)
      } else {
        throw new Error("Sorry we can't found the restaurant you want to edit")
      }
    })
    .catch((error) => {
      editSetting.renderErrorMessage =
        "Sorry we can't found the restaurant you want to edit"
      return res.status(404).render("edit", editSetting)
      console.log(error)
    })
})

//Update edit
router.put("/:id", (req, res) => {
  const ID = req.params.id
  //更改:直接取用form的資料不做型態更改
  const update = req.body
  const editSetting = { ...setting.new }
  editSetting.title = "編輯您的餐廳"
  editSetting.targetRest = { _id: ID } //to give id to error form
  return Restaurant.findByIdAndUpdate(
    ID,
    update,
    { runValidators: true } //enable schema validation check
  )
    .then(() => {
      res.redirect("/")
    }) //用新的then才可以在確定新增之後才redirect渲染
    .catch((error) => {
      editSetting.createErrorMessage = error.errors
      editSetting.errorData = update
      for (let stuff in error.errors) {
        console.error("[Data Create Error]: ", error.errors[stuff].message)
      }
      return res.status(404).render("edit", editSetting)
    })
})

//delete restaurant
router.delete("/:id", (req, res) => {
  const ID = req.params.id
  return Restaurant.findById(ID)
    .then((targetRest) => {
      if (targetRest) {
        targetRest.deleteOne()
      } else {
        throw new Error(
          "Sorry we can't found the restaurant you want to delete"
        )
      }
    })
    .then(() => {
      setting.emptyPage.errorMessage = null
      res.redirect("/")
    })
    .catch((error) => {
      setting.emptyPage.errorMessage = error.message
      //if searchResults裡面是空的跑這行
      res.status(200).render("emptySearch", setting.emptyPage)
      console.error(error)
    })
})
module.exports = router
