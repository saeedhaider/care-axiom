const url = require("url");

const bodyValidator = (req, res, next) => {
  // Parse URL params
  let {
    query: { address },
  } = url.parse(req.url, true);

  if (!Array.isArray(address)) {
    address = Array(address)
  }
  // Sanity check
  if (!address || !address.length) {
    res.status(422).json("Nothing to process");
    return;
  }
  req.addresses = address;
  next();
};

module.exports = bodyValidator;
