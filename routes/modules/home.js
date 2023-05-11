const express = require("express")
const router = express.Router()

const Restaurant = require("../../models/restaurant")

// index page Setting
const setting = {
  index: {
    title: "我的餐廳",
    stylesheet: "index.css",
    restaurantList: null,
    keyword: null, //keyword use in search
    sortRules: ["A->Z", "Z->A", "類別", "地區"], //Create Sort Dropdown item
    sortKeyword: null,
  },
}
//home page render
function sortBy(sortQuery) {
  //mapping dropdown sort query to object pass into sort()
  setting.index.sortKeyword = sortQuery ? sortQuery.trim() : null // storing sort Keyword and pass into hidden input in search form
  switch (sortQuery) {
  case "Z->A":
    return { name: -1 }
    break
  case "類別":
    return { category: 1 }
    break
  case "地區":
    return { location: 1 }
    break
  default:
    return { name: 1 }
  }
}
router.get("/", (req, res) => {
  const sortBaseOn = sortBy(req.query.sort) //Get object of rule pass into sort()
  return Restaurant.find()
    .sort(sortBaseOn)
    .lean()
    .then((restaurants) => {
      return (setting.index.restaurantList = restaurants)
    })
    .then(() => res.status(200).render("index", setting.index))
    .catch((error) => console.error(error))
})

//搜尋功能
router.get("/search", (req, res) => {
  const keyword = String(req.query.keyword).trim()
  const sortBaseOn = sortBy(req.query.sort) //Get object of rule pass into sort()

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
      setting.index.keyword = keyword
      console.table(setting.index)
      const searchSetting = { ...setting.index }
      searchSetting.restaurantList = searchResults

      if (searchResults.length) {
        res.status(200).render("index", searchSetting)
      } else {
        //if searchResults裡面是空的跑這行
        res.status(200).render("emptySearch", searchSetting)
      }
    })
    .catch((error) => console.error(error))
})

module.exports = router
