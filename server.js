'use strict'; // i think i should have used the model in cse 154
const SpotifyWebApi = require('spotify-web-api-node');
const dotenv = require('dotenv').config();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

let artist;
if (process.argv[2]) { // if the artist's name is passed as command line arg
  artist = process.argv[2];
} else {
  console.log('Artist must be passed in as command line arg!');
  process.exit();
}

let spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET
});

// callback
spotifyApi.clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body['access_token']);
    getArtist();
  })
  .catch(console.error);

function getArtist() {
  spotifyApi.searchArtists(artist)
    .then((data) => {
      getAlbumIds(data["body"]["artists"]["items"][0]["id"]);
    })
    .catch(console.error);
}

function getAlbumIds(id) {
  spotifyApi.getArtistAlbums(id, { include_groups: 'album', limit: 50 })
    .then((data) => {
      return data.body.items;
    })
    .then((albums) => {
      let albumObjs = [];
      albums.forEach((album) => {
        // console.log(album);
        let alreadyIn = false;
        albumObjs.forEach((albumObj) => {
          if (albumObj.name === album.name) {
            alreadyIn = true;
          }
        })
        if (album['album_type'] === 'album' && !alreadyIn) {
          let albumObj = {
            name: album['name'],
            id: album['id'],
            imgUrl: album['images'][0]['url'], // pick largest image in database
            songs: []
          }
          albumObjs.push(albumObj);
        }
      });
      return albumObjs;
    })
    .then(getSongs)
    .catch(console.error);
}

// oh no
function getSongs(albumObjs) {
  let promises = [];
  let songObjs = [];
  albumObjs.forEach((album) => {
    let id = album.id;
    promises.push(
      spotifyApi.getAlbumTracks(id)
        .then((albumData) => {
          let songs = albumData.body.items;
          songs.forEach((song) => {
            if (!song.name.toLowerCase().includes('remix')
                && !song.name.toLowerCase().includes('edited')
                && !song.name.toLowerCase().includes(' live at')
                && !song.name.toLowerCase().includes('session')) {
                let songObj = {
                  name: song.name,
                  album: album.name,
                  imgUrl: album.imgUrl
                }
                songObjs.push(songObj);
            }
          });
        })
        .catch(console.error)
      );
  });
  Promise.all(promises).then(() => { // maybe i should have implemented this everywhere?
    cleanse(songObjs);
    songObjs.forEach((song) => {
      console.log(song.name); // for debugging
    });
  });
}

// ugh. was pain cause i cant read documentation but this gets rid of 'duplicate' entries for songs
// because we're not using a set anymore.
function cleanse(songObjs) {
  let originalSize = songObjs.length;
  for (let i = songObjs.length - 1; i >= 0; i--) {
    let firstSongName = songObjs[i].name;
    for (let j = i - 1; j >= 0; j--) {
      let secondSongName = songObjs[j].name;
      if (firstSongName === secondSongName) {
        songObjs.splice(j, 1);
      }
    }
  }
}

// maybe store artist data in cookies or as global, expensive operations to be calling api
// every single time user wants song
function promptUser(songNames) {
  let songs = Array.from(songNames); // this is really bad. im making another array? good thing
                                     // computers are so good lmao.
  let song1 = songs[Math.floor(Math.random() * songs.length)];
  let song2;
  do {
    song2 = songs[Math.floor(Math.random() * songs.length)];
  } while (song1 === song2);
  let data = {
    song1: song1,
    song2: song2
  };
  // console.log(data);
}
