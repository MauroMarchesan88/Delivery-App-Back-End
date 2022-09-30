const chai = require('chai');
const { expect } = chai;
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const { User: userModel } = require('../../../database/models');
const jwtService = require('../../../api/middlewares/jwtValidation');
const usersService = require('../../../api/services/usersService');
const { 
  arrayOfUsersMock,
  adminMock, 
  customerMock, 
  arrayOfSellersMock, 
  sellerMock2,
  createUserBodyMock,
  loginUserBodyMock
  } = require('../../../tests/mocks/usersMock');

chai.use(chaiAsPromised);

describe('services/usersService', () => {
  beforeEach(() => {
    sinon.restore();
  });

  describe('#validateBody', () => {
    it('should throw if body is not an object', async () => {
      const body = 'not an object';
      return expect(usersService.validateBody(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should throw if "name" is missing', async () => {
      const body = {
        email: 'email',
        password: 'password',
        role: 'role',
      };

      return expect(usersService.validateBody(body))
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
      
      return expect(usersService.validateBody(body))
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
      
      return expect(usersService.validateBody(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should throw if "email" is missing', async () => {
      const body = {
        name: 'Full Name of Customer',
        password: 'password',
        role: 'role',
      };
      
      return expect(usersService.validateBody(body))
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
      
      return expect(usersService.validateBody(body))
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
      
      return expect(usersService.validateBody(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should throw if "password" is missing', async () => {
      const body = {
        name: 'Full Name of Customer',
        email: 'email@email.com',
        role: 'role',
      };
      
      return expect(usersService.validateBody(body))
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
      
      return expect(usersService.validateBody(body))
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
      
      return expect(usersService.validateBody(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    

    it('should return the provided object if it\'s valid', async () => {
      const body = {
        name: 'Full Name of Customer',
        email: 'email@email.com',
        password: 'password',
      };
      
      return expect(usersService.validateBody(body))
        .to.eventually.be.fulfilled
        .and.to.deep.equal(body);
    });
  });

  describe('#validateBodyLogin', () => {
    it('should throw if body is not an object', async () => {
      const body = 'not an object';
      return expect(usersService.validateBodyLogin(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should throw if "email" is missing', async () => {
      const body = {
        password: 'password',
      };
      
      return expect(usersService.validateBodyLogin(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should throw if "email" is not a string', async () => {
      const body = {
        email: 123,
        password: 'password',
      };
      
      return expect(usersService.validateBodyLogin(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should throw if "email" is not a valid email', async () => {
      const body = {
        email: 'email',
        password: 'password',
      };
      
      return expect(usersService.validateBodyLogin(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should throw if "password" is missing', async () => {
      const body = {
        email: 'email@email.com',
      };
      
      return expect(usersService.validateBodyLogin(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should throw if "password" is not a string', async () => {
      const body = {
        email: 'email@email.com',
        password: 123456,
      };
      
      return expect(usersService.validateBodyLogin(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    it('should throw if "password" length is smaller than 6', async () => {
      const body = {
        email: 'email@email.com',
        password: '12345',
      };
      
      return expect(usersService.validateBodyLogin(body))
        .to.eventually.be.rejected
        .and.to.have.property('name', 'ValidationError');
    });

    
    it('should return the provided object if it\'s valid', async () => {
      const body = {
        email: 'email@email.com',
        password: 'password',
      };
      
      return expect(usersService.validateBodyLogin(body))
        .to.eventually.be.fulfilled
        .and.to.deep.equal(body);
    });
  });

  describe('#create', () => {
    it('should throw an error if used email already exists in the database', async () => {
      const expectedError = new Error('User already registered');
      expectedError.name = 'ConflictError';

      sinon.stub(userModel, 'findOne').resolves(customerMock);

      return expect(usersService.create(createUserBodyMock))
        .to.eventually.be.rejected
        .and.to.have.property('name', expectedError.name);
    });

    it('should create a new user in the database', async () => {
      sinon.stub(userModel, 'findOne').resolves(null);
      sinon.stub(userModel, 'create').resolves(customerMock);
      sinon.stub(jwtService, 'createToken').resolves('customerToken')
      const { password, id, ...userInfo } = customerMock;

      return expect(usersService.create(createUserBodyMock))
      .to.eventually.be.fulfilled
      .and.to.deep.equal({...userInfo, token:'customerToken'});
    });
  });

  describe('#login', () => {
    it('should throw an error if used email is not in the database', async () => {
      const expectedError = new Error('Incorrect email or password');
      expectedError.name = 'NotFoundError';

      sinon.stub(userModel, 'findOne').resolves(null);
      const { login, password } = loginUserBodyMock;

      return expect(usersService.login(login, password))
        .to.eventually.be.rejected
        .and.to.have.property('name', expectedError.name);
    });

    it('should return user information and a token when the right email and password is used', async () => {
      sinon.stub(jwtService, 'createToken').resolves('validCustomerToken')
      sinon.stub(userModel, 'findOne').resolves(customerMock);
      const { login, password } = loginUserBodyMock;

      const { password: dbPassword, id, ...userInfo } = customerMock;
      return expect(usersService.login(login, password))
        .to.eventually.be.fulfilled
        .and.to.deep.equal({...userInfo, token:'validCustomerToken'})
    });
  })

  describe('#getAll', () => {
    it('should throw an error if token is invalid', async () => {
      const expectedError = new Error('Unauthorized');
      expectedError.name = 'UnauthorizedError';

      sinon.stub(jwtService, 'validateToken').throws(expectedError);

      return expect(usersService.getAll('invalid token'))
        .to.eventually.be.rejected
        .and.to.have.property('name', expectedError.name);
    });

    it('should throw an error if token is not from an administrator', async () => {
      const expectedError = new Error('Unauthorized');
      expectedError.name = 'UnauthorizedError';

      sinon.stub(jwtService, 'validateToken').resolves(customerMock);

      return expect(usersService.getAll('valid token'))
        .to.eventually.be.rejected
        .and.to.have.property('name', expectedError.name);
    });

    it('should throw if model throws', async () => {
      sinon.stub(jwtService, 'validateToken').resolves();
      sinon.stub(userModel, 'findAll').throws();

      return expect(usersService.getAll('valid token'))
        .to.eventually.be.rejected;
    });

    it('should return an array of users when called with a valid admin token', async () => {
      sinon.stub(jwtService, 'validateToken').resolves(adminMock);
      sinon.stub(userModel, 'findAll').resolves(arrayOfUsersMock);

      return expect(usersService.getAll('valid token'))
        .to.eventually.deep.equal(arrayOfUsersMock);
    });
  })
  
  describe('#getAllSellers', () => {
    it('should throw an error if token is invalid', async () => {
      const expectedError = new Error('Unauthorized');
      expectedError.name = 'UnauthorizedError';

      sinon.stub(jwtService, 'validateToken').throws(expectedError);

      return expect(usersService.getAllSellers('invalid token'))
        .to.eventually.be.rejected
        .and.to.have.property('name', expectedError.name);
    });

    it('should throw if model throws', async () => {
      sinon.stub(jwtService, 'validateToken').resolves();
      sinon.stub(userModel, 'findAll').throws();

      return expect(usersService.getAllSellers('valid token'))
        .to.eventually.be.rejected;
    });

    it('should return an array of sellers when called with a valid token', async () => {
      sinon.stub(jwtService, 'validateToken').resolves();
      sinon.stub(userModel, 'findAll').resolves(arrayOfSellersMock);

      return expect(usersService.getAllSellers('valid token'))
        .to.eventually.be.deep.equal(arrayOfSellersMock);
    });
  });

  describe('#findByPk', () => {
    it('should throw an error if token is invalid', async () => {
      const expectedError = new Error('Unauthorized');
      expectedError.name = 'UnauthorizedError';

      sinon.stub(jwtService, 'validateToken').throws(expectedError);

      return expect(usersService.findByPk('invalid token'))
        .to.eventually.be.rejected
        .and.to.have.property('name', expectedError.name);
    });

    it('should throw if model throws', async () => {
      sinon.stub(jwtService, 'validateToken').resolves();
      sinon.stub(userModel, 'findOne').throws();

      return expect(usersService.findByPk('valid token'))
        .to.eventually.be.rejected;
    });

    it('should throw an error if user not exists', async () => {
      const expectedError = new Error('User not found');
      expectedError.name = 'NotFoundError';

      sinon.stub(jwtService, 'validateToken').resolves();
      sinon.stub(userModel, 'findOne').resolves(null);
      
      return expect(usersService.findByPk(10))
      .to.eventually.be.rejected
      .and.to.have.property('name', expectedError.name);
    });

    it('should return an user when called with a valid token and a valid id', async () => {
      sinon.stub(jwtService, 'validateToken').resolves();
      sinon.stub(userModel, 'findOne').resolves(sellerMock2);

      return expect(usersService.findByPk(4))
        .to.eventually.be.deep.equal(sellerMock2);
    });
  });
});