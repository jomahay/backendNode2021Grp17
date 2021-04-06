let mongoose = require('mongoose');
let Schema = mongoose.Schema;
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let MatiereSchema = Schema({
   // _id: mongoose.Schema.Types.ObjectId,
    nom:String,
    image :String,
    prof: { type: Schema.Types.ObjectId, ref: 'Utilisateur' }
});
MatiereSchema.plugin(aggregatePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Matiere',MatiereSchema);
