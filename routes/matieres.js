
let Matiere = require('../model/matiere');
let fs = require('fs');

function getAllMatiere(req,res){

    Matiere.find((err, matieres) => {
        if(err){
            res.send(err)
        }

        res.send(matieres);
    });
}
// Récupérer tous les matieres (GET)
function getMatieres(req, res){
    var aggregateQuery = Matiere.aggregate([

        { "$lookup": {
            "from": "utilisateurs",
            "localField": "prof",
            "foreignField": "_id",
            "as": "prof"
        }}
  ]);
  Matiere.aggregatePaginate(
    aggregateQuery,
    {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    },
    (err, matieres) => {
      if (err) {
        res.send(err);
      }
      res.send(matieres);
    }
  );
}

// Récupérer une matiere par son id (GET)
function getMatiere(req, res){
    let matiereId = req.params.id;

    Matiere.find({_id: matiereId}).populate('prof').exec(function (err, matiere) {
        if (err) {
            console.log(err)
        }
        return res.json(matiere);
    });
}

// Ajout d'un matiere (POST)
function postMatiere(req, res){
    const nom=req.body.nom;
    const prof=req.body.prof;
    const image=req.body.image;

    Matiere.findOne({nom: nom}, (err, matiere) =>{

         //Erreur sur mongoDB
        if(err) {
        console.log(err)
        return res.status(500).send('Erreur sur le serveur.');
      }
  
      //Doublon trouvé
      if (matiere){
        console.log("matière déjà existant");
        return res.status(400).send({etat:false, message:'la matière existe déja'});
      }
        
        if(!req.body.image || !req.body.nom || !req.body.prof) {
            return res.status(500).send({ message: 'Insertion impossible '});
        }else{
            let matiere = new Matiere();
        
            matiere.nom = nom;
            matiere.image = image;
            matiere.prof = prof;
            
            
        
            console.log("POST matiere reçu :");
            
            console.log(matiere.nom+" "+matiere.image+" "+matiere.prof)
        
            matiere.save( (err,matiere) => {
                if(err){
                    res.send('ne peut pas posté matière ', err);
                }
                res.json({ message: `matière sauvegardé!`})
            });
    
        }
    });

    
  
}


//Update d'un matiere  (PUT)
function updateMatiere(req, res) {
    console.log("UPDATE recu matiere : ");
    console.log(req.body);
    const body = {
        nom: req.body.nom,
        prof: req.body.prof,
        image:  req.body.image
      };
    Matiere.findByIdAndUpdate(req.body.id, body, {new: true}, (err, matiere) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
          res.json({message: 'modification éffectué'})
        }

  
    });

}


// suppression d'un matiere (DELETE)
function deleteMatiere(req, res) {

    let matiereId = req.params.id;

    console.log(matiereId+" id matiere")
    Matiere.findOneAndRemove({_id: matiereId}, (err, matiere) => {
        if (err) {
            res.send(err);
        }
        console.log(matiere.image +" image");
        res.json({message: `matière supprimée`});
    })
}



module.exports = { getMatieres,getAllMatiere, getMatiere, postMatiere, updateMatiere, deleteMatiere};
