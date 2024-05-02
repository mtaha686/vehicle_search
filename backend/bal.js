const puppeteer = require("puppeteer-extra");
// const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");

async function scrapeData(url, carNumber, district) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url);

    // Fill out the form inputs
    await page.type('input[name="car_number"]', carNumber);
    await page.type('input[name="district"]', district);

    // Submit the form
    await page.click('button[name="search_button"]');

    // Wait for the search result
    // await page.waitForTimeout(3000); // Adjust the timeout as needed

    // Check if data is found
    const dataExists = await page.$(".search-results");
    if (dataExists) {
      const data = await page.evaluate(() => {
        // Extract data here
        // Example: const result = document.querySelector('.search-results').innerText.trim();
        // Adjust according to the structure of the search results
        // Return the extracted data
        return { message: "Data found" };
      });
      return data;
    } else {
      return { message: "No data found" };
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return { error: "An error occurred" };
  } finally {
    await browser.close();
  }
}

// Example usage:
const url = "https://excise.gob.pk/home/online-vehicle-verification-2/";
const carNumber = "ABC123";
const district = "quetta";

scrapeData(url, carNumber, district).then((result) => {
  console.log(result);
});
