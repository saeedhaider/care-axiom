const express = require("express");
const request = require("request");
const axios = require("axios");
const cheerio = require('cheerio');
const async = require("async");

const bodyValidator = require("./middlewares/bodyValidatorMiddleware");
const constructUserFeedBack = require("./common/userFeedBack");

// Initialize express
const app = express();
const port = 3000;

app.get("/I/want/title/promise", bodyValidator, (req, res) => {
  try {
    let listOfTitles = [];
    const { addresses } = req;
    let totalAddresses = addresses.length;

    const promises = addresses.map(address => axios.get(address));

    Promise.all(promises).then((results) => {
      results.forEach((result) => {
        const $ = cheerio.load(result.data);
        const title = $("title").text();
        if (title) listOfTitles.push(`<li>${addresses} - ${title} </li>`);

        setTimeout(function () {
          totalAddresses -= 1;
          if (totalAddresses === 0) {
              // return the response when fetch the titles of all addresses
              res.status(200).send(constructUserFeedBack(listOfTitles));
          }
        }, 1);
      });
    }).catch(err => {
      throw err;
    });
  
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/I/want/title/callback", bodyValidator, (req, res) => {
  try {
    let listOfTitles = [];
    const { addresses } = req;
    let totalAddresses = addresses.length;

    addresses.forEach(address => {
      // get the html of webpage and grab title tag
      request.get({ url: address }, (error, response) => {
        if (!error && response.statusCode == 200) {
          const $ = cheerio.load(response.body);
          const title = $("title").text();
          if (title) listOfTitles.push(`<li>${address} - ${title} </li>`);

          setTimeout(function () {
            totalAddresses -= 1;
            if (totalAddresses === 0) {
                // return the response when fetch the titles of all addresses
                res.status(200).send(constructUserFeedBack(listOfTitles));
            }
          }, 1);
        }
       });
    });

  } catch (err) {
    res.status(400).json("Something went wrong");
  }
});

app.get("/I/want/title/async", bodyValidator, async (req, res) => {
  try {
    const { addresses } = req;
    const listOfTitles = await async.map(addresses, async (address) => {
      const {data} = await axios.get(address);
      const $ = cheerio.load(data);
      const title = $("title").text();
      return `<li>${address} - ${title} </li>`;
    });

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
