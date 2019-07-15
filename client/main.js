(function() {

  window.addEventListener('load', init);

  function init() {
    document.getElementById('get-songs').addEventListener('click', getSongs)
  }

  function getSongs() {
    let artistName = document.getElementById('artist-name').value;
    if (artistName.length === 0) {
      console.log('no');
      return;
    } else {
      fetch('http://localhost:3000/getsongs?artist=' + artistName)
        .then((data) => data.json())
        .then(console.log)
        .catch(console.error);
    }
  }
}());
