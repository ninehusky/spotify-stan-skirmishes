(function (){
  const SpotifyWebApi = require('spotify-web-api-node');
  let spoitfyWebApi;
  let url;
  let accessToken = null; // maybe i shouldnt
  const scopes = ['user-read-private', 'user-read-email'];
  const state = 'some-state-of-my-choice';

  window.addEventListener('load', init);

  function init() {
    document.getElementById('get-token').addEventListener('click', getToken);
    spotifyWebApi = new SpotifyWebApi({
      clientId: 'e7f6878314bd41d0ae49119dfc6e8174',
      redirectUri: 'http://localhost:3000/auth/spotify/success'
    });
  }

  function getToken() {
    console.log('ayooo');
    url = spotifyWebApi.createAuthorizeURL(scopes, state);
    window.open(url);
  }

  function parseToken(token) {
    accessToken = token; //TODO: cookie?????
  }

}());
