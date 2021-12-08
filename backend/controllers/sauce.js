const Sauce = require("../models/Sauce");
const fs = require("fs");
const { connected } = require("process");

//crée sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

// récupérer toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error: error }));
};

//récupérer une seul sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error: error }));
};

//modification d'une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId == req.auth.userId) {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié !" }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        res.status(400).json({ message: "403: unauthorized request." });
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

//suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId == req.auth.userId) {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Objet supprimé !" }))
            .catch((error) => res.status(400).json({ error }));
        });
      } else {
        res.status(403).json({ message: "403: unauthorized request." });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

//liker ou disliker
exports.likeDislikeSauce = (req, res, next) => {
  let like = req.body.like; //bouton like sur la page
  let userId = req.body.userId; //le userID de l'utilisteur present sur la page
  let sauceId = req.params.id; //l'id de la sauce qui se trouve dans l'URL

  //Boucle switch qui va parcourir les 3 options
  switch (like) {
    case 1: // lorsqu'on like   FONCTIONNE PLUS OU MOIN
      Sauce.findOne({ _id: sauceId }).then((sauce) => {
        if (!sauce.usersLiked.includes(userId)) {
          if (sauce.usersDisliked.includes(userId)) {
            // Si l'utilisateur a deja dislike
            Sauce.updateOne(
              { _id: sauceId },
              { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } },
              { $push: { usersLiked: userId }, $inc: { likes: +1 } }
            )
              .then(() => res.status(200).json({ message: `j'aime` }))
              .catch((error) => res.status(400).json({ error }));
          } else {
            Sauce.updateOne(
              { _id: sauceId },
              { $push: { usersLiked: userId }, $inc: { likes: +1 } }
            )
              .then(() => res.status(200).json({ message: `j'aime` }))
              .catch((error) => res.status(400).json({ error }));
          }
        } else {
          res.status(400).json({ message: "déjà liker" });
        }
      });

      break;

    case 0: // lorsqu'il y a ni like ni dislike
      Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
          if (sauce.usersLiked.includes(userId)) {
            Sauce.updateOne(
              { _id: sauceId },
              { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
            )
              .then(() => res.status(200).json({ message: `Neutre` }))
              .catch((error) => res.status(400).json({ error }));
          }
          if (sauce.usersDisliked.includes(userId)) {
            Sauce.updateOne(
              { _id: sauceId },
              { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } }
            )
              .then(() => res.status(200).json({ message: `Neutre` }))
              .catch((error) => res.status(400).json({ error }));
          }
        })
        .catch((error) => res.status(404).json({ error }));
      break;

    case -1: //lorsqu'il y a un dislike
      Sauce.findOne({ _id: sauceId }).then((sauce) => {
        if (!sauce.usersDisliked.includes(userId)) {
          if (sauce.usersLiked.includes(userId)) {
            // Si l'utilisateur a deja dislike
            Sauce.updateOne(
              { _id: sauceId },
              { $pull: { usersLiked: userId }, $inc: { likes: -1 } },
              { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } }
            )
              .then(() => res.status(200).json({ message: `je n'aime pas` }))
              .catch((error) => res.status(400).json({ error }));
          } else {
            Sauce.updateOne(
              { _id: sauceId },
              { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } }
            )
              .then(() => res.status(200).json({ message: `je n'aime pas` }))
              .catch((error) => res.status(400).json({ error }));
          }
        } else {
          res.status(400).json({ message: "déjà disliker" });
        }
      });

      break;

    default:
      console.log(error);
  }
};
