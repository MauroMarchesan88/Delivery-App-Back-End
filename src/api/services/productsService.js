const { Product } = require('../../database/models');
const jwtService = require('../middlewares/jwtValidation');

const productsService = {
  getAll: async (token) => {
    await jwtService.validateToken(token);
    const allProducts = await Product.findAll();

    return allProducts;
    },
};

module.exports = productsService;
