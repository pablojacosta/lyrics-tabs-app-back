require("dotenv").config();
import axios, { AxiosRequestConfig } from "axios";
import * as cheerio from "cheerio";
import cors from "cors";
import express from "express";
const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hi! This is Lyrics and Tabs Finder's backend. :)");
});

app.get("/songs", (req, res) => {
  const options: AxiosRequestConfig = {
    method: "GET",
    url: "https://genius-song-lyrics1.p.rapidapi.com/search/",
    params: {
      q: req.query.newSearch,
      per_page: "10",
      page: "1",
    },
    headers: {
      "X-RapidAPI-Key": process.env.API_KEY as string,
      "X-RapidAPI-Host": "genius-song-lyrics1.p.rapidapi.com",
    },
  };

  axios
    .request(options)
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.error("ERROR ON SONGS", error);
    });
});

app.get("/lyrics", (req, res) => {
  const options = {
    method: "GET",
    url: req.query.passedUrl,
    responseType: "text",
  };

  axios
    .request(options as AxiosRequestConfig)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      let lyrics: any[] = [];

      $("div[class*='Lyrics-sc-1bcc94c6-1 bzTABU']", html).each(function () {
        let scrappedLyrics = $(this);
        scrappedLyrics.find("a").each(function () {
          $(this).replaceWith($(this).find("span").html()!);
        });

        lyrics.push(scrappedLyrics.html());
      });
      res.send(lyrics[0]);
    })
    .catch((err) => console.log("ERROR ON LYRICS", err));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
