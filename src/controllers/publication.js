'use strict'

var Publication = require('../models/publication');
const User = require('../models/user');
const Categoria = require('../models/categoria');
const Ruta = require('../models/ruta');
const Like = require('../models/like');
const Coment = require('../models/coment');
var fs = require('fs');
var path = require('path');

var controller = {
	
	savePublication: function(req, res)
	{
		User.find
		(
			{
				_id: req.body.userID
			},
			(error, result) =>
			{
				if (error)
				{
					return res.status(500).send({ message: error });
				}
				if (result.length<=0)
				{
					return res.status(404).send({ message: 'El usuario no se encuentra, no podemos crear una publicación sin un usuario asociado' });
				}else
				{
					Categoria.find
					(
						{
							_id: req.body.categoriaID
						},
						(error, result) =>
						{
							if (error)
							{
								return res.status(500).send({ message: error });
							}
							
							if (result.length<=0)
							{
								return res.status(404).send({ message: 'La Categoria no se encuentra, no podemos crear una publicación sin una categoria asociada' });
							}else
							{
								Ruta.find
								(
									{
										_id: req.body.rutaID
									},
									(error, result) =>
									{
										if (error)
										{
											return res.status(500).send({ message: error });
										}
										
										if (result.length<=0)
										{
											return res.status(404).send({ message: 'La Ruta no se encuentra, no podemos crear una publicación sin una ruta asociada' });
										}else
										{
											var publication = new Publication();
											var params = req.body;

											publication.title = params.title;
											publication.description = params.description;
											publication.image = null;
											publication.tarifa = params.tarifa;
											publication.vistas = null;
											publication.userID = params.userID;
											publication.categoriaID = params.categoriaID;
											publication.rutaID = params.rutaID;


											publication.save((err, publicationStored) => {
												if(err) return res.status(500).send({message: 'Error en el Servidor.'});

												if(!publicationStored) return res.status(404).send({message: 'Error al crear la Publicación.'});

												return res.status(200).send({
													publication: publicationStored,
													message: "Publicación Creada Correctamente"
												});
											});
										}
									}
								);
							}
						}
					);
				}
			}
		);
	},

	getPublication: function(req, res)
	{
		var publicationId = req.params.id;

		if(publicationId == null) return res.status(404).send({message: 'No se encuentra el parametro id.'});

		Publication.findById(publicationId, (err, publication) => {

			if(err) return res.status(500).send({message: 'Error en el Servidor.'});

			if(!publication) return res.status(404).send({message: 'El id de la Publicación no existe.'});

			return res.status(200).send({
				publication
			});

		})
		.populate('userID')
		.populate('categoriaID')
		.populate('rutaID');
	},

	getPublicationsUser: function(req, res)
	{	
		var userID = req.params.id;
		
		if(userID == null) return res.status(404).send({message: 'No se encuentra el parametro userID.'});

		Publication.find({userID: userID}, (err, publicationsUser) => {

			if(err) return res.status(500).send({message: 'Error en el servidor.'});

			if(!publicationsUser) return res.status(404).send({message: 'El id de la Publicación no existe.'});

			return res.status(200).send({
				publicationsUser
			});

		})
		.populate('userID')
		.populate('categoriaID')
		.populate('rutaID')
		.sort('-_id');

	},

	getPublications: function(req, res)
	{	
		Publication.find()
		.populate('userID')
		.populate('categoriaID')
		.populate('rutaID')
		.sort('-_id').exec((err, publications) => {

			if(err) return res.status(500).send({message: 'Error en el Servidor.'});

			if(!publications) return res.status(404).send({message: 'No hay Publicaciones que mostrar.'});

			return res.status(200).send({publications});

		});
	},

	updatePublication: function(req, res)
	{
		var publicationId = req.params.id;
		var update = req.body;

		if(publicationId == null) return res.status(404).send({message: 'No se encuentra el parametro id.'});

		Publication.findByIdAndUpdate(publicationId, update, {new:true}, (err, publicationUpdated) => {
			if(err) return res.status(500).send({message: 'Error en el Servidor'});

			if(!publicationUpdated) return res.status(404).send({message: 'No existe la Publicación.'});

			return res.status(200).send({
				publication: publicationUpdated,
				message: "Datos Actualizados Correctamente"
			});
		});
	},

	deletePublication: function(req, res)
	{
		var publicationId = req.params.id;
		
		if(publicationId == null) return res.status(404).send({message: 'No se encuentra el parametro id.'});

		Publication.findByIdAndRemove(publicationId, (err, publicationRemoved) => {
			if(err) return res.status(500).send({message: 'Error en el Servidor'});

			if(!publicationRemoved) return res.status(404).send({message: "No existe la Publicación."});

			Like.remove({publicationID: publicationId}, (err, likes) =>
			{
				if(err) return res.status(500).send({message: 'No se ha podido borrar los likes del usuario'});
			});

			Coment.remove({publicationID: publicationId}, (err, likes) =>
			{
				if(err) return res.status(500).send({message: 'No se ha podido borrar los comentarios del usuario'});
			});

			return res.status(200).send({
				publication: publicationRemoved,
				message: "Publicación Eliminada Correctamente"
			});
		});
	},

	uploadImage: function(req, res)
	{
		var publicationId = req.params.id;
		var fileName = 'Imagen no subida...';

		if(req.files)
		{
			var filePath = req.files.image.path;
			var fileSplit = filePath.split('\\');
			var fileName = fileSplit[1];
			var extSplit = fileName.split('\.');
			var fileExt = extSplit[1];

			if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif')
			{
				Publication.findByIdAndUpdate(publicationId, {image: fileName}, {new: true}, (err, publicationUpdated) => {
					if(err) return res.status(500).send({message: 'Error en el Servidor'});

					if(!publicationUpdated) return res.status(404).send({message: 'No existe la Publicación, no se puede actualizar la Imagen.'});

					return res.status(200).send({
						publication: publicationUpdated
					});
				});
			}else
			{
				fs.unlink(filePath, (err) => {
					return res.status(200).send({message: 'La extensión no es válida'});
				});
			}
		}else
		{
			return res.status(200).send({
				message: fileName
			});
		}

	},

	getImageFile: function(req, res)
	{
		var file = req.params.image;
		var path_file = './img/'+file;
		fs.exists(path_file, (exists) => {
			if(exists){
				return res.sendFile(path.resolve(path_file));
			}else{
				return res.status(200).send({
					message: "No existe la imagen..."
				});
			}
		});
	},



};

module.exports = controller;