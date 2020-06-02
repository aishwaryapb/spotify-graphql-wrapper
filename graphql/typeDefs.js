const { gql } = require('apollo-server');

module.exports = gql`

    type Auth {
        accessToken: String!
        expiresIn: Int!
    }

    type Playlist {
        id: String!
        name: String!
        imageUrl: String!
        tracksCount: Int!
        description: String!
    }

    type Artist {
        id: String!
        name: String!
    }

    type Track {
        id: String!
        name: String!
        imageUrl: String!
        releasedTime: String!
        artists: [Artist]
        duration: Int!
        audioPreview: String
        popularity: Int!
    }

    type Query {
        authenticate: Auth!
        getPlaylists: [Playlist]
        getTracks(playlistId: String!): [Track]
    }
`;
