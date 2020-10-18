const expressJwt = require('express-jwt');
const axios = require('axios');

function isAuthenticated() {

    return expressJwt({ secret: "piyush-employee-portal-secret", algorithms: ['HS256']/*, isRevoked*/ })
        .unless({
            path: [
                // public routes that don't require authentication are mentioned below
                '/',
                '/ui/register',
                '/ui/login',
                '/users/login',
                '/users/register',
                '/users/uploadProfilePic',
            ]
        });
}

module.exports = {
    isAuthenticated
};


async function isRevoked(req, payload, done) {

    const user = await axios.get('http://localhost:3000/users/' + payload.id);

    if (!user) {
        return done(null, true);
    }
    done();
};