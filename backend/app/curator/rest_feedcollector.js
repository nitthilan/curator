var mongoose = require('mongoose');
var Channel = mongoose.model('Channel');
var Article = mongoose.model('Article');
module.exports = function(app, auth, config, baseUrl){
	var log = require(config.root+'./setup/log.js').appLogger;
	var feedreader = require(config.root+'./curator/feedreader.js')();
	var articlefetcher = require(config.root+'./curator/articlefetcher.js')();
	var rest_validation = require(config.root+'./curator/rest_validation.js');
	var numRetries = 1;
	var total_request_made = 0;

	var countAndSaveChan = function(channel, res){
		Article.count({channelId:channel._id, isRead:false}, function(err, count){
			channel.numArticles = count;
			channel.save(function(err, savedChannel, numAffected){
				if(err)	{
					log.info("Error in saving channel "+err);
					if(res) res.send(err);
				}
				else{
					if(res) res.send(savedChannel);
				}
			})
		})
	}
	var updateIdAndCategory = function(posts, channel, res){
		for(var i=0;i<posts.length;i++){
			posts[i].categories = channel.categories;
			posts[i].channelId = channel._id;
		}
		Article.create(posts, function(err, savedPosts){
			if(err)	{
				log.info("Error in saving articles "+err);
				//if(res) return res.send(err);
			}
			countAndSaveChan(channel, res);										
		});
	}

	var getFormatArticle = function(channel){
		return function(err, data){
			if(err) {
				log.info("Error in parsing channel "+err);
				channel.numQueryFailures++;
				countAndSaveChan(channel, null);
			}
			else{
				updateIdAndCategory(data.posts, channel, null);				
			}
			total_request_made--;
			log.info("Total request made "+total_request_made);
			if(total_request_made === 0){
		  		log.info("Done parsing all folders and feeds");
		  	}
		}
	}

	var getNewChannelInfo = function(feedurl, res){
		return function(err, data){
			if(err){
				log.info("Error in getting channel info "+err);
				if(res) return res.send(err);
			}
			else{
				var channel = new Channel();
				channel.feedUrl = feedurl;
				var meta = data.meta;
				channel.title = meta.title;
				channel.siteUrl = meta.siteUrl;
				Channel.create(channel, function(err, savedChannel){
					if(err) {
						log.info("Error in saving channel "+err);
						if(res) return res.send(err);
						else return;
					}
					log.info("saved channel "+savedChannel);
					updateIdAndCategory(data.posts, savedChannel, res);
				});
			}
		}
	}

	var getNewArticleInfo = function(articleurl, res){
		return function(err, data){
			if(err){
				log.info("Error in getting article info "+err);
				if(res) return res.send(err);
			}
			else{
				var article = new Article();
				article.link = articleurl;
				article.title = data.title;
				article.description = data.description;
				article.gist = data.gist;
				article.imageUrl = data.imgPath;
				Article.create(article, function(err, savedArticle){
					if(err) {
						log.info("Error in saving channel "+err);
						if(res) return res.send(err);
						else return;
					}
					log.info("saved channel "+savedArticle);
					return res.send(savedArticle);
				});
			}
		}
	}

	var updateAllUrl = baseUrl+"/update"
	app.post(updateAllUrl, 
  	/*auth.requiresLogin,*/ 
  	rest_validation.validatePost,
  	function(req, res, next){
  		Channel.find({}, '', function(error, channelList){
  			if(error) log.info("This error should not happen at all");
			else if(channelList.length == 0) log.info("No matching channels:"+JSON.stringify(query));
  			else {
  				for(var i=0;i<channelList.length;i++){
  					total_request_made++;
  					feedreader.fetch(channelList[i].feedUrl, 0, getFormatArticle(channelList[i]));
  				}
  			}
  		});
  		res.send("Started update of all articles");
  	});

  	var addChannelFeedUrl = baseUrl+"/feedUrl"
	app.post(addChannelFeedUrl, 
  	/*auth.requiresLogin,*/ 
  	rest_validation.validatePost,
  	function(req, res, next){
  		var feedUrl = req.params.info.feedUrl;
  		feedreader.fetch(feedUrl, 0, getNewChannelInfo(feedUrl, res));
  	});
  	var addArticle = baseUrl+"/articleUrl"
	app.post(addArticle, 
  	/*auth.requiresLogin,*/ 
  	rest_validation.validatePost,
  	function(req, res, next){
  		var articleUrl = req.params.info.articleUrl;
  		articlefetcher.fetch(articleUrl, 0, getNewArticleInfo(articleUrl, res));
  	});
}