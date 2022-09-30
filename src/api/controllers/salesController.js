const SalesService = require('../services/salesService');

const SalesController = {
    create: async (req, res) => {
      const body = await SalesService.validateBodySale(req.body);
      const { authorization: token } = req.headers;
      
      const newSale = await SalesService.create(body, token);

      return res.status(201).json(newSale);
    },

    getAll: async (req, res) => {
      const { authorization: token } = req.headers;

      const allSales = await SalesService.getAll(token);

      return res.status(200).json(allSales);
    },

    getAllByUser: async (req, res) => {
      const { authorization: token } = req.headers;

      const allSales = await SalesService.getAllByUser(token);
      return res.status(200).json(allSales);
    },

    getAllBySeller: async (req, res) => {
      const { authorization: token } = req.headers;

      const allSales = await SalesService.getAllBySeller(token);
      return res.status(200).json(allSales);
    },
    
    findByPk: async (req, res) => {
      const { authorization: token } = req.headers;
      const { id } = req.params;

      const newSale = await SalesService.findByPk(token, id);

      return res.status(200).json(newSale);
    },

    updateSale: async (req, res) => {
      const { authorization: token } = req.headers;
      const { id } = req.params;

      const newSale = await SalesService.updateSale(token, id);
      const { user, saleData } = newSale;
      await SalesService.validateUpdate(saleData, user.id);

      let allSales = '';
      if (user.role === 'customer') {
        allSales = await SalesService.updateSaleCustomer(id, saleData.status);
      }

      if (user.role === 'seller') {
        allSales = await SalesService.updateSaleSeller(id, saleData.status);
      }

      return res.status(204).json({ message: allSales });
    },
};

module.exports = SalesController; 
