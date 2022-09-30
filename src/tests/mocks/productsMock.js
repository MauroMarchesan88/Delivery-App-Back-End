const productMock = {
  id: 1,
  name: 'Product 1',
  price: 10.00,
  urlImage: 'http://localhost:3000/images/products/1.jpg',
};

const arrayProductsMock = [productMock];

const mockedSale = {
  id: 1,
  user_id: 1,
  seller_id: 2,
  total_price: '100.00',
  deliveryAdress: 'rua 16',
  deliveryNumber: 5,
  sale_date: '2022-09-23 18:26:26'
};

const arraySaleMock = [mockedSale];

const saleData = {
  id: 1,
  userId: 1,
  sellerId: 2,
  totalPrice: '100.00',
  deliveryAdress: 'rua 16',
  deliveryNumber: 5,
  saleDate: '2022-09-23 18:26:26'
};

const mockedCreateSale = {
  seller_id: 2,
  total_price: '100.00',
  deliveryAdress: 'rua 16',
  deliveryNumber: 5,
  products: [{
    productId: 1,
    quantity: 2,
  }, {
    productId: 2,
    quantity: 2,
  }]
};

module.exports = { productMock, arrayProductsMock, mockedCreateSale, mockedSale, saleData, arraySaleMock };