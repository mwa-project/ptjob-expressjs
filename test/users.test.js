var supertest = require('supertest');
const app = require('../app');


describe('POST /users', () => {

    it('should insert a new user', done => {
        supertest.agent(app)
        .post('/users')
        .send({
            email: 'carl@gmail.com',
            password: '123456',
            first_name: 'carl',
            last_name: 'yang',
            user_name: 'carlyang'
        })
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
});

describe('DELETE /:username', () => {
    it('delete with username', done => {
        supertest.agent(app).delete('/users/carlyang')
        .expect(200, done);
    });
});