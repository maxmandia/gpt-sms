const admin = require("firebase-admin");

module.exports = {
  checkIfUserExists: async function (user) {
    let response = await admin()
      .firestore()
      .collection("users")
      .doc(user)
      .get();
    console.log(response.docs.length);
  },
};
