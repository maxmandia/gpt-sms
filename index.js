const key = "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";
const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
const axios = require("axios");
const twilio = require("twilio");
const client = twilio(
  "AC321769bf8114afb8a7ad39176b62011c",
  "eb5a8971e44855a9f2768a4a1de27100"
);
const app = express();

const configuration = new Configuration({
  apiKey: key,
});
const openai = new OpenAIApi(configuration);

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/message", (req, res) => {
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

app.listen(3000, () => {
  console.log("listenin");
});
