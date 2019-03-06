'use strict'

var Persona = require('../models/persona');
var Empresa = require('../models/empresa');
var moment = require('moment');

var controller = {
	
	savePersona: function(req, res)
	{	
		Persona.find
		(
			{
				cedula: req.body.cedula
			},
			(error, result) =>
			{
				if (error)
				{
					return res.status(500).send({ message: error });
				}
				
				if (result.length>0)
				{
					return res.status(404).send({ message: 'La cedula del Usuario ya esta registrada' });
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

											var params = req.body;

											const persona = new Persona({
												name: params.name,
												cedula: params.cedula,
												telefono: params.telefono,
												direccion: params.direccion,
												estado: params.estado.charAt(0).toUpperCase()+params.estado.slice(1),
												sexo: params.sexo.charAt(0).toUpperCase(),
												edoCivil: params.edoCivil.charAt(0).toUpperCase(),
												fechaNacimiento: params.fechaNacimiento,
												userID: params.userID,
											});

											persona.save((err, personaStored) =>
											{
												if(err) return res.status(500).send({message: 'Error en el Servidor.'});

												if(!personaStored) return res.status(404).send({message: 'No se ha podido guardar la Persona asociada al Usuario'});
												
												return res.status(200).send({
													persona: personaStored,
													message: "Persona asociada al Usuario creada satisfactoriamente"
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

	getPersona: function(req, res){
		var userID = req.params.id;

		if(userID == null) return res.status(404).send({message: 'La Persona asociada al Usuario no existe.'});

		Persona.find({userID: userID}, (err, persona) => {

			if(err) return res.status(500).send({message: 'Error en el Servidor.'});

			if(!persona) return res.status(404).send({message: 'El id de la persona asociada al Usuario no existe.'});
			
			persona = persona[0];
			return res.status(200).send({
				persona
			});

		});
	},

	getPersonas: function(req, res){
		
		Persona.find()
		.sort('-_id').exec((err, personas) => {

			if(err) return res.status(500).send({message: 'Error en el Servidor.'});

			if(!personas) return res.status(404).send({message: 'No hay Personas que mostrar.'});

			return res.status(200).send({personas});
		});


	},

	updatePersona: function(req, res){
		var personaId = req.params.id;
		var update = req.body;
		
		update.sexo = update.sexo.toUpperCase();
		update.edoCivil = update.edoCivil.toUpperCase();

		Persona.findByIdAndUpdate(personaId, update, {new:true}, (err, personaUpdated) => {
			if(err) return res.status(500).send({message: 'Error en el Servidor'});

			if(!personaUpdated) return res.status(404).send({message: 'La Persona asociada al Usuario no existe.'});

			return res.status(200).send({
				persona: personaUpdated,
				message: "Datos actualizados correctamente"
			});
		});

	},

	deletePersona: function(req, res){
		var personaId = req.params.id;
		Persona.findByIdAndRemove(personaId, (err, personaRemoved) => {
			if(err) return res.status(500).send({message: 'Error en el Servidor'});

			if(!personaRemoved) return res.status(404).send({message: "La Persona asociada al Usuario no existe."});

			return res.status(200).send({
				persona: personaRemoved,
				message: "Persona asociada al Usuario eliminada correctamente"
			});
		});
	},

};

module.exports = controller;