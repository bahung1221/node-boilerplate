const pool = require('./mySQLConnector')

/**
 * Execute sql query
 * @param query
 * @param data
 * @returns {Promise<object>}
 */
function executeQuery(query, data) {
  return new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      if (err) {
        if (connection) connection.release()
        reject(err.message)
        return
      }
      connection.query(query, function(err, rows) {
        connection.release()
        if (err) {
          reject(err.message)
        }
        resolve(rows)
      })
      connection.on('error', function(err) {
        reject(err.message)
      })
    })
  })
}

/**
 * Execute sql update statement
 * @param query
 * @param data
 * @returns {Promise<object>}
 */
function executeUpdate(query, data) {
  return new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      if (err) {
        if (connection) connection.release()
        reject(err.message)
        return
      }
      connection.query(query, data, function(err, rows) {
        connection.release()
        if (err) {
          reject(err.message)
        }
        resolve(rows)
      })
      connection.on('error', function(err) {
        reject(err.message)
      })
    })
  })
}

module.exports = {
  executeQuery: executeQuery,
  executeUpdate: executeUpdate
}
