const mongoose = require('mongoose')

const User = mongoose.model("User",{
    name: String,
    password: String,
    devices: Array,
    temperatures: Array
})

module.exports = User 