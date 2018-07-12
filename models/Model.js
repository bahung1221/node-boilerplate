const queryBuilder = require('./queryBuilder')
const connection = require('../database/connection')

/**
 * Constructor
 * @param table
 * @constructor
 */
const Model = function(table) {
  this._table = table
  this._connection = connection
}

/**
 * Get all rows that match conditions (options)
 * @param options
 * @param isGetMetaData
 * @returns {Promise<any>}
 */
Model.prototype.index = function(options, isGetMetaData = false) {
  let self = this

  return new Promise(async function(resolve, reject) {
    let queryString = queryBuilder.buildQueryString(options),
      sql = `SELECT * from ${self._table} ${queryString}`

    try {
      let rows = await self._connection.executeQuery(sql)
      if (isGetMetaData) {
        rows = await queryBuilder.createMetaData(self._table, options, rows)
      }
      resolve(rows)
    } catch (e) {
      console.error(e)
      reject(e)
    }
  })
}

/**
 * Get specific row with given id
 * @param id
 * @returns {Promise<object>}
 */
Model.prototype.find = function(id) {
  let self = this

  return new Promise(async function(resolve, reject) {
    let sql = `Select * From ${self._table} Where id = ${id} Limit 1`

    try {
      let rows = await self._connection.executeQuery(sql)
      resolve(rows)
    } catch (e) {
      console.error(e)
      reject(e)
    }
  })
}

/**
 * Store new row with given data into database
 * @param data
 * @returns {Promise<object>}
 */
Model.prototype.store = function(data) {
  let self = this

  return new Promise(async function(resolve, reject) {
    let sql = queryBuilder.buildInsertQuery(self._table, data)

    try {
      let rows = await self._connection.executeUpdate(sql)
      resolve(rows)
    } catch (e) {
      console.error(e)
      reject(e)
    }
  })
}

/**
 * Update specific row with given id
 * @param id
 * @param data
 * @returns {Promise<object>}
 */
Model.prototype.update = function(id, data) {
  let self = this

  return new Promise(async function(resolve, reject) {
    let sql = queryBuilder.updateQuery(self._table, id)

    try {
      let rows = await self._connection.executeUpdate(sql, data)
      resolve(rows)
    } catch (e) {
      console.error(e)
      reject(e)
    }
  })
}

/**
 * Delete specific row with given id
 * @param id
 * @returns {Promise<object>}
 */
Model.prototype.delete = function(id) {
  let self = this

  return new Promise(async function(resolve, reject) {
    let sql = queryBuilder.deleteQuery(self._table, id)

    try {
      let rows = await self._connection.executeQuery(sql)
      resolve(rows)
    } catch (e) {
      console.error(e)
      reject(e)
    }
  })
}

module.exports = {
  Model: Model
}
