const sinon = require('sinon');
const chai = require('chai');
const { expect } = chai;
const chaiAsPromised = require('chai-as-promised');
const salesService = require('../../../api/services/salesService');
const { Sale, SalesProducts } = require('../../../database/models');
const jwtService = require('../../../api/middlewares/jwtValidation');
const { customerMock, sellerMock } = require('../../mocks/usersMock');
const { mockedCreateSale, mockedSale, saleData, arraySaleMock } = require('../../mocks/productsMock');

chai.use(chaiAsPromised);

describe('services/salesService', () => {

  describe('#getAll', async () => {
    beforeEach(async () => {
      sinon.restore();
      
    });
  
    afterEach(()=>{
      sinon.restore();
    })

    it('should throw if query throws', async () => {
      sinon.stub(jwtService, 'validateToken').resolves(customerMock);
      sinon.stub(Sale, 'findAll').rejects();

      return expect(salesService.getAll()).to.eventually.be.rejected;
    });

    it('should return an empty array if there are no sales', async () => {
      sinon.stub(jwtService, 'validateToken').resolves(customerMock);
      sinon.stub(Sale, 'findAll').resolves([]);

      return expect(salesService.getAll()).to.eventually.deep.equal([]);
    });

    it('should return array of sales if query succeeds', async () => {
      sinon.stub(jwtService, 'validateToken').resolves(customerMock);
      sinon.stub(Sale, 'findAll').resolves(arraySaleMock);

      return expect(salesService.getAll()).to.eventually.deep.equal(arraySaleMock);
    });

    it('should throw if query throws', async () => {
      sinon.stub(jwtService, 'validateToken').resolves(sellerMock);
      sinon.stub(Sale, 'findAll').rejects();

      return expect(salesService.getAll()).to.eventually.be.rejected;
    });

    it('should return an empty array if there are no sales', async () => {
      sinon.stub(jwtService, 'validateToken').resolves(sellerMock);
      sinon.stub(Sale, 'findAll').resolves([]);

      return expect(salesService.getAll()).to.eventually.deep.equal([]);
    });

    it('should return array of sales if query succeeds', async () => {
      sinon.stub(jwtService, 'validateToken').resolves(sellerMock);
      sinon.stub(Sale, 'findAll').resolves(arraySaleMock);

      return expect(salesService.getAll()).to.eventually.deep.equal(arraySaleMock);
    });

  });

  describe('#findByPk', async () => {
    beforeEach(async () => {
      sinon.restore();
      
    });
  
    afterEach(()=>{
      sinon.restore();
    })

    it('should throw if query throws', async () => {
      sinon.stub(jwtService, 'validateToken').resolves(customerMock);
      sinon.stub(Sale, 'findOne').rejects();

      return expect(salesService.findByPk(1)).to.eventually.be.rejected;
    });

    it('should throw NotFoundError if there are no products with that PK', async () => {
      sinon.stub(jwtService, 'validateToken').resolves(sellerMock);
      sinon.stub(Sale, 'findOne').resolves(null);
      
      const expectedError = new Error('Sale not found');
      expectedError.name = 'NotFoundError';

      return expect(salesService.findByPk(1))
        .to.eventually.be.rejected
        .and.to.have.property('name', expectedError.name);
    }); 

    it('should return a single product if query succeeds', async () => {
      sinon.stub(jwtService, 'validateToken').resolves(customerMock);
      sinon.stub(Sale, 'findOne').resolves(mockedSale);

      return expect(salesService.findByPk(1)).to.eventually.deep.equal(mockedSale);
    });

  });

  describe('#create', async () => {
    beforeEach(async () => {
      sinon.restore();
      
    });
  
    afterEach(()=>{
      sinon.restore();
    })

    it('should throw if query throws', async () => {
      sinon.stub(jwtService, 'validateToken').resolves(customerMock);
      sinon.stub(Sale, 'create').rejects();

      return expect(salesService.create({})).to.eventually.be.rejected;
    });

    it('should return a single product if query succeeds', async () => {
      sinon.stub(jwtService, 'validateToken').resolves(customerMock);
      sinon.stub(Sale, 'create').resolves(mockedCreateSale);
      sinon.stub(SalesProducts, 'bulkCreate').resolves();

      return expect(salesService.create(mockedCreateSale))
        .to.eventually.deep.equal(mockedCreateSale);
    });
  });

  describe('#getAllByUser', async () => {
    beforeEach(async () => {
      sinon.restore();
      
    });
  
    afterEach(()=>{
      sinon.restore();
    })

    it('should throw if query throws', async () => {
      sinon.stub(jwtService, 'validateToken').resolves(customerMock);
      sinon.stub(Sale, 'findAll').rejects();

      return expect(salesService.getAllByUser({})).to.eventually.be.rejected;
    });

    it('should return a single product if query succeeds', async () => {
      sinon.stub(jwtService, 'validateToken').resolves(customerMock);
      sinon.stub(Sale, 'findAll').resolves(mockedSale);

      return expect(salesService.getAllByUser({})).to.eventually.deep.equal(mockedSale);
    });
  });
  
  describe('#getAllBySeller', async () => {
    beforeEach(async () => {
      sinon.restore();
      
    });
  
    afterEach(()=>{
      sinon.restore();
    })

    it('should throw if query throws', async () => {
      sinon.stub(jwtService, 'validateToken').resolves(customerMock);
      sinon.stub(Sale, 'findAll').rejects();

      return expect(salesService.getAllBySeller({})).to.eventually.be.rejected;
    });

    it('should return a single product if query succeeds', async () => {
      sinon.stub(jwtService, 'validateToken').resolves(customerMock);
      sinon.stub(Sale, 'findAll').resolves(mockedSale);

      return expect(salesService.getAllBySeller({})).to.eventually.deep.equal(mockedSale);
    });
  });

  describe('#updateSale', async () => {
    beforeEach(async () => {
      sinon.restore();
      
    });
  
    afterEach(()=>{
      sinon.restore();
    })

    it('should throw if query throws', async () => {
      sinon.stub(jwtService, 'validateToken').resolves(customerMock);
      sinon.stub(Sale, 'findByPk').rejects();

      return expect(salesService.updateSale({})).to.eventually.be.rejected;
    });

    it('should return user and saleData if query succeeds', async () => {
      sinon.stub(jwtService, 'validateToken').resolves(customerMock);
      sinon.stub(Sale, 'findByPk').resolves(mockedCreateSale);

      return expect(salesService.updateSale({}))
        .to.eventually.deep.equal( { user: {...customerMock}, saleData: {...mockedCreateSale} });
    });
  });

  describe('#updateSaleSeller', async () => {
    beforeEach(async () => {
      sinon.restore();
      
    });
  
    afterEach(()=>{
      sinon.restore();
    })

    it('should throw if query throws', async () => {
      sinon.stub(Sale, 'update').rejects();

      return expect(salesService.updateSaleSeller(mockedSale.id, 'Pendente' ))
        .to.eventually.be.rejected;
    });

    it('should return update sale if query succeeds', async () => {
      sinon.stub(Sale, 'update').resolves(mockedSale);

      return expect(salesService.updateSaleSeller(mockedSale.id, 'Pendente')).to.eventually.fulfilled;
    });
  });

  describe('#updateSaleCustomer', async () => {
    beforeEach(async () => {
      sinon.restore();
      
    });
  
    afterEach(()=>{
      sinon.restore();
    })

    it('should throw if query throws', async () => {
      sinon.stub(Sale, 'update').rejects();

      return expect(salesService.updateSaleCustomer(mockedSale.id, 'Pendente' ))
        .to.eventually.be.rejected;
    });

    it('should return update sale if query succeeds', async () => {
      sinon.stub(jwtService, 'validateToken').resolves(customerMock);
      sinon.stub(Sale, 'update').resolves(mockedSale);

      return expect(salesService.updateSaleCustomer(mockedSale.id, 'Em Trânsito')).to.eventually.fulfilled;
    });
  });

  describe('#validateBodySale', () => {
    it('should throw if body is not an object', async () => {
      const body = 'not an object';
      return expect(salesService.validateBodySale(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should throw if "sellerId" is missing', async () => {
      const body = {
        totalPrice: '100.00',
        deliveryAddress: 'rua 16',
        deliveryNumber: '5',
        products: [{
          productId: 1,
          quantity: 2,
        }, {
          productId: 2,
          quantity: 2,
        }]
      };

      return expect(salesService.validateBodySale(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should throw if "sellerId" is not a number', async () => {
      const body = {
        sellerId: "a",
        totalPrice: '100.00',
        deliveryAddress: 'rua 16',
        deliveryNumber: '5',
        products: [{
          productId: 1,
          quantity: 2,
        }, {
          productId: 2,
          quantity: 2,
        }]
      };
      
      return expect(salesService.validateBodySale(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should throw if "totalPrice" length is missing', async () => {
      const body = {
        sellerId: 2,
        deliveryAddress: 'rua 16',
        deliveryNumber: '5',
        products: [{
          productId: 1,
          quantity: 2,
        }, {
          productId: 2,
          quantity: 2,
        }]
      };
      
      return expect(salesService.validateBodySale(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should throw if "totalPrice" is not a string', async () => {
      const body = {
        sellerId: 2,
        totalPrice: 'asd',
        deliveryAddress: 'rua 16',
        deliveryNumber: '5',
        products: [{
          productId: 1,
          quantity: 2,
        }, {
          productId: 2,
          quantity: 2,
        }]
      };
      
      return expect(salesService.validateBodySale(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should throw if "deliveryAddress" is missing', async () => {
      const body = {
        sellerId: 2,
        totalPrice: '100.00',
        deliveryNumber: '5',
        products: [{
          productId: 1,
          quantity: 2,
        }, {
          productId: 2,
          quantity: 2,
        }]
      };
      
      return expect(salesService.validateBodySale(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should throw if "deliveryNumber" is missing', async () => {
      const body = {
        sellerId: 2,
        totalPrice: '100.00',
        deliveryAddress: 'rua 16',
        products: [{
          productId: 1,
          quantity: 2,
        }, {
          productId: 2,
          quantity: 2,
        }]
      };
      
      return expect(salesService.validateBodySale(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should throw if "deliveryNumber" is not a string', async () => {
      const body = {
        sellerId: 2,
        totalPrice: '100.00',
        deliveryAddress: 'rua 16',
        deliveryNumber: 5,
        products: [{
          productId: 1,
          quantity: 2,
        }, {
          productId: 2,
          quantity: 2,
        }]
      };
      
      return expect(salesService.validateBodySale(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should throw if "products" is missing', async () => {
      const body = {
        sellerId: 2,
        totalPrice: '100.00',
        deliveryAddress: 'rua 16',
        deliveryNumber: '5',
      };
      
      return expect(salesService.validateBodySale(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should throw if "products" not an array', async () => {
      const body = {
        sellerId: 2,
        totalPrice: '100.00',
        deliveryAddress: 'rua 16',
        deliveryNumber: '5',
        products: {
          productId: 1,
          quantity: 2,
        }
      };
      
      return expect(salesService.validateBodySale(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should return body if validation passed', async () => {
      const body = {
        sellerId: 2,
        totalPrice: 100.00,
        deliveryAddress: 'rua 16',
        deliveryNumber: '5',
        products: [{
          productId: 1,
          quantity: 2,
        }, {
          productId: 2,
          quantity: 2,
        }]
      };
      
      return expect(salesService.validateBodySale(body))
        .to.eventually.be.deep.equal(body)
    });
  });

  describe('#validateUpdate', () => {
    it('should throw if user is not rightfull customer or seller', async () => {
      const userData = 'wrong user';

      return expect(salesService.validateUpdate(saleData, userData))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'UnauthorizedError');
    });

    it('should return true for rightfull customer', async () => {
      const userData = 1;

      return expect(salesService.validateUpdate(saleData, userData))
        .to.eventually.be.true;
    });
    it('should return true for rightfull seller', async () => {
      const userData = 2;

      return expect(salesService.validateUpdate(saleData, userData))
        .to.eventually.be.true;
    });
  });
});