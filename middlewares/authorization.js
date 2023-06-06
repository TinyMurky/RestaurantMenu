function authorization (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  req.flash('not_login_warning', '需要先登入您的帳號')
  res.redirect('/users/login')
}

module.exports = { authorization }
