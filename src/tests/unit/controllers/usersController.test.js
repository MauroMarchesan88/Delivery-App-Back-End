const chai = require('chai');
const { expect } = chai;
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const usersController = require('../../../api/controllers/usersController');
const usersService = require('../../../api/services/usersService');
const { customerMock, createUserBodyMock, loginUserBodyMock, arrayOfUsersMock, arrayOfSellersMock, sellerMock2 } = require('../../mocks/usersMock');


chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('controllers/usersController', () => {
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
      sinon.stub(usersService, 'validateBody').throws();

      return expect(usersController.create(req, res))
        .to.eventually.be.rejected;
    });

    it('should return status 201 and an user object with token', async () => {
      req.body = {};
      const { id, password, ...userInfo } = customerMock
      const expectedReturn = {
        ...userInfo,
        token: 'validCustomerToken'
      };

      sinon.stub(usersService, 'validateBody').resolves(createUserBodyMock);
      sinon.stub(usersService, 'create').resolves(expectedReturn);

      await usersController.create(req, res);

      expect(res.status).to.have.been.calledWith(201);
      expect(res.json).to.have.been.calledWith(expectedReturn);
    });
  });

  describe('#login', () => {
    it('should throw if request body is invalid', async () => {
      req.body = {};
      sinon.stub(usersService, 'validateBodyLogin').throws();

      return expect(usersController.login(req, res))
        .to.eventually.be.rejected;
    });

    it('should return status 200 and an user object with token', async () => {
      req.body = {};
      const { id, password, ...userInfo } = customerMock
      const expectedReturn = {
        ...userInfo,
        token: 'validToken'
      };
      sinon.stub(usersService, 'validateBodyLogin').resolves(loginUserBodyMock);
      sinon.stub(usersService, 'login').resolves(expectedReturn);

      await usersController.login(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(expectedReturn);
    });
  });

  describe('#getAll', () => {
    it('should return status 200 and an array of users', async () => {
      req.body = {};
      req.headers = { authorization: 'validToken' };
  
      sinon.stub(usersService, 'getAll').resolves(arrayOfUsersMock);

      await usersController.getAll(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(arrayOfUsersMock);
    });
  });

  describe('#getAllSellers', () => {
    it('should return status 200 and an array of sellers', async () => {
      req.body = {};
      req.headers = { authorization: 'validToken' };
  
      sinon.stub(usersService, 'getAllSellers').resolves(arrayOfSellersMock);

      await usersController.getAllSellers(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(arrayOfSellersMock);
    });
  });

  describe('#findByPk', () => {
    it('should return status 200 and the info of a seller user', async () => {
      req.body = {};
      req.params = { id: 4 }
      req.headers = { authorization: 'validAdminToken' };
  
      sinon.stub(usersService, 'findByPk').resolves(sellerMock2);

      await usersController.findByPk(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(sellerMock2);
    });
  });
});