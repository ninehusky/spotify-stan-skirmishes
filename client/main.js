(function() {

  window.addEventListener('load', init);
  let id;

  function init() {
    document.getElementById('get-songs').addEventListener('click', getArtist)
  }

  function getArtist() {
    let artistName = document.getElementById('artist-name').value;
    if (artistName.length === 0) {
      console.log('no');
      return;
    } else {
      fetch('http://localhost:3000/getartist?artist=' + artistName)
        .then(data => data.json())
        .then(displayArtistData)
        .catch(console.error);
    }
  }

  function displayArtistData(data) {
    id = data.id;
    console.log(id);
    document.getElementById('artist-pic').src = data.img;
    document.getElementById('response').innerText = data.name;
  }
}());
