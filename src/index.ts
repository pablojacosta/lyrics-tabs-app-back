require("dotenv").config();
import express from "express";
import cors from "cors";
import axios, { AxiosRequestConfig } from "axios";
import cheerio from "cheerio";
const app = express();
app.use(cors());

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
      console.error(error);
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

      $("div[class*='Lyrics__Container']", html).each(function () {
        let scrappedLyrics = $(this);
        scrappedLyrics.find("a").each(function () {
          $(this).replaceWith($(this).find("span").html()!);
        });

        lyrics.push(scrappedLyrics.html());
      });
      res.send(lyrics);
    })
    .catch((err) => console.log(err));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
