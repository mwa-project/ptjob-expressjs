var supertest = require('supertest');
const app = require('../app');

var chai = require('chai');  
var expect = chai.expect;
// var should = chai.should();

describe('test/sessions.test.js', () => {

    var password = "123456";
    var user_name = "carl" + Math.floor(Math.random() * 999999999) + 1;
    var email = 'carly@gmail.com';

    before(done => {
        console.log('user_name: ' + user_name);
        supertest.agent(app)
            .post('/users')
            .send({
                email: email,
                password: password,
                userName: user_name,
                firstName: 'carl',
                lastName: 'y'
            })
            .expect(res => res.body.error === undefined)
            .end(done);
    });

    // after(done => {
    //     supertest.agent(app)
    //         .delete('/users/' + user_name)
    //         .expect(res => res.body.error === undefined)
    //         .end(done);
    // });

    it('should authenticate the user with the correct password', done => {
        supertest.agent(app)
            .post('/sessions')
            .send({
                userName: user_name,
                password: password
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(res => {
                // console.log(res);
                expect(res.body.error).to.be.undefined;
                expect(res.body.data.user_name).to.equal(user_name);
            })
            .end(done);
    });

    it('should return a token if the password is correct', done => {
        supertest.agent(app)
            .post('/sessions')
            .send({
                userName: user_name,
                password: password
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(res => {
                // console.log(res.body.token.length);
                expect(res.body.token).to.have.lengthOf(128);
            })
            .end(done);
    });

    it('should not return a token if the password is wrong', done => {
        supertest.agent(app)
            .post('/sessions')
            .send({
                userName: user_name,
                password: password + "1"
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(res => {
                expect(res.body.token).to.be.undefined;
            })
            .end(done);
    });

    it('should not authenticate the user with the wrong password', done => {
        supertest.agent(app)
            .post('/sessions')
            .send({
                userName: user_name,
                password: password + '1'
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(res => {
                expect(res.body.err).to.be.undefined;
                expect(res.body.data).to.be.undefined;
            })
            .end(done);
    });
});
