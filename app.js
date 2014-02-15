
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var config = require('./config');
var engine = require('ejs-locals');
var User = require('./models/users');
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
FacebookStrategy = require('passport-facebook').Strategy;
passport.use(new FacebookStrategy({
    clientID: config.facebookappid,
    clientSecret: config.facebooksecret,
    callbackURL: "http://6.vilagmegvaltas.com:3000/auth/facebook/callback",
    authType: 'reauthenticate'
  },
 function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Facebook profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Facebook account with a user record in your database,
      // and return that user instead.
      c = User.findOrCreate(profile, function(ret) {
        console.log("c:" + ret);
        ret.id = profile.id;
        return done(null, ret);  
      });
      
    });
  }
));

passport.serializeUser(function(user, done) {
  console.log('serializing: ' + user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    profile = {};
    profile.id = id;
    User.find(profile, function(ret) {
      done(null,ret);
    });
    
});


// all environments
app.disable('etag');
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser(config.cookiesecret));
app.use(connect.session({secret: config.couchdbsecret, store: store }));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  //res.locals.token = req.csrfToken();
  next();
});
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/miez', routes.miez);
app.get('/checkin', routes.checkin);
app.get('/checkin/all', routes.allcheckin);


app.get('/login', routes.login);
app.get('/users', user.list);

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
  	console.log('ok');
    res.redirect('/');
  });

app.get('/logout', function(req, res){
	console.log('logout');
  req.logout();
  res.redirect('/');
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
