let mongoose = require('mongoose');
let Schema = mongoose.Schema;
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let AssignmentSchema = Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    
    nom: String,
    rendu: Boolean,
    note:Number,
    remarque:String,
    dateDeRendu: Date,
    matiere: { type: Schema.Types.ObjectId, ref: 'Matiere' },
    eleve: { type: Schema.Types.ObjectId, ref: 'Utilisateur' },
    prof: { type: Schema.Types.ObjectId, ref: 'Utilisateur' }
    
});

AssignmentSchema.plugin(aggregatePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Assignment', AssignmentSchema);
