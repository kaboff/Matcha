module.exports = function(app, io, connection){
	var age = require('../class/age.js');
	var crypto = require('crypto');
	var randtoken = require('rand-token');
	var request = require('request');

	app.get('/', function(req, res){
		if (req.session && (req.session.valid == 'good' || req.session.valid == 'not'))
		{
			var message = req.session.valid;
			req.session.destroy();
			res.render('index', {confirm: true, msg: message});
		}
		else if (req.session && (req.session.valid == 'new_mail'))
		{
			var message = req.session.valid;
			req.session.destroy();
			res.render('index', {confirm: true, msg: message});		
		}
		else if (req.session && req.session.user)
			res.redirect('meetal');
		else
			res.render('index', {confirm: false, msg: ''});
	});

	app.post('/', function(req, res){
		var finish = false;
		var regex_mdp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,15}$/;
      	var regex_mail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
      	var regex_login = /^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9]){2,10}[a-zA-Z0-9]$/i;
      	var regex_name = /^([a-zàáâãäåçèéêëìíîïðòóôõöøùúûüýÿ](-| |')?){2,20}[a-zàáâãäåçèéêëìíîïðòóôõöøùúûüýÿ]$/i;
		if (req.body.iam == "homme" || req.body.iam == "femme")
		{	         
			if (req.body.orientation == "hetero" || req.body.orientation == "bisexuel" || req.body.orientation == "gay" || req.body.orientation == "")
			{
				var day = req.body.day;
			  	var month = req.body.month;
			  	var years = req.body.years;
			  	var date = month+'/'+day+'/'+years;
			  	var msg = age.isValidDate(date);
			  	var save_date = years+'/'+month+'/'+day;
			  	if (!msg)
				{
					if (age.getage(new Date(date)) >= 18)
					{
						if (req.body.orientation == "")
							req.body.orientation = 'bisexuel'
						finish = true;
					}
					else
						res.send({success: false, message: "Vous n'êtes pas majeur"});
				}
				else
					res.send({success: false, message: msg});
			}
			else
				res.send({success: false, message: "Une erreur est survenu sur l'orientation choisis"});
		}
	 	else
	 	{
	 		res.send({success: false, message: "Vous n'avez pas choisis votre sexe"});
		}
		if (finish && regex_mail.test(req.body.email) && regex_login.test(req.body.login) && regex_name.test(req.body.name)
			&& regex_name.test(req.body.surname) && regex_mdp.test(req.body.mdp) && regex_mdp.test(req.body.mdpsure))
		{
			if (save_date && req.body.iam && req.body.orientation)
			{
				if (req.body.iam == 'femme')
					var iam = 1;
				else if (req.body.iam == 'homme')
					var iam = 2;
				if (req.body.orientation == 'hetero')
					var orientation = 1;
				else if (req.body.orientation == 'bisexuel')
					var orientation = 2;
				else if (req.body.orientation == 'gay')
					var orientation = 3;
				if (req.body.mdp == req.body.mdpsure)
				{
					var passwordHash = crypto.createHmac('sha256', req.body.mdp);
					var final_mdp = passwordHash.digest('hex');
					var token = randtoken.generate(48);
					var user_socket = crypto.createHmac('sha256', req.body.login).digest('hex');
					connection.query('SELECT user_email FROM users WHERE user_email=?', req.body.email, function(err, rows, fields) 
					{
						connection.query('SELECT user_login FROM users WHERE user_login=?', req.body.login, function(err, rows_login, fields) 
						{
							if (rows[0])
								res.send({success: false, message: "Cette adresse-email existe deja"});
							else if (rows_login[0])
								res.send({success: false, message: "Ce pseudo est déjà utilisé"});
							else
							{
								request('http://ip-api.com/json', function (error, response, body_city) {
									request('https://maps.googleapis.com/maps/api/geocode/json?address='+JSON.parse(body_city).zip+'&components=country:fr', function (error, response, body) {
									  if (!error && response.statusCode == 200) {
									  	var user_create = [req.body.email, req.body.login, req.body.name, req.body.surname, save_date, JSON.parse(body_city).zip, JSON.parse(body)['results'][0].geometry.location.lat, JSON.parse(body)['results'][0].geometry.location.lng, iam, orientation, final_mdp, token, 0, user_socket];
											connection.query('INSERT INTO users (user_email, user_login, user_name, user_surname, user_birth, user_city, user_lat, user_lon, user_sex, user_orientation, user_mdp, user_key, user_valid, user_socket) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', user_create, function(err, rows, fields) {
												if (err)
												{
													res.send({success: false, message: "Une erreur est survenu"});
												}
												else
												{
													var msg_body;
													msg_body = '<html><body>';
													msg_body += '<table rules="all" style="border-color: #666;" cellpadding="10">';  
													msg_body += "<tr><td><strong>Merci de vous etes inscrit sur Meetal, pour valider votre compte cliquez sur le lien ci-dessous :<br>http://localhost:3000/inscription_send/" + token +"</strong> </td><td></td></tr>";
													msg_body += "</table>";
													msg_body += "</body></html>";
													var Email = require('email').Email
													var myMsg = new Email(
													{ from: "kaboffbeta@gmail.com"
													, to:   req.body.email
													, subject: "Validation de votre compte Meetal"
													, body: msg_body
													, bodyType: 'html'
													})
													myMsg.send(function(err){ if (err) res.send({success: false, message: "Une erreur est survenu"}); else res.send({success: false, message: "Votre inscription est complété"}); })
												}
											});
										}
									})
								});
							}
						});
					});
				}
				else
					res.send({success: false, message: "Veuillez confirmer votre mot de passe"});
			}
			else
				res.send({success: false, message: "Une erreur est survenu"});
		}
		else if (finish)
			res.send({success: false, message: "Une erreur est survenu sur vos champs"});
	});

	app.post('/login', function(req, res)
	{
		var array = [req.body.login];
		connection.query('SELECT * FROM users WHERE user_login=?', array, function(err, rows, fields)
		{
			if (rows && rows[0])
			{
				if (rows[0]['user_valid'])
				{
					var passwordHash = crypto.createHmac('sha256', req.body.pass);
					var mdp_log = passwordHash.digest('hex');
					if (rows[0]['user_mdp'] == mdp_log)
					{
						var array_user = {	
											id:  			rows[0]['user_id'],
											login: 			rows[0]['user_login'],
											sex: 			rows[0]['user_sex'],
											birth: 			age.getage(rows[0]['user_birth']),
											orientation: 	rows[0]['user_orientation'],
											socket_key: 	rows[0]['user_socket'],
											lat: 			rows[0]['user_lat'],
											lon: 			rows[0]['user_lon'],
											snap: 			rows[0]['user_snap_profile']
										};
						req.session.user = array_user;
						res.send({success: true});
					}
					else
						res.send({success: false, message: "Pseudo ou mot de passe incorrect"});
				}
				else
					res.send({success: false, message: "Vous devez valider votre compte avant de vous connecter."});
			}
			else
				res.send({success: false, message: "Pseudo ou mot de passe incorrect"});
		});
	});

	app.get('/mdp_lost/:token', function(req, res)
	{
		connection.query('SELECT user_id FROM users WHERE user_key=?', req.params.token, function(err, rows, fields)
		{
			if (rows && rows[0])
				res.render('mdp_lost', {find: true, token: req.params.token});
			else
				res.render('index', {confirm: false, msg: ''});
		});
	});

	app.post('/mdp_lost', function(req, res)
	{
		connection.query('SELECT user_id, user_key FROM users WHERE user_email=?', req.body.mymail, function(err, rows, fields)
		{
			if (rows && rows[0])
			{
				var Email = require('email').Email
				var myMsg = new Email(
				{ 
					from: "kaboffbeta@gmail.com"
					, to:   req.body.mymail
					, subject: "Mot de passe oublie"
					, body: "Pour changer votre mot de passe veuillez cliquez sur lien ci-dessous : http://localhost:3000/mdp_lost/" + rows[0].user_key
				});	
				myMsg.send(function(err){ 
					if (err) 	res.send({success: false}); 
					else 		res.send({success: true});
				});
			}
			else
				res.send({success: false}); 
		});
	});

	app.post('/new_pass/:token', function(req, res)
	{
		connection.query('SELECT user_id, user_key FROM users WHERE user_key=?', req.params.token, function(err, rows, fields)
		{
			if (rows && rows[0])
			{
				var regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/;
      			if (regex.test(req.body.pass) && regex.test(req.body.confirm))
      			{
      				if (req.body.pass == req.body.confirm)
      				{
      					var passwordHash = crypto.createHmac('sha256', req.body.pass);
						var final_mdp = passwordHash.digest('hex');
      					var token = randtoken.generate(48);
      					connection.query('UPDATE users SET ? WHERE ?', [{user_mdp: final_mdp, user_key: token}, {user_key: req.params.token}]);
      					res.send({success: true}); 
      				}
      				else
      					res.send({success: false}); 
      			}
      			else
					res.send({success: false}); 
			}
			else
				res.send({success: false}); 
		});
	});
}
