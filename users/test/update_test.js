const assert = require('assert')
const User = require('../src/user')

/**
 * Model Class:
 *  - update
 *  - findOneAndUpdate
 *  - findByIdAndUpdate
 * Model Instance:
 *  - update
 *  - set and save
 */
describe('Updating records', () => { // 有非常多種做法
  let joe

  beforeEach(done => {
    joe = new User({name: 'Joe', likes: 5})
    joe.save()
      .then(() => done())
  })

  function assertName (operation, done) {
    operation
      .then(() => User.find({}))
      .then(users => {
        assert(users.length === 1)
        assert(users[0].name === 'Alex')
        done()
      })
  }

  it('instance type using set n save', done => {
    joe.set('name', 'Alex') // 在memory，還沒到DB，可以再多個改變後再save
    assertName(joe.save(), done)
  })

  it('A model instance can update', done => {
    assertName(joe.update({name: 'Alex'}), done)
  })

  it('A model class can update', done => {
    assertName(
      User.update({name: 'Joe'}, {name: 'Alex'}),
      done
    )
  })

  it('A model class can update one record', done => {
    assertName(
      User.findOneAndUpdate({name: 'Joe'}, {name: 'Alex'}),
      done
    )
  })

  it('A model class can find a record with and Id and update', done => {
    assertName(
      User.findByIdAndUpdate(joe._id, {name: 'Alex'}),
      done
    )
  })

  // https://docs.mongodb.com/manual/reference/operator/update/
  it('A user can have their postCount incremented by 1', done => {
    User.update({name: 'Joe'}, {$inc: {likes: 10}}) // dec: {$inc: {likes: 負的}}
      .then(() => User.findOne({name: 'Joe'}))
      .then(user => {
        assert(user.likes === 15)
        done()
      })
  })
})
