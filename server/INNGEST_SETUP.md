# Inngest Integration for Ausi Lanka Scraping

This document explains how to use Inngest for background scraping jobs.

## 🚀 Setup

### 1. Start the Development Environment

You need **TWO terminals** running:

**Terminal 1 - API Server:**

```bash
cd server
bun run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Inngest Dev Server:**

```bash
cd server
bun run dev:inngest
# Runs on http://localhost:8288
```

The Inngest Dev Server provides:

- Visual dashboard for monitoring jobs
- Real-time function execution logs
- Retry and replay capabilities
- Event debugging

### 2. Access Inngest Dashboard

Open http://localhost:8288 in your browser to see:

- All registered functions
- Event history
- Job execution status
- Logs and errors

## 📡 API Endpoints

### 1. Trigger Single Product Scrape (Async)

#### Coles

```bash
POST http://localhost:5000/api/jobs/coles
Content-Type: application/json

{
  "url": "https://www.coles.com.au/product/coca-cola-zero-sugar-6-x-250ml-8574",
  "rate": 185.5
}
```

#### Chemist Warehouse

```bash
POST http://localhost:5000/api/jobs/chemist-warehouse
Content-Type: application/json

{
  "url": "https://www.chemistwarehouse.com.au/buy/12345/panadol-rapid-caplets-20-pack",
  "rate": 185.5
}
```

**Response:**

```json
{
  "success": true,
  "message": "Coles scraping job triggered successfully",
  "jobId": "01JEXAMPLE123456",
  "status": "Job is processing in background. Results will be available soon."
}
```

### 2. Batch Scraping (Multiple URLs)

#### Coles Batch

```bash
POST http://localhost:5000/api/jobs/coles/batch
Content-Type: application/json

{
  "urls": [
    "https://www.coles.com.au/product/coca-cola-zero-sugar-6-x-250ml-8574",
    "https://www.coles.com.au/product/coca-cola-classic-soft-drink-12-x-375ml-5495"
  ],
  "rate": 185.5
}
```

#### Chemist Warehouse Batch

```bash
POST http://localhost:5000/api/jobs/chemist-warehouse/batch
Content-Type: application/json

{
  "urls": [
    "https://www.chemistwarehouse.com.au/buy/12345/panadol-rapid-caplets-20-pack",
    "https://www.chemistwarehouse.com.au/buy/67890/panadol-osteo-caplets-96-pack"
  ],
  "rate": 185.5
}
```

**Response:**

```json
{
  "success": true,
  "message": "Triggered 2 Coles scraping jobs",
  "jobId": "01JEXAMPLE789012",
  "count": 2
}
```

### 3. Manual Price Update (Trigger Scheduled Job)

```bash
POST http://localhost:5000/api/jobs/price-update
```

**Response:**

```json
{
  "success": true,
  "message": "Price update job triggered",
  "jobId": "01JEXAMPLE345678"
}
```

## 🔄 How It Works

### Current Flow (Old - Blocking):

```
Client → API → Puppeteer (30s) → Response
❌ User waits 30 seconds
❌ Timeout issues on Vercel
```

### New Flow (Inngest - Async):

```
Client → API → Inngest Event → Instant Response (1s)
                    ↓
                Background:
                Puppeteer → Calculate → Store Result
✅ User gets immediate response
✅ Scraping happens in background
✅ Automatic retries on failure
```

## 🎯 Functions Available

### 1. `scrapeWoolworths`

- **Trigger:** `scrape/woolworths` event
- **Retries:** 3 attempts with exponential backoff
- **Steps:**
  1. Validate input (URL and rate)
  2. Scrape product page with Puppeteer
  3. Calculate LKR price
- **Returns:** Complete product data with calculated price

### 2. `scrapeWoolworthsBatch`

- **Trigger:** `scrape/woolworths-batch` event
- **Purpose:** Process multiple URLs in parallel
- **Steps:**
  1. Receive array of URLs
  2. Trigger individual scrape events for each
- **Returns:** Job count confirmation

### 3. `scheduledPriceUpdate`

- **Trigger:** Cron schedule (`0 2 * * *` - 2 AM daily)
- **Purpose:** Automatically update prices for all products
- **Steps:**
  1. Fetch all products from database
  2. Get latest exchange rate
  3. Trigger batch scrapes
- **Returns:** Summary of triggered jobs

## 🔧 Configuration

### Environment Variables

Add to your `.env` file:

```env
# Inngest (Optional for development)
INNGEST_EVENT_KEY=your-event-key-here
INNGEST_SIGNING_KEY=your-signing-key-here
```

**Note:** For local development with `bun run dev:inngest`, keys are NOT required.

### Scheduled Jobs

The daily price update runs at **2 AM every day** (Australian time).

To change the schedule, edit `scheduledPriceUpdate` in `inngest/functions.ts`:

```typescript
{
  cron: "0 2 * * *";
} // Current: 2 AM daily

