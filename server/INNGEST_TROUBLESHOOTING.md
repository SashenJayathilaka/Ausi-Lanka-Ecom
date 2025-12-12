# ❌ Inngest Integration Issue - Event Key Problem

## Problem

When trying to trigger scraping jobs, you get this error:

```
"Inngest API Error: 401 Event key not found"
```

And no runs appear at http://localhost:8288/runs

## Root Cause

The Inngest SDK's `inngest.send()` method is trying to send events to **Inngest Cloud** instead of the local Dev Server. Inngest Cloud requires authentication (event key), but in development you want events to go to your local Dev Server (port 8288).

## Solution

### Option 1: Don't Use `inngest.send()` in Development

Instead of triggering jobs through API endpoints with `inngest.send()`, directly trigger them from the Inngest Dashboard:

1. **Open Inngest Dashboard**: http://localhost:8288
2. **Go to "Functions" tab**
3. **Click on a function** (e.g., "Scrape Coles Product")
4. **Click "Invoke"** button
5. **Enter test data**:
   ```json
   {
     "url": "https://www.coles.com.au/product/coca-cola-zero-sugar-6-x-250ml-8574",
     "rate": 52.5
   }
   ```
6. **Click "Invoke Function"**
7. **Go to "Runs" tab** to see execution

### Option 2: Use Inngest Cloud (Sign Up Required)

1. **Sign up** at https://www.inngest.com/
2. **Create a new app**
3. **Get your Event Key** from dashboard
4. **Update `.env`**:
   ```env
   INNGEST_EVENT_KEY="your-real-event-key-here"
   INNGEST_SIGNING_KEY="your-signing-key-here"
   ```
5. **Update `inngest/client.ts`**:
   ```typescript
   export const inngest = new Inngest({
     id: "ausi-lanka-scraper",
     name: "Ausi Lanka Price Scraper",
     eventKey: process.env.INNGEST_EVENT_KEY,
   });
   ```
6. **Restart servers**

### Option 3: Use HTTP Endpoints to Inngest Dev Server (Recommended for Local Dev)

Modify your route handlers to post events directly to the Dev Server's HTTP API:

**Update `routes/inngestRoutes.ts`**:

```typescript
import { Router, Request, Response } from "express";
import fetch from "node-fetch"; // Add this import

const router = Router();

// Determine if we're in development
const isDev = process.env.NODE_ENV !== "production";
const INNGEST_DEV_URL = "http://localhost:8288";

// Trigger Coles scraping job
router.post("/coles", async (req: Request, res: Response) => {
  const { url, rate } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  if (!rate) {
    return res.status(400).json({ error: "Missing rate parameter" });
  }

  try {
    if (isDev) {
      // In development, post directly to Inngest Dev Server
      const response = await fetch(`${INNGEST_DEV_URL}/e/ausi-lanka-scraper`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "scrape/coles",
          data: { url, rate: parseFloat(rate) },
          ts: Date.now(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Dev server error: ${response.statusText}`);
      }

      const result = await response.json();

      return res.json({
        success: true,
        message: "Coles scraping job triggered successfully",
        jobId: result.ids?.[0] || "dev-mode",
        status:
          "Job is processing in background. Results will be available soon.",
      });
    } else {
      // In production, use inngest.send() with proper event key
      const { inngest } = await import("../inngest/client.js");
      const event = await inngest.send({
        name: "scrape/coles",
        data: { url, rate: parseFloat(rate) },
      });

      return res.json({
        success: true,
        message: "Coles scraping job triggered successfully",
        jobId: event.ids[0],
        status:
          "Job is processing in background. Results will be available soon.",
      });
    }
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      error: "Failed to trigger Coles scraping job",
      details: err.message,
    });
  }
});

export default router;
```

## Quick Testing Steps

### Test 1: Verify Functions are Registered

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/inngest"
```

You should see your registered functions.

### Test 2: Manually Invoke from Dashboard

1. Open: http://localhost:8288
2. Click "Functions" → "Scrape Coles Product" → "Invoke"
3. Enter test data
4. Check "Runs" tab

### Test 3: Use Test HTML Page

1. Open `server/test-inngest.html` in browser
2. Click "Check Functions" to verify setup
3. Click "Scrape Coles" to trigger job
4. View results in Inngest Dashboard

## Current Status

✅ **Both servers running**:

- Express API: http://localhost:5000
- Inngest Dev Server: http://localhost:8288

✅ **Functions registered**:

- `scrape-coles`
- `scrape-coles-batch`
- `scrape-chemist-warehouse`
- `scrape-chemist-warehouse-batch`
- `scheduled-price-update`

❌ **Issue**: `inngest.send()` trying to reach Inngest Cloud instead of local Dev Server

## Recommended Next Steps

1. **For now**: Use the Inngest Dashboard UI to manually invoke functions (Option 1)
2. **For production**: Sign up for Inngest Cloud and get real event keys (Option 2)
3. **Best for local dev**: Implement Option 3 to post events directly to Dev Server HTTP API

## Why This Happens

The Inngest SDK is designed to work with Inngest Cloud by default. When you call `inngest.send()`, it attempts to POST events to `https://inn.gs/e/<app-id>` (Inngest Cloud), which requires authentication.

The Inngest Dev Server (port 8288) provides a local alternative, but you need to explicitly send events to its HTTP endpoint: `http://localhost:8288/e/<app-id>`

## Files to Check

- ✅ `server/inngest/client.ts` - Inngest client configuration
- ✅ `server/inngest/functions.ts` - Function definitions
- ✅ `server/inngest/serve.ts` - Serve handler with functions registered
- ✅ `server/routes/inngestRoutes.ts` - API endpoints (needs Option 3 update)
- ✅ `server/index.ts` - Express app with `/api/inngest` endpoint
- ✅ `server/.env` - Environment variables (currently set to "local")

## Success Indicators

When working correctly, you should see:

1. **In Inngest Dashboard Functions tab**: All 5 functions listed
2. **After triggering a job**: New entry in "Runs" tab
3. **Run status**: Shows 3 steps completing (validate → scrape → calculate)
4. **Run output**: Contains scraped product data and calculated price
5. **Terminal logs**: Inngest Dev Server shows event received and function executed
