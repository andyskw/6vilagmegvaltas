
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var config = require('./config');
var connect = require('connect'),
	ConnectCouchDB = require('connect-couchdb')(connect);

	var store = new ConnectCouchDB({
	  // Name of the database you would like to use for sessions.
	  name: 'vilagmegvaltas-sessions',

	  // Optional. How often expired sessions should be cleaned up.
	  // Defaults to 600000 (10 minutes).
	  reapInterval: 600000,

	  // Optional. How often to run DB compaction against the session
	  // database. Defaults to 300000 (5 minutes).
	  // To disable compaction, set compactInterval to -1
	  compactInterval: 300000,

	  // Optional. How many time between two identical session store
	  // Defaults to 60000 (1 minute)
	  setThrottle: 60000
	});
var app = express();
var passport = require('passport');

passport.use(new FacebookStrategy({
    clientID: config.facebookappid,
    clientSecret: config.facebooksecret,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser(config.cookiesecret));
app.use(connect.session({secret: config.couchdbsecret, store: store }));
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
