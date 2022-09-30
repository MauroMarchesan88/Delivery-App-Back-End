const usersService = require('../services/usersService');

const usersController = {
    create: async (req, res) => {
      const { name, email, password } = await usersService.validateBody(req.body);

      const user = await usersService.create({ name, email, password });

      return res.status(201).json(user);
    },

    login: async (req, res) => {
        const { email, password } = await usersService.validateBodyLogin(req.body);
        const user = await usersService.login(email, password);

        return res.status(200).json(user);
    },

    getAll: async (req, res) => {
      const { authorization: token } = req.headers;
      const allUsers = await usersService.getAll(token);
      
      return res.status(200).json(allUsers);
    },

    getAllSellers: async (req, res) => {
      const { authorization: token } = req.headers;
      const allSellers = await usersService.getAllSellers(token);
      
      return res.status(200).json(allSellers);
    },

    findByPk: async (req, res) => {
      const { authorization: token } = req.headers;
      const { id } = req.params;
      const newSale = await usersService.findByPk(id, token);

      return res.status(200).json(newSale);
    },
};

module.exports = usersController;