var Client                = require('castv2-client').Client;
var DefaultMediaReceiver  = require('castv2-client').DefaultMediaReceiver;
var mdns                  = require('mdns');
var PornFinder = require('./lib/PornFinder');
var youtubedl = require('youtube-dl');


var browser = mdns.createBrowser(mdns.tcp('googlecast'));

browser.on('serviceUp', function(service) {
  console.log('found device "%s" at %s:%d', service.name, service.addresses[0], service.port);
  ondeviceup(service.addresses[0]);
  browser.stop();
});

browser.start();

function ondeviceup(host) {

  var client = new Client();

  client.connect(host, function() {
    console.log('connected, launching app ...');
    client.setVolume({
      muted: false,
      level: 1
    },() => {});

    client.launch(DefaultMediaReceiver, function(err, player) {
      player.on('status', function(status) {
        console.log('status broadcast playerState=%s', status.playerState);
      });

      getVideo(player);

    });

  });

  client.on('error', function(err) {
    console.log('Error: %s', err.message);
    client.close();
  });

}


function getVideo(player) {
  var options = [];
  PornFinder.findPorn().then(function(url) {
    youtubedl.getInfo(url, options, function(err, info) {
      if (err) throw err;
      var media = {
        // Here you can plug an URL to any mp4, webm, mp3 or jpg file with the proper contentType.
        contentId: info.url,
        contentType: 'video/mp4',
        streamType: 'BUFFERED', // or LIVE

        // Title and cover displayed while buffering
        metadata: {
          type: 0,
          metadataType: 0,
          title: info.title,
          images: [
            { url: info.thumbnail }
          ]
        }
      };
      try {
        player.load(media, { autoplay: true }, function(err, status) {
          player.seek(2*60, function(err, status) {
            //
          });
        });
      } catch (e) {
        getVideo(player);
      }
      
    });
  });
}
