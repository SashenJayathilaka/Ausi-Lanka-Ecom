# Server Deployment & Optimization Guide

## 1. Docker Deployment

We have added a `Dockerfile` to containerize the server. This ensures a consistent environment for Puppeteer.

### Build and Run locally

```bash
# Build the image
docker build -t ausi-lanka-server .

# Run the container (with customized concurrency)
docker run -p 5000:5000 --env MAX_CONCURRENCY=1 ausi-lanka-server
```

## 2. Optimizing for EC2 t2.micro (1GB RAM)

The `t2.micro` instance has very limited RAM (1GB). Puppeteer (Chrome) is memory intensive.

### Step A: Limit Concurrency

We have updated the code to accept a `MAX_CONCURRENCY` environment variable.
On a `t2.micro` instance, you **MUST** set this to `1` or at most `2`. The default was `5`, which will crash your server.

**How to set it:**

- **Docker:** Pass `--env MAX_CONCURRENCY=1`
- **PM2/Node:** Set in your `.env` file or export it: `export MAX_CONCURRENCY=1`

### Step B: Add Swap Space (CRITICAL)

Since 1GB RAM is often not enough even for one browser tab, you should add "Swap Space" (disk space used as RAM). This prevents the server from crashing ("struck") when RAM is full.

Run these commands on your EC2 terminal:

```bash
# 1. Create a 2GB swap file
sudo fallocate -l 2G /swapfile

# 2. Set correct permissions
sudo chmod 600 /swapfile

# 3. Setup swap area
sudo mkswap /swapfile

# 4. Enable swap
sudo swapon /swapfile

# 5. Make it permanent (add to fstab)
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Step C: Recommended EC2 Upgrade

If possible, upgrade to **t3.small** (2GB RAM). It costs slightly more but offers double the memory, which is much better for scraping tasks.
