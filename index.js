const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
const axios = require("axios");
const twilio = require("twilio");
const client = twilio(process.env.SID, process.env.TWILLIOKEY);
const app = express();

const configuration = new Configuration({
  apiKey: process.env.OPENAI,
});
const openai = new OpenAIApi(configuration);

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/message", (req, res) => {
  console.log("new request");
  let smsText = req.body.Body;
  let smsPhone = req.body.From;
  console.log(smsPhone);
  openai
    .createCompletion({
      model: "text-davinci-003",
      prompt: smsText,
      max_tokens: 1000,
      temperature: 0,
    })
    .then((resp) => {
      let answer = resp.data.choices[0].text;
      console.log(answer);

      client.messages
        .create({
          to: smsPhone,
          from: "+18126055420",
          body: answer,
        })
        .then(() => {
          console.log("message sent");
        })
        .catch((e) => console.log(e));
    })
    .catch((e) => {
      console.log(e.response.data);
    });
});

app.listen(process.env.PORT, () => {
  console.log("listenin");
});
