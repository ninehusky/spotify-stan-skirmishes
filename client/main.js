(function() {

  window.addEventListener('load', init);

  const URL_BASE = 'http://localhost:3000/'
  let id = null;

  function init() {
    document.getElementById('get-artist').addEventListener('click', getArtist);
    document.getElementById('get-albums').addEventListener('click', getAlbums);
  }

  function getArtist() {
    let artistName = document.getElementById('artist-name').value;
    if (artistName.length === 0) {
      console.log('lol');
    } else {
      fetch(URL_BASE + 'getartist?artist=' + artistName)
        .then(data => data.json())
        .then(displayArtistData)
        .catch(console.error);
    }
  }

  function displayArtistData(data) {
    id = data.id;
    document.getElementById('artist-pic').src = data.img;
    document.getElementById('artist-name').innerText = data.name;
    getAlbums(); // this is for debug, i'm too lazy to keep clicking
  }

  function getAlbums() {
    if (!id) {
      console.error('oops, no id');
    } else {
      fetch(URL_BASE + 'getsongs?artist=' + id)
        .then(data => data.json())
        .then(displayAlbumData)
        .catch(console.error);
    }
  }

  // wow. this could be so fun in react but instead i'm here using my
  // favorite framework at all, vanillaJS.
  function displayAlbumData(albumList) {
    let albumContainer = document.getElementById('album-data');
    while (albumContainer.hasChildNodes()) {
      albumContainer.removeChild(albumContainer.firstChild);
    }
    });
  }
}());
