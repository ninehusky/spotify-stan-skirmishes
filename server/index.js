"use strict";

const express = require('express');
const dotenv = require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

let timerId = null;

const spotifyApi = new SpotifyWebApi({
  redirectUri: process.env.REDIRECT_URI,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// i got this from a youtube video. not entirely sure how it works, but hopefully it'll
// let me test this "api" locally.
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

authenticate();

function authenticate() {
  spotifyApi.clientCredentialsGrant()
    .then(data => {
      console.log(`Access token expires in ${data.body['expires_in'] * 1000} ms`);
      timerId = setTimeout(authenticate, data.body['expires_in'] * 1000);
      spotifyApi.setAccessToken(data.body['access_token']);
    })
  }

app.get('/getsongs', function(req, res) {
  // let's deal with case of no auth later.
  if (!req.query.artist) {
    return res.status(400).send({
      message: 'No artist returned!'
    });
  } else {
     spotifyApi.searchArtists(req.query.artist)
      .then((data) => {        
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
      })
      .catch(console.error);
  }
});

app.listen(process.env.PORT, () => console.log(`Example running on ${process.env.PORT}!`));
