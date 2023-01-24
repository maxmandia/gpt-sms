const admin = require("./firebase");
const client = twilio(process.env.SID, process.env.TWILLIOKEY);

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
      client.messages({
        to: phone,
        from: "+18126055420",
        body: `Welcome to MeAndGPT! Visit www.meandgpt.com/signup/${phone} to get started`,
      });
      // admin.admin
      //   .firestore()
      //   .collection("users")
      //   .doc(phone)
      //   .create({
      //     phoneNumber: phone,
      //     createdAt: new Date(),
      //   })
      //   .then(() => {
      //     console.log("user created");
      //   })
      //   .catch((e) => {
      //     console.log(e);
      //   });
    }
  },
};
