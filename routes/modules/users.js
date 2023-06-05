const express = require("express")
const router = express.Router()
const passport = require("passport")
const User = reqire("../../models/user")

router.get("/login", (req, res)=>{
  res.render("login", {stylesheet:"login.css"})
})
router.post("/login",
  passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureMessage: true,
  }),
  (req, res) => {
    res.redirect("/")
  }
)
router.get("/register", (req, res)=>{
  res.render("register", {stylesheet:"login.css"})
})
module.exports = router