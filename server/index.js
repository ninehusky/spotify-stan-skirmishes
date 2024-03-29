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
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// oof these endpoint names could probably use some work.
app.get('/getartist', function(req, res) {
    // let's deal with case of no auth later.
    if (!req.query.artist) {
        return res.status(400).send({
            message: 'No artist param passed!'
        });
    } else {
        spotifyApi.searchArtists(req.query.artist)
            .then((data) => {
                let chosenArtist = data.body.artists.items[0];
                // this is a bandaid
                if (!chosenArtist) {
                    res.status(400).send({
                        message: 'No artist with that name found!'
                    });
                } else {
                    let artist = {
                        name: chosenArtist.name,
                        id: chosenArtist.id,
                        img: chosenArtist.images[0].url
                    }
                    res.send(artist);
                }
            })
            .catch(console.error);
    }
});

app.get('/getsongs', function(req, res) {
    if (!req.query.artist) {
        return res.status(400).send({
            message: 'No artist param passed!'
        });
    } else {
        spotifyApi.getArtistAlbums(req.query.artist, { include_groups: 'album', limit: 50 })
            .then(data => {
                return data.body.items;
            })
            .then(getSongs)
            .then(data => {
                res.send(data);
            })
            .catch(error);
    }
});

// returns array of songObjs
async function getSongs(albums) {
    let albumObjs = [];
    let promises = [];
    for (const album of albums) {
        await addSongs(album, albumObjs);
    }

    await Promise.all(promises);
    return albumObjs;
}

async function addSongs(album, albumObjs) {
    let songs = await spotifyApi.getAlbumTracks(album.id);
    songs = songs.body.items;
    let songObjs = [];
    for (const song of songs) {
        let songObj = {
            name: song.name,
            album: album.name,
            img_url: album.images[0].url
        }
        songObjs.push(songObj);
    }
    let albumObj = {
        name: album.name,
        img_url: album.images[0].url,
        song_list: songObjs
    }
    albumObjs.push(albumObj);
}

// TODO: make maybe this synchronous such that other funcs can't
// fire until successful authentication
function authenticate() {
    spotifyApi.clientCredentialsGrant()
        .then(data => {
            console.log(`Access token expires in ${data.body['expires_in'] * 1000} ms`);
            timerId = setTimeout(authenticate, data.body['expires_in'] * 1000);
            spotifyApi.setAccessToken(data.body['access_token']);
        })
}

// Returns sufficiently ambiguous error message that for whatever reason
// doesn't get fired when it should be.
function error(err) {
    console.error(err);
    return res.status(400).send({
        message: 'Aiya! There was an error!'
    });
}

authenticate();
app.listen(process.env.PORT, () => console.log(`Server running on ${process.env.PORT}!`));
