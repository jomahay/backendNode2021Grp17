let express = require('express');
let app = express();
const assignment = require('../routes/assignments');
const verification = require("../verification");
const prefix = '/api';

app.route(prefix + '/assignments')
  .get(verification.verificationToken,assignment.getAssignments);

 
app.route(prefix + '/assignments/:id')
  .get(verification.verificationToken,assignment.getAssignment)
  .delete(verification.verificationToken,assignment.deleteAssignment);


app.route(prefix + '/assignments')
  .post(verification.verificationToken,assignment.postAssignment)
  .put(verification.verificationToken,assignment.updateAssignment);



module.exports = app;