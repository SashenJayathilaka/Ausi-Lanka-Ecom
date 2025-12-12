# Test Inngest Scraping Functions

## Prerequisites

- Both servers must be running:
  - Express API: http://localhost:5000
  - Inngest Dev: http://localhost:8288

## Test Commands

### 1. Test Coles Scraping

**PowerShell:**

```powershell
$body = @{
    url = "https://www.coles.com.au/product/coca-cola-zero-sugar-6-x-250ml-8574"
    rate = 52.5
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/jobs/coles" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

**curl (Git Bash):**

```bash
curl -X POST http://localhost:5000/api/jobs/coles \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.coles.com.au/product/coca-cola-zero-sugar-6-x-250ml-8574", "rate": 52.5}'
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Coles scraping job triggered successfully",
  "jobId": "01JC...",
  "status": "Job is processing in background. Results will be available soon."
}
```

### 2. Test Chemist Warehouse Scraping

**PowerShell:**

```powershell
$body = @{
    url = "https://www.chemistwarehouse.com.au/buy/67514/swisse-ultiboost-hair-skin-nails-60-tablets"
    rate = 52.5
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/jobs/chemist-warehouse" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

**curl (Git Bash):**

```bash
curl -X POST http://localhost:5000/api/jobs/chemist-warehouse \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.chemistwarehouse.com.au/buy/67514/swisse-ultiboost-hair-skin-nails-60-tablets", "rate": 52.5}'
```

### 3. Test Coles Batch Scraping

**PowerShell:**

```powershell
$body = @{
    urls = @(
        "https://www.coles.com.au/product/coca-cola-zero-sugar-6-x-250ml-8574",
        "https://www.coles.com.au/product/coca-cola-classic-soft-drink-12-x-375ml-5495"
    )
    rate = 52.5
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/jobs/coles/batch" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

### 4. Test Chemist Warehouse Batch Scraping

**PowerShell:**

```powershell
$body = @{
    urls = @(
        "https://www.chemistwarehouse.com.au/buy/67514/swisse-ultiboost-hair-skin-nails-60-tablets",
        "https://www.chemistwarehouse.com.au/buy/123456/panadol-rapid-caplets-20-pack"
    )
    rate = 52.5
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/jobs/chemist-warehouse/batch" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

## Monitor Results

1. **Open Inngest Dashboard**: http://localhost:8288

2. **Navigate to "Runs" tab**

3. **Watch job execution** in real-time:

   - Green checkmarks = Step completed successfully
   - Orange spinner = Step in progress
   - Red X = Step failed (will retry automatically)

4. **Click on a run** to see:
   - Input payload (url, rate)
   - Step-by-step execution logs
   - Scraped data (title, price, image)
   - Calculated price in LKR
   - Total execution time

## Verify Function Registration

1. **Open Inngest Dashboard**: http://localhost:8288

2. **Click "Functions" tab**

3. **You should see 5 functions**:
   - ✅ `scrape-coles` - Scrape Coles Product
   - ✅ `scrape-coles-batch` - Scrape Multiple Coles Products
   - ✅ `scrape-chemist-warehouse` - Scrape Chemist Warehouse Product
   - ✅ `scrape-chemist-warehouse-batch` - Scrape Multiple Chemist Warehouse Products
   - ✅ `scheduled-price-update` - Daily Price Update

## Troubleshooting

### Functions Not Appearing in Dashboard

**Solution:**

1. Stop Inngest Dev Server (Ctrl+C)
2. Restart: `bun run dev:inngest`
3. Wait for "apps synced" message
4. Refresh dashboard

### "Failed to trigger job" Error

**Possible Causes:**

- Express server not running → Start with `bun run dev`
- Invalid URL format → Check retailer URL
- Missing rate parameter → Add rate to request body

### Scraping Job Fails

**Check:**

1. Open job in Inngest Dashboard
2. Click on failed step
3. View error message and stack trace
4. Common issues:
   - Product page changed selectors
   - Network timeout
   - Rate limiting from retailer

### Job Stuck in "Running" State

**Solution:**

- Jobs automatically timeout after 5 minutes
- Check Inngest Dashboard for error logs
- Try replaying the job from dashboard

## Success Indicators

✅ **API Response** < 200ms (instant)
✅ **Job Created** with unique ID
✅ **Dashboard Shows** job in "Running" state
✅ **Steps Complete** one by one (validate → scrape → calculate)
✅ **Final Result** includes calculated LKR price
✅ **Total Time** 10-30 seconds depending on retailer

## Example Successful Output

```json
{
  "url": "https://www.coles.com.au/product/coca-cola-zero-sugar-6-x-250ml-8574",
  "title": "Coca-Cola Zero Sugar 6 x 250mL",
  "price": "$5.50",
  "image": "https://productimages.coles.com.au/productimages/5/8574.jpg",
  "size": "6 x 250mL",
  "retailer": "Coles",
  "calculatedPrice": "288.75",
  "success": true
}
```

## Performance Comparison

| Metric            | Old (Sync)        | New (Inngest)    |
| ----------------- | ----------------- | ---------------- |
| API Response Time | 10-30s            | <100ms           |
| Timeout Risk      | High (Vercel 60s) | None             |
| Retry Logic       | Manual            | Automatic (3x)   |
| Monitoring        | None              | Visual Dashboard |
| Batch Processing  | Sequential        | Parallel         |
| Scheduled Jobs    | None              | Built-in Cron    |
