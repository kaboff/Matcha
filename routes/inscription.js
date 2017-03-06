module.exports = function(app, io, connection){
	var crypto = require('crypto');
	var randtoken = require('rand-token');

	app.post('/inscription', function(req, res){
		res.render('inscription');
	})
	app.get('/inscription_send/:key', function(req, res){
		connection.query('SELECT user_id, user_key FROM users WHERE user_key=?', req.params.key, function(err, rows, fields)
		{
			if (rows[0])
			{
				var token = randtoken.generate(48);
				var modif_user = [1, rows[0]['user_id']];
				connection.query('UPDATE users SET ? WHERE ?', [{ user_valid: 1, user_key: token }, { user_id: rows[0]['user_id'] }]);
				req.session.valid = 'good';
				res.redirect('/');
			}
			else
			{
				req.session.valid = 'not';
				res.redirect('/');
			}
		});
	})
}