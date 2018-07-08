const queryBuilder = require('./queryBuilder')
const DBManage = require('../database/DBManage')

/**
 * Constructor
 * @param table
 * @param sql
 * @constructor
 */
const Model = function (table, sql) {
  this._table = table
}

/**
 * Get all rows that match conditions (options)
 * @param options
 * @returns {Promise<object>}
 */
Model.prototype.index = function (options) {
  let self = this

  return new Promise(async function (resolve, reject) {
    let queryString = queryBuilder.buildQueryString(options),
      sql = `SELECT * from ${self._table} ${queryString}`

    try {
      let rows = await DBManage.executeQuery(sql)
      resolve(rows)
    } catch (e) {
      console.error(e.message)
      reject(e.message)
    }
  })
}

/**
 * Get specific row with given id
 * @param id
 * @returns {Promise<object>}
 */
Model.prototype.find = function (id) {
  let self = this

  return new Promise(async function (resolve, reject) {
    let sql = `Select * From ${self._table} Where id = ${id} Limit 1`

    try {
      let rows = await DBManage.executeQuery(sql)
      resolve(rows)
    } catch (e) {
      console.error(e.message)
      reject(e.message)
    }
  })
}

/**
 * Store new row with given data into database
 * @param data
 * @returns {Promise<object>}
 */
Model.prototype.store = function (data) {
  let self = this

  return new Promise(async function (resolve, reject) {
    let sql = `Insert into ${self._table} values ?`

    try {
      let rows = await DBManage.executeUpdate(sql, data)
      resolve(rows)
    } catch (e) {
      console.error(e.message)
      reject(e.message)
    }
  })
}

/**
 * Update specific row with given id
 * @param id
 * @param data
 * @returns {Promise<object>}
 */
Model.prototype.update = function (id, data) {
  // TODO
}

/**
 * Delete specific row with given id
 * @param id
 * @returns {Promise<object>}
 */
Model.prototype.delete = function (id) {
  // TODO
}

module.exports = {
  Model: Model
}
