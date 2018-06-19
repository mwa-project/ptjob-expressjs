var mongoose = require('mongoose');

var jobPostSchema = new mongoose.Schema({
    category: String
    , description: String
    , location: {state: String
        , city: String
        , zipcode: String
        , type:  { type: String }
        , coordinates:[Number, Number]}
    , requirements: [String]
    , period: {start_date: Date, end_date: Date}
    , salary_range: {from: Number, to: Number}
    , created_at: Date
    , updated_at: Date
    , deleted_at: Date
    , created_by: {user_id: mongoose.Schema.Types.ObjectId, full_name: String}
    , applicants: [{user_id: mongoose.Schema.Types.ObjectId
        , full_name: String
        , submission_date: Date
        , status: String}]

});

//run functions before saving:
jobPostSchema.pre('save', function(next){
        let currentDate = new Date();
        this.updated_at = currentDate;
        if(!this.created_at)this.created_at = currentDate;
});

module.exports = mongoose.model('jobs', jobPostSchema);
