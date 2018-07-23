const Driver = require('../models/driver')

module.exports = {
  greeting (req, res) {
    res.send({hi: 'there'})
  },
  index (req, res, next) {
    const {lng, lat} = req.query

    // GeoJSON point: http://geojson.org/
    const point = {
      type: 'Point',
      coordinates: [parseFloat(lng), parseFloat(lat)]
    }

    // https://docs.mongodb.com/manual/reference/operator/aggregation/geoNear/
    Driver.aggregate([
      {
        $geoNear: {
          near: point,
          spherical: true,
          maxDistance: 200000, // meters
          distanceField: 'dist.calaulated'
        }
      }
    ])
      .then(drivers => {
        res.send(drivers)
      })
      .catch(next)
  },
  create (req, res, next) {
    const driverProps = req.body
    Driver.create(driverProps) // create = new + save
      .then(driver => res.send(driver))
      .catch(next)
  },
  edit (req, res, next) {
    const driverId = req.params.id
    const driverProps = req.body

    Driver.findByIdAndUpdate({_id: driverId}, driverProps)
      .then(() => Driver.findById({_id: driverId}))
      .then(driver => res.send(driver))
      .catch(next)
  },
  delete (req, res, next) {
    const driverId = req.params.id

    Driver.findByIdAndRemove({_id: driverId})
      .then(driver => res.status(204).send(driver))
      .catch(next)
  }
}
