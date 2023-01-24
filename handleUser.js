const admin = require("./firebase");

module.exports = {
  checkIfUserExists: async function (phone) {
    let response = await admin.admin
      .firestore()
      .collection("users")
      .doc(phone)
      .get();
    if (response.exists) {
      // handle logic yea
    } else {
      admin.admin
        .firestore()
        .collection("users")
        .doc(phone)
        .create({
          phoneNumber: phone,
          createdAt: new Date(),
        })
        .then(() => {
          console.log("user created");
        })
        .catch((e) => {
          console.log(e);
        });
    }
  },
};
