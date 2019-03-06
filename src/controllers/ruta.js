'use strict'

var Ruta = require('../models/ruta');
var Publication = require('../models/publication');
var Like = require('../models/like');
var Coment = require('../models/coment');


var controller = {
	
	saveRuta: function(req, res)
	{
		Ruta.find
		(
			{
				name: req.body.name.charAt(0).toUpperCase()+req.body.name.slice(1)
			},
			(err, ruta) =>
			{
				if (err)
				{
					return res.status(500).send({ message: err });
				}
				if(req.body.name==undefined){
					return res.status(404).send({ message: 'No se encuentra el campo name en el formulario' });	
				}
				if (ruta.length>0)
				{
					return res.status(404).send({ message: 'El nombre de la ruta ya está registrada' });
				}else
				{
					var ruta = new Ruta();
					var params = req.body;

					ruta.name = params.name.charAt(0).toUpperCase()+params.name.slice(1),
					ruta.description = params.description.charAt(0).toUpperCase()+params.description.slice(1);

					ruta.save((err, rutaStored) => {
						if(err) return res.status(500).send({message: 'Error en el Servidor.'});

						if(!rutaStored) return res.status(404).send({message: 'No se ha podido guardar la Ruta.'});

						return res.status(200).send({
							ruta: rutaStored,
							message: "Ruta Creada Correctamente"
						});
					});
				}
			}
		);
	},

	getRuta: function(req, res){
		var rutaId = req.params.id;

		if(rutaId == null) return res.status(404).send({message: 'La Ruta no existe.'});

		Ruta.findById(rutaId, (err, ruta) => {

			if(err) return res.status(500).send({message: 'Error en el Servidor.'});

			if(!ruta) return res.status(404).send({message: 'El id de la Ruta no existe.'});

			return res.status(200).send({
				ruta
			});

		});
	},


	getRutas: function(req, res){
		
		Ruta.find()
		.populate('userID')
		.sort('-_id').exec((err, rutas) => {

			if(err) return res.status(500).send({message: 'Error en el Servidor.'});

			if(!rutas) return res.status(404).send({message: 'No hay Rutas que mostrar.'});

			return res.status(200).send({rutas});

		});

	},

	getpublicationsRuta: function(req, res)
	{	
		var rutaID = req.params.id;
		
		if(rutaID == null) return res.status(404).send({message: 'No se encuentra el parametro rutaID.'});

		Publication.find({rutaID: rutaID}, (err, publicationsRuta) => {

			if(err) return res.status(500).send({message: 'Error en el servidor.'});

			if(!publicationsRuta) return res.status(404).send({message: 'El id de la Publicación no existe.'});

			return res.status(200).send({
				publicationsRuta
			});

		})
		.populate('userID')
		.populate('categoriaID')
		.populate('rutaID')
		.sort('-_id');

	},

	updateRuta: function(req, res){
		var rutaId = req.params.id;
		var update = req.body;
		update.name = update.name.charAt(0).toUpperCase()+update.name.slice(1);
		update.description = update.description.charAt(0).toUpperCase()+update.description.slice(1);

		Ruta.findByIdAndUpdate(rutaId, update, {new:true}, (err, rutaUpdated) => {
			if(err) return res.status(500).send({message: 'Error en el Servidor'});

			if(!rutaUpdated) return res.status(404).send({message: 'El id de la Ruta no existe.'});

			return res.status(200).send({
				ruta: rutaUpdated,
				message: "Ruta Actualizada Correctamente"
			});
		});

	},

	deleteRuta: function(req, res){
		var rutaId = req.params.id;
		Ruta.findById(rutaId, (err, ruta) =>
		{
			if(err) return res.status(500).send({message: 'Error en el Servidor'});

			if(!ruta) return res.status(404).send({message: 'El id de la Ruta no existe.'});

			Publication.find({rutaID:rutaId}, (err, publications) =>{
				if(publications.length>0)
				{
					for(var j=0; j<publications.length;j++)
					{
						Like.remove({publicationID : publications[j]._id},(err, likeRemoved) =>{});
						Coment.remove({publicationID : publications[j]._id},(err, likeRemoved) =>{});
					}
					Publication.remove({rutaID:rutaId},(err,publicationsRemoved)=>{
						if(err) return res.status(500).send({message: 'No se ha podido borrar las publicaciones del usuario'});
					});
				}
			});
			

			ruta.remove((err,rutaRemoved)=>
			{
				return res.status(200).send({
					ruta: rutaRemoved,
					message: "Ruta Eliminada Correctamente"
				});
			});
		});
	},

	deleteRutas: function(req, res){
			
		Ruta.find((err, rutas) =>
		{
			if(rutas.length>0)
			{
				for(var i=0; i<rutas.length;i++)
				{
					Publication.find({rutaID:rutas[i]._id}, (err, publications) =>
					{
						if(publications.length>0)
						{
							for(var j=0; j<publications.length;j++)
							{
								Like.remove({publicationID : publications[j]._id},(err, likeRemoved) =>{
								});
								Coment.remove({publicationID : publications[j]._id},(err, comentRemoved) =>{
								});
							}
							
							Publication.remove({rutaID:rutas[i-1]._id},(err,publicationsRemoved)=>{
							});
						}
					});
				}
			}

			Ruta.remove((err, rutasRemoved) =>
			{
				if(rutasRemoved) return res.status(200).send({
					rutas: rutasRemoved,
					message: "Rutas Eliminadas Correctamente"
				});
			});
		});

	},
};

module.exports = controller;