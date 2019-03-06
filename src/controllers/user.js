'use strict'

var User = require('../models/user');
var Publication = require('../models/publication');
var Persona = require('../models/persona');
var Empresa = require('../models/empresa');
var Like = require('../models/like');
var Coment = require('../models/coment');
var Calificacion = require('../models/calificacion');

var fs = require('fs');
var path = require('path');

var controller = {

	saveUser: function(req, res)
	{
		User.find
		(
			{
				email: req.body.email
			},
			(err, user) =>
			{
				if (err)
				{
					return res.status(500).send({ message: err });
				}
				if(req.body.email==undefined){
					return res.status(404).send({ message: 'No se encuentra el campo email en el formulario' });	
				}
				if(req.body.password==undefined){
					return res.status(404).send({ message: 'No se encuentra el campo password en el formulario' });	
				}
				if(req.body.tipo==undefined){
					return res.status(404).send({ message: 'No se encuentra el campo tipo en el formulario' });	
				}
				if (user.length>0)
				{
					return res.status(404).send({ message: 'El email del usuario ya esta registrado' });
				}else
				{
					const user = new User(
					{
						email: req.body.email,
						password: req.body.password,
						tipo: req.body.tipo,
						description: req.body.description,
					});

					user.save((err, userStored) =>
					{
						if(err) return res.status(500).send({message: 'Error en el Servidor.'});

						if(!userStored) return res.status(404).send({message: 'No se puede guardar el usuario'});
						
						return res.status(200).send({
							user: userStored,
							message: "Usuario Creado Correctamente"
						});
					});
				}
			}
		);
	},

	getUser: function(req, res){
		var userId = req.params.id;

		if(userId == null) return res.status(404).send({message: 'El Usuario no existe.'});

		User.findById(userId, (err, user) => {

			if(err) return res.status(500).send({message: 'Error en el Servidor.'});

			if(!user) return res.status(404).send({message: 'El id del Usuario no existe.'});

			return res.status(200).send({
				user
			});

		});
	},

	getUsers: function(req, res){

		User.find({}).sort('-_id').exec((err, users) => {

			if(err) return res.status(500).send({message: 'Error en el Servidor.'});

			if(!users) return res.status(404).send({message: 'No hay Usuarios que mostrar.'});

			return res.status(200).send({users});
		});

	},

	getUsersExcept: function(req, res){
		var userId = req.params.id;

		User.find
		(
			{ "_id": { $ne: userId } }
		).sort('-_id').exec((err, users) => {

			if(err) return res.status(500).send({message: 'Error en el Servidor.'});

			if(!users) return res.status(404).send({message: 'No hay Usuarios que mostrar.'});

			return res.status(200).send({users});
		});

	},

	updateUser: function(req, res){
		var userId = req.params.id;
		var update = req.body;

		User.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdated) => {
			if(err) return res.status(500).send({message: 'Error en el Servidor'});
			
			if(!userUpdated) return res.status(404).send({message: 'Id del usuario no existe'});

			return res.status(200).send({
				user: userUpdated,
				message: "Datos Actualizados Correctamente"
			});
		});

	},

	deleteUser: function(req, res){
		var userId = req.params.id;

		User.findById(userId, (err, user) =>
		{
			if(err) return res.status(500).send({message: 'Error en el Servidor'});

			if(!user) return res.status(404).send({message: "Id del usuario no existe."});
			
			Publication.find({userID:userId}, (err, publications) =>{
				if(publications.length>0)
				{
					for(var j=0; j<publications.length;j++)
					{
						Like.remove({publicationID : publications[j]._id},(err, likeRemoved) =>{
						});
						Coment.remove({publicationID : publications[j]._id},(err, comentRemoved) =>{
						});
					}
					if(user.tipo!="admin")
					{
						Publication.remove({userID:userId},(err,publicationsRemoved)=>
						{
							if(err) return res.status(500).send({message: 'No se ha podido borrar las publicaciones del usuario'});
						});
					}
				}
			});
			
			Coment.remove({userID : userId},(err, comentRemoved) =>{
			});
			Like.remove({userID : userId},(err, comentRemoved) =>{
			});
			Calificacion.remove({userEmisorID : userId},(err, calificationRemoved) =>{
			});

			Persona.remove({userID:userId}, (err, personaRemoved) =>
			{
				if(err) return res.status(500).send({message: 'No se ha podido borrar la persona asociada al usuario'});
			});

			Empresa.remove({userID:userId}, (err, empresaRemoved) =>
			{
				if(err) return res.status(500).send({message: 'No se ha podido borrar la empresa asociada al usuario'});
			});
			
			user.remove((err,userRemoved)=>
			{
				return res.status(200).send({
					user: userRemoved,
					message: "Usuario Eliminado Correctamente"
				});
			});
		});
	},

	deleteUsers: function(req, res)
	{	
		var userId = req.params.id;

		User.find({ "_id": { $ne: userId } }, (err, users) =>
		{
			if(users.length>0)
			{
				for(var i=0; i<users.length;i++)
				{
					Persona.remove({userID:users[i]._id},(err,personaRemoved)=>{
					});
					
					Empresa.remove({userID:users[i]._id},(err,empresaRemoved)=>{
					});

					Publication.find({userID:users[i]._id}, (err, publications) =>{
						if(publications.length>0)
						{
							for(var j=0; j<publications.length;j++)
							{
								Like.remove({publicationID : publications[j]._id},(err, likeRemoved) =>{
								});
								Coment.remove({publicationID : publications[j]._id},(err, comentRemoved) =>{
								});
							}
							
							if(users[i-1].tipo!="admin")
							{
								Publication.remove({userID:users[i-1]._id},(err,publicationsRemoved)=>{
								});
							}
						}
					});

					Coment.remove({userID : users[i]._id},(err, comentRemoved) =>{
					});
					Like.remove({userID : users[i]._id},(err, comentRemoved) =>{
					});
					Calificacion.remove({userEmisorID : users[i]._id},(err, comentRemoved) =>{
					});
				}
				User.remove({ "_id": { $ne: userId } }, (err, usersRemoved) =>
				{	
					if(users) return res.status(200).send({
						users: users,
						message: 'Usuarios Eliminados Correctamente'
					});
				});
			}
		});

	},

	uploadImage: function(req, res){
		var userId = req.params.id;
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
				User.findByIdAndUpdate(userId, {image: fileName}, {new: true}, (err, userUpdated) =>
				{
					if(err) return res.status(500).send({message: 'La imagen no se ha subido'});

					if(!userUpdated) return res.status(404).send({message: 'El usuario no existe y no se ha asignado la imagen'});

					return res.status(200).send({
						project: userUpdated
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

	getImageFile: function(req, res){
		var file = req.params.image; //Capturo el nombre del archivo con su extension
		var path_file = './img/'+file; // le agrego el prefijo en donde se guardan
		fs.exists(path_file, (exists) => {
			if(exists){
				return res.sendFile(path.resolve(path_file)); //devuelvo la ruta completa de la img desde la raiz
			}else{
				return res.status(200).send({
					message: "No existe la imagen..."
				});
			}
		});
	}


};

module.exports = controller;