const request = require('supertest');
const server = require('../server');
const pool = require('./../config/db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios')

jest.mock('bcrypt', () => {
    return {
        hash: jest.fn(),
        compare: jest.fn()
    }
});
jest.mock('jsonwebtoken', () => {
    return {
        sign: jest.fn()
    }
});

jest.mock('./../config/db.js', () => {
    return {
      query: jest.fn(),
      on: jest.fn()
    };
});

jest.mock('axios', () => {
    return {
      get: jest.fn(),
      post: jest.fn()
    };
});

describe('GET /auth/linkedin', () => {
    beforeEach(() => {
        pool.query.mockClear();
    });

    it('/auth/linkedin does not throw any errors', async () => {
        const response = await request(server).get('/auth/linkedin');
        expect(response.status).toBe(302);
    });
})

describe('GET /auth/linkedinCallback', () => {
    beforeEach(() => {
        pool.query.mockClear();
    });

    it('/auth/linkedinCallback returns early if there is no code returned from linkedin auth', async () => {
        const response = await request(server).get('/linkedinCallback');
        expect(axios.post).not.toHaveBeenCalled();
    })

    it('/auth/linkedinCallback makes axios calls and database queries if user does not exist', async () => {
        pool.query.mockImplementationOnce(() => ({
            rows: [],
        }));

        axios.post.mockImplementationOnce(() => ({
            data: {
                access_token: 'test'
            }
        }))

        axios.get.mockImplementationOnce(() => ({
            data: {
                email: 'test@example.com',
                name: 'Test User'
            }
        }))

        pool.query.mockImplementationOnce(() => {})

        const response = await request(server).get('/linkedinCallback?code=test')

        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(pool.query).toHaveBeenCalledTimes(2);
    })

    it('/auth/linkedinCallback makes axios calls and database queries if user exists', async () => {
        pool.query.mockImplementationOnce(() => ({
            rows: [{
                id: 1,
                email: 'test@example.com'
            }],
        }));

        axios.post.mockImplementationOnce(() => ({
            data: {
                access_token: 'test'
            }
        }))

        axios.get.mockImplementationOnce(() => ({
            data: {
                email: 'test@example.com',
                name: 'Test User'
            }
        }))

        pool.query.mockImplementationOnce(() => {})

        const response = await request(server).get('/linkedinCallback?code=test')

        expect(axios.post).toHaveBeenCalled();
        expect(pool.query).toHaveBeenCalled();
    })
})