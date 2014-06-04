var request = require('request');
var cheerio = require('cheerio');
var articlefetcher = require('./articlefetcher')();

articlefetcher.fetch('http://ibnlive.in.com/news/postpoll-survey-bjpled-nda-ride-on-modi-power-congress-faces-rout/471411-37-64.html',0,function(err,articleinfo){
	if(err){
		console.log("Error "+err);
	}
	else{
		console.log("Article info "+articleinfo.title+" "+articleinfo.gist+" "+articleinfo.imgPath+" "+articleinfo.tag+" "+articleinfo.description);
	}
});
	// http://techcrunch.com/2014/04/23/merus-capital-raises-50-million-for-two-funds/?ncid=rss
	// http://ibnlive.in.com/news/ls-polls-tough-battle-for-key-players-in-tn-jaya-eyes-kingmaker-role/467008-62-128.html
	// http://spectrum.ieee.org/consumer-electronics/gadgets/the-amazing-micromouse-contest
	/* request('http://spectrum.ieee.org/consumer-electronics/gadgets/the-amazing-micromouse-contest', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    //console.log(body) // Print the google web page.
    	$ = cheerio.load(body);
    	$('title').each(function(i, elem) {
			//fruits[i] = $(this).text();
			console.log(i+" "+$(this).text());
		});
		$('meta').each(function(i, elem) {
			//fruits[i] = $(this).text();
			if($(this).attr('name')) {
				if($(this).attr('name').match('image')) console.log("name image "+$(this).attr('content'));
				if($(this).attr('name').match('description')) console.log("name description "+$(this).attr('content'));
				if($(this).attr('name').match('tag')) console.log("name tag "+$(this).attr('content'));
			}
			else if($(this).attr('property')) {
				if($(this).attr('property').match('image')) console.log("property image "+$(this).attr('content'));
				if($(this).attr('property').match('description')) console.log("property description "+$(this).attr('content'));
				if($(this).attr('property').match('tag')) console.log("property tag "+$(this).attr('content'));
			}
			//if() console.log(" image property ");
			//if($(this).attr('property').match('description')) console.log(" description property ")
		});
		$('p').each(function(i, elem) {
			//fruits[i] = $(this).text();
			//console.log(i+" "+$(this).text());
		});
    	
	  }
	}); */