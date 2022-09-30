const Joi = require('joi');
const md5 = require('md5');
const { User } = require('../../database/models');
const jwtValidation = require('../middlewares/jwtValidation');

const usersService = {
  validateBody: async (data) => {
      const schema = Joi.object({
          name: Joi.string().required().min(12),
          email: Joi.string().email().required(),
          password: Joi.string().required().min(6),
      });

      const value = await schema.validateAsync(data);

      return value;
  },

  validateBodyLogin: async (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6),
    });

    const value = await schema.validateAsync(data);
  
    return value;
},

  create: async ({ name, email, password }) => {
    const uniqueEmail = await User.findOne({
      where: { email },
    });

    const hash = md5(password);

    if (uniqueEmail) {
        const e = new Error('User already registered');
        e.name = 'ConflictError';
        throw e;
    }

    const newUser = { name, email, password: hash };
    const { id, password: pass, ...createdUser } = (await User.create(newUser))
      .get({ plain: true });
    const token = await jwtValidation.createToken({ ...createdUser, id });
    return { ...createdUser, token };
  },

  login: async (email, password) => {
    const hashBodyPassword = md5(password);
    const user = await User.findOne({ where: { email, password: hashBodyPassword }, raw: true });

    if (!user) {
      const e = new Error('Incorrect email or password');
      e.name = 'NotFoundError';
      throw e;
    }

    const { id, password: pass, ...loggedInUser } = user;
    const token = await jwtValidation.createToken({ ...loggedInUser, id });
    return { ...loggedInUser, token };
  },

  getAll: async (token) => {
    const user = await jwtValidation.validateToken(token);
    if (user.role !== 'administrator') {
      const e = new Error('Unauthorized');
      e.name = 'UnauthorizedError';
      throw e;
    }

    return User.findAll();
  },

  getAllSellers: async (token) => {
    await jwtValidation.validateToken(token);

    return User
    .findAll({ where: { role: 'seller' }, attributes: { exclude: ['password', 'email', 'role'] } });
  },

  findByPk: async (id, token) => {
    await jwtValidation.validateToken(token);

    const user = await User
    .findOne({ where: { id }, attributes: { exclude: ['password', 'email', 'role'] } });

    if (!user) {
      const e = new Error('User not found');
      e.name = 'NotFoundError';
      throw e;
    }
    return user;
  },
};

module.exports = usersService;