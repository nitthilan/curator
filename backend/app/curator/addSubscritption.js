var request = require('request');
var cheerio = require('cheerio');
var feedreader = require('./feedreader.js')();

var getFormatArticle = function(){

		return function(err, data){
			if(err) {
				if(err)	console.log("Error in parsing channel "+err);
			}
			else{
				var posts = data.posts;
				for(var i=0;i<posts.length;i++){
					console.log(" link "+posts[i].link);
				}
				console.log("Meta info "+JSON.stringify(data.meta));
				console.log("details title "+data.meta.title+"\n des "+data.meta.description+"\n feedUrl "+data.meta.xmlUrl+
					"\n siteUrl "+data.meta.link);
			}
		}
	}

//http://www.engadget.com/rss.xml
//http://ibnlive.in.com/ibnrss/top.xml
//http://feeds2.feedburner.com/TEDTalks_video
feedreader.fetch('http://www.engadget.com/rss.xml', 0, getFormatArticle());