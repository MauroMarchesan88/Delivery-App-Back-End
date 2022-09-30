const AdminService = require('../services/adminService');

const AdminController = {
    createUser: async (req, res) => {
      const { name, email, password, role } = await AdminService.validateBodyAdmin(req.body);
      const { authorization: token } = req.headers;

      const user = await AdminService.createUser({ name, email, password, role, token });

      return res.status(201).json(user);
    },

    deleteUser: async (req, res) => {
      const { authorization: token } = req.headers;
      const { id } = req.params;
      const deleteMessage = await AdminService.deleteUser(id, token);
      
      return res.status(204).json(deleteMessage);
    },
};

module.exports = AdminController;