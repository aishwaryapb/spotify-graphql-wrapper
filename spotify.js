const axios = require('axios');

const spotify = axios.create({
    baseURL: "https://api.spotify.com/v1",
    headers: {
        'Content-Type': 'application/json'
    }
});

const spotifyAuth = axios.create({
    baseURL: "https://accounts.spotify.com/api",
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

module.exports = {
    spotify,
    spotifyAuth
}