"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.static("dist"));
app.get("/songs", (req, res) => {
    const options = {
        method: "GET",
        url: "https://genius-song-lyrics1.p.rapidapi.com/search/",
        params: {
            q: req.query.newSearch,
            per_page: "10",
            page: "1",
        },
        headers: {
            "X-RapidAPI-Key": process.env.API_KEY,
            "X-RapidAPI-Host": "genius-song-lyrics1.p.rapidapi.com",
        },
    };
    axios_1.default
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
    axios_1.default
        .request(options)
        .then((response) => {
        const html = response.data;
        const $ = cheerio_1.default.load(html);
        let lyrics = [];
        $("div[class*='Lyrics__Container']", html).each(function () {
            let scrappedLyrics = $(this);
            scrappedLyrics.find("a").each(function () {
                $(this).replaceWith($(this).find("span").html());
            });
            lyrics.push(scrappedLyrics.html());
        });
        res.send(lyrics);
    })
        .catch((err) => console.log(err));
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
