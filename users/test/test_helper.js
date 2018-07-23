const mongoose = require('mongoose')

before(done => { // 整個test suite只執行一次
  mongoose.connect('mongodb://localhost:27017/users_test', {useNewUrlParser: true}).then(
    () => {done()},
    err => {console.warn('Warning', err)}
  )
})

beforeEach(done => {
  // blogPosts -> blogposts，mongoose會把collection name轉全小寫
  const {users, comments, blogposts} = mongoose.connection.collections
  // 清空這些collections (async)
  users.drop(() => {
    comments.drop(() => {
      blogposts.drop(() => {
        done()
      })
    })
  })
})

after(done => {
  mongoose.disconnect().then(
    () => {done()},
    err => {console.warn('Warning', err)}
  )
})
