const Artist = require('../models/artist')

/**
 * Sets a group of Artists as retired
 * @param {array} _ids - An array of the _id's of of artists to update
 * @return {promise} A promise that resolves after the update
 */
module.exports = (_ids) => {
  return Artist.update(
    {_id: {$in: _ids}},
    {retired: true},
    // http://mongoosejs.com/docs/api.html#update_update
    // Options: multi (boolean) whether multiple documents should be updated (false)
    {multi: true} // 若沒有設為true，只會update一筆
  )
}
