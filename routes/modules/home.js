const express = require("express")
const router = express.Router()

const Restaurant = require("../../models/restaurant")

// index page Setting
const setting = {
  index: {
    title: "我的餐廳",
    stylesheet: "index.css",
    restaurantList: null,
  },
}
//home page render
router.get("/", (req, res) => {
  return Restaurant.find()
    .sort("_id")
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

module.exports = router
