const SqlString = require('sqlstring')
const connection = require('../database/connection')

function buildQueryString(input) {
  let { limit, page, sort, ...other } = { ...input },
    whereStatement = buildWhereStatement(other),
    limitStatement = buildLimitStatement(limit, page),
    orderByStatement = buildOrderByStatement(sort)

  return `${whereStatement} ${orderByStatement} ${limitStatement}`
}

/**
 * Create sql where statement based on input object
 * @param {Object} obj
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
  return `LIMIT ${pos}, ${pos + limit - 1}`
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

/**
 * Build query & data for insert statement
 * @param tableName
 * @param input
 * @returns {{sql: string, data: any[]}}
 */
function buildInsertQuery(tableName, input) {
  let keys = Object.keys(input),
    values = keys.map(key => input[key]),
    sql = `Insert into ${tableName}(${keys
      .map(key => `\`${key}\``)
      .join(',')}) values (?)`

  return {
    sql: sql,
    data: values
  }
}

module.exports = {
  buildQueryString: buildQueryString,
  createMetaData: createMetaData,
  buildInsertQuery: buildInsertQuery
}
