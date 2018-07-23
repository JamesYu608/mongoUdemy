const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PostSchema = require('./post')

const UserSchema = new Schema({
  name: {
    type: String,
    validate: { // validation是mongoose level，跟mongo無關 (非原生)
      validator: name => name.length > 2,
      message: 'Name must be longer than 2 characters.'
    },
    required: [true, 'Name is required.']
  },
  posts: [PostSchema], // 只是為了展示subdocument，blogPosts則是使用了association的做法
  likes: Number,
  blogPosts: [{
    type: Schema.Types.ObjectId,
    ref: 'blogPost'
  }]
})

// Virtual type，並沒有真的在DB，當要取用時，執行function計算結果
// get: ES6 getter
UserSchema.virtual('postCount').get(function () { // this指向model instance
  return this.posts.length
})

// mongoose middleware
UserSchema.pre('remove', function (next) {
  // 避免: https://nodejs.org/api/modules.html#modules_cycles
  const BlogPost = mongoose.model('blogPost')
  BlogPost.remove({_id: {$in: this.blogPosts}}) // in: mongodb operator
    .then(() => next())
})

// User "class" or "model"
const User = mongoose.model('user', UserSchema) // 'user' -> collection name

module.exports = User
