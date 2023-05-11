//express setup
const express = require("express")
const app = express()
//handlebars setup
const exphbs = require("express-handlebars")
//method override
const methodOverride = require("method-override")
//require Routes
const routes = require("./routes")
//MongoDB Connection start
require("./configs/mongoose")
const Restaurant = require("./models/restaurant")
//const restaurant = require("./restaurant.json")

//setip port and hostname
const port = 3000
const hostname = "localhost"

// handlebar setting
app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",
    helpers: require("./configs/handlebars-helpers"),
  })
)
app.set("view engine", "handlebars")

//app use static and urlencoded
app.use(express.static("public"))
//enable req.body
app.use(express.urlencoded({ extended: true }))
//method override by query
app.use(methodOverride("_method"))
//start routers
app.use(routes)

app.listen(port, hostname, () => {
  console.log(`Server http://${hostname}:${port} started.`)
})
