const User = require('../models/User');

exports.signup = (req, res, next) => {
  const user = new User({
    ...req.body
  });
  //enregistrer le schema dans la base de donnée
  //les informations sont visible sur le cluster dns collections
  user.save()
  .then(() => res.status(201).json({message: 'objet enregistrer'}))
  .catch(error => res.status(400).json({error}));
};