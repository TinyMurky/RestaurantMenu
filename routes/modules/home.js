const express = require("express")
const router = express.Router()

const Restaurant = require("../../models/restaurant")

// index page Setting
const setting = {
  index: {
    title: "我的餐廳",
    stylesheet: "index.css",
    restaurantList: null,
    sortRules: ["A->Z", "Z->A", "類別", "地區"], //Create Sort Dropdown item
    sortKeyword: null,
    errorMessage: null,
  },
}
//home page render
const sortBy = require("../../plugins/sortBy").sortBy
router.get("/", (req, res) => {
  const sortBaseOn = sortBy(setting, req.query.sort) //Get object of rule pass into sort()
  return Restaurant.find()
    .sort(sortBaseOn)
    .lean()
    .then((restaurants) => {
      if (restaurants && restaurants.length) {
        setting.index.errorMessage = null //reset error message if found
        return (setting.index.restaurantList = restaurants)
      } else {
        throw new Error("Looks like we didn't have any restaurant.")
      }
    })
    .then(() => res.status(200).render("index", setting.index))
    .catch((error) => {
      setting.index.errorMessage = error.message
      res.status(200).render("emptySearch", setting.index)
      console.error(error)
    })
})

//搜尋功能
router.get("/search", (req, res) => {
  const keyword = String(req.query.keyword).trim()
  const sortBaseOn = sortBy(setting, req.query.sort) //Get object of rule pass into sort()
  const searchSetting = { ...setting.index }
  Restaurant.find({
    $or: [
      { name: { $regex: `${keyword}`, $options: "i" } },
      { name_en: { $regex: `${keyword}`, $options: "i" } },
      { category: { $regex: `${keyword}`, $options: "i" } },
    ],
  })
    .sort(sortBaseOn)
    .lean()
    .then((searchResults) => {
      //複製一個自己的setting
      //但是不能複製nest的object要小心
      //一搜尋就把keyword存起來
      searchSetting.keyword = keyword
      searchSetting.restaurantList = searchResults
      if (searchResults.length) {
        res.status(200).render("index", searchSetting)
      } else {
        throw new Error("Wow! Such Empty!")
      }
    })
    .catch((error) => {
      searchSetting.errorMessage = error.message
      //if searchResults裡面是空的跑這行
      res.status(200).render("emptySearch", searchSetting)
      console.error(error)
    })
})

module.exports = router
