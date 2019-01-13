const SqlString = require('sqlstring')
const connection = require('../database/connection')

function selectQuery(tableName, input) {
  let { limit, page, sort, ...other } = { ...input },
    whereStatement = buildWhereStatement(other),
    limitStatement = buildLimitStatement(limit, page),
    orderByStatement = buildOrderByStatement(sort)

  return `SELECT * from ${tableName} ${whereStatement} ${orderByStatement} ${limitStatement}`
}

function selectById(tableName, id) {
  let sql = `Select * From ${tableName} Where id = ${SqlString.escape(
    id
  )} Limit 1`

  return sql
}

/**
 * Build query & data for insert statement
 * @param tableName
 * @param input
 * @returns {{sql: string, data: any[]}}
 */
function insertQuery(tableName, input) {
  let keys = Object.keys(input),
    values = keys.map(key => input[key]),
    sqlKeys = keys.map(key => `\`${key}\``).join(','),
    sqlValues = values.map(value => SqlString.escape(value)).join(','),
    sql = `Insert into ${tableName}(${sqlKeys}) values (${sqlValues})`

  return sql
}

/**
 * Build sql update statement
 * @param tableName
 * @param input
 * @param id
 * @returns {string}
 */
function updateQuery(tableName, id) {
  let sql = `Update ${tableName} Set ? Where id = ${SqlString.escape(id)}`

  return sql
}

/**
 * Build sql delete statement
 * @param tableName
 * @param id
 * @returns {string}
 */
function deleteQuery(tableName, id) {
  let sql = `Delete from ${tableName} Where id = ${SqlString.escape(id)}`

  return sql
}

/**
 * Create sql where statement based on input object
 * @param {Object} input
 * @return {string}
 */
function buildWhereStatement(input) {
  if (!input) {
    return ''
  }

  let sql = '',
    length = Object.keys(input).length

  if (length) {
    let count = 0
    for (let item in input) {
      if (input.hasOwnProperty(item)) {
        if (count === 0) {
          sql += 'WHERE'
          sql += ` \`${item}\` = '${SqlString.escape(input[item])}'`
          count++
        } else {
          sql += ` \`${item}\` = '${SqlString.escape(input[item])}'`
          count++
          if (count !== length) {
            sql += ' and'
          }
        }
      }
    }
  }

  return sql
}

/**
 * Create limit statement for query
 * @param {Object} query
 * @return {string}
 */
function buildLimitStatement(limit, page) {
  if ((!limit && !page) || limit === 0) {
    return ''
  }

  page = page || 1
  limit = limit || 20

  let pos = (page - 1) * limit
  return `LIMIT ${pos}, ${limit}`
}

/**
 * Create sort statement on query string
 * @param query
 * @returns {string}
 */
function buildOrderByStatement(sort) {
  if (!sort) {
    return ''
  }

  let field = null,
    method = null,
    statement = ''

  if (sort) {
    if (sort.indexOf('-') != -1) {
      field = sort.split('-')[1]
      method = 'DESC'
    } else if (sort.indexOf('+') != -1) {
      field = sort.split('+')[1]
      method = 'ASC'
    }
  }

  if (field) {
    statement = `ORDER BY ${field} ${method}`
  }

  return statement
}

/**
 * Create meta data (paging)
 * @param tableName
 * @param input
 * @param resObj
 * @returns {Promise<object>}
 */
function createMetaData(tableName, input, resObj) {
  return new Promise(async function(resovle, reject) {
    let sql = `Select count(id) as total from ${tableName}`,
      { limit, page, sort, ...others } = { ...input }

    if (others) {
      let customWhereStatement = buildWhereStatement(others)
      sql = `Select count(id) as total from ${tableName} ${customWhereStatement}`
    }
    console.log(sql)
    try {
      page = page || 1
      limit = limit || 20

      let data = await connection.executeQuery(sql),
        total = data[0].total,
        perPage = Number(limit) === 0 ? total : limit,
        lastPage = Number(limit) === 0 ? 1 : Math.ceil(total / limit),
        currentPageCount = resObj.length

      let meta = {
        total: total,
        perPage: perPage,
        currentPage: page,
        lastPage: lastPage,
        currentPageCount: currentPageCount,
        data: resObj
      }

      resovle(meta)
    } catch (e) {
      console.error(e)
      reject(e)
    }
  })
}

module.exports = {
  selectQuery: selectQuery,
  selectById: selectById,
  createMetaData: createMetaData,
  insertQuery: insertQuery,
  updateQuery: updateQuery,
  deleteQuery: deleteQuery
}
