$( document ).ready(function() {
    // Helper Function to Extract Access Token for URL
   const getUrlParameter = (sParam) => {
     let sPageURL = window.location.search.substring(1),////substring will take everything after the https link and split the #/&
         sURLVariables = sPageURL != undefined && sPageURL.length > 0 ? sPageURL.split('#') : [],
         sParameterName,
         i;
     let split_str = window.location.href.length > 0 ? window.location.href.split('#') : [];
     sURLVariables = split_str != undefined && split_str.length > 1 && split_str[1].length > 0 ? split_str[1].split('&') : [];
     for (i = 0; i < sURLVariables.length; i++) {
         sParameterName = sURLVariables[i].split('=');
         if (sParameterName[0] === sParam) {
             return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
         }
     }
 };


   const accessToken = getUrlParameter('access_token');

   const client_id = "63cac51f2c10497b80b4d4f8044ecbe2";

   let redirect_uri = encodeURIComponent("https://albertogonzalez01.github.io/SpotifyAPI/");
   const redirect = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}`;


   if(accessToken == null || accessToken == "" || accessToken == undefined){
     window.location.replace(redirect);
   }


   $('#form').on('submit', function (e) {
    e.preventDefault();
    let search = $('#campo').val();
    let searchQuery = encodeURI(search);
    $.ajax({
        url: 'https://api.spotify.com/v1/search?q=' + searchQuery + '&type=track',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (response) {
            console.log(response);
            let track = response.tracks.items[0];
            console.log(track);

            // Convertir duración de milisegundos a formato "min:seg"
            let duration_ms = track.duration_ms;
            let minutes = Math.floor(duration_ms / 60000);
            let seconds = Math.floor((duration_ms % 60000) / 1000).toString().padStart(2, '0');
            let duration = `${minutes}:${seconds}`;

            $('#resultado').html(`
                <h1>Canción: ${track.name}</h1>
                <img src="${track.album.images[0].url}" alt="${track.name}">
                <p><b>Artista:</b> ${track.artists[0].name}</p>
                <p><b>Álbum:</b> ${track.album.name}</p>
                <p><b>Duración:</b> ${duration}</p>
                <p><b>Popularidad:</b> ${track.popularity}/100</p>
                <a href="${track.external_urls.spotify}" target="_blank">
                    Escuchar en Spotify
                </a>
            `);

           
        }
    });
});
 }); 