const chai = require('chai');
const { expect } = chai;
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const adminController = require('../../../api/controllers/adminController');
const adminService = require('../../../api/services/adminService');
const { customerMock } = require('../../mocks/usersMock');

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('controllers/adminController', () => {
  let req = {};
  let res = {};

  beforeEach(() => {
    sinon.restore();
    req = {};
    res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub();
  });

  describe('#createUser', () => {
    it('should throw if request body is invalid', async () => {
      req.body = {};
      req.headers = { authorization: 'valid token' };
      sinon.stub(adminService, 'validateBodyAdmin').throws();

      return expect(adminController.createUser(req, res))
        .to.eventually.be.rejected;
    });

    it('should throw if service throws', async () => {
      req.body = {};
      req.headers = { authorization: 'valid token' };
      sinon.stub(adminService, 'validateBodyAdmin').resolves(customerMock);
      sinon.stub(adminService, 'createUser').throws();

      return expect(adminController.createUser(req, res))
        .to.eventually.be.rejected;
    });

    it('should return status 201 and an user object', async () => {
      req.body = {};
      req.headers = { authorization: 'valid token' };
      sinon.stub(adminService, 'validateBodyAdmin').resolves(customerMock);
      sinon.stub(adminService, 'createUser').resolves(customerMock);

      await adminController.createUser(req, res);

      expect(res.status).to.have.been.calledWith(201);
      expect(res.json).to.have.been.calledWith(customerMock);
    });
  });

  describe('#deleteUser', () => {
    it('should throw if service throws', async () => {
      req.params = { id: 1 };
      req.headers = { authorization: 'valid token' };
      sinon.stub(adminService, 'deleteUser').throws();

      return expect(adminController.deleteUser(req, res))
        .to.eventually.be.rejected;
    });

    it('should return status 204 and { message: "user deleted" }', async () => {
      req.params = { id: 1 };
      req.headers = { authorization: 'valid token' };
      const response = { message: 'user deleted' };
      sinon.stub(adminService, 'deleteUser').resolves(response);

      await adminController.deleteUser(req, res);

      expect(res.status).to.have.been.calledWith(204);
      expect(res.json).to.have.been.calledWith(response);
    });
  });
});