const assert = require('assert')
const User = require('../src/user')

/**
 * Model Class:
 *  - remove
 *  - findOneAndRemove
 *  - findByIdAndRemove
 * Model Instance:
 *  - remove
 */
describe('Deleting a user', () => { // 有非常多種做法
  let joe

  beforeEach(done => {
    joe = new User({name: 'Joe'})
    joe.save()
      .then(() => done())
  })

  it('model instance remove', done => {
    joe.remove()
      .then(() => User.findOne({name: 'Joe'}))
      .then(user => {
        assert(user === null)
        done()
      })
  })

  it('class method remove', done => {
    User.remove({name: 'Joe'})
      .then(() => User.findOne({name: 'Joe'}))
      .then(user => {
        assert(user === null)
        done()
      })
  })

  it('class method findOneAndRemove', done => {
    User.findOneAndRemove({name: 'Joe'})
      .then(() => User.findOne({name: 'Joe'}))
      .then(user => {
        assert(user === null)
        done()
      })
  })

  it('class method findByIdAndRemove', done => {
    User.findByIdAndRemove(joe._id)
      .then(() => User.findOne({name: 'Joe'}))
      .then(user => {
        assert(user === null)
        done()
      })
  })
})
