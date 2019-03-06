'use strict'

var Calificacion = require('../models/calificacion');
var User = require('../models/user');

var controller =
{
	upCalificacion: function(req, res)
	{
		Calificacion.find
		(
			{
			    userEmisorID : { $in: [req.body.userEmisorID] },
			    userReceptorID : { $in: [req.body.userReceptorID] }
			},
			(err, calificacion) =>
			{
				if (err)
				{
					return res.status(500).send({ message: "Error en el Servidor" });
				}
				if(req.body.userEmisorID==undefined){
					return res.status(404).send({ message: 'No se encuentra el campo userEmisorID en la solicitud' });	
				}
				if(req.body.userReceptorID==undefined){
					return res.status(404).send({ message: 'No se encuentra el campo userReceptorID en la solicitud' });	
				}
				if(req.body.value==undefined){
					return res.status(404).send({ message: 'No se encuentra el campo value en la solicitud' });	
				}
				if(req.body.userEmisorID==req.body.userReceptorID){
					return res.status(404).send({ message: 'No puedes calificarte a ti mismo' });	
				}
				if(calificacion.length>0)
				{
					return res.status(404).send({ message: 'Ya calificaste a este usuario' });
				}
				else
				{
					var calificacion = new Calificacion();
					var params = req.body;

					calificacion.userEmisorID = params.userEmisorID;
					calificacion.userReceptorID = params.userReceptorID;
					calificacion.value = params.value;

					calificacion.save((err, calificacionStored) =>
					{
						if(err) return res.status(500).send({message: 'Error en Servidor.'});

						if(!calificacionStored) return res.status(404).send({message: 'No se ha podido guardar la calificacion.'});

						return res.status(200).send({
							calificacion: calificacionStored,
							message: "Calificacion Guardada"
						});
					});
				}
			}
		)
	},


	isCalificacion: function(req, res)
	{
		Calificacion.find
		(
			{
			    userEmisorID : { $in: [req.params.idE] },
			    userReceptorID : { $in: [req.params.idR] }
			},
			(err, calificacion) =>
			{
				if (err) return res.status(500).send({ message: err });
				
				if(calificacion.length<=0) return res.status(200).send(false);

				return res.status(200).send(true);
			}
		)
	},


	getCalificacion: function(req, res)
	{
		Calificacion.find
		(
			{
			    userEmisorID : { $in: [req.params.idE] },
			    userReceptorID : { $in: [req.params.idR] }
			},
			(err, calificacion) =>
			{
				if (err) return res.status(500).send({ message: err });
				
				if(!calificacion) return res.status(200).send({
					message: 'No existe la calificacion'
				});

				calificacion = calificacion[0];

				if(calificacion) return res.status(200).send({
					calificacion : calificacion
				});

			}
		)
	},

	updateCalificacion: function(req, res)
	{
		var calificacionId = req.params.id;
		
		Calificacion.findByIdAndUpdate(calificacionId,{value: req.body.value }, {new:true}, (err, calificacionUpdated) => {
			if(err) return res.status(500).send({message: 'Error en el Servidor'});

			if(!calificacionUpdated) return res.status(404).send({message: 'El id de la Calificacion no existe.'});

			return res.status(200).send({
				categoria: calificacionUpdated,
				message: "Calificación Actualizada Correctamente"
			});
		});

	},

	getCalificacionesR: function(req, res)
	{	
		var userReceptorID = req.params.idR;
		
		if(userReceptorID == null) return res.status(404).send({message: 'No se encuentra el parametro userReceptorID.'});

		Calificacion.find({userReceptorID: userReceptorID}, (err, calificacionesR) => {

			if(err) return res.status(500).send({message: 'Error en el servidor.'});

			if(!calificacionesR) return res.status(404).send({message: 'El id de la Publicación no existe.'});

			return res.status(200).send({
				calificacionesR
			});

		})
		.populate('userEmisorID')
		.populate('userReceptorID');
	},

};

module.exports = controller;