const express = require('express');
const cors = require('cors');

const UsersRouter = require('./routes/usersRoute');
const ProductsRouter = require('./routes/productsRoute');
const SalesRoute = require('./routes/salesRoute');
const AdminRoute = require('./routes/adminRoute');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/images', express.static('public/images'));
app.use('/users', UsersRouter);
app.use('/products', ProductsRouter);
app.use('/sales', SalesRoute);
app.use('/admin', AdminRoute);

app.use((err, _req, res, _next) => {
  const { name, message } = err;
  switch (name) {
      case 'ValidationError':
          res.status(400).json({ message });
          break;
      case 'NotFoundError':
          res.status(404).json({ message });
          break;
      case 'ConflictError':
          res.status(409).json({ message });
          break;
      case 'UnauthorizedError':
          res.status(401).json({ message });
          break;
      default:
          res.status(500).json({ message });
          break;
  }
});

module.exports = app;
