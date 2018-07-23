const assert = require('assert')
const User = require('../src/user')

describe('Creating records', () => {
  it('save a user', done => {
    const joe = new User({
      name: 'Joe'
    })
    joe.save() // promise
      .then(() => {
        assert(!joe.isNew) // isNew: built-in property of mongoose (已真的存進DB: false)
        done()
      })
  })
})
