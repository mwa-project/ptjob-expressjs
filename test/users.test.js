var supertest = require('supertest');
const app = require('../app');
var chai = require('chai');  
var expect = chai.expect;

describe('test/users.test.js', () => {

    const user_name = 'carlyang1845';
    const password = '123456';
    let token;

    it('should insert a new user with valid data', done => {
        supertest.agent(app)
        .post('/users')
        .send({
            email: 'carl@gmail.com',
            first_name: 'carl',
            last_name: 'yang',
            user_name: user_name,
            password: password
        })
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it('should return a token if the password is correct', done => {
        supertest.agent(app)
        .post('/sessions')
        .send({
            user_name: user_name,
            password: password
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
            // console.log(res.body.token.length);
            expect(res.body.token).to.have.lengthOf(128);
            token = res.body.token;
            console.log('got the token for user! -> ' + token)
        })
        .end(done);
    });

    // it('should can get all users with a valid token', done => {
    //     request = supertest.agent(app);
    //     request.post('/sessions')
    //     .set({
    //         user_name: user_name,
    //         password: password
    //     })
    //     .expect(res => {
    //         expect(res.body.token).to.have.lengthOf(128);

    //         request.get('/users')
    //         .set({ access_token: res.body.token })
    //         .expect(200, done);
    //     });
    // });

    it('should can get all users with a valid token', done => {
        supertest.agent(app)
        .get('/users')
        .set('access_token', token)
        .expect(200, done);
    });

    it('should not can get all users with an invalid token', done => {
        supertest.agent(app)
        .get('/users')
        .set({'access_token': ''})
        .expect(401, done);
    });

    it('should not can get all users without a token', done => {
        supertest.agent(app)
        .get('/users')
        .expect(401, done);
    });

    it('should delete a user with a correct username', done => {
        supertest.agent(app).delete('/users/' + user_name)
        .expect(200, done);
    });
});