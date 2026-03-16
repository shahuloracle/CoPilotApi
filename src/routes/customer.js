const express = require('express');
const router = express.Router();

const customerController = require('../controllers/customerController');

router.get('/customer', customerController.list);
router.post('/customer/add', customerController.save);

module.exports = router;