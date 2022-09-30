const { Router } = require('express');
const rescue = require('express-rescue');
const ProductsController = require('../controllers/productsController');

const router = Router();

router.get('/', rescue(ProductsController.getAll));

module.exports = router;
