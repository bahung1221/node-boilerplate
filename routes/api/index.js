const express = require('express')
const router = express.Router()
const {Model} = require('../../models/Model')

/* GET home page. */
router.get('/', async function(req, res, next) {
  let model = new Model('products')
  let response = await model.index({
    limit: 10,
    sort: '-id',
    page: 2
  })

  // res.send('GET "/api" OK')
  res.json(response)
})

module.exports = router
