let express = require('express');
let app = express();
const utilisateur = require('../routes/utilisateurs');

const auth = require('../routes/auth');
const verification = require("../verification");

const prefix = '/api';


app.route(prefix + '/utilisateur/register')
  .post(verification.verificationAdmin,auth.register);


app.route(prefix + '/utilisateur/login')
  .post(auth.login)

app.route(prefix + '/utilisateur/moi')
  .get(verification.verificationToken,verification.decoder) 

app.route(prefix +'/utilisateur/:id')
  .get(verification.verificationToken,utilisateur.getUtilisateur)
  .delete(verification.verificationToken,utilisateur.deleteUtilisateur);


app.route(prefix +'/utilisateurs')
.get(verification.verificationToken,utilisateur.getUtilisateurs)
.put(verification.verificationToken,auth.updateUtilisateur);


app.route(prefix +'/user/:role')
.get(verification.verificationToken,utilisateur.getUtilisateurByRole);



module.exports = app;


