const ProductsService = require('../services/productsService');

const productsController = {
    getAll: async (req, res) => {
      const { authorization: token } = req.headers;
      const allProducts = await ProductsService.getAll(token);

      return res.status(200).json(allProducts);
    },
};

module.exports = productsController; 