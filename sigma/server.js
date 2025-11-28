import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { sigma1 } from "./utils/sigma1.js";
import { sigma2 } from "./utils/sigma2.js";
import { sms } from "./utils/sms.js";

const app = express();
const port = process.env.PORT || 8080;

app.get("/", async (req, res) => {
  res.send("sigma...")
})

// **********************************
// SIGMA 1
// **********************************
app.get("/sigma/one", async (req, res) => {
  try {
    // verify request
    const headers = req.headers;
    if (headers.id !== process.env.SIGMA1_CRON) throw new Error("no-verify");
    // call func.
    await sigma1();
    //response
    res.json({ status: "OK", data: "success" });
  } catch (error) {
    // error
    console.error("Error at /sigma-one - ", error);
    res.json({ status: "ERROR", data: error.message });
  }
});

// **********************************
// SIGMA 2
// **********************************
app.get("/sigma/two", async (req, res) => {
  try {
    // verify request
    const headers = req.headers;
    if (headers.id !== process.env.SIGMA2_CRON) throw new Error("no-verify");
    // call func.
    await sigma2();
    //response
    res.json({ status: "OK", data: "success" });
  } catch (error) {
    // error
    console.error("Error at /sigma-two - ", error);
    res.json({ status: "ERROR", data: error.message });
  }
});

// **********************************
// SMS
// **********************************
app.get("/sigma/sms", async (req, res) => {
  try {
    // verify request
    const headers = req.headers;
    if (headers.id !== process.env.SMS_CRON) throw new Error("no-verify");
    // call func.
    await sms();
    //response
    res.json({ status: "OK", data: "success" });
  } catch (error) {
    // error
    console.error("Error at /sms - ", error);
    res.json({ status: "ERROR", data: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
