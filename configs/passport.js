const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')
const GoogleStrategy = require('passport-google-oauth20')
const GitHubStrategy = require('passport-github2')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env' })
}

// 本地方式登入
const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // 要打開這個才能回傳flash
  },
  async function verify (req, email, password, done) {
    try {
      const user = await User.findOne({ email })
      if (!user) {
        req.flash('login_error', '此Email尚未創建帳號')
        return done(null, false, { message: 'Email not found.' })
      }
      const passwordCorrect = await bcrypt.compare(password, user.password)
      if (!passwordCorrect) {
        req.flash('login_error', '密碼錯誤')
        return done(null, false, { message: "Email and password didn't match" })
      } else {
        return done(null, user, { message: 'Login success!' })
      }
    } catch (error) {
      req.flash('login_error', error.message)
      return done(error, null)
    }
  })

// facebook登入
const facebookStrategy = new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK,
  profileFields: ['email', 'displayName']
},
async function (accessToken, refreshToken, profile, done) {
  // 拿到資料創一個帳號
  try {
    const { name, id } = profile._json
    const email = `${id}@facebook.com`

    const user = await User.findOne({ email })
    if (user) {
      return done(null, user)
    } else {
      const password = Math.random().toString(36).slice(-8)
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      const newUser = new User({
        name,
        email,
        password: hash
      })
      await newUser.save()
      return done(null, newUser)
    }
  } catch (error) {
    return done(error, false)
  }
}
)

// google登入
const googleStrategy = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK
},
async function (accessToken, refreshToken, profile, done) {
  try {
    const name = profile._json.name
    const email = profile._json.email

    const user = await User.findOne({ email })
    if (user) {
      return done(null, user)
    } else {
      const password = Math.random().toString(36).slice(-8)
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      const newUser = new User({
        name,
        email,
        password: hash
      })
      await newUser.save()
      return done(null, newUser)
    }
  } catch (error) {
    return done(error, false)
  }
}
)

// github login
const githubStrategy = new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK,
  scope: 'user:email' // github在router的scope回傳email時有的時候會是null,直接在passport設定
},
async function (accessToken, refreshToken, profile, done) {
  try {
    const name = profile.displayName
    const email = profile.emails[0].value

    const user = await User.findOne({ email })
    if (user) {
      return done(null, user)
    } else {
      const password = Math.random().toString(36).slice(-8)
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      const newUser = new User({
        name,
        email,
        password: hash
      })
      await newUser.save()
      return done(null, newUser)
    }
  } catch (error) {
    return done(error, false)
  }
}
)

function usePassport (app) {
  app.use(passport.initialize())
  // init passport on every route call.
  app.use(passport.session())
  // allow passport to use "express-session".
  passport.use(localStrategy)
  passport.use(facebookStrategy)
  passport.use(googleStrategy)
  passport.use(githubStrategy)
  passport.serializeUser(function (user, done) {
    return done(null, user.id)
  })
  passport.deserializeUser(async function (id, done) {
    try {
      const user = await User.findById(id).lean()
      return done(null, user)
    } catch (error) {
      return done(error, null)
    }
  })
}

module.exports = usePassport
