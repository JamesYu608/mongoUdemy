const assert = require('assert')
const User = require('../src/user')
const Comment = require('../src/comment')
const BlogPost = require('../src/blogPost')

describe('Association', () => {
  let joe, blogPost, comment

  beforeEach(done => {
    joe = new User({name: 'Joe'})
    blogPost = new BlogPost({title: 'JS is Great', content: 'Yep it really is'})
    comment = new Comment({content: 'Congrats on great post'})

    // 雖然看起來是push/assign整個model instance，但是我們在schema中宣告association，所以其實只關聯ObjectId
    joe.blogPosts.push(blogPost)
    blogPost.comments.push(comment)
    comment.user = joe

    Promise.all([joe.save(), blogPost.save(), comment.save()])
      .then(() => done())
  })

  // modifier: enhance the query in some way
  it('saves a relation between a user and a blogpost', done => {
    User.findOne({name: 'Joe'})
      .populate('blogPosts') // populate是一個modifier，用途: resolve relationship
      .then(user => {
        assert(user.blogPosts[0].title === 'JS is Great')
        done()
      })
  })

  it('saves a full relation graph', done => {
    User.findOne({name: 'Joe'})
      .populate({
        path: 'blogPosts',
        populate: { // 在上面的path中，繼續populate
          path: 'comments',
          model: 'comment', // 為什麼這邊需要指定model? http://mongoosejs.com/docs/populate.html#cross-db-populate
          populate: {
            path: 'user',
            model: 'user'
          }
        }
      })
      .then(user => {
        assert(user.name === 'Joe')
        assert(user.blogPosts[0].title === 'JS is Great')
        assert(user.blogPosts[0].comments[0].content === 'Congrats on great post')
        assert(user.blogPosts[0].comments[0].user.name === 'Joe')
        done()
      })
  })
})

