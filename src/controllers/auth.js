'use strict'

const User = require('../models/user');
const service = require('../services/auth');

var controller = {

	signUp: function (req, res)
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

					user.save( (err) =>
					{
						if (err)
						{
							return res.status(500).send({
								message: `Error al crear el usuario: ${err}`,
							});
						}
						return res.status(201).send({
							token: service.createToken(user),
							user
						});
					});
				}
			}
		);
	},

	signIn: function (req, res)
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
				if (user.length<=0)
				{
					return res.status(404).send({ message: 'No existe el email del usuario' });
				}else
				{
					if(req.body.password!=user[0].password){
						return res.status(404).send({ message: 'La contraseña no coincide' });
					}else
					{
						req.user = user;
						res.status(200).send(
						{
							message: 'Te has logueado correctamente',
							user,
							token: service.createToken(user)
						});
					}
				}
			}
		);
	}

}

module.exports = controller;