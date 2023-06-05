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
  res.render('login', { stylesheet: stylesheet.login })
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
  res.render('register', { stylesheet: stylesheet.register })
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
        stylesheet: stylesheet.login,
        errors
      })
      return
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
module.exports = router
