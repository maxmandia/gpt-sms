require("dotenv").config();

admin = require("firebase-admin");
var serviceAccount = JSON.parse(process.env.FIREBASE);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
module.exports = admin;
