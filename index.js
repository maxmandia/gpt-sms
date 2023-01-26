const express = require("express");
require("dotenv").config();
const handleUser = require("./handleUser");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
const axios = require("axios");
const twilio = require("twilio");
const client = twilio(process.env.SID, process.env.TWILLIOKEY);
const app = express();
const { initializeApp } = require("firebase-admin/app");
app.use(bodyParser.urlencoded({ extended: false }));
const configuration = new Configuration({
  apiKey: process.env.OPENAI,
});
const openai = new OpenAIApi(configuration);
const stripe = require("stripe")(process.env.STRIPE);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/message", (req, res) => {
  let smsText = req.body.Body;
  let smsPhone = req.body.From;
  handleUser.checkIfUserExists(smsPhone);

  // openai
  //   .createCompletion({
  //     model: "text-davinci-003",
  //     prompt: smsText,
  //     max_tokens: 1000,
  //     temperature: 0,
  //   })
  //   .then((resp) => {
  //     let answer = resp.data.choices[0].text;
  //     console.log(answer);

  //     client.messages
  //       .create({
  //         to: smsPhone,
  //         from: "+18126055420",
  //         body: answer,
  //       })
  //       .then(() => {
  //         console.log("message sent");
  //       })
  //       .catch((e) => console.log(e));
  //   })
  //   .catch((e) => {
  //     console.log(e.response.data);
  //   });
});

app.post("/create-payment-intent", async (req, res) => {
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.post("/checkout-session", async (req, res) => {
  const paymentLink = await stripe.paymentLinks.create({
    line_items: [
      {
        price: "price_1MUcjrIiD6NGAJACFWFjjQe7",
        quantity: 1,
      },
    ],
  });
  res.json({
    url: paymentLink.url,
  });
  res.end();
});

app.post(
  "/webhook-payment-success",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        process.env.STRIPE_ENDPOINT_SECRET
      );
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type == "charge.succeeded") {
      console.log(event.data.object);
      res.send(200);
    }
  }
);
app.listen(process.env.PORT, () => {
  console.log("starting server");
});
