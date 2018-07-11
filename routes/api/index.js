const express = require('express')
const router = express.Router()
const { Model } = require('../../models/Model')

/* GET home page. */
router.get('/', async function(req, res, next) {
  let model = new Model('products')
  // let response = await model.store({
  //   name: 'test ne',
  //   catalog_id: 1,
  //   content: 'Test content ne'
  // })

  // let response = await model.find(2)
  let response = await model.index({
    limit: 10,
    page: 1,
    sort: '-id'
  }, true)

  // res.send('GET "/api" OK')
  res.json(response)
})

module.exports = router
