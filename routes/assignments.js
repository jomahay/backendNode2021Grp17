let Assignment = require('../model/assignment');

// Récupérer tous les assignments (GET)
function getAssignments(req, res){
  state:boolean  = false;
  if(req.query.rendu=="false")
  {
      state = false;
  }
  else{
      state = true;
  }
  var aggregateQuery = Assignment.aggregate([


      { "$lookup": {
          "from": "matieres",
          "localField": "matiere",
          "foreignField": "_id",
          "as": "matiere"
      }},
      { "$lookup": {
          "from": "utilisateurs",
          "localField": "eleve",
          "foreignField": "_id",
          "as": "eleve"
      }},
      { "$lookup": {
        "from": "utilisateurs",
        "localField": "prof",
        "foreignField": "_id",
        "as": "prof"
      }},
      { $match: { rendu: state } },
  ]);

    
    Assignment.aggregatePaginate(
      aggregateQuery,
      {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
      },
      (err, assignments) => {
        if (err) {
          res.send(err);
        }
        res.send(assignments);
      }
    );
    
}




// Récupérer un assignment par son id (GET)
function getAssignment(req, res){
    let assignmentId = req.params.id;

    
    Assignment.findOne({_id: assignmentId}).populate('eleve').populate('matiere').exec(function (err, assignment) {
        if (err) {
            console.log(err)
        }
        return res.json(assignment);
    });
}

// Ajout d'un assignment (POST)
function postAssignment(req, res){
    let assignment = new Assignment();
    //assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;
    assignment.matiere = req.body.matiere;
    assignment.eleve = req.body.eleve;
    assignment.note = req.body.note;
    assignment.remarque=req.body.remarque;
    assignment.prof=req.body.prof;

    if(assignment.nom === undefined ||
        assignment.dateDeRendu === undefined ||
        assignment.matiere === undefined ||
        assignment.eleve === undefined || assignment.remarque === undefined || assignment.note === undefined || assignment.prof === undefined ){
        return res.status(400).send('Requête incomplète.');
    }

    console.log("POST assignment reçu :");
    console.log(assignment)

    assignment.save( (err) => {
        if(err){
            res.send('cant post assignment ', err);
        }
        res.json({ message: `${assignment.nom} enregistré !`})
    })
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    Assignment.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
          res.json({message: 'modification effectuée'})
        }

      // console.log('updated ', assignment)
    });

}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {

    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${assignment.nom} supprimé `});
    })
}



module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment};
