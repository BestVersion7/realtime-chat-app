const messageController = require('../controller/message')
const express = require('express')
const router = express.Router()

router.delete('/', messageController.deleteAll)

module.exports = router