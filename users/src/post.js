const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
  title: String
})

// Post作為users的subdocument (embedded)，這邊只export scheme，我們並沒有要建立collection
module.exports = PostSchema
