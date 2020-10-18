const express = require('express');
const router = express.Router();
const axios = require('axios');

//When an employee clicks on a job opening to view its details
router.get('/:id', function(req, res) {
    axios.get('http://localhost:3000/jobs/' + req.params.id).then((response) => {
      res.render('jobOpeningDetails', { openingDetails: response.data });
    });
  });

  module.exports = router;
