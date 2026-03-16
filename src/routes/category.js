const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');

router.get('/category', categoryController.list);

router.post('/category/add', categoryController.save);

router.get('/category/delete/:id', categoryController.delete);

router.get('/category/update/:id', categoryController.edit);

router.post('/category/update/:id', categoryController.update);

module.exports = router;
