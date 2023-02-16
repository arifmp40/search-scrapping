import puppeteer, { EventEmitter } from "puppeteer";
import express from "express";
import { benchmark } from "./benchmark";
const app = express();
const port = process.env.PORT || 6969;
let count: { [props: string]: any } = {};
let watch_time: { [props: string]: any } = {};
let initiate_views: { [props: string]: any } = {};

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

    const live_views_el = await page.waitForSelector(
      `.ytd-watch-metadata#info span`,
      {
        timeout: 0,
      }
    );

    const live_views = await live_views_el?.evaluate(
      (e) => +e.textContent!.substring(0, e.textContent!.length - 5)
    );
    !initiate_views[name] && (initiate_views[name] = live_views);

    const time = Number((random(min || 10, duration) * 1000).toFixed(2));
    const runner_time = benchmark.end_point().toFixed(2);

    setTimeout(async () => {
      count[name]++;
      watch_time[name] += time;
      console.log(
        `Viewed - ${count[name]} // Current time - ${(time / 1000).toFixed(
          2
        )} sec // Total time - ${(watch_time[name] / 60000).toFixed(
          2
        )} min // Live - ${live_views} // Runner time ${runner_time} sec ---> ${name} Accuracy(${(
          ((live_views! - initiate_views[name]) / count[name]) *
          100
        ).toFixed(2)})% \n`
      );

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
get_views({
  url: "https://www.youtube.com/watch?v=RhOWleIHKt4",
  name: "After Dark",
  duration: 40,
  min: 22,
  channel: "https://www.youtube.com/@sirvenux",
});
get_views({
  url: "https://www.youtube.com/watch?v=kCsi2QieQAo",
  name: "Highlight",
  duration: 130,
  min: 70,
  channel: "https://www.youtube.com/@sirvenux",
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
