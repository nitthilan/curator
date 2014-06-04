var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');
var og = require('open-graph');

var articlefetcher = require('./articlefetcher.js')();


// Database configuration
var connectStr = 'mongodb' +'://'+'localhost'+':'+'27017'+'/'+'curator';
console.log(connectStr);
mongoose.connect(connectStr);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Database connection opened.");
});
require('./model');
var Article = mongoose.model('Article');

/* Article.find({}, function(error, data){
	if(error) console.log("Error in query "+error);
	//log.info("Query "+query);
	console.log("Num articles "+data.length);
	var numinvalidMeta = 0;
	for(var i=0;i<data.length;i++){
		//console.log(data[i].description);
		$ = cheerio.load("<body>"+data[i].description+"</body>", { normalizeWhitespace: true, xmlMode: true});
		console.log("Articles no"+i);
		//console.log("description "+data[i].description);
		//console.log("image src:"+ $('img').attr('src'));
		//console.log($('img').get());
		//console.log("body:"+$('body').text());
		data[i].gist = $('body').text();
		data[i].imageUrl = $('img').attr('src');

		data[i].save(function(err, savedChannel, numAffected){
			if(err)	{
				log.info("Error in saving channel "+err);
			}
		});
		og(data[i].link, function(err, meta){
	    	console.log(meta);
	    	if(!err){
	    		if(Object.keys(meta).length === 0) numinvalidMeta++;
	    	}
	    	else{
	    		numinvalidMeta++;
	    	}
	    	console.log("Numinvalid meta "+numinvalidMeta);
		})
	}
	
	//console.log(data[105].description);
	//console.log(data[105].link);
}); */

var getDescription= function(data, i){
	return function(err, fetchedData){
		if(err){
			console.log("Error in querying article "+err)
		}
		else{
			console.log("Article "+i);
			data.description = fetchedData.description;
			data.save(function(err, savedArticle, numAffected){
				if(err)	{
					log.info("Error in saving article "+err);
				}
			});
		}
	}
}

Article.find({}, function(error, data){
	if(error) console.log("Error in query "+error);
	//log.info("Query "+query);
	console.log("Num articles "+data.length);
	var numinvalidMeta = 0;
	for(var i=0;i<data.length;i++){

		articlefetcher.fetch(data[i].link, 0, getDescription(data[i], i));
	}
});

console.log("Done");

//<img src="http://feeds.feedburner.com/~r/TEDTalks_video/~4/HqTMM3hX9HM" height="1" width="1"/>