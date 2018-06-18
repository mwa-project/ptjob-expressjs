mongoose = require('mongoose');
var User = require('../../models/user');
var chai = require('chai');
var expect = chai.expect;
var should = chai.should();

describe('test/models/user.test.js', () => {

    const user_name = "carl" + Math.floor(Math.random() * 999999999) + 1;
    const password = '123456';
    const email = 'carlyang@gmail.com';
    it('should not insert a user without password', (done) => {
        let user = new User({
            first_name: 'carl',
            last_name: 'yang',
            user_name: user_name,
            email: email
        });
        user.save((err, user) => {
            should.not.exist(user);
            should.exist(err);
            done();
        });
    });

    it('should insert a user', (done) => {
        let user = new User({
            first_name: 'carl',
            last_name: 'yang',
            user_name: user_name,
            password: password,
            email: email
        });
        user.save((err, user) => {
            should.not.exist(err);
            should.exist(user);
            done();
        });
    });

    it('should delete a user with user_name', (done) => {
        User.findOneAndDelete({ user_name: user_name }, (err, user) => {
            expect(err).to.be.null;
            expect(user).to.have.property('email', email);
            done();
        });
    });

    it('should not delete any use with a wrong user_name', (done) => {
        User.findOneAndDelete({ user_name: user_name + '1' }, (err, user) => {
            expect(err).to.be.null;
            expect(user).to.be.null;
            done();
        });
    });

});