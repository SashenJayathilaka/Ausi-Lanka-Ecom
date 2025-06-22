import puppeteer from "puppeteer";

export const scrapeJBHIFIProduct = async (req, res) => {
  const productUrl = req.query.url;

  if (!productUrl) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  if (!productUrl.includes("jbhifi.com.au")) {
    return res.status(400).json({ error: "Invalid JB Hi-Fi URL" });
  }

  try {
    const browser = await puppeteer.launch({
      executablePath:
        process.env.CHROME_PATH ||
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    );

    // Configure to handle lazy-loaded images
    await page.setViewport({ width: 1280, height: 800 });

    await page.goto(productUrl, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // Wait specifically for the image container to load
    await page
      .waitForSelector(
        'div[data-testid="product-image-container"], img._1n3ie3p8',
        { timeout: 10000 }
      )
      .catch(() => console.log("Image container took longer to load"));

    const productData = await page.evaluate(() => {
      // Title extraction
      const titleElement =
        document.querySelector("h1._12mtftw9") ||
        document.querySelector('[data-testid="product-title"]');
      const title = titleElement?.textContent?.trim();

      // Price extraction (corrected)
      const priceElement =
        document.querySelector(".PriceTag_actual__1eb7mu916") ||
        document.querySelector('[data-testid="price-value"]');
      let priceText = priceElement?.textContent?.trim();

      if (priceText) {
        priceText = priceText.replace(/[^\d.]/g, "");
        if (priceText) {
          priceText = `$${parseFloat(priceText).toFixed(2)}`;
        }
      }

      // Robust image extraction
      const getImageUrl = () => {
        // Try multiple image selectors
        const imgElement =
          document.querySelector("img._1n3ie3p8") ||
          document.querySelector('[data-testid="product-image"] img') ||
          document.querySelector("img.product-image-main");

        if (!imgElement) return null;

        // First try to get srcset (for higher quality images)
        const srcset = imgElement.getAttribute("srcset");
        if (srcset) {
          const sources = srcset
            .split(",")
            .map((src) => src.trim().split(" ")[0])
            .filter((url) => url.includes(".jpg") || url.includes(".png"));

          if (sources.length > 0) {
            return sources[0]; // Get the first (usually highest quality) image
          }
        }

        // Fallback to src attribute
        let imageUrl =
          imgElement.getAttribute("src") || imgElement.getAttribute("data-src");

        // Ensure proper URL format
        if (imageUrl) {
          if (imageUrl.startsWith("//")) {
            imageUrl = `https:${imageUrl}`;
          } else if (!imageUrl.startsWith("http")) {
            imageUrl = `https://www.jbhifi.com.au${
              imageUrl.startsWith("/") ? "" : "/"
            }${imageUrl}`;
          }
          return imageUrl;
        }

        return null;
      };

      return {
        title: title || null,
        price: priceText || null,
        image: getImageUrl(),
      };
    });

    await browser.close();

    if (!productData.title || !productData.price) {
      throw new Error(
        `Missing essential data. Title: ${productData.title}, Price: ${productData.price}`
      );
    }

    res.json({
      title: productData.title,
      price: productData.price,
      image: productData.image || "Image not available",
      retailer: "JB Hi-Fi",
      url: productUrl,
    });
  } catch (err) {
    console.error("JB Hi-Fi scrape error:", err);
    res.status(500).json({
      error: "Failed to scrape JB Hi-Fi product",
      details: err.message,
      suggestion:
        "If this persists, JB Hi-Fi may have updated their page structure.",
    });
  }
};
