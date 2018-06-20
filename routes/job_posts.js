const express = require('express');
const router = express.Router();
const JobPost = require('../models/job_post');
const User = require('../models/user');


router.get('/:long/:lat/:dist', function (req, res, next) {
  JobPost.find( {
    location: {
      $near: {
       $maxDistance: req.params['dist'],
       $geometry: {
        type: "point",
        coordinates: [req.params['long'], req.params['lat']]
       }
      }
     }
    }
  ).exec(function (err, jobPosts) {
      res.json({
        "data": jobPosts
      });
    });
});

/* GET job posts listing. */
router.get('/:search', function (req, res, next) {
  JobPost.find(
    { $text: { $search: req.params['search'] } },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .exec(function (err, jobPosts) {
      if(jobPosts.length == 0)
      return next();
      res.json({
        "data": jobPosts
      });
    });
});

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

router.get('/user/:id', (req, res, next) => {

  JobPost.find({"created_by.user_id": req.params.id }, (err, posts) => {
    res.json({
      "data": posts
    })
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
          status: status
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
          start_date: start_date,
          end_date: end_date,
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
      , type: 'point'
      , coordinates: [req.body.longitude, req.body.latitude]
    }
    , requirements: req.body.requirements //still not sure the syntax
    , period: { start_date: req.body.period_start_date, end_date: req.body.period_end_date }
    , salary_range: { from: req.body.salary_range_from, to: req.body.salary_range_to }
    , status: 'open'
    // , deleted_at: new Date()  // if not marked as deleted , property deleted_at does not exist
    , created_by: { user_id: req.body.created_by_user_id, full_name: req.body.created_by_full_name }

  }); 

  jobPost.save((err, data) => { //, data
    if (err) {
      console.log("save error" + err);
      res.send({
        "error": {
          "code": 520,
          "message": err
        }
      });
    } else {
      //update job_posts array in creator document.
      User.update({ _id: req.body.created_by_user_id },
        {
          $push: {
            job_posts: {
              job_id: data._id,
              job_name: data.category,
              posted_date: data.created_at,
              //applied_date: submission_date,
              status: data.status,
              start_date : data.period.start_date,
              end_date : data.period.end_date
            }
          }
        }, x => {
          console.log(x);
        });

      res.json({
        "data": 'success'
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

var JobStatus = {
  Open: "Open",
  Close: "Close",
  Taken: "Taken",
  Completed: "Completed",
}

var ApplicationStatus = {
  Submitted: "Submitted",
  Successful: "Successful",
  UnSuccessful: "UnSuccessful",
  Completed: "Completed"
}


let changeJobStatus = (job_id, new_status, callback) => {
  JobPost.findOneAndUpdate(
    { _id: job_id },
    { status: new_status },
    (err, doc) => {
      if (err) return handleError(err);
      console.log('update Job success: -> ' + JobStatus.Completed);
      callback(true);
    }
  );
}

// Change the status of job
let changeJobApplicationsStatus = (job_id, new_status, callback) => {
  JobPost.findById(job_id, (err, job) => {
    job.applicants.forEach(app => app.status = new_status);
    job.save((err, updatedJob) => {
      console.log(`update status to ${new_status} for ${job.applicants.length} applications`);
    });
  })
}
// Change the all the applications's status to unsuccess for a job
let changeJobAllApplicationsToUnSuccess = (job_id, callback) => {
  changeJobApplicationsStatus(job_id, ApplicationStatus.Successful, callback);
}
// Change one application's status to success for a job
let changeJobOneApplicationToSuccess = (job_id, user_id, callback) => {
  JobPost.findById(job_id, (err, job) => {
    job.applicants.forEach(app => {
      if (app.user_id == user_id) {
        app.status = ApplicationStatus.Successful;
      }
    });
    job.save((err, updatedJob) => {
      console.log(`update status to ${new_status} for ${job.applicants.length} applications`);
    });
  })
}

// Change the status of application for user
let changeUserApplicationStatus = (user_id, job_id, status, callback) => {
  console.log(`user_id: ${user_id}, job_id: ${job_id}`)
  User.findById(user_id, (err, user) => {
    console.log(user);
    if (!user.job_applications) return callback(true);
    user.job_applications.forEach(app => {
      if (app.job_id == job_id) app.status = status;
    });
    user.save((err, updatedUser) => {
      console.log(`update status to ${status} for ${user_id}`);
    });
  });
}
// Change the application-status to success for one user
let changeUserApplicationToSuccess = (user_id, job_id, callback) => {
  changeUserApplicationStatus(user_id, job_id, ApplicationStatus.Successful, callback);
}
// Change the application-status to unsuccess for one user
let changeUserApplicationToUnSuccess = (user_id, job_id, callback) => {
  changeUserApplicationStatus(user_id, job_id, ApplicationStatus.UnSuccessful, callback);
}

// Change the worker's status to completed after the job has been marked done 
let changeUserApplicationToCompleted = (user_id, job_id, callback) => {
  changeUserApplicationStatus(user_id, job_id, ApplicationStatus.Completed, callback);
}

router.patch('/:job_id/close', (req, res, next) => {
  let job_id = req.params.job_id;
  changeJobStatus(job_id, JobStatus.Close, success => {
    res.json({ "data": success ? "success" : "failed" })
  });
  
});
router.patch('/:job_id/competed', (req, res, next) => {
  let job_id = req.params.job_id;
  // step 1
  changeJobStatus(job_id, JobStatus.Completed, success => {
    // res.json({ "data": success ? "success" : "failed" })
    console.log(`step 1: change job status ${success}`)
  });

  // find the worker id
  JobPost.findById(job_id, (err, job) => {
    console.log(`step 2: got job: ${job._id}`)
    let applicants = job.applicants;
      for (let app of applicants) {
        if (app.status == ApplicationStatus.Successful) {
          let user_id = app.user_id;
          console.log(`step 3: got user: ${user_id}`)
          // step 2
          changeUserApplicationToCompleted(user_id, job_id, success => {
            console.log(`step 4: update user application: ${success}`)
            res.json({ "data": success ? "success" : "failed" })
          });
        }
      }
      res.json({ "data": "success" })
  })
  
  
  
});
router.patch('/:job_id/accept/:user_id', (req, res, next) => {
  try {
    let job_id = req.params.job_id;
    console.log(`job id: ${job_id}`)
    let winner_id = req.params.user_id;

    // step 1
    changeJobStatus(job_id, JobStatus.Taken, success => {
      console.log(success)
    });

    // step 2
    JobPost.findById(job_id, (err, job) => {
      console.log(`---> job: ${job}`)
      let applicants = job.applicants;
      for (let app of applicants) {
        changeUserApplicationToUnSuccess(app.user_id, job_id, success => {
        console.log(success)
        });
      }
    })
    
    // step 3
    changeUserApplicationToSuccess(winner_id, job_id, success => {
      console.log(success)
      res.json({ "data": success ? "success" : "failed" })
    });
  } catch (error) {
    console.log(error);
  }
  
  
});


// router.patch('/:job_id/status/:status', (req, res, next) => {
//   let job_id = req.params.id;
//   let new_status = req.params.status;
//   JobPost.findOneAndUpdate(
//     { _id: job_id },
//     { status: new_status },
//     (err, doc) => {
//       if (err) return handleError(err);
//       console.log('update Job success')
//     }
//   );
//   User.findOneAndUpdate(
//     { "job_applications.job_id": job_id },
//     { "job_applications.$.status": new_status},
//     (err, doc) => {
//       if (err) return handleError(err);
//       console.log('update User success')
//       res.json({ "data": 'success' });
//     }
//   );
// });


module.exports = router;
