const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// Setting passed to res.render
const setting = {
  show: {
    title: null,
    stylesheet: 'show.css',
    restaurantList: null,
    targetRest: null,
    errorMessage: null
  },
  new: {
    title: '創造您的餐廳',
    stylesheet: 'new.css',
    js: 'new.js',
    targetRest: null,
    renderErrorMessage: null,
    createErrorMessage: null,
    errorData: null
  },
  emptyPage: {
    title: '我的餐廳',
    stylesheet: 'index.css',
    errorMessage: null
  }
}

// Create New Restaurant
router.get('/new', (req, res) => {
  Promise.resolve()
    .then(() => {
      setting.new.renderErrorMessage = null
      res.render('new', setting.new)
    })
    .catch((error) => {
      setting.new.renderErrorMessage = error.message
      return res.status(404).render('new', setting.new)
    })
})

router.post('/', (req, res) => {
  const data = req.body
  const newRest = new Restaurant(data)
  return newRest
    .save()
    .then(() => {
      setting.new.createErrorMessage = null
      setting.new.errorData = null
      res.redirect('/')
    })
    .catch((error) => {
      setting.new.createErrorMessage = error.errors
      setting.new.errorData = data
      for (const stuff in error.errors) {
        console.error('[Data Create Error]: ', error.errors[stuff].message)
      }
      return res.status(404).render('new', setting.new)
    })
})

// read specific restaurant
router.get('/:id', (req, res) => {
  const restaurantID = req.params.id
  return Restaurant.findById(restaurantID)
    .lean()
    .then((targetRest) => {
      if (targetRest) {
        setting.show.errorMessage = null
        setting.show.targetRest = targetRest
        setting.show.title = String(targetRest.name)
        return res.status(200).render('show', setting.show)
      } else {
        throw new Error('Sorry but restaurant not found')
      }
    })
    .catch((error) => {
      setting.show.errorMessage = 'Sorry but restaurant not found'
      console.error(error)
      return res.status(404).render('show', setting.show)
    })
})

// Edit restaurant
router.get('/:id/edit', (req, res) => {
  const restaurantID = req.params.id
  const editSetting = { ...setting.new }
  editSetting.title = '編輯您的餐廳'
  return Restaurant.findById(restaurantID)
    .lean()
    .then((targetRest) => {
      if (targetRest) {
        editSetting.targetRest = targetRest
        return res.status(200).render('edit', editSetting)
      } else {
        throw new Error("Sorry we can't found the restaurant you want to edit")
      }
    })
    .catch((error) => {
      editSetting.renderErrorMessage =
        "Sorry we can't found the restaurant you want to edit"
      return res.status(404).render('edit', editSetting)
    })
})

router.put('/:id', (req, res) => {
  const restaurantID = req.params.id
  // 更改:直接取用form的資料不做型態更改
  const update = req.body
  const editSetting = { ...setting.new }
  editSetting.title = '編輯您的餐廳'
  editSetting.targetRest = { _id: restaurantID } // to give id to error form
  return Restaurant.findByIdAndUpdate(restaurantID, update, {
    runValidators: true
  })
    .then(() => {
      res.redirect('/')
    })
    .catch((error) => {
      editSetting.createErrorMessage = error.errors
      editSetting.errorData = update
      for (const stuff in error.errors) {
        console.error('[Data Create Error]: ', error.errors[stuff].message)
      }
      return res.status(404).render('edit', editSetting)
    })
})

// delete restaurant
router.delete('/:id', (req, res) => {
  const restaurantID = req.params.id
  return Restaurant.findById(restaurantID)
    .then((targetRest) => {
      if (targetRest) {
        targetRest.deleteOne()
      } else {
        throw new Error(
          "Sorry we can't found the restaurant you want to delete"
        )
      }
    })
    .then(() => {
      setting.emptyPage.errorMessage = null
      res.redirect('/')
    })
    .catch((error) => {
      setting.emptyPage.errorMessage = error.message
      res.status(200).render('emptySearch', setting.emptyPage)
      console.error(error)
    })
})
module.exports = router
