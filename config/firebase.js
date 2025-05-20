const admin = require('firebase-admin');
const serviceAccount = require('./articles-project-auth-firebase-admin.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;

