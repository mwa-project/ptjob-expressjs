var supertest = require('supertest');
const app = require('../app');

describe('POST /users', () => {
    it('response with json', done => {
        supertest.agent(app)
        .post('/users', {
            email: 'carl@gmail.com',
            password: '123456',
            first_name: 'carl',
            last_name: 'yang'
        })
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect(res => {
            console.log(res);
            res.body.error == null;
        });
    });
});
