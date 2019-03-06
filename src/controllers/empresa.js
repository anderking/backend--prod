'use strict'

var Empresa = require('../models/empresa');
var Persona = require('../models/persona');
var moment = require('moment');

var controller = {
	
	saveEmpresa: function(req, res)
	{	
		Empresa.find
		(
			{
				rif: req.body.rif
			},
			(error, result) =>
			{
				if (error)
				{
					return res.status(500).send({ message: error });
				}
				
				if (result.length>0)
				{
					return res.status(404).send({ message: 'El rif del Usuario ya esta registrado' });
				}else
				{
					Empresa.find
					(
						{
							userID: req.body.userID	
						},
						(error,result) =>
						{
							if (error)
							{
								return res.status(500).send({ message: error });
							}

							if (result.length>0)
							{
								return res.status(404).send({ message: 'Este Usuario ya tiene una Empresa asociada' });
							}else
							{

								Persona.find
								(
									{
										userID: req.body.userID	
									},
									(error,result) =>
									{
										if (error)
										{
											return res.status(500).send({ message: error });
										}

										if (result.length>0)
										{
											return res.status(404).send({ message: 'Este Usuario ya tiene una Persona asociada' });
										}else
										{

											var params = req.body;

											const empresa = new Empresa({
												name: params.name,
												rif: params.rif,
												telefono: params.telefono,
												direccion: params.direccion,
												estado: params.estado.charAt(0).toUpperCase()+params.estado.slice(1),
												userID: params.userID,
											});
											

											empresa.save((err, empresaStored) =>
											{
												if(err) return res.status(500).send({message: 'Error en el Servidor.'});

												if(!empresaStored) return res.status(404).send({message: 'No se ha podido guardar la Empresa asociada al Usuario'});
												
												return res.status(200).send({
													empresa: empresaStored,
													message: "Empresa asociada al Usuario creada satisfactoriamente"
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

	getEmpresa: function(req, res){
		var userID = req.params.id;

		if(userID == null) return res.status(404).send({message: 'La Empresa asociada al Usuario no existe.'});

		Empresa.find({userID: userID}, (err, empresa) => {
			if(err) return res.status(500).send({message: 'Error en el Servidor.'});

			if(!empresa) return res.status(404).send({message: 'El id de la empresa asociada al Usuario no existe.'});

			empresa = empresa[0];
			return res.status(200).send({
				empresa
			});

		});
	},

	getEmpresas: function(req, res){
		
		Empresa.find()
		.sort('-_id').exec((err, empresas) => {

			if(err) return res.status(500).send({message: 'Error en el Servidor.'});

			if(!empresas) return res.status(404).send({message: 'No hay empresas que mostrar.'});

			return res.status(200).send({empresas});
		});


	},

	updateEmpresa: function(req, res){
		var empresaId = req.params.id;
		var update = req.body;

		Empresa.findByIdAndUpdate(empresaId, update, {new:true}, (err, empresaUpdated) => {
			if(err) return res.status(500).send({message: 'Error en el Servidor'});

			if(!empresaUpdated) return res.status(404).send({message: 'La Empresa asociada al Usuario no existe.'});

			return res.status(200).send({
				empresa: empresaUpdated,
				message: "Datos actualizados correctamente"
			});
		});

	},

	deleteEmpresa: function(req, res){
		var empresaId = req.params.id;
		Empresa.findByIdAndRemove(empresaId, (err, empresaRemoved) => {
			if(err) return res.status(500).send({message: 'Error en el Servidor'});

			if(!empresaRemoved) return res.status(404).send({message: "La Empresa asociada al Usuario no existe."});

			return res.status(200).send({
				empresa: empresaRemoved,
				message: "Empresa asociada al Usuario eliminada correctamente"
			});
		});
	},

};

module.exports = controller;