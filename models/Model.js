const queryBuilder = require('./queryBuilder')
const DBManage = require('../database/DBManage')

const Model = function (table, sql) {
  this._table = table

  this.index = function (options) {
    let self = this

    return new Promise(function(resolve, reject) {
      let queryString = queryBuilder.buildQueryString(options),
        sql = `SELECT * from ${self._table} ${queryString}`

      DBManage.executeQuery(sql, function(err, data) {
        if (err) {
          console.log(err.message)
          reject(err)
        }

        resolve(data)
      })
    })
  }
}

module.exports = {
  Model: Model
}
