// twilio
import Twilio from "twilio";
// gpt
import { gpt } from "./gpt.js";

// send sms
export async function sms() {
  try {
    // init twillio
    const TWILIO_SID = process.env.TWILIO_SID;
    const TWILIO_TOKEN = process.env.TWILIO_TOKEN;
    const client = new Twilio(TWILIO_SID, TWILIO_TOKEN);

    // TODO fetch data from db
    const data = {
      status: "Expired",
      mls: "E12428631",
      address: "115 WINTER GARDENS TRAIL, SCARBOROUGH, ON",
      property_type: "Detached",
      list_price: "$999,999",
      start_date: "2025-09-26",
      end_date: "2025-11-25",
      dom: 60,
      expired: "2 days ago",
    };

    if (!data || data.length === 0) throw new Error("no-data");

    // gMaps base url
    const map = `https://www.google.com/maps/place`;

    // deconstruct incoming data
    const {
      status,
      address,
      property_type: type,
      list_price: price,
      start_date: start,
      end_date: end,
      expired,
      url,
    } = data;

    // build sms message
    // const message = `${status} Listing:\n${address}\n\n${type}\n\nList Price: ${price}\nStrt Date: ${start}\nEnd Date: ${end}\n${map}/${encodeURIComponent(
    //   address
    // )}`;

    // build gpt message
    let message = await gpt(data);
    if (!message) throw new Error("no-gpt");
    message = `${message}\n${map}/${encodeURIComponent(address)}`;

    // send sms
    await client.messages.create({
      body: message,
      from: "+18205004651",
      to: "+17785879496", // TODO
    });

    console.log('SMS')
    return message;
  } catch (error) {
    console.error("Error sending message:", error);
    return false;
  }
}
