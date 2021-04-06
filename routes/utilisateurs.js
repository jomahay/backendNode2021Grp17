const Utilisateur = require('../model/utilisateur');
const Role = require("../model/role");

// Récupérer tous les utilisateurs (GET)
function getUtilisateurs(req, res){
  
    var aggregateQuery = Utilisateur.aggregate();
  
    Utilisateur.aggregatePaginate(
    aggregateQuery,
    {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 8,
    },
    (err, utilisateurs) => {
      if (err) {
        res.send(err);
      }
      res.send(utilisateurs);
    }
  );
}

// Récupérer un utilisateur par son id (GET)
function getUtilisateur(req, res){
    let utilisateurId = req.params.id;

    Utilisateur.findOne({_id: utilisateurId}, (err, utilisateur) =>{
        if(err){res.send(err)}
        res.json(utilisateur);
    })
}

//Récuperer un utilisateur par son role (GET)
function getUtilisateurByRole(req, res){
    let utilisateurRole = req.params.role;

    Utilisateur.find({role: utilisateurRole}, (err, utilisateur) =>{
        if(err){res.send(err)}
       
        res.json(utilisateur);
    })
}
// suppression d'un utilisateur (DELETE)
function deleteUtilisateur(req, res) {

    let utilisateurId = req.params.id;

    console.log(utilisateurId+" id utilisateur")
    Utilisateur.findOneAndRemove({_id: utilisateurId}, (err, utilisateur) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `utilisateur supprimé`});
    })
}



module.exports = { getUtilisateur,getUtilisateurs,getUtilisateurByRole,deleteUtilisateur};