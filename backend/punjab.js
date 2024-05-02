const puppeteer = require("puppeteer-extra");
const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");

async function scrapeData(url, vehicleNumber, apiKey) {
  puppeteer.use(
    RecaptchaPlugin({
      provider: { id: "2captcha", token: apiKey },
    })
  );

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url);
    await page.type('input[name="vhlno"]', vehicleNumber);
    await page.waitForSelector(".search button:not([disabled])");
    await page.click(".search button");
    await page.waitForSelector(".g-recaptcha iframe");
    const { solved, error } = await page.solveRecaptchas();
    if (!solved) throw new Error(error);
    await page.waitForSelector(".search button:not([disabled])");
    await page.click(".search button");

    const vehicleNotFound = await page.evaluate(() => {
      const messageElement = document.querySelector(
        'h4[style="color:#ff0000"]'
      );
      return messageElement ? messageElement.textContent.trim() : null;
    });

    if (vehicleNotFound) {
      console.log("Vehicle not found");
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

        return result;
      });

      console.log(JSON.stringify(data));
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await browser.close();
  }
}

// Example usage:
const url = "https://mtmis.excise.punjab.gov.pk/";
const vehicleNumber = "LXZ 123";
const apiKey = "6fef2c73a3fe89c12946df5a46508f22";

scrapeData(url, vehicleNumber, apiKey);
