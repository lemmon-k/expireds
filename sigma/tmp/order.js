import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
const param = args[0];
const filePath = path.resolve(`${param}.json`);

// Read file
const rawData = fs.readFileSync(filePath, "utf8");
const listings = JSON.parse(rawData);

function rankListings(listings) {
const domValue = (item) => (typeof item.dom === "number" ? item.dom : Infinity);

// Remove duplicates by address
const seen = new Set();
const uniqueListings = listings.filter((item) => {
const address = item.address?.trim();
if (!address || seen.has(address)) return false;
seen.add(address);
return true;
});

const expired = uniqueListings.filter((item) => item.status === "Expired");
const nonExpired = uniqueListings.filter((item) => item.status !== "Expired");

expired.sort((a, b) => domValue(a) - domValue(b));
nonExpired.sort((a, b) => domValue(a) - domValue(b));

return [...expired, ...nonExpired].map((item, index) => ({
...item,
id: index + 1,
}));
}

// Sort, remove duplicates, and overwrite file
const sortedListings = rankListings(listings);
fs.writeFileSync(filePath, JSON.stringify(sortedListings, null, 2), "utf8");

console.log(`SAVED`);
