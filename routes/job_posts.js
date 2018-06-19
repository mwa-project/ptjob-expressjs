const express = require('express');
const router = express.Router();
const JobPost = require('../models/job_post');
const User = require('../models/user');

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

/* Patch job posts listing. */
router.patch('/:job_id', function (req, res, next) {

  let full_name = req.body.full_name;
  let user_id = req.body.user_id;
  let status = "submitted";
  let submission_date = new Date();

  let job_id = req.body._id;
  let job_name = req.body.job_name;
  let posted_date = req.body.posted_date;
  let start_date = req.body.start_date;
  let end_date = req.body.end_date;

  console.log(req.body);

  JobPost.update({ _id: job_id },
    {
      $push: {
        applicants: {
          user_id: user_id,
          full_name: full_name,
          submission_date: submission_date,
          status : status
        }
      }
    }, x => {
      console.log(x);
    });

  User.update({ _id: user_id },
    {
      $push: {
        job_applications: {
          job_id: job_id,
          job_name: job_name,
          posted_date: posted_date,
          applied_date: submission_date,
          status: status,
          start_date : start_date,
          end_date : end_date,
        }
      }
    }, x => {
      console.log(x);
    });

  res.json({ 'data': 'success' });
});


/* POST new job post */
router.post('/', function (req, res, next) {
  console.log('HALO')
  var jobPost = new JobPost({
    //job post data from req body here
    category: req.body.category
    , description: req.body.description
    , location: {
      state: req.body.state
      , city: req.body.city
      , zipcode: req.body.zipcode
      , type: 'Point'
      , coordinates: [req.body.longitude, req.body.latitude]
    }
    , requirements: req.body.requirements //still not sure the syntax
    , period: { start_date: req.body.period_start_date, end_date: req.body.period_end_date }
    , salary_range: { from: req.body.salary_range_from, to: req.body.salary_range_to }
    , created_at: new Date()
    , updated_at: new Date()
    // , deleted_at: new Date()  // if not marked as deleted , property deleted_at does not exist
    , created_by: { user_id: req.body.created_by, full_name: req.body.full_name }

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
