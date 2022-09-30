const { Router } = require('express');
const rescue = require('express-rescue');
const AdminController = require('../controllers/adminController');

const router = Router();

router.post('/create/user', rescue(AdminController.createUser));
router.delete('/delete/user/:id', rescue(AdminController.deleteUser));

module.exports = router;
