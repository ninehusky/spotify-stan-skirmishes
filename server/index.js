const express = require('express');
const dotenv = require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();
var token = null;

const spotifyWebApi = new SpotifyWebApi({
  redirectUri: process.env.REDIRECT_URI,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

app.get('/auth/spotify/success', function(req, res) {

  /* Read query parameters */
  var code  = req.query.code; // Read the authorization code from the query parameters
  var state = req.query.state; // (Optional) Read the state from the query parameter

  /* Get the access token! */
  spotifyWebApi.authorizationCodeGrant(code)
    .then(function(data) {
      // console.log(data);
      res.send(data['body']['access_token']);
    })
    .catch(console.error);
});

app.listen(process.env.PORT, () => console.log(`Example running on ${process.env.PORT}!`));
