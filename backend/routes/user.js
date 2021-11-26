const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

//---------------------Routes-----------------------
//requete post  LOGIN
//ca fonctionne, j'ai le message objet enregistrer

router.post('/signup', userCtrl.signup);





// requete get
// router.use('api/auth', (req, res, next) => {
//   User.find()
//   .then(users => res.status(200).json(users))
//   .catch(error => res.status(400).json({error}));
// })


module.exports = router;