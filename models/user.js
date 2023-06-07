const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    default: '我'
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
},
{ timestamps: true }
)

module.exports = mongoose.model('User', UserSchema)
