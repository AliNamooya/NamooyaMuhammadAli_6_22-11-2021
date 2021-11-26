const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');



exports.signup = (req, res, next) => { 
  bcrypt.hash(req.body.password, 10)
  .then(hash =>{
    const user = new User({
      email: req.body.email,
      password: hash
    });
    //sauvegarde des infos dans la BDD atlas
    user.save()
    .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
    .catch(error => res.status(400).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
};




exports.login = (req, res, next) => {
  User.findOne({ email : req.body.email }) // récupération de l'email entrée dans la BDD
  .then(user => {
    if (!user){//si l'email n'est pas valable
      return res.statu(401).json({error: 'Utilisateur non trouvé'})
    }
    //si c'est valable, on compare le mdp avec celui de la BDD
    bcrypt.compare(req.body.password, user.password)
    .then(valid => {
      if (!valid) {// si le mdp n'est pas valable
        return res.statu(401).json({error: 'Mot de passe incorrecte'})
      }
      //si c'est valable, on lui renvoie les infos suivantes
      res.status(200).json({
        userId: user._id,
        token: jwt.sign(
          { userId: user._id},
          'RANDOM_TOKEN_SECRET',
          { expiresIn: '24h'} //token valable 24h
        )
      });
    })
    .catch(error => res.status(500).json({}));
  })
  .catch(error => res.status(500).json({}));
};