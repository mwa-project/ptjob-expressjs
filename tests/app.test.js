var supertest = require('supertest');
const app = require('../app');

describe('GET /users', () => {
    it('response with json', done => {
        supertest.agent(app)
        .get('/users')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
});
