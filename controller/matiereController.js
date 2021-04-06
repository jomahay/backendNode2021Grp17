let express = require('express');
let app = express();
const matiere = require('../routes/matieres');
const uploadFile = require("../upload");
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
  .post([verification.verificationAdmin,uploadFile.single('file') ],matiere.postMatiere)
  .put([verification.verificationAdmin,uploadFile.single('file') ],matiere.updateMatiere);
 
  app.route(prefix + '/matieres')
  .put(verification.verificationToken,matiere.updateMatiereSansFichier);

module.exports = app;