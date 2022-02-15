/**
 *
 * @param {Array} listOfTitles
 * @returns return user feed back
 */
const constructUserFeedBack = (listOfTitles) => {
  return `  <html>
    <head></head>
    <body>
    <h1> Following are the titles of given websites: </h1>
    <ul> ${listOfTitles}</ul>
    </body>
    </html>`;
};

module.exports = constructUserFeedBack;
