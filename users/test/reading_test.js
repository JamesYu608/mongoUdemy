const assert = require('assert')
const User = require('../src/user')

describe('Reading users out of the database', () => {
  let joe, maria, alex, zach

  beforeEach(done => {
    alex = new User({name: 'Alex'})
    joe = new User({name: 'Joe'})
    maria = new User({name: 'Maria'})
    zach = new User({name: 'Zach'})
    Promise.all([joe.save(), maria.save(), zach.save(), alex.save()])
      .then(() => done())
  })

  it('finds all users with a name of joe', done => {
    User.find({name: 'Joe'})
      .then(users => { // array
        // assert(users[0]._id === joe._id)
        // 1. _id在new User時就已產生，不用真的到存進DB
        // 2. [注意] 上面會failed，雖然印出來一樣，但_id其實是被ObjectId物件包起來，不會===
        assert(users[0]._id.toString() === joe._id.toString()) // ok!
        done()
      })
  })

  it('find a user with a particular id', done => {
    User.findOne({_id: joe._id}) // 這邊不需要.toString()，比較交給mongoose處理
      .then(user => { // single instance
        assert(user.name === 'Joe')
        done()
      })
  })

  // sort, skip, limit: modifier
  it('can skip and limit the result set', done => {
    User.find({})
      .sort({name: 1}) // 1: asc, -1: desc
      .skip(1)
      .limit(2)
      .then(users => {
        assert(users[0].name === 'Joe')
        assert(users[1].name === 'Maria')
        done()
      })
  })
})
