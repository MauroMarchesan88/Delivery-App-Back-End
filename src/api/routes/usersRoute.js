const { Router } = require('express');
const rescue = require('express-rescue');
const UsersController = require('../controllers/usersController');

const router = Router();

router.post('/create', rescue(UsersController.create));
router.post('/login', rescue(UsersController.login));
router.get('/sellers', rescue(UsersController.getAllSellers));
router.get('/:id', rescue(UsersController.findByPk));
router.get('/', rescue(UsersController.getAll));

module.exports = router;
