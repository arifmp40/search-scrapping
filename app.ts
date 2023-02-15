import puppeteer, { EventEmitter } from "puppeteer";
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
let count: { [props: string]: any } = {};
let watch_time: { [props: string]: any } = {};

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min) + Math.random();
}

function get_views(url: string, name: string, duration: number, min?: number) {
  !count[name] && (count[name] = 0);
  !watch_time[name] && (watch_time[name] = 0);
  puppeteer.launch({ headless: true }).then((browser) => {
    // (async function () {
    //   const page = await browser.newPage();
    //   await page.goto("https://bi.social/did", { timeout: 0 });
    //   const search_btn = ".searchButton";
    //   const domains_arr = domains.split("\n");
    //   for (let i = 0; i < domains_arr.length; i++) {
    //     const domain = domains_arr[i];
    //     const input = await page.$("input");
    //     await input?.focus();
    //     await page.keyboard.down("Control");
    //     await page.keyboard.press("a");
    //     await page.keyboard.up("Control");
    //     await page.keyboard.press("Backspace");
    //     await page.type(`input`, domain);
    //     await page.waitForSelector(search_btn);
    //     await page.click(search_btn);
    //     const status = await page.waitForSelector(".judgment .status", {
    //       timeout: 0,
    //     });
    //     const value = await page.evaluate((e) => e.textContent, status);
    //     if (value === "Registrable") {
    //       fs.appendFile(
    //         "result.txt",
    //         `${count}. ${domain} - https://bi.social/did \n`,
    //         (err) => {}
    //       );
    //       count++;
    //     }
    //     console.log("social - progress - " + (i + 1) / 100);
    //     domain === "æternity" && browser.close();
    //   }
    // })();
    // (async function () {
    //   try {
    //     const page = await browser.newPage();
    //     await page.goto("https://dmail.ai/presale", { timeout: 0 });
    //     const domains_arr = domains.split("\n");
    //     for (let i = 0; i < domains_arr.length; i++) {
    //       const domain = domains_arr[i];
    //       const input = await page.$("input");
    //       await input?.focus();
    //       await page.keyboard.down("Control");
    //       await page.keyboard.press("a");
    //       await page.keyboard.up("Control");
    //       await page.keyboard.press("Backspace");
    //       await page.type(`input`, domain);
    //       const status = await page.waitForSelector(".email-suffix + div", {
    //         timeout: 0,
    //       });
    //       const value = await page.evaluate((e) => e?.className, status);
    //       if (value === "success") {
    //         fs.appendFile(
    //           "result.txt",
    //           `${count}. ${domain} - https://dmail.ai/presale \n`,
    //           (err) => {}
    //         );
    //         count++;
    //       }
    //       console.log("dmail - progress - " + (i + 1) / 100);
    //       domain === "æternity" && browser.close();
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // })();
    (async function () {
      const page = await browser.newPage();
      await page.goto(url, { timeout: 0 });
      const play = await page.waitForSelector(".ytp-play-button", {
        timeout: 0,
      });
      await play?.click();
      const time = Number((random(min || 10, duration) * 1000).toFixed(2));

      setTimeout(async () => {
        count[name]++;
        watch_time[name] += time;
        console.log(
          `Viewed - ${count[name]} // Current Watch time - ${(
            time / 1000
          ).toFixed(2)} seconds // Total Watch time - ${(
            watch_time[name] / 60000
          ).toFixed(2)} minutes ---> ${name}`
        );
        await browser.close();
        get_views(url, name, duration);
      }, time);
    })();
  });
}

get_views("https://www.youtube.com/watch?v=qUya-EmYxSc", "GLOO WALL", 18);
get_views("https://www.youtube.com/watch?v=qUya-EmYxSc", "GLOO WALL", 18);
get_views("https://www.youtube.com/watch?v=qUya-EmYxSc", "GLOO WALL", 18);
get_views("https://www.youtube.com/watch?v=qUya-EmYxSc", "GLOO WALL", 18);
get_views("https://www.youtube.com/watch?v=8peDaoF3qgw", "ELON MUSK", 60, 40);
// get_views("https://www.youtube.com/watch?v=7D1XsoQJLXo", "ADHI RAAT", 28, 16);
// get_views("https://www.youtube.com/watch?v=RhOWleIHKt4", "AFTER DARK", 40, 26);
// get_views("https://www.youtube.com/watch?v=RhOWleIHKt4", "AFTER DARK", 40, 26);
// get_views("https://www.youtube.com/watch?v=RhOWleIHKt4", "AFTER DARK", 40, 26);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
