import fs from "fs";
import path from "path";
import { format } from "date-fns";

// puppeteer
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());

// dynamic delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// scrape "expired" listings
export async function sigma1() {
  console.log("sigma-1 running...");
  try {
    // launch browser
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["no-sandbox"],
    });
    const page = await browser.newPage();

    // set page params
    await page.setViewport({ width: 1280, height: 800 });

    // nav to gta page
    await page.goto(
      `https://housesigma.com/on/toronto-real-estate/map/?center_marker=43.653226,-79.3831843&view=map&municipality=10343&status=sale-delisted&lat=43.735640&lon=-79.295293&zoom=10&page=1`,
      { waitUntil: "networkidle2" }
    );

    const epochs = await setSettings(page);
    const results = await getData(epochs, page);

    browser.close();
    return console.log("RESULTS: ", results.length);
    // return save(results);
  } catch (error) {
    console.log("Error at: ", "scrapeListings()", error);
  }
}

// sets scrape settings
async function setSettings(page) {
  try {
    // open dropdown filter
    await page.evaluate(() => {
      const options = document.querySelectorAll(
        'div[class^="app-dropdown-item-title"]'
      );
      const option90d = Array.from(options).find(
        (el) => el.innerText.trim() === "90d"
      );
      if (option90d) option90d.click();
    });

    await delay(1000);

    // set filter to 1 day
    await page.evaluate(() => {
      // Select <span> with title "Last 1 days"
      const spans = document.querySelectorAll("span[title]");
      const last1Day = Array.from(spans).find(
        (el) => el.getAttribute("title").trim() === "Last 1 days"
      );
      if (last1Day) last1Day.click();
    });

    await delay(1000);

    // select available paginated pages
    const epochs = await page.evaluate(() => {
      const links = Array.from(
        document.querySelectorAll("div.app-pagination a")
      );

      const pageNumbers = links
        .map((link) => parseInt(link.innerText.trim()))
        .filter((num) => !isNaN(num));

      return Math.max(...pageNumbers);
    });

    return epochs;
  } catch (error) {
    console.log("Error at setSettings() => ", error);
  }
}

// parse page data
async function getData(epochs, page, limit = 20) {
  try {
    let count = 1;
    const data = [];

    for (let i = 1; i <= epochs; i++) {
      console.log(`Epoch ${i}/${epochs}`);
      console.log("Count: ", count);
      console.log("-------------------------------");

      // set upper limit for listings collected
      // if (count >= limit) break;

      await page.goto(
        `https://housesigma.com/on/toronto-real-estate/map/?center_marker=43.653226,-79.3831843&view=map&municipality=10343&status=sale-delisted&lat=43.735640&lon=-79.295293&zoom=10&page=${i}`,
        { waitUntil: "networkidle2" }
      );

      await delay(2000);

      const results = await page.$$eval(
        ".pc-listing-card",
        (cards, startId) => {
          let id = startId;
          const output = [];
          const urls = [];

          for (const card of cards) {
            const statusEl = card.querySelector(".photo-bottom");
            const statusText = statusEl ? statusEl.innerText.trim() : null;

            if (
              statusText !== "Expired" &&
              statusText !== "Terminated" &&
              statusText !== "Deal Fell Through"
            )
              continue;

            const addressEl = card.querySelector(".address");
            const address = addressEl ? addressEl.innerText.trim() : null;

            const urlEl = card.querySelector(".photo-wrapper");
            const url = urlEl ? urlEl.getAttribute("href") : null;

            if (url && !urls.includes(url)) {
              urls.push(url);
              output.push({
                id: id++,
                status: statusText,
                mls: "",
                address: `${address.split(",")[1]?.trim().split(" ")[0]}, ON`,
                property_type: "",
                list_price: "",
                start_date: "",
                end_date: "",
                dom: 0,
                expired: "0 days ago",
                notes: "",
                url: `https://housesigma.com${url}`,
                stage: "init",
              });
            }
          }

          return output;
        },
        count
      );

      data.push(...results);
      count += results.length;
    }

    return data;
  } catch (error) {
    console.log("Error at getData() => ", error);
  }
}

// TODO write to db
// save listings
async function save(listings) {
  const dir = path.resolve("./tmp");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  const filePath = path.join(
    dir,
    `housesigma-listings-${format(
      new Date(),
      "yyyy-MM-dd-HH:mma"
    ).toLowerCase()}.json`
  );

  fs.writeFileSync(filePath, JSON.stringify(listings, null, 2));

  console.log(`SAVED`);
  console.log("-------------------------------");
}
