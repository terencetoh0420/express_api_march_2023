// create a song model
// it is mapped to song collection

let mongoose = require('mongoose')

// use mongoose to initialize schema

let mongoSchema = mongoose.Schema
// use mongoSchema to reference song collection in mongodb database
let songSchema = new mongoSchema({
    "video_id":String,
    "likes": Number,
    "views": Number
},{collection:"songs"})

// export the model
module.exports=mongoose.model('songs',songSchema)