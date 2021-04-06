let mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Role = require("../model/role");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let Schema = mongoose.Schema;

let UtilisateurSchema = Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    nom: {
        type: String,
        trim: true,
        required: true
      },
    prenom:{
        type: String,
        trim: true,
        required: true
      },
    email:{
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true
      },
    hash_motDePasse: String,
    role: {
        enum: Object.values(Role),
        type: String
    },
    date_creation: { type:Date,default:Date.now} ,
    image: String
});

UtilisateurSchema.plugin(aggregatePaginate);

UtilisateurSchema.methods.comparePassword = function(motDePasse) {
    return bcrypt.compareSync(motDePasse,this.hash_motDePasse);
  };

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Utilisateur', UtilisateurSchema);
