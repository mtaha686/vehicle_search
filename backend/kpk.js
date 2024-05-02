const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

async function automateForm(url, district, vehicleType, registrationNumber) {
  try {
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url);

    // Wait for the district select element to appear
    await page.waitForSelector("#dname");

    // Select the district programmatically
    await page.select('select[name="dname"]', district);

    // Wait for the vehicle type select element to appear
    await page.waitForSelector("#dtype");

    // Select the vehicle type
    await page.select("#dtype", vehicleType);

    // Enter the registration number
    await page.type('input[name="reg_no"]', registrationNumber);

    // Click the Search button
    await page.click('input[name="Search"]');

    try {
      // Wait for the table to load
      await page.waitForSelector(".table", { timeout: 1000 });

      // Extract and display data if table exists
      const data = await page.evaluate(() => {
        const tableRows = document.querySelectorAll(".table tbody tr");
        const result = {};

        tableRows.forEach((row) => {
          const cells = row.querySelectorAll("td");
          if (cells.length === 2) {
            const key = cells[0].querySelector("strong").innerText.trim();
            const value = cells[1].innerText.trim();
            result[key] = value;
          }
        });

        return result;
      });

      if (Object.keys(data).length === 0) {
        console.log("No data found");
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log("No data found");
    }

    // Close the browser
    await browser.close();
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Example usage:
const url = "https://www.kpexcise.gov.pk/mvrecords/";
const district = "abbotabad";
const vehicleType = "reg";
const registrationNumber = "D 8103";

automateForm(url, district, vehicleType, registrationNumber);
