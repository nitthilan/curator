/**
 * Tips
 * ====
 * - Set `user-agent` and `accept` headers when sending requests. Some services will not respond as expected without them.
 * - Set `pool` to false if you send lots of requests using "request" library.
 */

var request = require('request')
  , FeedParser = require('feedparser')
  , Iconv = require('iconv').Iconv;
var cheerio = require('cheerio');

function getParams(str) {
  var params = str.split(';').reduce(function (params, param) {
    var parts = param.split('=').map(function (part) { return part.trim(); });
    if (parts.length === 2) {
      params[parts[0]] = parts[1];
    }
    return params;
  }, {});
  return params;
}


module.exports = function(){

  function fetch(feed, numTries, callback) {
    //var feed = channel.feedUrl;
    var posts = [];
    // Define our streams
    var req = null;
    try{
      req = request(feed, {timeout: 20000, pool: false});
    }catch(error){
      return callback(error, null);
    }
    
    req.setMaxListeners(50);
    // Some feeds do not respond without user-agent and accept headers.
    req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
       //.setHeader('accept', 'text/html,application/xhtml+xml');
    // Define our handlers
    req.on('error', function(err){
      var error = new Error("Error in request "+err+' feed '+ feed + " numTries "+ numTries);
      //console.log(error);
      if(numTries) fetch(feed, numTries--, callback);
      else return callback(error, null);
    });

    var feedparser = new FeedParser();

    req.on('response', function(res) {
      var stream = this
        , iconv
        , charset;

      if (res.statusCode != 200) return this.emit('error', new Error('Bad status code '+res.statusCode));

      charset = getParams(res.headers['content-type'] || '').charset;

      // Use iconv if its not utf8 already.
      if (!iconv && charset && !/utf-*8/i.test(charset)) {
        try {
          iconv = new Iconv(charset, 'utf-8');
          console.log('Converting from charset %s to utf-8', charset);
          iconv.on('error', function(err){
            return callback(new Error("Error character conversion "+err), null);            
          });
          // If we're using iconv, stream will be the output of iconv
          // otherwise it will remain the output of request
          stream = this.pipe(iconv);
        } catch(err) {
          this.emit('error', err);
        }
      }

      // And boom goes the dynamite
      stream.pipe(feedparser);
    });

    feedparser.on('error', function(err){
      //console.log("Error in parsing feed "+err);
      //return callback(new Error("Error in parsing feed "+err), null);
    });
    feedparser.on('end', function(){
      var meta = {
        title:this.meta.title,
        siteUrl:this.meta.link
      }
      return callback(null, {posts:posts,meta:meta});     
      
    });
    feedparser.on('readable', function() {

      var post;

      while (post = this.read()) {
        var articleLink = null;
        if(post.link) articleLink = post.link;
        else if(post.guid) articleLink = post.guid;
        else if(post.origlink) articleLink = post.origlink;
        $ = cheerio.load("<body>"+post.description+"</body>", { normalizeWhitespace: true, xmlMode: true});
        posts.push({
          title:post.title,
          gist:$('body').text(),
          imageUrl:$('img').attr('src'),
          author:post.author,
          link:articleLink,
          pubDate:new Date(post.date)
        });
        //console.log(post);
      }
    });
  }
  return{fetch:fetch}
}