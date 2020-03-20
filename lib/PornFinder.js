var request = require('request');

var PornFinder = function() {};

PornFinder.prototype.findPorn = function(category) {
  return new Promise(function(resolve,reject) {
    request(`https://www.pornhub.com/webmasters/search?category=${category}`,
      function(error,response,body) {
        var videos = JSON.parse(body)['videos'];
        resolve(videos[Math.floor(Math.random() * 20)]['url']);
      }
    );
  });
}

module.exports = new PornFinder();
