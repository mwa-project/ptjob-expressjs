var express = require('express');
var router = express.Router();
var JobPost = require('../models/job_post');

/* GET job posts listing. */
router.get('/', function (req, res, next) {
  JobPost.find({}, (err, jobPosts) => {
    res.json({
      "data": jobPosts
    });
  });
});

/* GET job posts listing. */
router.get('/:id', function (req, res, next) {
  JobPost.findById(req.params['id'], (err, jobPost) => {
    res.json({
      "data": jobPost
    });
  });
});

/* POST new job post */
router.post('/', function (req, res, next) {
  var jobPost = new JobPost({
    //job post data from req body here
    category: req.body.category
    , description: req.body.description
    , location: {state: req.body.state
        , city: req.body.city
        , zipcode: req.body.zipcode
        , type: 'Points'
        , coordinates:[req.body.longitude, req.body.latitude]}
    , requirements: req.body.requirements //still not sure the syntax
    , period: {start_date: req.body.start_date, end_date: req.body.end_date}
    , salary_range: {from: req.body.salary_from, to: req.body.salary_to}
    , created_at: new Date()
    , updated_at: new Date()
    , deleted_at: new Date()
    , created_by: {user_id: req.body.created_by, full_name: req.body.full_name}

  });
  jobPost.save(err => {
    if (err) {
      console.log("save error" + err);
      res.send({
        "error": {
          "code": 520,
          "message": err
        }
      });
    } else {
      res.json({
        "data": null
      });
    }

  });
});

router.delete('/:id', (req, res, next) => {
  JobPost.findOneAndRemove({ id: req.params.id }, (err) => {
    if (err) {
      res.json({
        "error": {
          "error": 520,
          "message": err
        }
      });
    } else {
      res.json({ "data": null });
    }
  });
});



module.exports = router;
