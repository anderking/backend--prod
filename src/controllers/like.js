'use strict'

var Like = require('../models/like');
var User = require('../models/user');
var Publication = require('../models/publication');

var controller =
{
	upLike: function(req, res)
	{
		Like.find
		(
			{
			    userID : { $in: [req.body.userID] },
			    publicationID : { $in: [req.params.idP] }
			},
			(err, like) =>
			{
				if (err)
				{
					return res.status(500).send({ message: "Error en el Servidor" });
				}
				if(req.body.userID==undefined){
					return res.status(404).send({ message: 'No se encuentra el campo userID en la solicitud' });	
				}
				if(like.length>0)
				{
					return res.status(404).send({ message: 'Ya le diste like a esta publicación' });
				}
				else
				{
					var like = new Like();
					var params = req.body;

					like.userID = params.userID;
					like.publicationID = req.params.idP;

					like.save((err, likeStored) =>
					{
						if(err) return res.status(500).send({message: 'Error en Servidor.'});

						if(!likeStored) return res.status(404).send({message: 'No se ha podido guardar el like.'});

						return res.status(200).send({
							like: likeStored,
							message: "Like guardado"
						});
					});
				}
			}
		)
	},

	disLike: function(req, res)
	{
		Like.remove
		(
			{
				userID : { $in: [req.body.userID] },
			    publicationID : { $in: [req.params.idP] }
			},(err, like) =>
			{
				if(err) return res.status(500).send({message: 'Error en el Servidor'});

				if(like.n==0) return res.status(404).send({message: "Ya fue eliminado."});

				return res.status(200).send
				({
					message: "Like Eliminado",
					like
				});
			}
		);
	},

	getLikesPublication: function(req, res)
	{
		Like.find
		(
			{
			    publicationID : req.params.idP
			},
			(err, likesPublication) =>
			{
				if (err) return res.status(500).send({ message: err });

				if(!likesPublication) return res.status(404).send({message: 'No hay likes de esta publicación.'});

				return res.status(200).send({
					likesPublication
				})
				
			}
		)
		.populate('userID')
		.populate('publicationID');
	},

	getLikesUser: function(req, res)
	{
		Like.find
		(
			{
			    userID : req.params.idU
			},
			(err, likesUsers) =>
			{
				if (err) return res.status(500).send({ message: err });

				if(!likesUsers) return res.status(404).send({message: 'Este usuario no tiene likes.'});

				return res.status(200).send({
					likesUsers
				})
				
			}
		)
		.populate('userID')
		.populate('publicationID');
	},

	getLikes: function(req, res)
	{
		Like.find
		(
			{

			},
			(err, likes) =>
			{
				if (err) return res.status(500).send({ message: err });

				if(!likes) return res.status(404).send({message: 'Este usuario no tiene likes.'});

				return res.status(200).send({
					likes
				})
				
			}
		)
		.populate('userID')
		.populate('publicationID');
	},

	isLike: function(req, res)
	{
		Like.find
		(
			{
			    userID : { $in: [req.params.idU] },
			    publicationID : { $in: [req.params.idP] }
			},
			(err, like) =>
			{
				if (err) return res.status(500).send({ message: err });
				
				if(like.length<=0) return res.status(202).send(false);

				return res.status(200).send(true);
			}
		)
	},

};

module.exports = controller;