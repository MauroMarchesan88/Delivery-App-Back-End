const customerMock = {
  id: 1,
  name: 'Customer User',
  email: 'customer@email.com',
  password: '123456',
  role: 'customer',
};

const sellerMock = {
  id: 2,
  name: 'Seller User',
  email: 'seller@email.com',
  password: '123456',
  role: 'seller',
};

const sellerMock2 = {
  id: 4,
  name: 'Second Seller User',
};

const sellerMock3 = {
  id: 5,
  name: 'Third Seller User',
};

const adminMock = {
  id: 3,
  name: 'Admin User',
  email: 'admin@email.com',
  password: 'admin123',
  role: 'administrator',
};

const arrayOfUsersMock = [
  customerMock,
  sellerMock,
  adminMock,
];

const arrayOfSellersMock = [
  sellerMock2,
  sellerMock3,
];

const createUserBodyMock = {
  name: 'Customer User',
  email: 'customer@email.com',
  password: '123456',
};

const loginUserBodyMock = {
  email: 'customer@email.com',
  password: '123456',
};

module.exports = { 
  customerMock, 
  sellerMock2, 
  adminMock, 
  arrayOfUsersMock, 
  arrayOfSellersMock,
  createUserBodyMock,
  loginUserBodyMock
};