// https://stackoverflow.com/questions/28131177/evernote-oauth-login-javascript

var Evernote = require('evernote');
var http = require("http");
var url = require("url");

CONSUMER_KEY="Put your consumer key here";
CONSUMER_SECRET="***";

if (CONSUMER_KEY === "Put your consumer key here"){
  console.error("\nPlease enter your Evernote consumer key and secret\n\nIf you don't have a key you can get one at:\nhttps://dev.evernote.com/#apikey\n")
  process.exit(1)
}

var global = {};
global.oauthToken = '';
global.oauthSecret = '';

function getOauthVerifier(url) {
        var regex = new RegExp("[\\?&]oauth_verifier=([^&#]*)"),
        results = regex.exec(url);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var handler = function(request, response) {
  var params = url.parse(request.url)
  var pathname = params.pathname;
  console.log("Request for " + pathname + " received.");

  var client = new Evernote.Client ({
    consumerKey: "Put your consumer key here",
    consumerSecret: "put your consumer secret here",
    sandbox: true
  });

  if (pathname == "/"){
    var callbackUrl = 'http://localhost:8888/oauth';

    client.getRequestToken(callbackUrl, function(err, oauthToken, oauthSecret, results){
      if(err) {
        console.log(err);
      }
      else {
        global.oauthToken = oauthToken;
        global.oauthSecret = oauthSecret;
        console.log("set oauth token and secret");
        var authorizeUrl = client.getAuthorizeUrl(oauthToken);
        console.log(authorizeUrl);
        response.writeHead(200, {"Content-Type":"text/html"});
        response.write("Please <a href=\""+authorizeUrl+"\">click here</a> to authorize the application");
        response.end();
      }
    });
  }
  else if (pathname == "/oauth"){
    client.getAccessToken(
      global.oauthToken, 
      global.oauthSecret, 
      getOauthVerifier(params.search), 
      function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
        if(error) {
          console.log("error\n\n\n");
          console.log(error);
        }
        else {
          response.writeHead(200, {"Content-Type":"text/html"});
          response.write(oauthAccessToken);
          response.end();
        }   
      }
    );
  }
  else {
    response.writeHead(200, {"Content-Type":"text/html"});
    response.write("not a valid URL <a href=\"/\"> GO HOME </a>");
    response.end();
  }
};


http.createServer(handler).listen(8888);