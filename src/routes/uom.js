const express = require('express');
const router = express.Router();

const uomController = require('../controllers/uomController');

router.get('/uom', uomController.list);
router.post('/uom/add', uomController.save);

module.exports = router;