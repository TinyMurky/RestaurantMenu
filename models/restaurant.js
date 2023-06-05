//Schema for Restaurant
const mongoose = require("mongoose")
const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "You miss name of your restaurant"],
    },
    name_en: {
      type: String,
      validate: {
        validator: function (v) {
          return /[A-Za-z0-9 ]+/i.test(v)
        },
        message: (props) =>
          `${props.value} is not a valid Alphanumaric only name!`,
      },
      required: [true, "English name is required"],
    },
    category: {
      type: String,
      required: [true, "Your restaurant need to have som kind of category"],
    },
    image: {
      type: String,
      validate: {
        validator: function (v) {
          return /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(
            v
          )
        },
        message: (props) => `${props.value} is not a valid URL for image!`,
      },
      required: [true, "Image URL is required, otherwise it will be ugly"],
    },
    location: {
      type: String,
      required: [
        true,
        "Your restaurant need a location, otherwise no customer will show up",
      ],
    },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return /(\d{2,3}[ -]?|\(\d{2,3}\))\d{3,4}[ -]?\d{4}|09\d{2}(\d{6}|[ -]\d{3}[ -]\d{3})/.test(
            v
          )
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
      required: [true, "Phone number is required"],
    },
    google_map: {
      type: String,
      validate: {
        validator: function (v) {
          return /https?:\/\/goo\.gl\/maps\//i.test(v)
        },
        message: (props) =>
          `${props.value} is not a valid Google map sharing link`,
      },
      required: [true, "Google map link is required"],
    },
    //Rating type changed from string to number
    rating: {
      type: Number,
      min: [1, "Rating at least 1 star"],
      max: [5, "Maximate Rating is 5 stars"],
      required: [true, "Please rate your star"],
    },
    description: {
      type: String,
      required: [true, "Atleast one word for description, please"],
    },
    userID:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      index:true,
      required:true,
    }
  },
  { collection: "A7_restaurants" }
)

module.exports = mongoose.model("Restaurant", restaurantSchema)
