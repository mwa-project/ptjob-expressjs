var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    first_name: String
    , last_name: String
    , email: String
    , user_name: {type: String, index: true, unique: true}
    , password: { type: String, required: true }
    , created_at: Date
    , updated_at: Date
    , dateOfBirth: Date
    , gender: String
    , location: { state: String
        , city: String
        , zipcode: String
        , type: String
        , coordinates:[Number, Number]}
       // , coordinates:{type: [Number, Number]}} //titin: it can also work , I think
    , educations: [{schoolName: String
        , startDate:Date
        , endDate: Date
        , city: String}]
    , hobbies: [String]
    , achievements:[String]
    , ratings: [{job_id: mongoose.Schema.Types.ObjectId
        , job_name: String
        , rating_type: Boolean
        , rating_value: Number
        , comment: String}]
    , job_applications: [{job_id: mongoose.Schema.Types.ObjectId
        , job_name: String
        , date_posted: Date
        , date_applied: Date
        , status: String
        , start_date: Date
        , end_date: Date }]
    , job_posts: [{job_id: mongoose.Schema.Types.ObjectId
        , job_name: String
        , date_posted: Date
        , date_applied: Date
        , status: String
        , start_date: Date
        , end_date: Date }]
    , job_subscription:{categories: []
        , salary: {from: Number, to: Number}
        , distance: Number}

});

//indexes:
//...
userSchema.index({user_name: 1});

//custom methods:
userSchema.methods.fullName = function(){
    return this.first_name + ' '+ this.last_name;
}

//statics:
userSchema.static.findByName = function(name, cb){
    return this.find({user_name: name}, cb);
}
//run functions before saving:
userSchema.pre('save', function(next){
    var currentDate = new Date();
    this.updated_at = currentDate;
    if(!this.created_at)this.created_at = currentDate;
    
    // hashing a password before saving it to the database
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
        if (err) {
          console.log(err);
          return next(err);
        }
        user.password = hash;
        next();
    })
});

//query helpers
userSchema.query.byUserName = function(userName){
    return this.find({user_name: userName});
}

//virtuals:
// userSchema.virtual('fullName')
// .get(function(){
//     return this.first_name + ' ' + this.last_name;
// })
// .set(function(v){
//     this.first_name = v.substr(0, v.indexOf(' '));
//     this.last_name = v.substr(v.indexOf(' ')+1);
// })

userSchema.statics.authenticate = function (user_name, password, callback) {
    this.findOne({ user_name: user_name }, function (err, user) {
        if (err) {
          return callback(err)
        } else if (!user) {
          var err = new Error('User not found.');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(password, user.password, function (err, result) {
          if (result === true) {
            return callback(null, user);
          } else {
            return callback();
          }
        })
      });
  }

userSchema.methods.generateToken = () => {
    // Signing a token with 1 hour of expiration
    const secret = 'mwa';
    return jwt.sign({
        user_name: this.user_name,
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        exp: Math.floor(Date.now() / 1000) + (60 * 60)
    }, secret);
};
module.exports = mongoose.model('User', userSchema);
