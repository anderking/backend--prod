'use strict'

var Coment = require('../models/coment');
var Publication = require('../models/publication');
var User = require('../models/user');

var controller = {
	
	saveComent: function(req, res)
	{
		Publication.find
		(
			{
			    _id : req.body.publicationID
			},
			(err, publication) =>
			{
				if (err)
				{
					return res.status(500).send({ message: "Error en el Servidor publication" });
				}

				if(publication.length<=0)
				{
					return res.status(404).send({ message: 'La publicación no existe, no puedes agregar un comentario' });
				}
				else
				{
					User.find
					(
						{
						    _id : req.body.userID
						},
						(err, publication) =>
						{
							if (err)
							{
								return res.status(500).send({ message: "Error en el Servidor user" });
							}

							if(publication.length<=0)
							{
								return res.status(404).send({ message: 'El usuario no existe, no puedes agregar un comentario' });
							}
							else
							{
								var coment = new Coment();
								var params = req.body;

								coment.text = params.text
								coment.userID = params.userID;
								coment.publicationID = params.publicationID;

								coment.save((err, comentStored) =>
								{
									if(err) return res.status(500).send({message: 'Error en Servidor.'});

									if(!comentStored) return res.status(404).send({message: 'No se ha podido guardar el comentario.'});

									return res.status(200).send({
										coment: comentStored,
										message: "Comentario Creado Correctamente"
									});
								});
							}
						}
					);
				}
			}
		)
	},

	getComent: function(req, res){
		var comentId = req.params.id;

		if(comentId == null) return res.status(404).send({message: 'El comentario no existe.'});

		Coment.findById(comentId, (err, coment) => {

			if(err) return res.status(500).send({message: 'Error en el Servidor.'});

			if(!coment) return res.status(404).send({message: 'El id del comentario no existe.'});

			return res.status(200).send({
				coment
			});

		});
	},


	getComents: function(req, res){
		
		Coment.find()
		.populate('userID')
		.populate('publicationID')
		.sort('-create_at').exec((err, coments) => {

			if(err) return res.status(500).send({message: 'Error en el Servidor.'});

			if(!coments) return res.status(404).send({message: 'No hay comentarios que mostrar.'});

			return res.status(200).send({coments});

		})

	},

	getcomentsPublication: function(req, res)
	{	
		var publicationID = req.params.id;
		
		if(publicationID == null) return res.status(404).send({message: 'No se encuentra el parametro publicationID.'});

		Coment.find({publicationID: publicationID}, (err, comentsPublication) => {

			if(err) return res.status(500).send({message: 'Error en el servidor.'});

			if(!comentsPublication) return res.status(404).send({message: 'El id de la Publicación no existe.'});

			return res.status(200).send({
				comentsPublication
			});

		})
		.populate('userID')
		.populate('publicationID')
		.sort('-_id');

	},

	updateComent: function(req, res){
		var comentId = req.params.id;
		var update = req.body;

		Coment.findByIdAndUpdate(comentId, { text: req.body.text }, {new:true}, (err, comentUpdated) => {
			if(err) return res.status(500).send({message: 'Error en el Servidor'});

			if(!comentUpdated) return res.status(404).send({message: 'El id del comentario no existe.'});

			

			return res.status(200).send({
				coment: comentUpdated,
				message: "Comentario Actualizado Correctamente"
			});
		});
	},

	deleteComent: function(req, res){
		var comentId = req.params.id;
		Coment.findByIdAndRemove(comentId, (err, comentRemoved) => {
			if(err) return res.status(500).send({message: 'Error en el Servidor'});

			if(!comentRemoved) return res.status(404).send({message: "La el comentario no existe."});

			return res.status(200).send({
				persona: comentRemoved,
				message: "Comentario Eliminado Correctamente"
			});
		});
	},

};

module.exports = controller;