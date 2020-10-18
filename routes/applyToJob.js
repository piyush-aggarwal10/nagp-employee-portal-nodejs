const express = require('express');
const router = express.Router();
const axios = require('axios');

//When an employee applies for a job
router.get('/:id', function(req, res) {
    axios.put('http://localhost:3000/jobs/apply/' + req.params.id).then((response) => {
      //res.render('jobOpeningDetails', { openingDetails: response.data });
    })
    .catch((err) =>{
      console.log(err);
    });
  });

  module.exports = router;
