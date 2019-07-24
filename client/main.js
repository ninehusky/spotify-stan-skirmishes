(function() {

  window.addEventListener('load', init);

  const URL_BASE = 'http://localhost:3000/'
  let id = null;
  let songData = null;
  let gameData = null;

  function init() {
    document.getElementById('lookup').addEventListener('click', getArtistData);
    document.getElementById('skirmish').addEventListener('click', getSongData);
  }

  function getArtistData() {
    fetch(URL_BASE + 'getartist?artist=' + document.getElementById('artist-name').value)
      .then(data => data.json())
      .then(displayArtistData)
      .catch(console.error);
  }

  function displayArtistData(response) {
    id = response.id;
    document.getElementById('artist-image').src = response.img;
    document.getElementById('display-artist-name').innerText = response.name;
    document.getElementById('artist-display').classList.remove('hidden');
  }

  function getSongData() {
    if (id) {
      fetch(URL_BASE + 'getsongs?artist=' + id)
        .then(data => data.json())
        .then(displaySongData)
        .catch(console.error);
    }
  }

  function displaySongData(response) {
    songData = response;
    createCards();
  }

  function createCards() {
    document.getElementById('display').innerText = ''; // doesn't this leak memory?
    if (songData) {
      console.log('starting...');
      let song1 = randArray(randArray(songData)['song_list']); // oh god
      let song2;
      do {
        song2 = randArray(randArray(songData)['song_list']); // this seems bad
      } while (song1 === song2);
      document.getElementById('display').appendChild(createCard(song1));
      document.getElementById('display').appendChild(createCard(song2));
    } else {
      document.getElementById('display').innerText = 'oops there was an error.'; // this ought to keep em at bay
    }
  }

  // i sure do miss JSX
  function createCard(songObj) {
    let div = document.createElement('div');
    div.classList.add('card');
    div.classList.add('w-25');
    let info = document.createElement('div');
    info.classList.add('card-body');
    info.innerText = `${songObj.name} from ${songObj.album}`
    let albumArt = document.createElement('img');
    albumArt.src = songObj['img_url'];
    albumArt.alt = songObj.album + ' album art';
    albumArt.classList.add('card-image-bottom');
    div.appendChild(albumArt);
    div.appendChild(info);
    return div;
  }

  // i feel like it's actually ridiculous how this isn't built into js
  /**
   * @param arr - array to be selected from
   * @return A random element in the given array
   */
  function randArray(arr) {
    let index = Math.floor(Math.random() * arr.length);
    return arr[index];
  }
}());
