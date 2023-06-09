// express setup
const express = require('express')
const app = express()

// handlebars setup
const exphbs = require('express-handlebars')

// method override for put and delete routing
const methodOverride = require('method-override')

// express-session for login
const session = require('express-session')

// import index.js from ./routes for seperating routing
const routes = require('./routes')

// passport setting
const usePassport = require('./configs/passport')

// flash store message
const flash = require('connect-flash')
// import mongoose.js file to connect to MongoDB
require('./configs/mongoose')

// import dotenv for .env
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env' })
}
// using port giving by enviroment of cloud server, or default 3000
const PORT = process.env.PORT

// handlebars setting
app.engine(
  'handlebars',
  exphbs.engine({
    defaultLayout: 'main',
    helpers: require('./plugins/handlebars-helpers')
  })
)
app.set('view engine', 'handlebars')

// preprocessing request
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
  secret: process.env.SECRET_SESSION_WORD,
  resave: false,
  saveUninitialized: true
}))
app.use(flash())
usePassport(app)
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.login_error = req.flash('login_error')
  res.locals.not_login_warning = req.flash('not_login_warning')
  res.locals.register_success = req.flash('register_success')
  res.locals.logout_success = req.flash('logout_success')
  next()
})
app.use(routes) // Enable routing to different file.js

app.listen(PORT, () => {
  console.log(`Server at port ${PORT} started.`)
})
