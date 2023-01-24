const admin = require("./firebase");

module.exports = {
  checkIfUserExists: async function (user) {
    let response = await admin.admin
      .firestore()
      .collection("users")
      .doc("sfVyAluoYBe5X4VFjkTq")
      .get();
    console.log(response.exists);
  },
};
