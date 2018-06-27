function buildQueryString(input) {
  let {limit, page, sort, ...other} = {...input},
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
          sql += ` \`${item}\` = '${input[item]}'`
          count++
        } else {
          sql += ` \`${item}\` = '${input[item]}'`
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

module.exports = {
  buildQueryString: buildQueryString
}
