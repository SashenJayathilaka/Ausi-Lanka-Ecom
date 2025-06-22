import puppeteer from "puppeteer";

export const scrapeColesProduct = async (req, res) => {
  const productUrl = req.query.url;

  if (!productUrl) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  if (!productUrl.includes("coles.com.au")) {
    return res.status(400).json({ error: "Invalid Coles URL" });
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

    await page.goto(productUrl, { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 5000));

    const productData = await page.evaluate(() => {
      const titleEl = document.querySelector("h1.product__title");
      const priceEl = document.querySelector("span.price__value");
      const imgEl = document.querySelector(
        'img[data-testid="product-thumbnail-image-0"]'
      );
      const sizeEl = document.querySelector(".product__size");

      return {
        title: titleEl ? titleEl.textContent.trim() : null,
        price: priceEl ? priceEl.textContent.trim() : null,
        image: imgEl ? imgEl.src || imgEl.getAttribute("data-src") : null,
        size: sizeEl ? sizeEl.textContent.trim() : null,
        retailer: "Coles",
      };
    });

    await browser.close();

    res.json({
      title: productData.title || "Title not found",
      price: productData.price || "Price not found",
      image: productData.image
        ? productData.image.startsWith("http")
          ? productData.image
          : `https://shop.coles.com.au${productData.image}`
        : "Image not found",
      size: productData.size || null,
      retailer: "Coles",
    });
  } catch (err) {
    console.error("Coles scrape error:", err);
    res.status(500).json({ error: "Failed to scrape Coles product" });
  }
};
