const Joi = require('joi');
const md5 = require('md5');
const { User } = require('../../database/models');
const jwtValidation = require('../middlewares/jwtValidation');

const AdminService = {
  validateBodyAdmin: async (data) => {
    const schema = Joi.object({
        name: Joi.string().required().min(12),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6),
        role: Joi.string().required(),
    });

    const value = await schema.validateAsync(data);
    return value;
  },

  createUser: async ({ name, email, password, role, token }) => {
    const user = await jwtValidation.validateToken(token);

    if (user.role !== 'administrator') {
      const e = new Error('Unauthorized');
      e.name = 'UnauthorizedError';
      throw e;
    }

    const uniqueEmail = await User.findOne({ where: { email } });

    if (uniqueEmail) {
        const e = new Error('User already registered');
        e.name = 'ConflictError';
        throw e;
    }

    const hash = md5(password);
    const newUser = { name, email, password: hash, role };
    const { password: pass, ...createdUser } = (await User.create(newUser))
      .get({ plain: true });
    return { ...createdUser };
  },

   deleteUser: async (id, token) => {
    const user = await jwtValidation.validateToken(token);
    if (user.role !== 'administrator') {
      const e = new Error('Unauthorized');
      e.name = 'UnauthorizedError';
      throw e;
    }
    const findUser = await User.findOne({ where: { id } });
    
    if (!findUser) {
      const e = new Error('User not found');
      e.name = 'NotFoundError';
      throw e;
    }

    await User.destroy({ where: { id } });
    return { message: 'user deleted' };
  },
};

module.exports = AdminService;