var http = require('http');

function doGet(id, onend) {

	couchdb_options = {
				      host: 'localhost',
				      port: '5984',
				      path: '/vilagmegvaltas-sessions/u_'+id,
				      method: 'GET',
				      headers: {
				          'Content-Type': 'application/json',
				      }
				  };

	var req_json = http.get(couchdb_options, function(res) {
	  if (res.statusCode == 404) {
	  	console.log("404");
	  	a = {};
	  	a.error = 404;
	  	console.log(a);
	  	onend(a);
	  	
	  };
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));

	  // Buffer the body entirely for processing as a whole.
	  var bodyChunks = [];
	  res.on('data', function(chunk) {
	    console.log("data");
	    bodyChunks.push(chunk);
	  }).on('end', function() {
	  		a = Buffer.concat(bodyChunks);
	  		a = JSON.parse(a);
			onend(a);

	  })
	}).on('error', function(e) {
	  console.log('ERROR: ' + e.message);
	});
}

function create(user) {

					post_options = {
				      host: 'localhost',
				      port: '5984',
				      path: '/vilagmegvaltas-sessions/u_'+user.id,
				      method: 'PUT',
				      headers: {
				          'Content-Type': 'application/json'
				      }
				  };

			    var post_req = http.request(post_options, function(error, res) {
			    	if (error == null) {
				      res.setEncoding('utf8');
				      res.on('data', function (chunk) {
				          console.log('CREATE USER Response: ' + chunk);
				      });
				    } else {
				    	return { error : "Error occured!"};
				    }

				});

			  adata = {};
			  adata.id = "" + user.id;
			   
			  adata.name = user.displayName;
			  adata.provider = user.provider;
			  post_req.write(JSON.stringify(adata));
			  post_req.end();
			  return adata;
}

exports.findOrCreate = function(profile, ret) {
	console.log(profile.id);
	doGet(profile.id, function(a) {

		if (a !== undefined && a.error !== undefined) {
		if (a.error == 404) {
			user = profile;
			var b = create(user);
			ret(b);
			
		}
	} else {
		ret(a);
	}
	});
	
}

exports.find = function(profile, ret) {
	console.log(profile.id);
	doGet(profile.id, function(a) {
		

		if (a !== undefined && a.error !== undefined) {
			ret(null);
			
		}
	 else {
		ret(a);
	}
	});
	
}