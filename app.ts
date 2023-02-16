import puppeteer, { EventEmitter } from "puppeteer";
import express from "express";
import { benchmark } from "./benchmark";
const app = express();
const port = process.env.PORT || 3000;
let count: { [props: string]: any } = {};
let watch_time: { [props: string]: any } = {};

process.setMaxListeners(Infinity);

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min) + Math.random();
}

async function get_views(props: {
  url: string;
  channel: string;
  name: string;
  duration: number;
  min?: number;
}) {
  const { duration, name, url, min, channel } = props;
  !count[name] && (count[name] = 0);
  !watch_time[name] && (watch_time[name] = 0);

  const href = url.substring(url.indexOf("/watch"), url.length);
  benchmark.start_point();
  try {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto(channel + "/videos", { timeout: 0 });

    await page.evaluate(() => {
      localStorage.setItem(
        "yt-player-quality",
        JSON.stringify({
          data: { quality: 144, previousQuality: 144 },
          expiration: 1707632422563,
          creation: 1676528422563,
        })
      );
    });

    const video = await page.waitForSelector(`a[href="${href}"]`, {
      timeout: 0,
    });

    await video?.click();
    const time = Number((random(min || 10, duration) * 1000).toFixed(2));
    const runner_time = benchmark.end_point().toFixed(2);

    setTimeout(async () => {
      count[name]++;
      watch_time[name] += time;
      console.log(
        `Viewed - ${count[name]} // Current Watch time - ${(
          time / 1000
        ).toFixed(2)} sec // Total Watch time - ${(
          watch_time[name] / 60000
        ).toFixed(2)} min // Runner time ${runner_time} sec ---> ${name}`
      );
      console.log(benchmark.end_point());
      await browser.close();

      get_views(props);
    }, time);
  } catch (error) {
    console.log(error);
  }
}

get_views({
  url: "https://www.youtube.com/watch?v=8YTRTUfNWxQ",
  name: "ABDULLAH",
  duration: 24,
  min: 15,
  channel: "https://www.youtube.com/@blog-starmusic5934",
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
