module.exports = function(app, io, connection, http){
	require('./index.js')(app, io, connection);
	require('./inscription.js')(app, io, connection);
	require('./meetal.js')(app, io, connection, http);
	require('./request_ajax.js')(app, io, connection);
}