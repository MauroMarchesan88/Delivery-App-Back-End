const { Router } = require('express');
const rescue = require('express-rescue');
const SalesController = require('../controllers/salesController');

const router = Router();

router.post('/create', rescue(SalesController.create));
router.patch('/update/:id', rescue(SalesController.updateSale));
router.get('/user', rescue(SalesController.getAllByUser));
router.get('/seller', rescue(SalesController.getAllBySeller));
router.get('/:id', rescue(SalesController.findByPk));
router.get('/', rescue(SalesController.getAll));

module.exports = router;