// Examples:
{
  cron: "0 */6 * * *";
} // Every 6 hours
{
  cron: "0 8,20 * * *";
} // 8 AM and 8 PM
{
  cron: "0 0 * * 0";
} // Sunday midnight
```

## 📊 Monitoring Jobs

### Via Inngest Dashboard (http://localhost:8288)

1. **Functions Tab:** See all registered functions
2. **Events Tab:** View all triggered events
3. **Runs Tab:** Monitor job execution status
4. **Logs:** Debug with detailed logs

### Job States:

- 🟡 **Queued:** Waiting to execute
- 🔵 **Running:** Currently processing
- 🟢 **Completed:** Successfully finished
- 🔴 **Failed:** Error occurred (will retry)
- ⚪ **Cancelled:** Manually stopped

## 🚢 Production Deployment

### 1. Sign up at [inngest.com](https://app.inngest.com)

### 2. Get your keys from the dashboard

### 3. Add to production `.env`:

```env
INNGEST_EVENT_KEY=prod_key_here
INNGEST_SIGNING_KEY=signkey_here
```

### 4. Update `inngest/client.ts`:

```typescript
export const inngest = new Inngest({
  id: "ausi-lanka-scraper",
  name: "Ausi Lanka Price Scraper",
  eventKey: process.env.INNGEST_EVENT_KEY,
});
```

### 5. Deploy normally to AWS EC2 or Vercel

The `/api/inngest` endpoint will automatically:

- Register functions with Inngest Cloud
- Execute jobs on trigger
- Handle retries and monitoring

## 🔄 Migrating Other Scrapers

To convert other scrapers (Coles, Aldi, etc.) to Inngest:

1. Copy the Woolworths function pattern from `inngest/functions.ts`
2. Replace scraping logic with the specific retailer's code
3. Add new route in `routes/inngestRoutes.ts`
4. Test with Inngest Dev Server

Example for Coles:

```typescript
export const scrapeColes = inngest.createFunction(
  { id: "scrape-coles", retries: 3 },
  { event: "scrape/coles" },
  async ({ event, step }) => {
    // Your Coles scraping logic here
  }
);
```

## 📈 Benefits

✅ **Non-blocking:** Returns instantly, scrapes in background
✅ **Reliable:** Automatic retries on failures
✅ **Scalable:** Parallel processing for batch jobs
✅ **Observable:** Visual dashboard for monitoring
✅ **Scheduled:** Cron jobs for automatic updates
✅ **Type-safe:** Full TypeScript support
✅ **Vercel-ready:** Works on serverless platforms

## 🆘 Troubleshooting

### Jobs not appearing in dashboard?

1. Check both terminals are running
2. Verify http://localhost:8288 is accessible
3. Check for errors in server terminal

### Jobs failing?

1. Check Inngest dashboard logs
2. Verify Chrome is installed (CHROME_PATH)
3. Check MongoDB connection
4. Verify URL is valid

### Want to replay a failed job?

1. Go to Inngest dashboard
2. Find the failed job in "Runs"
3. Click "Replay" button

## 🎓 Next Steps

1. ✅ Start both development servers
2. ✅ Test single scrape via API
3. ✅ Monitor job in Inngest dashboard
4. ✅ Convert other scrapers (Coles, Aldi, etc.)
5. ✅ Set up production Inngest account
6. ✅ Configure scheduled jobs for your needs

---

**Documentation:** https://www.inngest.com/docs
**Support:** ausilk27@gmail.com
