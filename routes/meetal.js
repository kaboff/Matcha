module.exports = function(app, io, connection, http){
	var crypto = require('crypto');
	var randtoken = require('rand-token');
	var request = require('request');
	var age = require('../class/age.js');
	var my_lib = require('../class/age.js');

	app.get('/meetal', function(req, res){
		if (req.session && req.session.user)
		{
			String.prototype.replaceAll = function(search, replacement) {
			    var target = this;
			    return target.split(search).join(replacement);
			};
			connection.query('SELECT user_sex, user_orientation, user_tags FROM users WHERE user_id = ?', req.session.user.id, function(err, sex)
			{
				if (sex[0]['user_sex'] == 1 && sex[0]['user_orientation'] == 1)
					var sql_complete = "AND user_sex = 2 AND (user_orientation = 1 OR user_orientation = 3)";
				else if (sex[0]['user_sex'] == 2 && sex[0]['user_orientation'] == 1)
					var sql_complete = "AND user_sex = 1 AND (user_orientation = 1 OR user_orientation = 3)";
				else if (sex[0]['user_sex'] == 1 && sex[0]['user_orientation'] == 2)
					var sql_complete = "AND user_sex = 1 AND (user_orientation = 2 OR user_orientation = 3)";
				else if (sex[0]['user_sex'] == 2 && sex[0]['user_orientation'] == 2)
					var sql_complete = "AND user_sex = 2 AND (user_orientation = 2 OR user_orientation = 3)";
				else if (sex[0]['user_sex'] == 1 && sex[0]['user_orientation'] == 3)
					var sql_complete = "AND (user_sex = 1 AND (user_orientation = 2 OR user_orientation = 3)) OR (user_sex = 2 AND (user_orientation = 1 OR user_orientation = 3))";
				else if (sex[0]['user_sex'] == 2 && sex[0]['user_orientation'] == 3)
					var sql_complete = "AND (user_sex = 1 AND (user_orientation = 1 OR user_orientation = 3)) OR (user_sex = 2 AND (user_orientation = 2 OR user_orientation = 3))";
				connection.query('SELECT user_id, user_login, user_birth, user_sex, user_city, user_lat, user_lon, user_orientation, user_biography, user_snap_profile, user_city_begin, user_connect, user_music, user_tags, user_last_activity, user_score, user_connect, user_last_activity FROM users WHERE user_id != ? AND user_valid = 1 AND user_last_activity != 0 AND user_id NOT IN (SELECT action_sender FROM actions WHERE action = "bloque" AND action_receiver = ?) AND user_id NOT IN (SELECT action_receiver FROM actions WHERE action = "bloque" AND action_sender = ?) '+sql_complete+' ORDER BY user_connect DESC, user_last_activity DESC', [req.session.user['id'], req.session.user['id'], req.session.user['id']], function(err, rows)
				{
					var array_tmp = [req.session.user['id'], req.session.user['id']];
					connection.query('SELECT * FROM actions WHERE action_receiver = ? OR action_sender = ?', array_tmp, function(err, my_action)
					{
						function distance(lat1, lon1, lat2, lon2) {
					            var radlat1 = Math.PI * lat1/180
					            var radlat2 = Math.PI * lat2/180
					            var radlon1 = Math.PI * lon1/180
					            var radlon2 = Math.PI * lon2/180
					            var theta = lon1-lon2
					            var radtheta = Math.PI * theta/180
					            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
					            dist = Math.acos(dist)
					            dist = dist * 180/Math.PI
					            dist = dist * 60 * 1.1515
					            dist = dist * 1.609344
					            return dist
					    }
						var array_all_user = [];
						for (var i = 0; rows[i]; i++) {
							if (!my_lib.bloque_or_not(req.session.user.id, rows[i]['user_id'], my_action) && req.session.user.id != rows[i]['user_id'])
							{
								array_all_user.push(
								{
									id: rows[i]['user_id'],
									login: rows[i]['user_login'],
									biography: rows[i]['user_biography'],
									sex: rows[i]['user_sex'],
									score: rows[i]['user_score'],
									age: my_lib.getage(new Date(rows[i]['user_birth'])),
									image: rows[i]['user_snap_profile'],
									connect: rows[i]['user_connect'],
									activity: my_lib.getTime(rows[i]['user_last_activity']),
									activity_nb: new Date(rows[i]['user_last_activity']).getTime() / 1000,
									key_id: crypto.createHmac('sha256', rows[i]['user_id'].toString()).digest('hex'),
									music: rows[i]['user_music'],
									tags: rows[i]['user_tags'] == null ? rows[i]['user_tags'] : rows[i]['user_tags'].replaceAll(' ','-'),
									same_tags: my_lib.tags(sex[0]['user_tags'], rows[i]['user_tags']),
									city: rows[i]['user_city'],
									city_hidden: rows[i]['user_city_begin'],
									distance: distance(req.session.user.lat, req.session.user.lon, rows[i]['user_lat'], rows[i]['user_lon']),
									match: my_lib.its_a_match_or_not(req.session.user.id, rows[i]['user_id'], my_action),
									me_like: my_lib.me_like(req.session.user.id, rows[i]['user_id'], my_action),
									you_like: my_lib.other_like(req.session.user.id, rows[i]['user_id'], my_action)
								});
							}
						};
						res.render('meetal', {user: req.session.user, row: rows, all_user: array_all_user, my_lib: my_lib, my_action: my_action});
					});
				});
			});
		}
		else
			res.redirect('/');
	});

	app.get('/logout', function(req, res)
	{
		if (req.session && req.session.user)
		{
			connection.query('UPDATE users SET ? WHERE ?', [{user_connect: 0}, {user_id: req.session.user.id}]);
			req.session.destroy();
			res.redirect('/');
		}
		else
			res.redirect('/');
	});

	app.get('/mypage', function(req, res)
	{
		if (req.session && req.session.user)
		{
			connection.query('SELECT * FROM users WHERE user_id=?', req.session.user.id, function(err, rows)
			{
				res.render('mypage', {user: req.session.user, row: rows, myClass: age});
			});
		}
		else
			res.redirect('/');
	});

	app.get('/edit_my_information', function(req, res)
	{
		if (req.session && req.session.user)
		{
			connection.query('SELECT * FROM users WHERE user_id=?', req.session.user.id, function(err, rows)
			{
				res.render('edit', {user: req.session.user, row: rows, age: age});
			});
		}
		else
			res.redirect('/');
	});

	app.post('/request_database', function(req, res)
	{
		if (req.session && req.session.user)
		{
			if (req.body.success && req.body.success == 'nice')
			{
				connection.query('SELECT * FROM users WHERE user_id=?', req.session.user.id, function(err, rows)
				{
					res.send({user: rows});
				});
			}
			else
				res.send({error : 'error'});
		}
		else
			res.send({error : 'error'});

	});

	app.post('/request_database_action', function(req, res)
	{
		var visite = 0;
		var like = 0;
		var message = 0;
		if (req.session && req.session.user)
		{
			if (req.body.success && req.body.success == 'nice')
			{
				connection.query('SELECT * FROM actions WHERE ? AND ?', [{action_receiver: req.session.user.id}, {action_see: 0}], function(err, rows)
				{
					if (rows)
					{
						for (var i = 0; rows[i]; i++) {
							if (rows[i]['action'] == 'like')
								like++;
							if (rows[i]['action'] == 'visite')
								visite++;
							if (rows[i]['action'] == 'message')
								message++;
						};
						res.send({actions: {visite, like, message}});
					}
					else
						res.send({error : 'error'});
				});
			}
			else
				res.send({error : 'error'});
		}
		else
			res.send({error : 'error'});
	});

	app.post('/profile_snap', function(req, res)
	{
		if (req.session && req.session.user)
		{
			if (req.body.success && req.body.success == 'nice')
			{
				connection.query('SELECT user_snap_profile, user_snap1, user_snap2, user_snap3, user_snap4, user_snap5 FROM users WHERE user_id=?', req.session.user.id, function(err, snap)
				{
					if (snap)
					{
					 	connection.query('UPDATE users SET ? WHERE ?', [{user_snap_profile: snap[0]['user_snap'+req.body.nb]}, {user_id: req.session.user.id}], function(err, row)
					 	{
					 		if (err)
					 			res.send({success: false, message: 'Une erreur est survenue.'});
					 		else
					 			res.send({success: true, message: 'Votre image de profil a bien été changé.'});
					 	});
					}
					else
						res.send({success: false, message: 'Une erreur est survenue.'});
				});
			}
			else
				res.send({success: false, message: 'Une erreur est survenue.'});
		}
		else
			res.send({success: false, message: 'Une erreur est survenue.'});
	});

	app.post('/delete_img', function(req, res){
		if (req.session && req.session.user)
		{
			connection.query('SELECT user_snap_profile, user_snap1, user_snap2, user_snap3, user_snap4, user_snap5 FROM users WHERE user_id=?', req.session.user.id, function(err, snap)
			{
				if (req.body.success && req.body.success == 'nice')
				{
					if (req.body.nb == 1)
					{
							if (snap[0]['user_snap_profile'] == snap[0]['user_snap1'])
							{
								var match_img = false;
								for (var i = 1; i < 6 && !match_img; i++) {
									if (i == 1)
										i++;
									if (snap[0]['user_snap'+i])
									{
										connection.query('UPDATE users SET ? WHERE ?', [{user_snap_profile: snap[0]['user_snap'+i], user_snap1: null}, {user_id: req.session.user.id}]);
										req.session.user.snap = snap[0]['user_snap'+i];
										match_img = true;
									}
								};
								if (!match_img)
								{
									connection.query('SELECT * FROM users WHERE user_id=?', req.session.user.id, function(err, rows)
									{
										connection.query('UPDATE users SET ? WHERE ?', [{user_snap_profile: null, user_snap1: null}, {user_id: req.session.user.id}]);
										req.session.user.snap = null;
										res.send({user: rows});
									});
								}
								else
									res.send({success: true});
							}
							else
							{
								connection.query('SELECT * FROM users WHERE user_id=?', req.session.user.id, function(err, rows)
								{
									connection.query('UPDATE users SET ? WHERE ?', [{user_snap1: null}, {user_id: req.session.user.id}]);
									req.session.user.snap = null;
									res.send({user: rows});
								});
							}
					}
					else if (req.body.nb == 2)
					{
							if (snap[0]['user_snap_profile'] == snap[0]['user_snap2'])
							{
								var match_img = false;
								for (var i = 1; i < 6 && !match_img; i++) {
									if (i == 2)
										i++;
									if (snap[0]['user_snap'+i])
									{
										connection.query('UPDATE users SET ? WHERE ?', [{user_snap_profile: snap[0]['user_snap'+i], user_snap2: null}, {user_id: req.session.user.id}]);
										req.session.user.snap = snap[0]['user_snap'+i];
										match_img = true;
									}
								};
								if (!match_img)
								{
									connection.query('SELECT * FROM users WHERE user_id=?', req.session.user.id, function(err, rows)
									{
										connection.query('UPDATE users SET ? WHERE ?', [{user_snap_profile: null, user_snap2: null}, {user_id: req.session.user.id}]);
										req.session.user.snap = null;
										res.send({user: rows});
									});
								}
								else
									res.send({success: true});
							}
							else
							{
								connection.query('SELECT * FROM users WHERE user_id=?', req.session.user.id, function(err, rows)
								{
									connection.query('UPDATE users SET ? WHERE ?', [{user_snap2: null}, {user_id: req.session.user.id}]);
									req.session.user.snap = null;
									res.send({user: rows});
								});
							}
					}
					else if (req.body.nb == 3)
					{
							if (snap[0]['user_snap_profile'] == snap[0]['user_snap3'])
							{
								var match_img = false;
								for (var i = 1; i < 6 && !match_img; i++) {
									if (i == 3)
										i++;
									if (snap[0]['user_snap'+i])
									{
										connection.query('UPDATE users SET ? WHERE ?', [{user_snap_profile: snap[0]['user_snap'+i], user_snap3: null}, {user_id: req.session.user.id}]);
										req.session.user.snap = snap[0]['user_snap'+i];
										match_img = true;
									}
								};
								if (!match_img)
								{
									connection.query('SELECT * FROM users WHERE user_id=?', req.session.user.id, function(err, rows)
									{
										connection.query('UPDATE users SET ? WHERE ?', [{user_snap_profile: null, user_snap3: null}, {user_id: req.session.user.id}]);
										req.session.user.snap = null;
										res.send({user: rows});
									});
								}
								else
									res.send({success: true});
							}
							else
							{
								connection.query('SELECT * FROM users WHERE user_id=?', req.session.user.id, function(err, rows)
								{
									connection.query('UPDATE users SET ? WHERE ?', [{user_snap3: null}, {user_id: req.session.user.id}]);
									req.session.user.snap = null;
									res.send({user: rows});
								});
							}
					}
					else if (req.body.nb == 4)
					{
							if (snap[0]['user_snap_profile'] == snap[0]['user_snap4'])
							{
								var match_img = false;
								for (var i = 1; i < 6 && !match_img; i++) {
									if (i == 4)
										i++;
									if (snap[0]['user_snap'+i])
									{
										connection.query('UPDATE users SET ? WHERE ?', [{user_snap_profile: snap[0]['user_snap'+i], user_snap4: null}, {user_id: req.session.user.id}]);
										req.session.user.snap = snap[0]['user_snap'+i];
										match_img = true;
									}
								};
								if (!match_img)
								{
									connection.query('SELECT * FROM users WHERE user_id=?', req.session.user.id, function(err, rows)
									{
										connection.query('UPDATE users SET ? WHERE ?', [{user_snap_profile: null, user_snap4: null}, {user_id: req.session.user.id}]);
										req.session.user.snap = null;
										res.send({user: rows});
									});
								}
								else
									res.send({success: true});
							}
							else
							{
								connection.query('SELECT * FROM users WHERE user_id=?', req.session.user.id, function(err, rows)
								{
									connection.query('UPDATE users SET ? WHERE ?', [{user_snap4: null}, {user_id: req.session.user.id}]);
									req.session.user.snap = null;
									res.send({user: rows});
								});
							}
					}
					else if (req.body.nb == 5)
					{
							if (snap[0]['user_snap_profile'] == snap[0]['user_snap5'])
							{
								var match_img = false;
								for (var i = 1; i < 6 && !match_img; i++) {
									if (i == 5)
										i++;
									if (snap[0]['user_snap'+i])
									{
										connection.query('UPDATE users SET ? WHERE ?', [{user_snap_profile: snap[0]['user_snap'+i], user_snap5: null}, {user_id: req.session.user.id}]);
										req.session.user.snap = snap[0]['user_snap'+i];
										match_img = true;
									}
								};
								if (!match_img)
								{
									connection.query('SELECT * FROM users WHERE user_id=?', req.session.user.id, function(err, rows)
									{
										connection.query('UPDATE users SET ? WHERE ?', [{user_snap_profile: null, user_snap5: null}, {user_id: req.session.user.id}]);
										req.session.user.snap = null;
										res.send({user: rows});
									});
								}
								else
									res.send({success: true});
							}
							else
							{
								connection.query('SELECT * FROM users WHERE user_id=?', req.session.user.id, function(err, rows)
								{
									connection.query('UPDATE users SET ? WHERE ?', [{user_snap5: null}, {user_id: req.session.user.id}]);
									req.session.user.snap = null;
									res.send({user: rows});
								});
							}
					}
					else
						res.send({success: false});
				}
			else
				res.send({success: false});
			});
		}
		else
			res.send({success: false});
	});

	app.post('/change_basic', function(req, res)
	{
		if (req.session && req.session.user)
		{
			if (req.body.success && req.body.success == 'nice')
			{	
				request('https://maps.googleapis.com/maps/api/geocode/json?address='+req.body.city+'&components=country:fr', function (error, response, body) {
					if (!error && response.statusCode == 200) {
						connection.query('UPDATE users SET ? WHERE ?', [{user_name: req.body.name, user_surname: req.body.surname, user_city: req.body.city, user_lat: JSON.parse(body)['results'][0].geometry.location.lat, user_lon: JSON.parse(body)['results'][0].geometry.location.lng}, {user_id: req.session.user.id}]);
					res.send({success: true});
				}});
			}
			else
				res.send({success: false});
		}
		else
			res.send({success: false});
	});

	app.post('/change_me', function(req, res)
	{
		if (req.session && req.session.user)
		{
			if (req.body.success && req.body.success == 'nice')
			{	
				req.body.description = req.body.description.trim();
				if (req.body.description == '')
					req.body.description = null;
				connection.query('UPDATE users SET ? WHERE ?', [{user_size: req.body.size, user_poid: req.body.poid, user_eyes: req.body.eyes, user_hairs: req.body.hairs, user_biography: req.body.description}, {user_id: req.session.user.id}]);
				res.send({success: true});
			}
			else
				res.send({success: false});
		}
		else
			res.send({success: false});
	});

	app.post('/change_gout', function(req, res)
	{
		if (req.session && req.session.user)
		{
			if (req.body.success && req.body.success == 'nice')
			{
				connection.query('UPDATE users SET ? WHERE ?', [{user_music: req.body.music, user_tags: req.body.tags}, {user_id: req.session.user.id}]);
				res.send({success: true});
			}
			else
				res.send({success: false});
		}
		else
			res.send({success: false});
	});

	app.post('/data_from_edit', function (req, res) {
		if (req.session && req.session.user)
		{
			connection.query('SELECT * FROM users WHERE user_id=?', req.session.user.id, function(err, rows)
			{
				res.send({ data: [{user: req.session.user, row: rows}]});
			});
		}
		else
			res.send({success: false});
	});

	app.post('/new_pass', function (req, res) {
		if (req.session && req.session.user)
		{
			if (req.body.success && req.body.success == 'nice')
			{
				var regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,15}$/;
				if (regex.test(req.body.mdp3) && regex.test(req.body.mdp1) && regex.test(req.body.mdp2))
				{
					var passwordHash3 = crypto.createHmac('sha256', req.body.mdp3);
					var final_mdp3 = passwordHash3.digest('hex');
					connection.query('SELECT * FROM users WHERE ? AND ?', [{user_id :req.session.user.id}, {user_mdp : final_mdp3}], function(err, rows)
					{
						if (rows[0])
						{
							var passwordHash1 = crypto.createHmac('sha256', req.body.mdp1);
							var passwordHash2 = crypto.createHmac('sha256', req.body.mdp2);
							var final_mdp1 = passwordHash1.digest('hex');
							var final_mdp2 = passwordHash2.digest('hex');
							if (final_mdp1 == final_mdp2)
							{
								connection.query('UPDATE users SET ? WHERE ?', [{user_mdp: final_mdp1}, {user_id: req.session.user.id}]);
								res.send({success: true});
							}
						}
						else
							res.send({success: false});
					});
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

	app.post('/pass_random', function (req, res) {
		if (req.session && req.session.user)
		{
			if (req.body.success && req.body.success == 'nice')
			{
				var regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,15}$/;
				if (regex.test(req.body.mdp_rand))
				{
					var passwordHash = crypto.createHmac('sha256', req.body.mdp_rand);
					var final_mdp = passwordHash.digest('hex');
					connection.query('SELECT * FROM users WHERE ? AND ?', [{user_id :req.session.user.id}, {user_mdp : final_mdp}], function(err, rows)
					{
						if (rows)
						{
							var token = randtoken.generate(10);
							while (!regex.test(token))
								var token = randtoken.generate(10);
							var passwordHash = crypto.createHmac('sha256', token);
							var final_mdp = passwordHash.digest('hex');
							var msg_body;
							msg_body = '<html><body>';
							msg_body += '<table rules="all" style="border-color: #666;" cellpadding="10">';  
							msg_body += "<tr><td><strong>Voici votre nouveau mot de passe aleatoire :<br>"+ token +"</strong> </td><td></td></tr>";
							msg_body += "</table>";
							msg_body += "</body></html>";
							var Email = require('email').Email
							var myMsg = new Email(
							{ from: "kaboffbeta@gmail.com"
							, to:   rows[0].user_email
							, subject: "Nouveau mot de passe"
							, body: msg_body
							, bodyType: 'html'
							})
							myMsg.send(function(err){ 
								if (err) 
									res.send({success: false, message: 'Une erreur est survenue.'});
								else 
								{
									connection.query('UPDATE users SET ? WHERE ?', [{user_mdp: final_mdp}, {user_id: req.session.user.id}]);
									res.send({success: true});
								}
							})
						}
						else
							res.send({success: false, message: 'Votre mot de passe est incorrect.'});
					});
				}
				else
					res.send({success: false, message: 'Votre mot de passe est incorrect.'});
			}
			else
				res.send({success: false, message: 'Une erreur est survenue.'});
		}
		else
			res.send({success: false, message: 'Une erreur est survenue.'});
	});

	app.post('/new_mail', function (req, res) {
		if (req.session && req.session.user)
		{
			if (req.body.success && req.body.success == 'nice')
			{
				var regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
				if (regex.test(req.body.new_mail))
				{
					connection.query('SELECT * FROM users WHERE user_id=?', req.session.user.id , function(err, rows)
					{
						if (rows)
						{
							if (rows[0]['user_email'] != req.body.new_mail)
							{
								var msg_body;
								msg_body = '<html><body>';
								msg_body += '<table rules="all" style="border-color: #666;" cellpadding="10">';  
								msg_body += "<tr><td><strong>Vous avez demander une nouvelle adresse email pour la valider cliquer sur le lien ci-dessous :<br>http://localhost:3000/new_mail/"+rows[0]['user_key']+"/"+req.body.new_mail+"</strong> </td><td></td></tr>";
								msg_body += "</table>";
								msg_body += "</body></html>";
								var Email = require('email').Email
								var myMsg = new Email(
								{ from: "kaboffbeta@gmail.com"
								, to:   req.body.new_mail
								, subject: "Nouvelle adresse email"
								, body: msg_body
								, bodyType: 'html'
								})
								myMsg.send(function(err){ 
									if (err) 
										res.send({success: false, message: 'Une erreur est survenue.'});
									else 
									{
										connection.query('UPDATE users SET ? WHERE ?', [{user_new_mail: req.body.new_mail}, {user_id: req.session.user.id}]);
										res.send({success: true});
									}
								})
							}
							else
								res.send({success: false, message: 'Cette adresse-email est déja votre email actuelle.'});
						}
						else
							res.send({success: false, message: 'Une erreur est survenue.'});
					});
				}
				else
					res.send({success: false, message: 'Votre nouvelle adresse email est incorrecte.'});
			}
			else
				res.send({success: false, message: 'Une erreur est survenue.'});
		}
		else
			res.send({success: false, message: 'Une erreur est survenue.'});
	});

	app.get('/new_mail/:key/:mymail', function(req, res){
		connection.query('SELECT user_id FROM users WHERE ? AND ?', [{user_key: req.params.key}, {user_new_mail: req.params.mymail}], function(err, rows, fields)
		{
			if (rows)
			{
				connection.query('UPDATE users SET ? WHERE ?', [{user_new_mail: null, user_email: req.params.mymail}, {user_id: rows[0]['user_id']}]);
				req.session.valid = 'new_mail';
				res.redirect('/');
			}
			else
			{
				req.session.valid = 'not';
				res.redirect('/');
			}
		});
	});

	app.post('/tags', function(req, res){
		if (req.session && req.session.user)
		{
			connection.query('SELECT user_tags FROM users', function(err, rows, fields)
			{
				var key = 0;
				var array_tag = [];
				var exists = false;
				while (rows[key])
				{
					if (rows[key]['user_tags'] != null)
					{
						var split = rows[key]['user_tags'].split(";");
						for (var i = 0; split[i]; i++) {
							for (var o = 0; array_tag[o]; o++) {
								if (array_tag[o].toLowerCase() == split[i].toLowerCase())
									exists = true;
							}
							if (!exists)
								array_tag.push(split[i].charAt(0).toUpperCase() + split[i].substring(1).toLowerCase());
							exists = false;
						}
					}
					key++;
				}
				res.send({all_tags: array_tag.sort()});
			});
		}
		else
			res.end();
	});

	app.get('/profile/:key', function(req, res){
		if (req.session && req.session.user)
		{
			if (req.session.user.sex == 1 && req.session.user.orientation == 1)
				var sql_complete = "user_sex = 2 AND (user_orientation = 1 OR user_orientation = 3)";
			else if (req.session.user.sex == 2 && req.session.user.orientation == 1)
				var sql_complete = "user_sex = 1 AND (user_orientation = 1 OR user_orientation = 3)";
			else if (req.session.user.sex == 1 && req.session.user.orientation == 2)
				var sql_complete = "user_sex = 1 AND (user_orientation = 2 OR user_orientation = 3)";
			else if (req.session.user.sex == 2 && req.session.user.orientation == 2)
				var sql_complete = "user_sex = 2 AND (user_orientation = 2 OR user_orientation = 3)";
			else if (req.session.user.sex == 1 && req.session.user.orientation == 3)
				var sql_complete = "(user_sex = 1 AND (user_orientation = 2 OR user_orientation = 3)) OR (user_sex = 2 AND (user_orientation = 1 OR user_orientation = 3))";
			else if (req.session.user.sex == 2 && req.session.user.orientation == 3)
				var sql_complete = "(user_sex = 1 AND (user_orientation = 1 OR user_orientation = 3)) OR (user_sex = 2 AND (user_orientation = 2 OR user_orientation = 3))";
			connection.query('SELECT * FROM users WHERE '+sql_complete, function(err, rows)
			{
				results = null;
				if (rows)
				{
					results_socket_key = null;
					for (var i = 0; rows[i]; i++) {
						if (crypto.createHmac('sha256', rows[i]['user_id'].toString()).digest('hex') == req.params.key)
						{
							results = rows[i]['user_id'];
							results_socket_key = rows[i]['user_socket'];
						}
					};
					if (results)
					{
						connection.query('SELECT * FROM users WHERE ? AND user_id NOT IN (SELECT action_sender FROM actions WHERE action = "bloque" AND action_receiver = ?) AND user_id NOT IN (SELECT action_receiver FROM actions WHERE action = "bloque" AND action_sender = ?)', [{user_id: results}, req.session.user.id, req.session.user.id] ,function(err, user_find)
						{
							if (user_find && user_find[0])
							{
								connection.query('SELECT * FROM actions WHERE ? AND ? AND ?', [{action: 'visite'}, {action_receiver: results}, {action_sender: req.session.user.id}] ,function(err, is_exists_row)
								{
									if (is_exists_row && !is_exists_row[0])
									{
										var today = new Date();
										var activity = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
										connection.query('INSERT INTO actions (action, action_receiver, action_sender, action_created_at) VALUES (?, ?, ?, ?)', ['visite', results, req.session.user.id, activity]);
										connection.query('SELECT user_score FROM users WHERE ?', [{user_id: results}], function(err, results_id)
										{
											connection.query('UPDATE users SET ? WHERE ?', [{user_score: results_id[0]['user_score'] + 5}, {user_id: results}]);
											connection.query('SELECT user_id, user_login, user_birth, user_sex, user_city, user_snap_profile FROM users WHERE ?', [{user_id: req.session.user.id}],function(err, my_json)
											{
												io.emit(results_socket_key, crypto.createHmac('sha256', my_json[0]['user_id'].toString()).digest('hex'), my_json[0], 'visite');
											});
										});
									}
								});
								connection.query('SELECT * FROM actions WHERE action_receiver = ? OR action_sender = ?', [req.session.user.id, req.session.user.id], function(err, my_action)
								{
									user_find[0]['birth'] = my_lib.getage(new Date(user_find[0]['user_birth']));
									res.render('profile', {user: req.session.user, profile_user: user_find, my_lib: my_lib, my_action: my_action});
								});
							}
							else
								res.redirect('/meetal');
						});
					}
					else
						res.redirect('/meetal');
				}
				else
					res.redirect('/meetal');
			});
		}
		else
			res.redirect('/meetal');
	});

	app.post('/like/:key', function(req, res){
		if (req.session && req.session.user)
		{
			connection.query('SELECT * FROM users', function(err, rows)
			{
				if (rows)
				{
					results = null;
					results_socket_key = null;
					for (var i = 0; rows[i]; i++) {
						if (crypto.createHmac('sha256', rows[i]['user_id'].toString()).digest('hex') == req.params.key)
						{
							results = rows[i]['user_id'];
							results_socket_key = rows[i]['user_socket'];
						}
					};
					if (results)
					{   
						var today = new Date();
		        		var activity = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
						connection.query('INSERT INTO actions (action, action_receiver, action_sender, action_created_at) VALUES (?, ?, ?, ?)', ['like', results, req.session.user.id, activity]);
						connection.query('SELECT user_score FROM users WHERE ?', [{user_id: results}], function(err, results_id)
						{
							connection.query('UPDATE users SET ? WHERE ?', [{user_score: results_id[0]['user_score'] + 5}, {user_id: results}]);
							connection.query('SELECT user_id, user_login, user_birth, user_sex, user_city, user_snap_profile FROM users WHERE ?', [{user_id: req.session.user.id}],function(err, my_json)
							{
								connection.query('SELECT * FROM actions WHERE action_sender=? OR action_receiver=?', [req.session.user.id, req.session.user.id], function(err, all_action)
								{
									if (my_lib.its_a_match_or_not(req.session.user.id, results, all_action))
										io.emit(results_socket_key, crypto.createHmac('sha256', my_json[0]['user_id'].toString()).digest('hex'), my_json[0], 'match');
									else
										io.emit(results_socket_key, crypto.createHmac('sha256', my_json[0]['user_id'].toString()).digest('hex'), my_json[0], 'like');
									res.send({message: 'lol'});
								});
							});
						});
					}
					else
						res.send({message: 'error'});
				}
				else
					res.send({message: 'error'});
			});
		}
		else
			res.send({message: 'error'});
	});

	app.post('/dislike/:key', function(req, res){
		if (req.session && req.session.user)
		{
			connection.query('SELECT * FROM users', function(err, rows)
			{
				if (rows)
				{
					results = null;
					for (var i = 0; rows[i]; i++) {
						if (crypto.createHmac('sha256', rows[i]['user_id'].toString()).digest('hex') == req.params.key)
							results = rows[i]['user_id'];
					};
					if (results)
					{   
						var today = new Date();
		        		var activity = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
		        		connection.query('SELECT user_score FROM users WHERE ?', [{user_id: results}], function(err, results_id)
						{
			        		connection.query('UPDATE users SET ? WHERE ?', [{user_score: results_id[0]['user_score'] - 10}, {user_id: results}]);
							connection.query('INSERT INTO actions (action, action_receiver, action_sender, action_created_at) VALUES (?, ?, ?, ?)', ['dislike', results, req.session.user.id, activity], function(err, rows, fields)
							{
								res.send({success: true});
							});
						});
					}
					else
						res.send({message: 'error'});
				}
				else
					res.send({message: 'error'});
			});
		}
		else
			res.send({message: 'error'});
	});

	app.post('/unlike/:key', function(req, res){
		if (req.session && req.session.user)
		{
			connection.query('SELECT * FROM users', function(err, rows)
			{
				if (rows)
				{
					results = null;
					for (var i = 0; rows[i]; i++) {
						if (crypto.createHmac('sha256', rows[i]['user_id'].toString()).digest('hex') == req.params.key)
						{
							results = rows[i]['user_id'];
							results_socket_key = rows[i]['user_socket'];
						}
					};
					if (results)
					{
						connection.query('SELECT user_score FROM users WHERE ?', [{user_id: results}], function(err, results_id)
						{
							connection.query('SELECT user_id, user_login, user_birth, user_sex, user_city, user_snap_profile FROM users WHERE ?', [{user_id: req.session.user.id}],function(err, my_json)
							{
								io.emit(results_socket_key, crypto.createHmac('sha256', my_json[0]['user_id'].toString()).digest('hex'), my_json[0], 'unlike');
							});
							connection.query('UPDATE users SET ? WHERE ?', [{user_score: results_id[0]['user_score'] + -5}, {user_id: results}]);
							connection.query('DELETE FROM actions WHERE action_sender=? AND action_receiver=? AND action=?', [req.session.user.id, results, 'like']);
							res.send({success: true});
						});
					}
					else
						res.send({message: 'error'});
				}
				else
					res.send({message: 'error'});
			});
		}
		else
			res.send({message: 'error'});
	});

	app.get('/meet', function(req, res){
		if (req.session && req.session.user)
		{
			connection.query('SELECT user_id, user_login, user_birth, user_sex, user_orientation, user_biography, user_snap_profile, user_city_begin, user_connect, user_last_activity, user_score, user_city FROM users WHERE user_id != ? AND user_valid=1 AND user_last_activity != 0 ORDER BY user_connect DESC, user_last_activity DESC', req.session.user['id'], function(err, rows)
			{
				connection.query('SELECT * FROM actions WHERE action = ? AND action_receiver = ? ORDER BY action_created_at DESC', ['like', req.session.user['id']], function(err, my_action)
				{
					res.render('like', {user: req.session.user, row: rows, crypto: crypto, my_lib: my_lib, my_action: my_action});
				});
			});
		}
		else
			res.redirect('/');
	});

	app.get('/visite', function(req, res){
		if (req.session && req.session.user)
		{
			connection.query('SELECT user_id, user_login, user_birth, user_sex, user_orientation, user_biography, user_snap_profile, user_city_begin, user_connect, user_last_activity, user_score, user_city FROM users WHERE user_id != ? AND user_valid=1 AND user_last_activity != 0 ORDER BY user_connect DESC, user_last_activity DESC', req.session.user['id'], function(err, rows)
			{
				connection.query('SELECT * FROM actions WHERE action = ? AND action_receiver = ? ORDER BY action_created_at DESC', ['visite', req.session.user['id']], function(err, my_action)
				{
					res.render('visite', {user: req.session.user, row: rows, crypto: crypto, my_lib: my_lib, my_action: my_action});
				});
			});
		}
		else
			res.redirect('/');
	});

	app.post('/see_like', function(req, res){
		if (req.session && req.session.user)
			connection.query('UPDATE actions SET ? WHERE ? AND ?', [{action_see: 1}, {action_receiver: req.session.user['id']}, {action: 'like'}]);
		res.send({success: true});
	});

	app.post('/see_visite', function(req, res){
		if (req.session && req.session.user)
			connection.query('UPDATE actions SET ? WHERE ? AND ?', [{action_see: 1}, {action_receiver: req.session.user['id']}, {action: 'visite'}]);
		res.send({success: true});
	});

	app.get('/classement', function(req, res){
		if (req.session && req.session.user)
		{
			connection.query('SELECT user_login, user_birth, user_sex, user_snap_profile, user_score FROM users WHERE user_valid=1 AND user_last_activity != 0 ORDER BY user_score DESC', function(err, rows)
			{
				res.render('rank', {user: req.session.user, row: rows, my_lib: my_lib});
			});
		}
		else
			res.redirect('/');
	});

	app.get('/message', function(req, res){
		if (req.session && req.session.user)
		{
			connection.query('SELECT * FROM actions WHERE (action_receiver = ? OR action_sender = ?) AND (action = ? OR action = ?) ORDER BY action_created_at ASC', [req.session.user.id, req.session.user.id, 'like', 'message'], function(err, message)
			{
				var id_array = [];
				for (var i = 0; message[i]; i++) {
					if (message[i].action_sender == req.session.user.id)
						if (my_lib.its_a_match_or_not(req.session.user.id, message[i].action_receiver, message) && id_array.indexOf(message[i].action_receiver) < 0)
							id_array.push(message[i]['action_receiver']);
					if (message[i].action_receiver == req.session.user.id)
						if (my_lib.its_a_match_or_not(req.session.user.id, message[i].action_sender, message) && id_array.indexOf(message[i].action_sender) < 0)
							id_array.push(message[i]['action_sender']);
				};
				var begin_sql = 'SELECT user_id, user_login, user_birth, user_sex, user_snap_profile, user_score FROM users WHERE (';
				var last_sql = '';
				for (var i = 0; i != id_array.length; i++) {
					if (last_sql == '')
						last_sql = 'user_id = ?';
					else
						last_sql += ' OR user_id = ?';
				};
				connection.query((begin_sql + last_sql + ')'), id_array,function(err, rows)
				{
					if (rows)
					{
						for (var i = 0; rows[i]; i++) {
							rows[i]['code'] = crypto.createHmac('sha256', rows[i]['user_id'].toString()).digest('hex');
							rows[i]['views'] = 0;
						};
						for (var i = 0; message[i]; i++) {
							if (message[i]['action'] == 'message')
								message[i]['time'] = my_lib.getTime(message[i]['action_created_at']);
							for (var o = 0; rows[o]; o++) {
								if (message[i]['action'] == 'message' && message[i]['action_receiver'] == req.session.user.id && rows[o]['user_id'] == message[i]['action_sender'] && message[i]['action_see'] == 0)
								rows[o]['views'] += 1;
							};
						};
					}
					res.render('message', {user: req.session.user, message: message, rows: rows});
				});
			});
		}
		else
			res.redirect('/');
	});

	app.post('/send_msg', function(req, res){
		if (req.session && req.session.user)
		{
			if (req.body.mymsg && req.body.other)
			{
				connection.query('SELECT * FROM users', function(err, rows)
				{
					if (rows)
					{
						results = null;
						for (var i = 0; rows[i]; i++) {
							if (crypto.createHmac('sha256', rows[i]['user_id'].toString()).digest('hex') == req.body.other)
							{
								results = rows[i]['user_id'];
								results_socket_key = rows[i]['user_socket'];
							}
						};
						if (results)
						{
							var reg_msg = /^([a-zA-Z0-9.,:()àáâãäåçèéêëìíîïðòóôõöøùúûüýÿ?^|<-](-| |')?){2,100}$/i;
	        				if (req.body.mymsg != '' && reg_msg.test(req.body.mymsg))
	        				{
								var today = new Date();
		        				var activity = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
		        				var array_msg = ['message', results, req.session.user.id, activity, req.body.mymsg];
								connection.query('INSERT INTO actions (action, action_receiver, action_sender, action_created_at, action_message) VALUES (?, ?, ?, ?, ?)', array_msg);
								connection.query('SELECT user_id, user_login, user_birth, user_sex, user_city, user_snap_profile FROM users WHERE ?', [{user_id: req.session.user.id}],function(err, my_json)
								{
									io.emit(results_socket_key, crypto.createHmac('sha256', my_json[0]['user_id'].toString()).digest('hex'), my_json[0], 'message', array_msg);
									res.send({success: true});
								})
							}
							else
								res.send({success: false});
						}
						else
							res.end();
					}
					else
						res.end();
				});
			}
			else
				res.end();
		}
		else
			res.end();
	});

	app.post('/msg_see/:key', function(req, res){
		if (req.session && req.session.user)
		{
			connection.query('SELECT * FROM users', function(err, rows)
			{
				results = null;
				if (rows)
				{
					for (var i = 0; rows[i]; i++) {
						if (crypto.createHmac('sha256', rows[i]['user_id'].toString()).digest('hex') == req.params.key)
							results = rows[i]['user_id'];
					}
					if (results)
					{
						connection.query('UPDATE actions SET ? WHERE ? AND ? AND ?', [{action_see: 1}, {action_receiver: req.session.user.id,}, {action_sender: results}, {action: 'message'}]);
					}
					else
						res.end();
				}
				else
					res.end();
			});
		}
		else
			res.end();
	});

	app.get('/admin', function(req, res)
	{
		if (req.session && req.session.user)
		{
			connection.query('SELECT * FROM users', function(err, rows)
			{
				connection.query('SELECT * FROM actions WHERE action = "report"', function(err, actions)
				{
					res.render('admin', {user: req.session.user, row: rows, actions: actions, age: age});
				});
			});
		}
		else
			res.redirect('/');
	});

	app.post('/data_from_admin', function (req, res) {
		if (req.session && req.session.user)
		{
			connection.query('SELECT * FROM users', function(err, rows)
			{
				connection.query('SELECT * FROM actions WHERE action = "report"', function(err, actions)
				{
					res.send({ data: [{user: req.session.user, actions: actions, row: rows}]});
				});
			});
		}
		else
			res.end();
	});

	app.post('/admin_delete/:key', function (req, res) {
		if (req.session && req.session.user)
		{
			connection.query('SELECT user_admin FROM users WHERE user_id = ?', req.session.user.id, function(err, rows)
			{
				if (rows && rows[0]['user_admin'])
				{
					connection.query('DELETE FROM users WHERE user_id = ?', req.params.key);
					connection.query('DELETE FROM actions WHERE ? OR ?', [{action_sender: req.params.key}, {action_receiver: req.params.key}]);
					res.send({success: true});
				}
				else
					res.send({success: false});
			});
		}
		else
			res.send({success: false});
	});

	app.post('/admin_set/:key', function (req, res) {
		if (req.session && req.session.user)
		{
			connection.query('SELECT user_admin FROM users WHERE user_id = ?', req.session.user.id,function(err, rows)
			{
				if (rows && rows[0]['user_admin'])
				{
					connection.query('UPDATE users SET ? WHERE ?', [{user_admin: 1}, {user_id: req.params.key}]);
					res.send({success: true});
				}
				else
					res.send({success: false});
			});
		}
		else
			res.send({success: false});
	});

	app.post('/report_send/:key', function (req, res) {
		if (req.session && req.session.user)
		{
			connection.query('SELECT * FROM users', function(err, rows)
			{
				if (rows && rows[0])
				{
					results = null;
					score = null;
					for (var i = 0; rows[i]; i++) {
						if (crypto.createHmac('sha256', rows[i]['user_id'].toString()).digest('hex') == req.params.key)
						{
							results = rows[i]['user_id'];
							score = rows[i]['user_score'];
						}
					};
					if (results)
					{
						connection.query('SELECT * FROM actions WHERE ? AND ? AND ?', [{action_sender : req.session.user.id}, {action_receiver: results}, {action: 'report'}], function(err, exists)
						{
							if (!exists[0])
							{
								var today = new Date();
				        		var activity = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
								connection.query('UPDATE users SET ? WHERE ?', [{user_score: score + -10}, {user_id: results}]);
								connection.query('INSERT INTO actions (action, action_receiver, action_sender, action_created_at) VALUES (?, ?, ?, ?)', ['report', results, req.session.user.id, activity]);
								res.send({success: true});
							}
							else
								res.send({success: false});
						});
					}
					else
						res.send({success: false});
				}
				else
					res.send({success: false});
			});
		}
		else
			res.send({success: false});
	});

	app.post('/bloque_send/:key', function (req, res) {
		if (req.session && req.session.user)
		{
			connection.query('SELECT * FROM users', function(err, rows)
			{
				if (rows && rows[0])
				{
					results = null;
					score = null;
					for (var i = 0; rows[i]; i++) {
						if (crypto.createHmac('sha256', rows[i]['user_id'].toString()).digest('hex') == req.params.key)
						{
							results = rows[i]['user_id'];
							score = rows[i]['user_score'];
						}
					};
					if (results)
					{
						connection.query('SELECT * FROM actions WHERE ? AND ? AND ?', [{action_sender : req.session.user.id}, {action_receiver: results}, {action: 'bloque'}], function(err, exists)
						{
							if (!exists[0])
							{
								var today = new Date();
				        		var activity = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
								connection.query('UPDATE users SET ? WHERE ?', [{user_score: score + -10}, {user_id: results}]);
								connection.query('INSERT INTO actions (action, action_receiver, action_sender, action_created_at) VALUES (?, ?, ?, ?)', ['bloque', results, req.session.user.id, activity]);
								res.send({success: true});
							}
							else
								res.send({success: false});
						});
					}
					else
						res.send({success: false});
				}
				else
					res.send({success: false});
			});
		}
		else
			res.send({success: false});
	});

	app.post('/get_message', function (req, res) {
		if (req.session && req.session.user)
		{
			connection.query('SELECT * FROM actions WHERE (action_receiver = ? OR action_sender = ?) AND (action = ? OR action = ?) ORDER BY action_created_at ASC', [req.session.user.id, req.session.user.id, 'like', 'message'], function(err, message)
			{
				if (message && message[0])
				{
					var id_array = [];
					for (var i = 0; message[i]; i++) {
						if (message[i].action_sender == req.session.user.id)
							if (my_lib.its_a_match_or_not(req.session.user.id, message[i].action_receiver, message) && id_array.indexOf(message[i].action_receiver) < 0)
								id_array.push(message[i]['action_receiver']);
						if (message[i].action_receiver == req.session.user.id)
							if (my_lib.its_a_match_or_not(req.session.user.id, message[i].action_sender, message) && id_array.indexOf(message[i].action_sender) < 0)
								id_array.push(message[i]['action_sender']);
					};
					var begin_sql = 'SELECT user_id, user_login, user_birth, user_sex, user_snap_profile, user_score FROM users WHERE (';
					var last_sql = '';
					for (var i = 0; i != id_array.length; i++) {
						if (last_sql == '')
							last_sql = 'user_id = ?';
						else
							last_sql += ' OR user_id = ?';
					};
					connection.query((begin_sql + last_sql + ')'), id_array,function(err, rows)
					{
						if (rows)
						{
							for (var i = 0; rows[i]; i++) {
								rows[i]['code'] = crypto.createHmac('sha256', rows[i]['user_id'].toString()).digest('hex');
								rows[i]['views'] = 0;
							};
							for (var i = 0; message[i]; i++) {
								if (message[i]['action'] == 'message')
									message[i]['time'] = my_lib.getTime(message[i]['action_created_at']);
								for (var o = 0; rows[o]; o++) {
									if (message[i]['action'] == 'message' && message[i]['action_receiver'] == req.session.user.id && rows[o]['user_id'] == message[i]['action_sender'] && message[i]['action_see'] == 0)
									rows[o]['views'] += 1;
								};
							};
						}
						res.send({success: true, messages: message});
					});
				}
				else
					res.send({success: true, messages: message});
			});
		}
	});

	app.route('/api*')
		.get(function(req,res){
			if (req.query.alluser == 'true')
			{
				connection.query('SELECT user_login, user_birth, user_sex, user_orientation, user_city, user_biography, user_music, user_tags, user_size, user_poid, user_eyes, user_hairs, user_score FROM users', function(err, rows)
				{
					res.json({user : rows});
				});
			}
			else if (req.query.user)
			{
				connection.query('SELECT user_login, user_birth, user_sex, user_orientation, user_city, user_biography, user_music, user_tags, user_size, user_poid, user_eyes, user_hairs, user_score FROM users WHERE user_login LIKE ?', ['%'+req.query.user+'%'], function(err, rows)
				{
					if (rows && rows[0])
						res.json({user : rows});
					else
						res.json({});
				});
			}
			else if (req.query.city)
			{
				connection.query('SELECT user_login, user_birth, user_sex, user_orientation, user_city, user_biography, user_music, user_tags, user_size, user_poid, user_eyes, user_hairs, user_score FROM users WHERE user_city LIKE ?', ['%'+req.query.city+'%'], function(err, rows)
				{
					if (rows && rows[0])
						res.json({user : rows});
					else
						res.json({});
				});
			}
			else
				res.json({error: 'Error URL for API'});
		});
}