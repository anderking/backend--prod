'use strict'

var Categoria = require('../models/categoria');
var Publication = require('../models/publication');
var Like = require('../models/like');
var Coment = require('../models/coment');

var controller = {
	
	saveCategoria: function(req, res)
	{
		Categoria.find
		(
			{
				name: req.body.name.charAt(0).toUpperCase()+req.body.name.slice(1)
			},
			(err, categoria) =>
			{
				if (err)
				{
					return res.status(500).send({ message: err });
				}

				if (categoria.length>0)
				{
					return res.status(404).send({ message: 'El nombre de la categoria ya está registrada' });
				}else
				{
					var categoria = new Categoria();
					var params = req.body;

					categoria.name = params.name.charAt(0).toUpperCase()+params.name.slice(1);
					categoria.description = params.description.charAt(0).toUpperCase()+params.description.slice(1);

					categoria.save((err, categoriaStored) => {
						if(err) return res.status(500).send({message: 'Error en el Servidor.'});

						if(!categoriaStored) return res.status(404).send({message: 'No se ha podido guardar la Categoria.'});

						return res.status(200).send({
							categoria: categoriaStored,
							message: "Categoria Creada Correctamente"
						});
					});
				}
			}
		);
	},

	getCategoria: function(req, res)
	{
		var categoriaId = req.params.id;

		if(categoriaId == null) return res.status(404).send({message: 'La Categoria no existe.'});

		Categoria.findById(categoriaId, (err, categoria) => {

			if(err) return res.status(500).send({message: 'Error en el Servidor.'});

			if(!categoria) return res.status(404).send({message: 'El id de la Categoria no existe.'});
			return res.status(200).send({
				categoria
			});

		});
	},


	getCategorias: function(req, res)
	{
		
		Categoria.find()
		.populate('userID')
		.sort('-_id').exec((err, categorias) => {

			if(err) return res.status(500).send({message: 'Error en el Servidor.'});

			if(!categorias) return res.status(404).send({message: 'No hay Categorias que mostrar.'});

			return res.status(200).send({categorias});

		});

	},


	getpublicationsCategoria: function(req, res)
	{	
		var categoriaID = req.params.id;
		
		if(categoriaID == null) return res.status(404).send({message: 'No se encuentra el parametro categoriaID.'});

		Publication.find({categoriaID: categoriaID}, (err, publicationsCategoria) => {

			if(err) return res.status(500).send({message: 'Error en el servidor.'});

			if(!publicationsCategoria) return res.status(404).send({message: 'El id de la Publicación no existe.'});

			return res.status(200).send({
				publicationsCategoria
			});

		})
		.populate('userID')
		.populate('categoriaID')
		.populate('rutaID')
		.sort('-_id');

	},

	updateCategoria: function(req, res)
	{
		var categoriaId = req.params.id;
		var update = req.body;
		
		update.name = update.name.charAt(0).toUpperCase()+update.name.slice(1);
		update.description = update.description.charAt(0).toUpperCase()+update.description.slice(1);


		Categoria.findByIdAndUpdate(categoriaId, update, {new:true}, (err, categoriaUpdated) => {
			if(err) return res.status(500).send({message: 'Error en el Servidor'});

			if(!categoriaUpdated) return res.status(404).send({message: 'El id de la Categoria no existe.'});

			return res.status(200).send({
				categoria: categoriaUpdated,
				message: "Categoria Actualizada Correctamente"
			});
		});

	},

	deleteCategoria: function(req, res)
	{
		var categoriaId = req.params.id;
		Categoria.findById(categoriaId, (err, categoria) =>
		{
			if(err) return res.status(500).send({message: 'Error en el Servidor'});

			if(!categoria) return res.status(404).send({message: 'El id de la Categoria no existe.'});

			Publication.find({categoriaID:categoriaId}, (err, publications) =>{
				if(publications.length>0)
				{
					for(var j=0; j<publications.length;j++)
					{
						Like.remove({publicationID : publications[j]._id},(err, likeRemoved) =>{});
						Coment.remove({publicationID : publications[j]._id},(err, likeRemoved) =>{});
					}
					Publication.remove({categoriaID:categoriaId},(err,publicationsRemoved)=>{
						if(err) return res.status(500).send({message: 'No se ha podido borrar las publicaciones del usuario'});
					});
				}
			});
			

			categoria.remove((err,categoriaRemoved)=>
			{
				return res.status(200).send({
					categoria: categoriaRemoved,
					message: "Categoría Eliminada Correctamente"
				});
			});
		});
	},


	deleteCategorias: function(req, res){
			
		Categoria.find((err, categorias) =>
		{
			if(categorias.length>0)
			{
				for(var i=0; i<categorias.length;i++)
				{
					Publication.find({categoriaID:categorias[i]._id}, (err, publications) =>
					{
						if(publications.length>0)
						{
							for(var j=0; j<publications.length;j++)
							{
								Like.find({publicationID : publications[j]._id},(err, likeRemoved) =>{});
								Coment.find({publicationID : publications[j]._id},(err, comentRemoved) =>{});
							}
							
							Publication.find({categoriaID:categorias[i-1]._id},(err,publicationsRemoved)=>{
								console.log(publicationsRemoved);
							});
						}
					});
				}
			}

			Categoria.find((err, categoriasRemoved) =>
			{
				if(categoriasRemoved) return res.status(200).send({
					categorias: categoriasRemoved,
					message: "Categorías Eliminadas Correctamente"
				});
			});
		});
	},

};

module.exports = controller;