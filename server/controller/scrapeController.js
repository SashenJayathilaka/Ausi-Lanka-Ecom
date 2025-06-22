import puppeteer from "puppeteer";

export const scrapeProduct = async (req, res) => {
  const productUrl = req.query.url;

  if (!productUrl) {
    return res.status(400).json({ error: "Missing `url` query parameter." });
  }

  try {
    const browser = await puppeteer.launch({
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    );

    await page.goto(productUrl, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    await new Promise((r) => setTimeout(r, 3000));

    const extractText = async (selectors) => {
      for (const sel of selectors) {
        try {
          const text = await page.$eval(sel, (el) => el.textContent.trim());
          if (text) return text;
        } catch {}
      }
      return null;
    };

    const extractImage = async () => {
      try {
        const img = await page.$(
          "div.w-full.overflow-hidden button:nth-child(1) img"
        );
        if (img) {
          const src = await page.evaluate((el) => el.getAttribute("src"), img);
          return src?.startsWith("http")
            ? src
            : `https://www.chemistwarehouse.com.au${src}`;
        }
      } catch {}
      return null;
    };

    const title =
      (await extractText(["h1.product-title"])) ||
      (await page
        .$eval('meta[property="og:title"]', (el) => el.content)
        .catch(() => null)) ||
      "Title not found";

    const price =
      (await extractText([
        ".product-price-now",
        ".product-price",
        ".price",
        "h2.display-l.text-colour-title-light",
      ])) || "Price not found";

    const image = (await extractImage()) || "Image not found";

    await browser.close();

    res.json({ title, price, image });
  } catch (err) {
    console.error("Scrape error:", err.message);
    res.status(500).json({ error: "Scraping failed." });
  }
};
