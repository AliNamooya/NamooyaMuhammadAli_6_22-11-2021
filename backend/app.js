//récupération des dépendencies
const express = require('express');
const mongoose = require('mongoose');

//-----------Models-----------
const sauce = require ('./models/sauce')


//------------Routes-------------
const userRoutes =require('./routes/user');



const app = express();

//le serveur accepte json
app.use(express.json());

// Connexion a mongoDB (atlas)
mongoose.connect('mongodb+srv://AliNamooya:testtest@cluster0.jseu7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));



// Permet a tout le monde d'acceder a l'API
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});




//------------Routes-------------
app.use('/api/auth', userRoutes);


module.exports = app;