const mongoose = require('mongoose')
const Schema = mongoose.Schema

// GeoJSON
const PointSchema = new Schema({
  type: {type: String, default: 'Point'},
  // https://docs.mongodb.com/manual/core/2dsphere/
  // index: geometry.coordinates_2dsphere
  coordinates: {type: [Number], index: '2dsphere'}
})

const DriverSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  driving: {
    type: Boolean,
    default: false
  },
  geometry: PointSchema
})

const Driver = mongoose.model('driver', DriverSchema)

module.exports = Driver
