const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const routes = require('./routes/routes')
const app = express()

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost:27017/muber', {useNewUrlParser: true})
}

// POST request是以chunks的方式傳到express
// express本身並不能很好的處理POST request的req.body
app.use(bodyParser.json())
routes(app)

app.use((err, req, res, next) => {
  res.status(422).send({error: err.message})
})

module.exports = app
