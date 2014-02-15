
/*
 * GET home page.
 */

var Checkin = require('../models/checkins');

exports.index = function(req, res){
	user = req.user;
  if (user !== undefined && user.name !== undefined) {
  	res.render('main', { title: "Welcome", user: user });
  } else {
  	res.render('index', { title: "Welcome"});
  }
};


exports.miez = function(req, res){
	user = req.user;
  if (user !== undefined && user.name !== undefined) {
  	res.render('miez', {  user: user });
  } else {
  	res.render('miez', { });
  }
};


exports.login = function(req, res){
  user = req.user;
  if (user !== undefined && user.name !== undefined) {
    res.render('main', { title: "Welcome", user: user });
  } else {
    res.render('login', { });
  }
};

exports.checkin = function(req, res){
  user = req.user;
  if (user !== undefined && user.name !== undefined) {
    Checkin.create(user, function(ret) {
          res.render('main', {  user: user, message: "Sikeres bejelentkezés." });
    });

  } else {
    res.render('login', { });
  }
};

exports.allcheckin = function(req, res) {
  Checkin.getAll(function (checkins) {
    res.write(JSON.stringify(checkins));
    res.end();
  });
}
