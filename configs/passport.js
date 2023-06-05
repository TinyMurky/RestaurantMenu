const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // 要打開這個
  },
  async function verify (req, email, password, done) {
    try {
      const user = await User.findOne({ email })
      if (!user) {
        return done(null, false, { message: 'Email not found.' })
      }
      const passwordCorrect = await bcrypt.compare(password, user.password)
      console.log('password matching: ', passwordCorrect)
      if (!passwordCorrect) {
        return done(null, false, { message: "Email and password didn't match" })
      } else {
        return done(null, user, { message: 'Login success!' })
      }
    } catch (error) {
      return done(error, null)
    }
  })
function usePassport (app) {
  app.use(passport.initialize())
  // init passport on every route call.
  app.use(passport.session())
  // allow passport to use "express-session".
  passport.use(localStrategy)
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
