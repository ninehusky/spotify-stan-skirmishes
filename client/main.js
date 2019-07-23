(function() {

  window.addEventListener('load', init);

  const URL_BASE = 'http://localhost:3000/'
  let id = null;
  let songData = null;

  function init() {
    document.getElementById('skirmish').addEventListener('click', createCards);
    fetch(URL_BASE + 'getsongs?artist=5K4W6rqBFWDnAN6FQUkS6x')
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        songData = data;
      })
      .catch(console.error);
  }

  function createCards() {
    document.getElementById('display').innerText = ''; // doesn't this leak memory?
    if (songData) {
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
