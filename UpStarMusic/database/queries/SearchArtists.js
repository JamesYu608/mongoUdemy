const Artist = require('../models/artist')

/**
 * Searches through the Artist collection
 * @param {object} criteria An object with a name, age, and yearsActive
 * @param {string} sortProperty The property to sort the results by
 * @param {integer} offset How many records to skip in the result set
 * @param {integer} limit How many records to return in the result set
 * @return {promise} A promise that resolves with the artists, count, offset, and limit
 */
module.exports = (criteria, sortProperty, offset = 0, limit = 20) => {
  const query = Artist.find(buildQuery(criteria))
    .sort({[sortProperty]: 1}) // 這個發生在database，若要sort virtual type (在server)，要使用aggregate
    .skip(offset)
    .limit(limit)

  // Artist.find(buildQuery(criteria))不能設為變數然後先count()取得結果後，再繼續sort()...
  // 呼叫count()後就已經結束query，只能分開
  return Promise.all([query, Artist.find(buildQuery(criteria)).count()])
    .then(results => {
      return {
        all: results[0],
        count: results[1],
        offset,
        limit
      }
    })
}

const buildQuery = criteria => {
  const query = {}

  // https://docs.mongodb.com/manual/reference/operator/query/text/
  if (criteria.name) {
    // // 需要先建立index才能用$search (目前不支援multi-indexes)，建立index有三種方法
    // 1. Shell: db.artists.createIndex({name: "text"})
    // 2. Schema: name: { type: String, text: true }
    // 3. Model: ArtistSchema.path('name').index({ text: true })
    query.$text = {$search: criteria.name}
  }

  if (criteria.age) {
    query.age = {
      $gte: criteria.age.min,
      $lte: criteria.age.max
    }
  }

  if (criteria.yearsActive) {
    query.yearsActive = {
      $gte: criteria.yearsActive.min,
      $lte: criteria.yearsActive.max
    }
  }

  return query
}
