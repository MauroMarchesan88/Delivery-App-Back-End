const chai = require('chai');
const { expect } = chai;
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const productsController = require('../../../api/controllers/productsController');
const productsService = require('../../../api/services/productsService');
const { arrayProductsMock } = require('../../mocks/productsMock');

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('controllers/productsController', () => {
  let req = {};
  let res = {};

  beforeEach(() => {
    sinon.restore();
    req = {};
    res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub();
  });

  describe('#getAll', () => {
    it('should throw if service throws', async () => {
      sinon.stub(productsService, 'getAll').throws();

      return expect(productsController.getAll(req, res))
        .to.eventually.be.rejected;
    });

    it('should return status 200 and an array of products', async () => {
      req.headers = { authorization: 'valid token' };
      sinon.stub(productsService, 'getAll').resolves(arrayProductsMock);

      await productsController.getAll(req, res);
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(arrayProductsMock);
    });
  });
});