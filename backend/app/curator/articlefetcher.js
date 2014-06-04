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
    var options = {
        url: feed,
        headers: {
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36'
        },
        timeout: 20000,
        pool: false
    };
    request(options,function(error, response, body){
      if(error){
        if(numTries) return fetch(feed, numTries--, callback);
        return callback(error, null);
      }
      if(response.statusCode !== 200){
        return callback(new Error('Bad status code '+res.statusCode), null);
      }
      charset = getParams(response.headers['content-type'] || '').charset;
      if (charset && !/utf-*8/i.test(charset)) {
        var iconv = new Iconv(charset, 'utf-8//TRANSLIT');
        console.log('Converting from charset %s to utf-8', charset);
        body = iconv.convert(body);
      }
      var articleinfo = {
        description:"",
        img:null,
        title:null,
        imgPath:null,
        tag:null,
        gist:null
      }
      $ = cheerio.load(body);
      articleinfo.title = $('title').text();
      $('meta').each(function(i, elem) {
        //fruits[i] = $(this).text();
        var attr = null;
        if($(this).attr('name')) attr = 'name';
        else if($(this).attr('property')) attr = 'property';
        if(attr){
          if($(this).attr(attr).match('image')) articleinfo.imgPath = $(this).attr('content');
          if($(this).attr(attr).match('description')) articleinfo.gist = $(this).attr('content');
          if($(this).attr(attr).match('tag')) articleinfo.tag = $(this).attr('content');
        }
      });
      $('p').each(function(i, elem) {
        //fruits[i] = $(this).text();
        articleinfo.description += " "+$(this).text();
        //console.log(i+" "+$(this).text());
      });
      if(articleinfo.imgPath){
        options.url = articleinfo.imgPath;
        request(options,function(error, response, body){
          if(!error && response.statusCode === 200){
            articleinfo.img = body;
          }
          return callback(null, articleinfo)
        });
      }
      else{
        return callback(null, articleinfo);
      }
    });
  }
    
  return{fetch:fetch}
}