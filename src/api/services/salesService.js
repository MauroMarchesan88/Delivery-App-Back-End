const Joi = require('joi');
const { Sale, SalesProducts, Product } = require('../../database/models');
const jwtService = require('../middlewares/jwtValidation');

const SaleService = {
  validateBodySale: async (data) => {
    const schema = Joi.object({
        sellerId: Joi.number().required(),
        totalPrice: Joi.number().required(),
        deliveryAddress: Joi.string().required(),
        deliveryNumber: Joi.string().required(),
        products: Joi.array().items(Joi.object()).required(),
    });

    const value = await schema.validateAsync(data);
    return value;
},
  
  create: async (body, token) => {
    const {
      sellerId,
      totalPrice,
      deliveryAddress,
      deliveryNumber,
      products } = body;

    const user = await jwtService.validateToken(token);
    const allProducts = await Sale.create({
      userId: user.id, sellerId, totalPrice, deliveryAddress, deliveryNumber });
    const saleId = allProducts.id;

    const arrayProducts = products.map((product) => ({ ...product, saleId }));
    await SalesProducts.bulkCreate(arrayProducts);  
  
    return allProducts;
  },

  getAll: async (token) => {
    await jwtService.validateToken(token);
    const allSales = await Sale.findAll();
    return allSales;
  },

  getAllByUser: async (token) => {
    const user = await jwtService.validateToken(token);

    const allSales = await Sale.findAll({ where: { userId: user.id } });
    return allSales;
  },

  getAllBySeller: async (token) => {
    const user = await jwtService.validateToken(token);

    const allSales = await Sale.findAll({ where: { sellerId: user.id } });
    return allSales;
  },

  findByPk: async (token, id) => {
    await jwtService.validateToken(token);

    const result = await Sale.findOne({
      where: { id }, include: { model: Product, as: 'products' } });

    if (!result) {
      const e = new Error('Sale not found');
      e.name = 'NotFoundError';
      throw e;
    }

    return result;
  },

  validateUpdate: async (saleData, userData) => {
    if (userData === saleData.userId) return true;
    
    if (userData === saleData.sellerId) return true;
  
    const e = new Error('Unauthorized');
    e.name = 'UnauthorizedError';
    throw e;
  },

  updateSaleCustomer: async (id, saleStatus) => {
    let allowedStatus = [];
    if (saleStatus === 'Em Trânsito') {
      allowedStatus = 'Entregue';
      const allSales = await Sale.update({ status: allowedStatus }, { where: { id } });
      return allSales;
    }
    const e = new Error('Unauthorized');
    e.name = 'UnauthorizedError';
    throw e;
  },

  updateSaleSeller: async (id, saleStatus) => {
    let allowedStatus = [];
    if (saleStatus !== 'Pendente' && saleStatus !== 'Preparando') return 'bad request';
    if (saleStatus === 'Pendente') allowedStatus = 'Preparando';
    if (saleStatus === 'Preparando') allowedStatus = 'Em Trânsito';
    await Sale.update({ status: allowedStatus }, { where: { id } });

    return allowedStatus;
  },

  updateSale: async (token, id) => {
    const user = await jwtService.validateToken(token);
    const saleData = await Sale.findByPk(id);
       
    return { user, saleData };
  },

};

module.exports = SaleService;
