var mongoose = require('mongoose');

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
    , location: {city: String
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
    next();
});

//query helpers
userSchema.query.byUserName = function(userName){
    return this.find({user_name: userName});
}

//virtuals:
userSchema.virtual('fullName')
.get(function(){
    return this.first_name + ' ' + this.last_name;
})
.set(function(v){
    this.first_name = v.substr(0, v.indexOf(' '));
    this.last_name = v.substr(v.indexOf(' ')+1);
})

module.exports = mongoose.model('User', userSchema);
