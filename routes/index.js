const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')
const { authorization } = require('../middlewares/authorization')

router.use('/users', users)
router.use('/restaurants', authorization, restaurants)
router.use('/', authorization, home)
module.exports = router
