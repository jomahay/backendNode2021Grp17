const jwt = require('jsonwebtoken');
const Utilisateur = require('./model/utilisateur');
const role = require('./model/role');

function extractBearerToken (headerValue) {
    if (typeof headerValue !== 'string') {
        return false
    }

    const matches = headerValue.match(/(bearer)\s+(\S+)/i)
    return matches && matches[2]
}

function verificationToken(req, res, next){
    // Récupération du token
    const token = req.headers.authorization && extractBearerToken(req.headers.authorization)

    // Présence d'un token
    if (!token) {
        return res.status(401).json({ message: 'Erreur .Besoin de token ' })
    }
    jwt.verify(token,'RESTFULAPIs', function(err, decoded) {
        if (err){
            console.log(err);
            return res.status(500).send('Token non reconnu.');
        }
         else {
            console.log(decoded)
           console.log(decoded._id+" id ")
            Utilisateur.findById(decoded._id, { password: 0 }, function (err, utilisateur) {
                if (err) {
                    console.log(err);
                    res.status(500).send('Erreur sur le serveur.');
                }
                if (!utilisateur) return res.status(404).send('Utilisateur non reconnu');
    
                req.utilisateur = utilisateur;
    
                return next();
            });
        }
    });
}

function decoder(req, res){


    const token = req.headers.authorization && extractBearerToken(req.headers.authorization)
    // Décodage du token
    const decoded = jwt.decode(token, { complete: false })

    return res.json({ content: decoded })
}

function verificationAdmin(req, res, next){
    verificationToken(req, res, function () {
        if (req.utilisateur.role !== role.ADMIN){
            return res.status(403).send('Accès interdit');
        }

        return next();
    });
}



module.exports = {verificationToken,decoder,verificationAdmin};