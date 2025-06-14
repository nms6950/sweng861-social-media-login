const request = require('supertest');
const server = require('../server');
const pool = require('./../config/db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios')

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

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

describe('GET /getShows', () => {
    beforeEach(() => {
        pool.query.mockClear();
        axios.get.mockClear();
    });

    it('/getShows returns with error message if status code is not 200', async () => {
        axios.get.mockImplementation(() => ({
            status: '400'
        }));

        const res = await request(server).get('/getShows');
        
        expect(res.body).toHaveProperty('error', 'Failed to fetch shows from API');
    })

    it('/getShows makes correct insertion queries to database if shows exist', async () => {
        axios.get.mockImplementation(() => ({
            status: 200,
            data: {
                shows: [
                    {
                        show_id: '1',
                        title: 'Show 1',
                        critics_score: 80,
                        audience_score: 70,
                        image_url: 'https://example.com/image1.jpg',
                        media_url: 'https://example.com/media1.mp4',
                        release_date: '2022-01-01',
                        is_video: true
                    },
                    {
                        show_id: '2'
                    },
                    {
                        title: 'Show 3'
                    }
                ]
            }
        }));

        const res = await request(server).get('/getShows');
        
        expect(res.body).toHaveProperty('message', 'Shows inserted successfully');
        expect(pool.query).toHaveBeenCalledTimes(2);
    })

});

describe('POST /createShow', () => {
    beforeEach(() => {
        pool.query.mockClear();
    });

    it('/createShow returns error message if validation fails', async () => {
        const res = await request(server).post('/createShow').send({
            show_id: '1',
            title: 'Show 1'
        })

        expect(res.body).toHaveProperty('error', 'Validation failed');
        expect(pool.query).not.toHaveBeenCalled();
    })

    it('/createShow makes correct insert query to database', async () => {
        pool.query.mockImplementation(() => ({
            rows: [{
                show_id: '1',
                title: 'Show 1',
            }]
        }))

        const res = await request(server).post('/createShow').send({
            title: 'Show 1'
        })

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'TV show created');
        expect(pool.query).toHaveBeenCalledTimes(1);
    });
})

describe('PUT /updateShow/:id', () => {
    beforeEach(() => {
        pool.query.mockClear();
    });

    it('/updateShow/:id returns correct error message if id is not passed in', async () => {
        const res = await request(server).put(`/updateShow/${false}`)

        expect(res.body).toHaveProperty('error', 'Show ID is required');
        expect(pool.query).not.toHaveBeenCalled();
    })

    it('/updateShow/:id returns correct error message if update params fail validation', async () => {
        const res = await request(server).put(`/updateShow/${1}`).send({
            critics_score: 110
        })

        expect(res.body).toHaveProperty('error', 'Validation failed');
        expect(pool.query).not.toHaveBeenCalled();
    })

    it('/updateShow/:id returns success message if data is valid and show exists', async () => {
        pool.query.mockImplementation(() => ({
            rows: [{
                show_id: '1',
                title: 'Show 1',
            }],
            rowCount: 1
        }))

        const res = await request(server).put(`/updateShow/${1}`).send({
            critics_score: 90
        })

        expect(res.body).toHaveProperty('message', 'Show updated successfully');
        expect(pool.query).toHaveBeenCalled();
    })

    it('/updateShow/:id returns error message if show does not exist', async () => {
        pool.query.mockImplementation(() => ({
            rows: [],
            rowCount: 0
        }))
        
        const res = await request(server).put(`/updateShow/${1}`).send({
            critics_score: 90
        })

        expect(res.body).toHaveProperty('error', 'TV show not found');
        expect(pool.query).toHaveBeenCalled();
    })
})

describe('GET /getShow/:id', () => {
    beforeEach(() => {
        pool.query.mockClear();
    });

    it('/getShow/:id returns correct error message if id is not passed in', async () => {
        const res = await request(server).get(`/getShow/${false}`)

        expect(res.body).toHaveProperty('error', 'Show ID is required');
        expect(pool.query).not.toHaveBeenCalled();
    })

    it('/getShow/:id returns error message if show does not exist', async () => {
        pool.query.mockImplementation(() => ({
            rows: [],
            rowCount: 0
        }))
        
        const res = await request(server).get(`/getShow/${1}`)

        expect(res.body).toHaveProperty('error', 'Show not found');
        expect(pool.query).toHaveBeenCalled();
    })

    it('/getShow/:id returns show if show exists', async () => {
        pool.query.mockImplementation(() => ({
            rows: [{
                show_id: '1',
                title: 'Show 1'
            }],
            rowCount: 1
        }))
        
        const res = await request(server).get(`/getShow/${1}`)

        expect(res.body).toHaveProperty('show');
        expect(pool.query).toHaveBeenCalled();
    })
})

describe('GET /getAllShows', () => {
    beforeEach(() => {
        pool.query.mockClear();
    });

    it('/getAllShows returns shows', async () => {
        pool.query.mockImplementation(() => ({
            rows: [{
                show_id: '1',
                title: 'Show 1'
            }],
            rowCount: 1
        }))
        
        const res = await request(server).get(`/getAllShows`)

        expect(res.body).toBeTruthy();
        expect(pool.query).toHaveBeenCalled();
    })
})

describe('DELETE /deleteShow/:id', () => {
    beforeEach(() => {
        pool.query.mockClear();
    });

    it('/deleteShow/:id returns correct error message if id is not passed in', async () => {
        const res = await request(server).delete(`/deleteShow/${false}`)

        expect(res.body).toHaveProperty('error', 'Show ID is required');
        expect(pool.query).not.toHaveBeenCalled();
    })

    it('/deleteShow/:id returns error message if show does not exist', async () => {
        pool.query.mockImplementation(() => ({
            rows: [],
            rowCount: 0
        }))
        
        const res = await request(server).delete(`/deleteShow/${1}`)

        expect(res.body).toHaveProperty('error', 'Show not found');
        expect(pool.query).toHaveBeenCalled();
    })

    it('/deleteShow/:id returns success message if show exists', async () => {
        pool.query.mockImplementation(() => ({
            rows: [{
                show_id: '1',
                title: 'Show 1'
            }],
            rowCount: 1
        }))
        
        const res = await request(server).delete(`/deleteShow/${1}`)

        expect(res.body).toHaveProperty('message', 'Show deleted successfully');
        expect(pool.query).toHaveBeenCalled();
    })
})