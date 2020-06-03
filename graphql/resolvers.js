const { spotify, spotifyAuth } = require('../spotify');
const qs = require('querystring');

const AuthError = new Error("Authorization header is missing");
const SessionError = new Error("Session Expired. Please refresh");

module.exports = {
    Query: {

        authenticate: async () => {
            const data = {
                "grant_type": "client_credentials"
            }
            const base64Client = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');
            const response = await spotifyAuth.post("/token", qs.encode(data), {
                headers: {
                    'Authorization': `Basic ${base64Client}`,
                }
            });

            if (response.status === 200) {
                const auth = response.data;
                return {
                    accessToken: auth.access_token,
                    expiresIn: auth.expires_in
                }
            }
            else throw new Error('Authentication failed')
        },

        getPlaylists: async (_, __, context) => {
            const authHeader = context.req.headers.authorization;
            if (authHeader) {
                const response = await spotify.get("/browse/featured-playlists", {
                    headers: {
                        "Authorization": authHeader
                    }
                });

                if (response.status === 200) {
                    const { playlists: { items } } = response.data;
                    return items.map(playlist => ({
                        id: playlist.id,
                        name: playlist.name,
                        description: playlist.description,
                        imageUrl: playlist.images[0].url,
                        tracksCount: playlist.tracks.total
                    }))
                }
                else if (response.status === 401) throw SessionError;
                else throw new Error('Problem fetching featured playlists');
            }
            else throw AuthError;
        },

        getTracks: async (_, { playlistId }, context) => {
            const authHeader = context.req.headers.authorization;
            if (authHeader) {

                const response = await spotify.get(`/playlists/${playlistId}`, {
                    headers: {
                        "Authorization": authHeader
                    }
                });

                if (response.status === 200) {
                    const { tracks: { items } } = response.data;
                    let tracks = [];
                    items.forEach(playlistTrack => {
                        if (playlistTrack.track)
                            tracks.push({
                                id: playlistTrack.track.id,
                                name: playlistTrack.track.name,
                                artists: playlistTrack.track.artists.map(artist => ({
                                    id: artist.id,
                                    name: artist.name
                                })),
                                duration: playlistTrack.track.duration_ms,
                                audioPreview: playlistTrack.track.preview_url,
                                popularity: playlistTrack.track.popularity,
                                imageUrl: playlistTrack.track.album.images[0].url,
                                releasedTime: playlistTrack.added_at
                            })
                    })
                    return tracks;
                }
                else if (response.status === 401) throw SessionError;
                else throw new Error('Problem fetching tracks from the playlist');
            }
            else throw AuthError;
        }

    }
}