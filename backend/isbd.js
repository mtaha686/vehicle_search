const puppeteer = require("puppeteer");

async function scrapeData(url, registrationNo, registrationDate) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url);

    // Fill out the form inputs
    await page.type('input[name="registrationNo"]', registrationNo);
    await page.type('input[name="registrationDate"]', registrationDate);

    // Submit the form
    await page.click('input[name="SUBMIT"]');

    // Wait for the search result
    await page.waitForSelector("table");

    // Check if data is found
    const dataExists = await page.$("table");
    if (dataExists) {
      const data = await page.evaluate(() => {
        const tableRows = document.querySelectorAll("table tr");
        const result = {};

        tableRows.forEach((row) => {
          const cells = row.querySelectorAll("td");
          if (cells.length === 2) {
            const key = cells[0].innerText.trim();
            const value = cells[1].innerText.trim();
            result[key] = value;
          }
        });

        return result;
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
const url = "YOUR_WEBSITE_URL_HERE";
const registrationNo = "IDN-9830";
const registrationDate = "05-JAN-17";

scrapeData(url, registrationNo, registrationDate).then((result) => {
  console.log(result);
});
