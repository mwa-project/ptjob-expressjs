mongoose = require('mongoose');
var User = require('../../models/user');
var chai = require('chai');  
var expect = chai.expect;
var should = chai.should();

describe('Test User model', () => {

      it('should not insert a user without password', (done) => {
        let user = new User({
            first_name: 'carl',
            last_name: 'yang',
            user_name: 'carlyang',
            email: 'carlyang@gmail.com'
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
            user_name: 'carlyang2',
            password: '123456',
            email: 'carlyang@gmail.com'
        });
        user.save((err, user) => {
            should.not.exist(err);
            should.exist(user);
            done();
        });
      });

    //   it('should delete a user with user_name', (done) => {
    //     User.findOneAndDelete({ user_name: 'carlyang2'}, (err, user) => {
    //         expect(err).to.be.null;
    //         expect(user).to.have.property('email', 'carlyang@gmail.com');
    //         done();
    //     });
    //   });

      it('should not delete any use with a wrong user_name', (done) => {
        User.findOneAndDelete( { user_name: 'carlyangwrongname' }, (err, user) => {
            expect(err).to.be.null;
            expect(user).to.be.null;
            done();
        });
      });
    
});