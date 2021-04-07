let express = require('express');
let app = express();
const matiere = require('../routes/matieres');

const verification = require("../verification");
const prefix = '/api';

app.route(prefix + '/matieres')
  .get(verification.verificationToken,matiere.getMatieres);

  app.route(prefix + '/matieres/tous')
  .get(verification.verificationToken,matiere.getAllMatiere); 

app.route(prefix + '/matiere/:id')
  .get(verification.verificationToken,matiere.getMatiere)
  .delete(verification.verificationAdmin,matiere.deleteMatiere);


app.route(prefix + '/matiere')
  .post(verification.verificationAdmin,matiere.postMatiere)
  .put(verification.verificationAdmin ,matiere.updateMatiere);


module.exports = app;