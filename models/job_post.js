var mongoose = require('mongoose');

var jobPostSchema = new mongoose.Schema({
    category: String
    , description: String
    , location: {city: String
        , type: String
        , coordinates:[Number, Number]}
    , requirements: [String]
    , period: {startDate: Date, endDate: Date}
    , salary_range: {from: Number, to: Number}
    , created_at: Date
    , updated_at: Date
    , deleted_at: Date
    , created_by: {user_id: ObjectId, full_name: String}
    , applicants: [{user_id: ObjectId
        , full_name: String
        , submission_date: Date
        , status: String}]  

});

module.exports = mongoose.model('JobPost', jobPostSchema);