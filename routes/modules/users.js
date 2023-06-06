const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../../models/user')
const bcrypt = require('bcryptjs')
const stylesheet = {
  login: 'login.css',
  register: 'login.css'
}

router.get('/login', (req, res) => {
  if (!req.isAuthenticated()) {
    res.render('login', { title: '登入我的餐廳', stylesheet: stylesheet.login })
  } else {
    res.redirect('/')
  }
})
router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureMessage: true
  }),
  (req, res) => {
    res.redirect('/')
  }
)
router.get('/register', (req, res) => {
  if (!req.isAuthenticated()) {
    res.render('register', { title: '註冊我的餐廳', stylesheet: stylesheet.register })
  } else {
    res.redirect('/')
  }
})

router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!(name && email && password && confirmPassword)) {
    errors.push({ message: '請輸入所有欄位' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不一致' })
  }
  try {
    const user = await User.findOne({ email })
    if (user) {
      errors.push({ message: '該信箱已存在' })
    }
    if (errors.length) {
      res.render('register', {
        title: '註冊我的餐廳',
        stylesheet: stylesheet.login,
        register_errors: errors,
        name,
        email,
        password,
        confirmPassword
      })
    } else {
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      const newUser = new User({
        name,
        email,
        password: hash
      })
      newUser.save()
      req.flash('register_success', '已成功註冊帳號')
      res.redirect('/users/login')
    }
  } catch (error) {
    console.error(error)
  }
})

router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err) }
    req.flash('logout_success', '您已成功登出')
    res.redirect('/users/login')
  })
})
module.exports = router
