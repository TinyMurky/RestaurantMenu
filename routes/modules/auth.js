const express = require('express')
const router = express.Router()
const passport = require('passport')
router.get('/facebook',
  passport.authenticate('facebook', { authType: 'reauthenticate', scope: ['public_profile', 'email'] }))

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/users/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/')
  })

router.get('/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  })) // 'email',

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/users/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/')
  })

router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] }))

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/users/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/')
  })
module.exports = router
