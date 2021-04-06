const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Utilisateur = require('../model/utilisateur');


 function register(req, res) {

    const email = req.body.email;
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const role = req.body.role;
    const motDePasse = req.body.motDePasse;

  //Vérification email
  let emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)){
      console.log("Email invalide");
      return res.status(400).send('Email invalide.');
  }

  Utilisateur.findOne({email: email}, (err, utilisateur) =>{

     //Erreur sur mongoDB
     if(err) {
      console.log(err)
      return res.status(500).send('Erreur sur le serveur.');
    }

    //Doublon trouvé
    if (utilisateur){
      console.log("Email déjà existant");
      return res.status(400).send({etat:false, message:'Email déjà existant.'});
    }
    if(!req.file || !nom || !prenom || !email || !role || !motDePasse ) {
      return res.status(500).send({etat:false, message: 'insertion impossible '});
    }else {
      var nouveauUtilisateur = new Utilisateur();
      nouveauUtilisateur.nom=nom;
      nouveauUtilisateur.prenom=prenom;
      nouveauUtilisateur.email=email;
      nouveauUtilisateur.role=role;
      nouveauUtilisateur.image=req.file.filename;
    
    nouveauUtilisateur.hash_motDePasse =bcrypt.hashSync(motDePasse,8);
    nouveauUtilisateur.save(function(err, utilisateur) {
      if (err) {
        return res.status(400).send({
          message: err
        });
      } else {
        utilisateur.hash_motDePasse=undefined;
        return res.json({etat:true,  utilisateur});
      }
    });
    }
    


  });
    
  }
  //update utilisateur avec fichier (PUT)
  function updateUtilisateur(req, res) {

  
    if(!req.file || !req.body.nom || !req.body.prenom || !req.body.email || !req.body.role || !req.body.motDePasse ) {
     
      return res.status(500).send({etat:false, message: 'modification impossible '});
    }else {
      console.log(req.body);
      let emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(req.body.email)){
        console.log("Email invalide");
        return res.status(400).send('Email invalide.');
      }
     
       const body = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        email:req.body.email,
        role:req.body.role,
        hash_motDePasse:req.body.motDePasse,
        image:  req.file.filename
      };
    
      Utilisateur.findByIdAndUpdate(req.body.id, body, {new: true}, (err, utilisateur) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
           
          res.json({message: 'modification éffectué'})
        }

    });
       

      
    }
  }

  //update utilisateur sans fichier (PUT)
function updateUtilisateurSansFichier(req, res) {
 
  console.log(req.body);


    const body = {
      nom: req.body.nom,
      prenom: req.body.prenom,
      email:req.body.email,
      role:req.body.role,
      hash_motDePasse:req.body.motDePasse,
      image:  req.body.image
    };
    Utilisateur.findByIdAndUpdate(req.body.id, body, {new: true}, (err, utilisateur) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
          res.json({message: 'modification éffectué'})
        }
    });

  
}

  function login (req, res) {

    const email = req.body.email;
    const motDePasse = req.body.motDePasse;

   console.log("Connexion avec email : " + email);
    Utilisateur.findOne({
      email: email
    }, function(err, utilisateur) {
        //Erreur sur le serveur 
      if (err){
        console.log(err);
        return res.status(500).send('Erreur sur le serveur.');
      }
      if (!utilisateur || !utilisateur.comparePassword(motDePasse)) {
        return res.status(401).json({ auth: false , token: '',message: 'Identifiant et/ou mot de passe érroné' });
      }
      //Créer le token de connexion et la retourne
      let token=jwt.sign({ email: utilisateur.email, nom: utilisateur.nom,role:utilisateur.role, _id: utilisateur._id }, 'RESTFULAPIs');
      return res.json({ auth: true, token: token, message: 'Connexion réussie.' });
    });
  }

  


module.exports = { register, login,updateUtilisateur,updateUtilisateurSansFichier};