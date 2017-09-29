var request = require('request');

var PornFinder = function() {};

PornFinder.prototype.findPorn = function() {
  return new Promise(function(resolve,reject) {
    request('https://www.pornhub.com/webmasters/search?id=44bc40f3bc04f65b7a35&category=bondage',
      function(error,response,body) {
        var videos = JSON.parse(body)['videos'];
        resolve(videos[Math.floor(Math.random() * 20)]['url']);
      }
    );
  });
}

module.exports = new PornFinder();
