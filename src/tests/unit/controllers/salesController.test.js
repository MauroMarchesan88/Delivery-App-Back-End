const chai = require('chai');
const { expect } = chai;
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const salesController = require('../../../api/controllers/salesController');
const salesService = require('../../../api/services/salesService');
const { customerMock, sellerMock } = require('../../mocks/usersMock');
const jwtService = require('../../../api/middlewares/jwtValidation');
const {mockedCreateSale, mockedSale, arraySaleMock} = require('../../mocks/productsMock');

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('controllers/salesController', () => {
  let req = {};
  let res = {};

  beforeEach(() => {
    sinon.restore();
    req = {};
    res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub();
  });

  describe('#create', () => {
    it('should throw if request body is invalid', async () => {
      req.body = {};
      req.headers = { authorization: 'valid token' };
      sinon.stub(salesService, 'validateBodySale').throws();

      return expect(salesController.create(req, res))
        .to.eventually.be.rejected;
    });

    it('should throw if service throws', async () => {
      req.body = {};
      req.headers = { authorization: 'valid token' };
      sinon.stub(salesService, 'validateBodySale').resolves(mockedCreateSale);
      sinon.stub(salesService, 'create').throws();

      return expect(salesController.create(req, res))
        .to.eventually.be.rejected;
    });

    it('should return status 201 and an user object', async () => {
      req.body = {};
      req.headers = { authorization: 'valid token' };
      sinon.stub(salesService, 'validateBodySale').resolves(mockedCreateSale);
      sinon.stub(salesService, 'create').resolves(mockedCreateSale);

      await salesController.create(req, res);

      expect(res.status).to.have.been.calledWith(201);
      expect(res.json).to.have.been.calledWith(mockedCreateSale);
    });
  });

  describe('#getAll', () => {
    it('should throw if service throws', async () => {
      req.params = { id: 1 };
      req.headers = { authorization: 'valid token' };
      sinon.stub(salesService, 'getAll').throws();

      return expect(salesController.getAll(req, res))
        .to.eventually.be.rejected;
    });

    it('should return status 200 and an array of sales', async () => {
      req.params = { id: 1 };
      req.headers = { authorization: 'valid token' };
      sinon.stub(salesService, 'getAll').resolves(arraySaleMock);

      await salesController.getAll(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(arraySaleMock);
    });
  });

  describe('#getAllByUser', () => {
    it('should throw if service throws', async () => {
      req.params = { id: 1 };
      req.headers = { authorization: 'valid token' };
      sinon.stub(salesService, 'getAllByUser').throws();

      return expect(salesController.getAllByUser(req, res))
        .to.eventually.be.rejected;
    });

    it('should return status 200 and an array of sales', async () => {
      req.params = { id: 1 };
      req.headers = { authorization: 'valid token' };
      sinon.stub(salesService, 'getAllByUser').resolves(arraySaleMock);

      await salesController.getAllByUser(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(arraySaleMock);
    });
  });

  describe('#getAllBySeller', () => {
    it('should throw if service throws', async () => {
      req.params = { id: 1 };
      req.headers = { authorization: 'valid token' };
      sinon.stub(salesService, 'getAllBySeller').throws();

      return expect(salesController.getAllBySeller(req, res))
        .to.eventually.be.rejected;
    });

    it('should return status 200 and an array of sales', async () => {
      req.params = { id: 1 };
      req.headers = { authorization: 'valid token' };
      sinon.stub(salesService, 'getAllBySeller').resolves(arraySaleMock);

      await salesController.getAllBySeller(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(arraySaleMock);
    });
  });


  describe('#findByPk', () => {
    it('should throw if service throws', async () => {
      req.params = { id: 1 };
      req.headers = { authorization: 'valid token' };
      sinon.stub(salesService, 'findByPk').throws();

      return expect(salesController.findByPk(req, res))
        .to.eventually.be.rejected;
    });

    it('should return status 200 and a sale', async () => {
      req.params = { id: 1 };
      req.headers = { authorization: 'valid token' };
      sinon.stub(salesService, 'findByPk').resolves(mockedSale);

      await salesController.findByPk(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(mockedSale);
    });
  });

  describe('#updateSale', () => {
    it('should throw if service throws', async () => {
      req.params = { id: 1 };
      req.headers = { authorization: 'valid token' };
      sinon.stub(salesService, 'updateSale').throws();

      return expect(salesController.updateSale(req, res))
        .to.eventually.be.rejected;
    });

    it('should return status 200 and a sale for customer', async () => {
      req.params = { id: 1 };
      req.headers = { authorization: 'valid token' };
      sinon.stub(jwtService, 'validateToken').resolves(customerMock);
      sinon.stub(salesService, 'updateSale').resolves({ user: customerMock, saleData: mockedSale});
      sinon.stub(salesService, 'validateUpdate').resolves(mockedSale, customerMock.id);
      sinon.stub(salesService, 'updateSaleCustomer').resolves('Entregue');

      await salesController.updateSale(req, res);

      expect(res.status).to.have.been.calledWith(204);
    });

    it('should return status 200 and a sale for seller', async () => {
      req.params = { id: 1 };
      req.headers = { authorization: 'valid token' };
      sinon.stub(jwtService, 'validateToken').resolves(sellerMock);
      sinon.stub(salesService, 'updateSale').resolves({ user: sellerMock, saleData: mockedSale});
      sinon.stub(salesService, 'validateUpdate').resolves(mockedSale, sellerMock.id);
      sinon.stub(salesService, 'updateSaleSeller').resolves('Preparando');

      await salesController.updateSale(req, res);

      expect(res.status).to.have.been.calledWith(204);
    });
  });
});