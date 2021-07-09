const express = require("express");
const app = express();
const axios = require("axios");
const serverless = require('serverless-http');
const moment = require("moment");

app.get("/", async function(req, res) {
  const timezone = new Date().getTimezoneOffset() / 60 * -1;
  const time = `${moment().format("LLLL")} UTC${timezone > 0 ? "+" : ""}${timezone}`;

  if (!req.query.url) {
    console.log(`${time}: ${req.ip} | [400] [NO URL]`);

    res.status(400);
    return res.json({
      error: true,
      message: "No Url"
    });
  }

  try {
    const response = await axios({
      method: 'get',
      headers: {
        "Accept-Language": "en-US,en;q=0.5",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36"
      },
      url: req.query.url,
    });

    console.log(response.request._redirectable._currentUrl);

    const obj = {
      error: false,
      message: null,
      href: response.request._redirectable._currentUrl,
      host: new URL(response.request._redirectable._currentUrl).host
    };

    console.log(`${time}: ${req.ip} | [200] ${req.query.url ? req.query.url : "[NO URL]"} → ${obj.href}`);

    res.json(obj);
  } catch (e) {
    console.error(`${time}: ${req.ip} | [500] ${req.query.url ? req.query.url : "[NO URL]"}`);
    console.error(e.stack);

    const obj = {
      error: true,
      message: "Server Error",
      href: null,
      host: null
    };

    res.status(500);
    return res.json(obj);
  }
});

module.exports = app;
module.exports.handler = serverless(app);
