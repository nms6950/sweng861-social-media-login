const request = require('supertest');
const server = require('../server');
const pool = require('./../config/db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
      get: jest.fn()
    };
});

describe('POST /createAccount', () => {
    beforeEach(() => {
        pool.query.mockClear();
    });

    it('/createAccount should return error message if the user already exists', async () => {
        pool.query.mockImplementation(() => ({
            rows: [{ id: 1, email: 'test@example.com' }],
        }));

        const res = await request(server).post('/createAccount').send({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        });

        expect(res.body).toHaveProperty('error', 'User with this email already exists');
        expect(pool.query).toHaveBeenCalledTimes(1);
    })

    it('/createAccount should make two database queries if user does not exist', async () => {
        // Mock first query returns no user
        pool.query.mockImplementationOnce(() => ({ rows: [] }));
        // Mock second query returns inserted user
        pool.query.mockImplementationOnce(() => ({
            rows: [{ id: 1, email: 'test@example.com' }],
        }));

        const res = await request(server).post('/createAccount').send({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        });

        expect(pool.query).toHaveBeenCalledTimes(2);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id', 1)
    })
})

describe('POST /login', () => {
    beforeEach(() => {
        pool.query.mockClear();
        bcrypt.compare.mockClear();
        jwt.sign.mockClear();
    });

    it('/login should return error message if the user does not exist', async () => {
        pool.query.mockImplementation(() => ({
            rows: [],
        }));

        const res = await request(server).post('/login').send({
            email: 'test@example.com',
            password: 'password123'
        });

        expect(res.body).toHaveProperty('error', 'User not found');
        expect(pool.query).toHaveBeenCalledTimes(1);
    })

    it('/login should return invalid password if password hash does not match', async () => {
        pool.query.mockImplementation(() => ({
            rows: [{
                password: '',
                email: 'test@example.com'
            }],
        }));

        bcrypt.compare.mockImplementation(() => false);

        const res = await request(server).post('/login').send({
            email: 'test@example.com',
            password: 'password123'
        });

        expect(res.body).toHaveProperty('error', 'Invalid password');
        expect(bcrypt.compare).toHaveBeenCalledTimes(1)
        expect(pool.query).toHaveBeenCalledTimes(1);
    })

    it('/login should create token and set cookie if login is successful', async () => {
        pool.query.mockImplementation(() => ({
            rows: [{
                password: '',
                email: 'test@example.com'
            }],
        }));

        bcrypt.compare.mockImplementation(() => true);

        const res = await request(server).post('/login').send({
            email: 'test@example.com',
            password: 'password123'
        });

        expect(bcrypt.compare).toHaveBeenCalledTimes(1);
        expect(pool.query).toHaveBeenCalled();
        expect(jwt.sign).toHaveBeenCalledTimes(1);
    })
})