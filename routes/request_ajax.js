module.exports = function(app, io, connection){
	var crypto = require('crypto');
	var randtoken = require('rand-token');

	app.post('/request_ajax_city', function(req, res)
	{
		connection.query('UPDATE users SET ? WHERE ?', [{ user_city_begin: req.body.city}, { user_id: req.session.user['id'] }]);
	});
}