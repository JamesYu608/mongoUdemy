const assert = require('assert')
const User = require('../src/user')

describe('Subdocuments', () => {
  it('Can create a subdocument', done => {
    const joe = new User({
      name: 'Joe',
      posts: [{title: 'PostTitle'}]
    })

    joe.save()
      .then(() => User.findOne({name: 'Joe'}))
      .then(user => {
        assert(user.posts[0].title === 'PostTitle')
        done()
      })
  })

  it('Can add subdocuments to an existing record', done => {
    const joe = new User({
      name: 'Joe',
      posts: []
    })

    joe.save()
      .then(() => User.findOne({name: 'Joe'}))
      .then(user => { // Add a new post to joe
        user.posts.push({title: 'New Post'})
        return user.save() // 繼續promise chaining
      })
      .then(() => User.findOne({name: 'Joe'}))
      .then(user => {
        assert(user.posts[0].title === 'New Post')
        done()
      })
  })

  it('Can remove an existing subdocument', done => {
    const joe = new User({
      name: 'Joe',
      posts: [{title: 'New Title'}]
    })

    joe.save()
      .then(() => User.findOne({name: 'Joe'}))
      .then(user => { // Remove document
        user.posts[0].remove() // mongoose的API，不用自己操作posts array
        // [注意] 這邊因為是subdocument的操作，所以還是需要save()才算
        // 若是user.remove()或joe.remove()，就真的會寫入DB
        return user.save()
      })
      .then(() => User.findOne({name: 'Joe'}))
      .then(user => {
        assert(user.posts.length === 0)
        done()
      })
  })
})
