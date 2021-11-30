const passwordSchema = require('../models/password');

module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.status(400).json({ message: 'Le mot de passe doit faire entre 6 et 20 caractères,contenir minimum 1 majuscules et 1 chiffre' });
    } else {
        next();
    }
};