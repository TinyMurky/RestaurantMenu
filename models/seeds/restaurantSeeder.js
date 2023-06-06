const { db, mongoose } = require('../../configs/mongoose')
const Restaurant = require('../restaurant')
const User = require('../user')
const restJSON = require('./restaurant.json')
const bcrypt = require('bcryptjs')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
db.on('error', (error) => {
  console.log(`MongoDB has Error: ${error}`)
})

const seedUser = {
  name: 'root',
  password: '12345678',
  email: 'root@example.com'
}

db.once('open', async () => {
  const user = await User.findOne({ email: seedUser.email })
  if (!user) {
    // 如果尚未建立Seed User, 先建立seed user之後在將餐廳建在他下面
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(seedUser.password, salt)
    const newUser = new User({
      name: seedUser.name,
      password: hash,
      email: seedUser.email
    })
    const restPromises = restJSON.results.map(async (value, index, array) => {
      /**********************
       * 重要！
       * 下面這一行一定要 "return"promise all才會等它完成
       **********************/
      value.userID = newUser._id
      return Restaurant.create(value)
    })
    await Promise.all(restPromises)
    await newUser.save()
    console.log('Construct seed data done!')
  } else {
    const restPromises = restJSON.results.map(async (value, index, array) => {
      const restaurant = await Restaurant.findOne({ name: value.name })
      // 如果有Seed User但是其中有幾個餐廳遺失的話再重建
      if (!restaurant) {
        value.userID = user._id
        return Restaurant.create(value)
      }
    })
    await Promise.all(restPromises)
    console.log('補完備刪除的資訊')
  }
  if (mongoose.connection.readyState === 1) {
    mongoose.disconnect()
  }
})
