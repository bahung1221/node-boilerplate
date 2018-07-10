const express = require('express')
const router = express.Router()
const { Model } = require('../../models/Model')

/* GET home page. */
router.get('/', async function(req, res, next) {
  let model = new Model('test')
  let response = await model.store({
    name: 'test ne'
  })

  // let response = await model.find(2)

  // res.send('GET "/api" OK')
  res.json(response)
})

module.exports = router
