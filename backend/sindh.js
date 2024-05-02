const puppeteer = require("puppeteer-extra");
const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");

puppeteer.use(
  RecaptchaPlugin({
    provider: { id: "2captcha", token: "6fef2c73a3fe89c12946df5a46508f22" },
  })
);

async function automateForm(url, vehicleType, regNo) {
  const browser = await puppeteer.launch({ headless: false }); // Change to true for headless mode
  const page = await browser.newPage();

  try {
    await page.goto(url);
    // Select vehicle type
    if (vehicleType === "four") {
      await page.click('input[value="1"]');
    } else if (vehicleType === "two") {
      await page.click('input[value="2"]');
    } else {
      throw new Error("Invalid vehicle type");
    }

    await page.type("#reg_no", regNo);
    // Solve the reCAPTCHA
    await page.waitForSelector("#rcaptcha iframe");
    // Solve the reCAPTCHA
    const { solved, error } = await page.solveRecaptchas();
    if (!solved) throw new Error(error);

    await page.click("#search_veh");
    await page.waitForSelector("#veh_res");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close(); // Uncomment if you want to close the browser automatically
  }
}

// Example usage
const url = "https://excise.gos.pk/vehicle/vehicle_search";
const vehicleType = "four"; // or "two"
const regNo = "ABC-123"; // Example registration number

automateForm(url, vehicleType, regNo);
