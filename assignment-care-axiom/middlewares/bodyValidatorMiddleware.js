const url = require("url");

const bodyValidator = (req, res, next) => {
  // Parse URL params
  const {
    query: { address },
  } = url.parse(req.url, true);

  // Sanity check
  if (!address || !address.length) {
    res.status(422).json("Nothing to process");
    return;
  }
  req.address = address;
  next();
};

module.exports = bodyValidator;
