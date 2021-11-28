// récupération des dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

//utilisation d'express, METTRE CETTE LIGNE AVANT LES APP.USE
const app = express();


//Routes 
const sauceRoutes = require('./routes/sauce');
const userRoutes =require('./routes/user');


//Connexion a la BDD de atlas
mongoose.connect('mongodb+srv://AliNamooya:testtest@cluster0.jseu7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{ useNewUrlParser: true,
useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

 
//Autorisation des headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use(express.json());

//téléchargement des images
app.use('/images', express.static(path.join(__dirname, 'images')));

//Routes API
app.use('/api/sauces',sauceRoutes);
app.use('/api/auth' , userRoutes);

module.exports = app;