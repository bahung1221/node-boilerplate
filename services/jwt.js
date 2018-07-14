const jwt = require('jsonwebtoken')
const cert = 'ZG9hbmx0d2ViMi1qc29uLXdlYi10b2tlbg=='

/**
 * Create new jwt token
 * @param {Object} payload
 */
function sign(payload) {
  return new Promise(function(resolve, reject) {
    jwt.sign(payload, cert, { expiresIn: '24h' }, function(err, token) {
      if (err) {
        reject(err)
      }
      resolve(token)
    })
  })
}

/**
 * Verify jwt token
 * @param {String} token
 */
function verify(token) {
  return new Promise(function(resolve, reject) {
    jwt.verify(token, cert, function(err, decoded) {
      if (err) {
        reject(err)
      }
      resolve(decoded)
    })
  })
}

/**
 * Middleware to check jwt token
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
async function jwtMiddleware(req, res, next) {
  // check header for token
  let jwtHeader = req.headers.authorization

  // decode token
  if (jwtHeader) {
    jwtHeader = req.headers.authorization.split(' ')
    let scheme = jwtHeader[0]
    let token = jwtHeader[1]

    // Check scheme
    if (scheme !== 'Bearer') {
      return res.status(401).json({
        success: false,
        message: 'Failed to authenticate token.'
      })
    }

    // verifies secret and checks exp
    try {
      let decoded = await verify(token)
      req.decoded = decoded
      return next()
    } catch (e) {
      return res.status(401).json({
        success: false,
        message: 'Failed to authenticate token.'
      })
    }
  } else {
    // if there is no token
    // return an error
    return res.status(403).json({
      success: false,
      message: 'No token provided.'
    })
  }
}

module.exports = {
  sign: sign,
  verify: verify,
  jwtMiddleware: jwtMiddleware
}
