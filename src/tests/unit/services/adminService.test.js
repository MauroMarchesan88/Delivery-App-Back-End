const chai = require('chai');
const { expect } = chai;
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const { User: userModel } = require('../../../database/models');
const jwtService = require('../../../api/middlewares/jwtValidation');
const adminService = require('../../../api/services/adminService');
const { arrayProductsMock } = require('../../mocks/productsMock');
const { customerMock, adminMock } = require('../../mocks/usersMock');
const md5 = require('md5');

chai.use(chaiAsPromised);

describe('services/adminService', () => {
  beforeEach(() => {
    sinon.restore();
  });

  describe('#createUser', () => {
    it('should throw if token is invalid', async () => {
      const expectedError = new Error('Expired or invalid token');
      expectedError.name = 'UnauthorizedError';

      sinon.stub(jwtService, 'validateToken').throws(expectedError);

      return expect(adminService.createUser({...customerMock, token: 'invalidToken'}))
        .to.eventually.be.rejected
        .and.to.have.property('name', expectedError.name);
    });

    it('should throw if token is not from administrator', async () => {
      const expectedError = new Error('Unauthorized');
      expectedError.name = 'UnauthorizedError';

      sinon.stub(jwtService, 'validateToken').resolves(customerMock);

      return expect(adminService.createUser({...customerMock, token: 'userToken'}))
        .to.eventually.be.rejected
        .and.to.have.property('name', expectedError.name);
    });

    it('should throw if user is already registered', async () => {
      sinon.stub(jwtService, 'validateToken').resolves(adminMock);
      sinon.stub(userModel, 'findOne').resolves(customerMock);

      const expectedError = new Error('User already registered');
      expectedError.name = 'ConflictError';

      return expect(adminService.createUser({...customerMock, token: 'adminToken'}))
        .to.eventually.be.rejected
        .and.to.have.property('name', expectedError.name);
    });

    it('should return a user without a password', async () => {
      sinon.stub(jwtService, 'validateToken').resolves(adminMock);
      sinon.stub(userModel, 'findOne').resolves(null);
      sinon.stub(userModel, 'create').resolves(customerMock);
      customerMock.get = () => customerMock;

      const { password, ...userWithoutPass } = customerMock;

      return expect(adminService.createUser({...customerMock, token: 'adminToken'}))
        .to.eventually.be.fulfilled
        .and.to.deep.equal(userWithoutPass);
    });
  });

  describe('#deleteUser', () => {
    it('should throw if token is invalid', async () => {
      const expectedError = new Error('Expired or invalid token');
      expectedError.name = 'UnauthorizedError';

      sinon.stub(jwtService, 'validateToken').throws(expectedError);

      return expect(adminService.deleteUser(1, 'invalidToken'))
        .to.eventually.be.rejected
        .and.to.have.property('name', expectedError.name);
    });

    it('should throw if token is not from administrator', async () => {
      const expectedError = new Error('Unauthorized');
      expectedError.name = 'UnauthorizedError';

      sinon.stub(jwtService, 'validateToken').resolves(customerMock);

      return expect(adminService.deleteUser(1, 'userToken'))
        .to.eventually.be.rejected
        .and.to.have.property('name', expectedError.name);
    });

    it('should throw if user is not found', async () => {
      sinon.stub(jwtService, 'validateToken').resolves(adminMock);
      sinon.stub(userModel, 'findOne').resolves(null);

      const expectedError = new Error('User not found');
      expectedError.name = 'NotFoundError';

      return expect(adminService.deleteUser(1, 'adminToken'))
        .to.eventually.be.rejected
        .and.to.have.property('name', expectedError.name);
    });

    it('should return { message: "user deleted" }', async () => {
      sinon.stub(jwtService, 'validateToken').resolves(adminMock);
      sinon.stub(userModel, 'findOne').resolves(customerMock);
      sinon.stub(userModel, 'destroy').resolves();

      return expect(adminService.deleteUser(1, 'adminToken'))
        .to.eventually.be.fulfilled
        .and.to.deep.equal({ message: 'user deleted' });
    });
  });

  describe('#validateBodyAdmin', () => {
    it('should throw if body is not an object', async () => {
      const body = 'not an object';
      return expect(adminService.validateBodyAdmin(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should throw if "name" is missing', async () => {
      const body = {
        email: 'email',
        password: 'password',
        role: 'role',
      };

      return expect(adminService.validateBodyAdmin(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should throw if "name" is not a string', async () => {
      const body = {
        name: 123,
        email: 'email',
        password: 'password',
        role: 'role',
      };
      
      return expect(adminService.validateBodyAdmin(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should throw if "name" length is smaller than 12', async () => {
      const body = {
        name: 'name',
        email: 'email',
        password: 'password',
        role: 'role',
      };
      
      return expect(adminService.validateBodyAdmin(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should throw if "email" is missing', async () => {
      const body = {
        name: 'Full Name of Customer',
        password: 'password',
        role: 'role',
      };
      
      return expect(adminService.validateBodyAdmin(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should throw if "email" is not a string', async () => {
      const body = {
        name: 'Full Name of Customer',
        email: 123,
        password: 'password',
        role: 'role',
      };
      
      return expect(adminService.validateBodyAdmin(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should throw if "email" is not a valid email', async () => {
      const body = {
        name: 'Full Name of Customer',
        email: 'email',
        password: 'password',
        role: 'role',
      };
      
      return expect(adminService.validateBodyAdmin(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should throw if "password" is missing', async () => {
      const body = {
        name: 'Full Name of Customer',
        email: 'email@email.com',
        role: 'role',
      };
      
      return expect(adminService.validateBodyAdmin(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should throw if "password" is not a string', async () => {
      const body = {
        name: 'Full Name of Customer',
        email: 'email@email.com',
        password: 123456,
        role: 'role',
      };
      
      return expect(adminService.validateBodyAdmin(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should throw if "password" length is smaller than 6', async () => {
      const body = {
        name: 'Full Name of Customer',
        email: 'email@email.com',
        password: '12345',
        role: 'role',
      };
      
      return expect(adminService.validateBodyAdmin(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should throw if "role" is missing', async () => {
      const body = {
        name: 'Full Name of Customer',
        email: 'email@email.com',
        password: 'password',
      };
      
      return expect(adminService.validateBodyAdmin(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should throw if "role" is not a string', async () => {
      const body = {
        name: 'Full Name of Customer',
        email: 'email@email.com',
        password: 'password',
        role: 123,
      };
      
      return expect(adminService.validateBodyAdmin(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should return the provided object if it\'s valid', async () => {
      const body = {
        name: 'Full Name of Customer',
        email: 'email@email.com',
        password: 'password',
        role: 'role',
      };
      
      return expect(adminService.validateBodyAdmin(body))
        .to.eventually.be.fulfilled
        .and.to.deep.equal(body);
    });
  });
});