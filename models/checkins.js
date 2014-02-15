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

function create(user, ret) {
				var time = new Date().getTime();
					post_options = {
				      host: 'localhost',
				      port: '5984',
				      path: '/vilagmegvaltas-sessions/ci_'+time+"_"+user.id,
				      method: 'PUT',
				      headers: {
				          'Content-Type': 'application/json'
				      }
				  };

			    var post_req = http.request(post_options, function(error, res) {
			    	if (error == null) {
				      res.setEncoding('utf8');
				      res.on('data', function (chunk) {
				          console.log('CREATE CHEKIN Response: ' + chunk);
				      });
				    } else { 
				    	return { error : "Error occured!"};
				    }

				});

			  adata = {};
			  adata.id = "" + user.id;
			  adata.type="checkin";
			  adata.datetime=time;
			  adata.pic= "http://graph.facebook.com/"+user.id+"/picture?type=square";
			  adata.username = user.name;
			  adata.name = user.displayName;
			  adata.provider = user.provider;
			  post_req.write(JSON.stringify(adata));
			  post_req.end();
			  ret(adata);
}

exports.create = function(profile, ret) {
			create(profile, function(r) {
				ret(r);
			});

}


function getAll(onend) {

	couchdb_options = {
				      host: 'localhost',
				      port: '5984',
				      path: '/vilagmegvaltas-sessions/_design/checkins/_view/all',
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
exports.getAll = function(ret) {
		getAll(function (f) {
			ret(f);
		});
}
