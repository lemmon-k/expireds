import fs from "fs";
import path from "path";
import axios from "axios";

// puppeteer
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());

// TODO fetch from db
const param = "housesigma-listings-2025-11-27-18:28pm";
const BASE_PATH = `./tmp/${param}.json`;

// dynamic delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// scrape "expired" listings
export async function sigma2() {
  console.log("sigma-2 running...");
  try {
    // read JSON file
    const filePath = path.resolve(BASE_PATH);
    const rawData = fs.readFileSync(filePath, "utf-8");
    const listings = JSON.parse(rawData);

    // launch browser
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["no-sandbox"],
    });
    const page = await browser.newPage();

    // set page params
    await page.setViewport({ width: 1280, height: 800 });

    let count = 1;
    let removed = 0;
    for (let i = listings.length - 1; i >= 0; i--) {
      console.log(`Epoch: ${count}/${listings.length}`);
      console.log("Removed: ", removed);
      console.log("-------------------------------");

      const listing = listings[i];
      if (!listing.url) continue;

      await page.goto(listing.url, { waitUntil: "networkidle2" });
      await delay(2000);

      const updatedData = await getData(page);

      // update only status and address
      if (
        !updatedData?.propertyType?.toLowerCase().includes("condo") &&
        (updatedData.status === "Expired" ||
          updatedData.status === "Terminated" ||
          updatedData.status === "Deal Fell Through")
      ) {
        count++;
        listings[i].status = updatedData.status || listings[i].status;
        listings[i].property_type =
          updatedData.propertyType || listings[i].property_type;
        listings[i].address = updatedData.address || listings[i].address;
        listings[i].stage = "sanitized";
      } else {
        removed++;
        listings.splice(i, 1); // safe removal
      }
    }

    await browser.close();

    const indexedListings = listings.map((item, index) => {
      item.id = index + 1;
      return item;
    });

    // save listings
    return save(filePath, indexedListings);
  } catch (error) {
    console.log("Error at scrapeListings():", error);
  }
}

// TODO write to db
// save data to db, and local file in dev
async function save(filePath, listings) {
  if (process.env.ENV === "prod") {
    return console.log(listings.length);
  }

  // overwrite local file
  fs.writeFileSync(filePath, JSON.stringify(listings, null, 2), "utf-8");
  console.log("SAVED");
  console.log("-------------------------------");
}

// parse page data
async function getData(page) {
  const data = await page.evaluate(() => {
    const statusEl = document.querySelector(".photo-bottom");
    const status = statusEl ? statusEl.innerText.trim() : null;

    const propertyTypeEl = document.querySelector(".property-type");
    const propertyType = propertyTypeEl
      ? propertyTypeEl.innerText.trim()
      : null;

    const urlEl = document.querySelector('meta[name="og:url"]');
    const url = urlEl ? urlEl.getAttribute("content") : null;

    return { status, propertyType, url };
  });

  const address = data.url ? await parseAddressUrl(data.url) : "Unknown";

  return { status: data.status, propertyType: data.propertyType, address };
}

// parse address from url string
async function parseAddressUrl(url) {
  const parts = url.split("/").filter(Boolean);

  let province = null;
  let city = null;
  let street = null;

  for (const part of parts) {
    // Province is always 2 letters like "on", "bc", "ab"
    if (!province && /^[a-z]{2}$/.test(part)) {
      province = part.toUpperCase();
      continue;
    }

    // Street address: must start with a number
    if (!street && /^\d+[-a-z0-9]+/i.test(part)) {
      street = part.replace(/-/g, " ");
      continue;
    }

    // City: ends with -real-estate OR just a city name
    if (!city) {
      if (part.endsWith("-real-estate")) {
        city = part.replace("-real-estate", "").replace(/-/g, " ");
      } else if (
        /^[a-z-]+$/i.test(part) &&
        !/home|condo|townhouse|sale/i.test(part)
      ) {
        // fallback city detection
        city = part.replace(/-/g, " ");
      }
    }
  }

  // Capitalize city
  if (city) {
    city = city.replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // Final output
  if (street && city && province) {
    return `${street}, ${city}, ${province}`.toUpperCase();

    // TODO enable for prod
    const address = await geocoding(`${street}, ${city}, ${province}`);
    return address;
  }

  return null;
}

// geocoding address
async function geocoding(malformed) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${malformed
    .split(" ")
    .join("+")}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await axios.get(url);

    const results = response.data.results;
    if (results && results.length > 0) {
      return results[0].formatted_address;
    }

    return null;
  } catch (error) {
    console.log("Error at geocoding: ", error.message);
    return null;
  }
}
