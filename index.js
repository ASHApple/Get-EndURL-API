const express = require("express");
const app = express();
const request = require("request-promise-native");
const serverless = require('serverless-http');

app.get("/.netlify/functions/server", function(req, res) {
  console.log(`${new Date()} | ${req.query.url ? req.query.url : "[NO URL]"}`);

  if (!req.query.url) {
    res.status(400);
    return res.json({
      error: true,
      message: "No Url"
    });
  }

  const option = {
    headers: {
      "User-Agent": process.env.UserAgent
    },
    url: req.query.url,
    followRedirect: true,
    followAllRedirects: true,
    maxRedirects: 20,
    removeRefererHeader: true,
    resolveWithFullResponse: true
  };

  request.get(option).then(result => {
    const obj = {
      error: false,
      message: null,
      href: result.request.href,
      host: result.request.host
    };
    return res.json(obj);
  }).catch(err => {
    console.error(err.stack);

    const obj = {
      error: true,
      message: "Server Error",
      href: null,
      host: null
    };
    res.status(500);
    return res.json(obj);
  });
});

module.exports = app;
module.exports = serverless(app);
