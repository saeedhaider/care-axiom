const express = require("express");
const axios = require("axios");
const async = require("async");

const bodyValidator = require("./middlewares/bodyValidatorMiddleware");
const constructUserFeedBack = require("./common/userFeedBack");

// Initialize express
const app = express();
const port = 3000;

app.get("/I/want/title/promise", bodyValidator, async (req, res) => {
  try {
    let listOfTitles = [];

    const { address } = req;
    listOfTitles = await Promise.all(
      address.map(async (address) => {
        const { data } = await axios.get(address);
        // Find title tag/value
        const title = data.match("<title>(.*?)</title>")[1];
        if (title) return `<li>${address} - ${title} </li>`;
      })
    );

    // Sending response back
    res.status(200).send(constructUserFeedBack(listOfTitles));
  } catch (error) {
    console.log(error);
    res.status(400).send("Something went wrong");
  }
});

app.get("/I/want/title/callback", bodyValidator, async (req, res) => {
  try {
    let listOfTitles = [];
    let promises = [];
    const { address } = req;

    listOfTitles = address.map(async (url) => {
      promises.push(
        axios
          .get(url)
          .then(({ data }) => {
            const title = data.match("<title>(.*?)</title>")[1];
            listOfTitles.push(`<li>${url} - ${title} </li>`);
          })
          .catch((error) => {
            console.log(error);
            listOfTitles.push(`<li>${url} - NO RESPONSE </li>`);
          })
      );
    });

    await Promise.all(promises);
    res.status(200).send(constructUserFeedBack(listOfTitles));
  } catch (err) {
    res.status(400).json("Something went wrong");
  }
});

app.get("/I/want/title/async", bodyValidator, async (req, res) => {
  try {
    const { address } = req;
    let listOfTitles = [];
    const promises = [];

    async.each(address, (address) => {
      promises.push(
        axios
          .get(address)
          .then(({ data }) => {
            const title = data.match("<title>(.*?)</title>")[1];
            listOfTitles.push(`<li>${address} - ${title} </li>`);
          })
          .catch((error) => {
            console.log(error);
            listOfTitles.push(`<li>${address} - NO RESPONSE </li>`);
          })
      );
    });
    await Promise.all(promises);
    res.status(200).send(constructUserFeedBack(listOfTitles));
  } catch (error) {
    console.log("error", error);
    res.status(400).json("Something went wrong");
  }
});

app.get("*", function (req, res) {
  res.status(404).send("I do not have what you need!!!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
