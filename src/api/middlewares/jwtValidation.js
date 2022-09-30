require('dotenv/config');
const jwt = require('jsonwebtoken');
const fs = require('fs/promises');
const path = require('path');

const jsonPath = path.join(__dirname, '..', '..', '..', 'jwt.evaluation.key');

const jwtService = {
    createToken: async (data) => {
    const secret = await fs.readFile(jsonPath);

        const token = jwt.sign({ data }, secret);
        return token;
    },

    validateToken: async (token) => {
    const secret = await fs.readFile(jsonPath);

        try {
            const { data } = jwt.verify(token, secret);
            return data;
        } catch (_error) {
            const e = new Error('Expired or invalid token');
            e.name = 'UnauthorizedError';
            throw e;
        }
    },
};

module.exports = jwtService; 