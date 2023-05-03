//express setup
const express = require("express")
const app = express()

//handlebars setup
const exphbs = require("express-handlebars")

//setup json
const restaurant = require("./restaurant.json")

//setip port and hostname
const port = 3000
const hostname = "localhost"

const setting = {
  index:{
    title:"我的餐廳",
    stylesheet:"index.css",
    restaurantList: restaurant.results,
  },
  show:{
    title: null,
    stylesheet:"show.css",
    restaurantList: restaurant.results,
    targetRest: null,
  },
}

app.engine("handlebars", exphbs.engine({defaultLayout:"main"}))
app.set("view engine", "handlebars")

app.use(express.static("public"))

//index render
app.get("/", (req, res)=>{
  res.status(200).render("index", setting.index)
})

//restaurant個別網頁介紹
app.get("/restaurants/:id", (req, res)=>{
  const id = req.params.id
  const targetRest = restaurant.results.find(element=>element.id.toString() === id)
  setting.show.targetRest = targetRest
  setting.show.title = targetRest.name
  if (targetRest){
    res.status(200).render("show", setting.show)
  } else {
    res.status(404).send("<h1>404 Restaurant Not Found</h1>")
  }
})

//搜尋功能
app.get("/search", (req, res)=>{
  const keyword = req.query.keyword
  const keywordLower = keyword.toLowerCase().trim()
  console.log(keywordLower)
  const searchResults = restaurant.results.filter(element=>{
    return element.name.toLowerCase().includes(keywordLower) ||
    element.name_en.toLowerCase().includes(keywordLower) ||
    element.category.toLowerCase().includes(keywordLower) //search by category
  })

  //複製一個自己的setting
  //但是不能複製nest的object要小心
  const searchSetting = {...setting.index}
  searchSetting.restaurantList = searchResults
  searchSetting.keyword = keyword

  if(searchResults.length) {
    res.status(200).render("index", searchSetting)
  } else{
    //if searchResults裡面是空的跑這行
    res.status(200).render("emptySearch", searchSetting)
  }
})

app.listen(port, hostname, ()=>{
  console.log(`Server http://${hostname}:${port} started.`)
})