"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.send("Hi! This is Lyrics and Tabs Finder's backend. :)");
});
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
        const $ = cheerio.load(html);
        let lyrics = [];
        $("div[class*='Lyrics-sc-1bcc94c6-1 bzTABU']", html).each(function () {
            let scrappedLyrics = $(this);
            scrappedLyrics.find("a").each(function () {
                $(this).replaceWith($(this).find("span").html());
            });
            lyrics.push(scrappedLyrics.html());
        });
        res.send(lyrics[0]);
    })
        .catch((err) => console.log(err));
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
