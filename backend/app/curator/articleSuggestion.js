var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');
var natural = require('natural'),
    TfIdf = natural.TfIdf,
    tfidf = new TfIdf();

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

Article.find({}, '', function(error, data){
	if(error) console.log("Error in query "+error);
	//log.info("Query "+query);
	console.log("Num articles "+data.length);
	natural.PorterStemmer.attach();
	for(var i=0;i<data.length;i++){
		//console.log(data[i].description);
		$ = cheerio.load("<body>"+data[i].description+"</body>", { normalizeWhitespace: true, xmlMode: true});
		//console.log($('img').attr('src'));
		//console.log($('img').get());
		//console.log($('body').text());
		//console.log($('body').text().tokenizeAndStem());
		tfidf.addDocument($('body').text());
	}
	for(var i=0;i<5;i++){
		console.log("article num "+i);
		$ = cheerio.load("<body>"+data[i].description+"</body>", { normalizeWhitespace: true, xmlMode: true});
		console.log($('body').text());
		tfidf.listTerms(i /*document index*/).forEach(function(item) {
		    console.log(item.term + ': ' + item.tfidf);
		});
	}
});

console.log("Done");

//<img src="http://feeds.feedburner.com/~r/TEDTalks_video/~4/HqTMM3hX9HM" height="1" width="1"/>