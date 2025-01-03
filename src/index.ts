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
      console.error(error);
    });
});

app.get("/lyrics", async (req, res) => {
  const getHeadersList = async () => {
    const url = `http://headers.scrapeops.io/v1/browser-headers?api_key=${process.env.SCRAPE_OPS_API_KEY}`;
    const response = await axios.get(url);
    return response.data.result || [];
  };

  const getRandomHeader = async (headerList: string[]) => {
    const randomIndex = Math.floor(Math.random() * headerList.length);
    return headerList[randomIndex];
  };

  const headerList = await getHeadersList();

  const options = {
    method: "GET",
    url: req.query.passedUrl,
    responseType: "text",
    headers: getRandomHeader(headerList),
  };

  axios
    .request(options as any)
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
    .catch((err) => console.log(err));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
