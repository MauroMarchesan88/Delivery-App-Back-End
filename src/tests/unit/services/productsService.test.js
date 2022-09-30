const chai = require('chai');
const { expect } = chai;
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const { Product: productModel } = require('../../../database/models');
const jwtService = require('../../../api/middlewares/jwtValidation');
const productsService = require('../../../api/services/productsService');
const { arrayProductsMock } = require('../../mocks/productsMock');

chai.use(chaiAsPromised);

describe('services/productsService', () => {
  beforeEach(() => {
    sinon.restore();
  });

  describe('#getAll', () => {
    it('should throw if token is invalid', async () => {
      const expectedError = new Error('Expired or invalid token');
      expectedError.name = 'UnauthorizedError';

      sinon.stub(jwtService, 'validateToken').throws(expectedError);

      return expect(productsService.getAll('invalid token'))
        .to.eventually.be.rejected
        .and.to.have.property('name', expectedError.name);
    });

    it('should throw if model throws', async () => {
      sinon.stub(jwtService, 'validateToken').resolves();
      sinon.stub(productModel, 'findAll').throws();

      return expect(productsService.getAll('valid token'))
        .to.eventually.be.rejected;
    });

    it('should return an array of products', async () => {
      sinon.stub(jwtService, 'validateToken').resolves();
      sinon.stub(productModel, 'findAll').resolves(arrayProductsMock);

      return expect(productsService.getAll('valid token'))
        .to.eventually.deep.equal(arrayProductsMock);
    });
  });
});