const express = require("express")
const router = express.Router()

router.get("/login", (req, res)=>{
  res.render("login", {stylesheet:"login.css"})
})

router.get("/register", (req, res)=>{
  res.render("register", {stylesheet:"login.css"})
})
module.exports = router