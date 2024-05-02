const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer-extra");
const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");

const app = express();
app.use(bodyParser.json());
app.use(cors());

puppeteer.use(
  RecaptchaPlugin({
    provider: { id: "2captcha", token: "6fef2c73a3fe89c12946df5a46508f22" },
  })
);

async function scrapeData(vehicleNumber) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto("https://mtmis.excise.punjab.gov.pk/");
    await page.type('input[name="car_number"]', vehicleNumber);
    await page.type('input[name="district"]', vehicleNumber);

    await page.click("button[name='search_button']");

    const vehicleNotFound = await page.evaluate(() => {
      const messageElement = document.querySelector("p");
      return messageElement ? messageElement.textContent.trim() : null;
    });

    if (vehicleNotFound) {
      return { error: "Vehicle not found" };
    } else {
      await page.waitForSelector(".sec2-lable");

      const data = await page.evaluate(() => {
        const labels = document.querySelectorAll(".sec2-lable");
        const values = document.querySelectorAll(".sec2-data");
        const result = {};

        labels.forEach((label, index) => {
          const key = label.textContent.trim();
          const value = values[index].textContent.trim();
          result[key] = value;
        });

        return { data: result };
      });

      return data;
    }
  } catch (error) {
    return { error: "An error occurred" };
  } finally {
    await browser.close();
  }
}

// app.post("/search", async (req, res) => {
//   const { vehicleNumber } = req.body;

//   try {
//     const result = await scrapeData(vehicleNumber);
//     res.json(result);
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
