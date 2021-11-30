const passwordValidator = require('password-validator');
//Permet de verifier la validité d'un mdp avec les criteres suivantes :

const passwordSchema = new passwordValidator();

passwordSchema
.is().min(6)                                    // Minimum length 6
.is().max(20)                                   // Maximum length 20
.has().uppercase(1)                             // Must have  1 uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(1)                                // Must have at least 1 digits
.has().not().spaces()                           // Should not have spaces                 

module.exports = passwordSchema;