# Cloudflare Setup Guide

Complete guide to deploy Portfolio Manager using Cloudflare's free tier services.

## Prerequisites

1. Cloudflare account (free tier)
2. Node.js and npm installed
3. Wrangler CLI installed

```bash
npm install -g wrangler
```

## Step 1: Login to Cloudflare

```bash
wrangler login
```

This will open your browser to authenticate with Cloudflare.

## Step 2: Create D1 Database

```bash
# Create the database
wrangler d1 create portfolio-manager-db
```

This will output a database ID. Copy it and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "portfolio-manager-db"
database_id = "YOUR_DATABASE_ID_HERE"  # Replace with actual ID
```

## Step 3: Initialize Database Schema

```bash
# Run the schema migration
wrangler d1 execute portfolio-manager-db --file=./schema.sql
```

This creates all tables and inserts seed data.

## Step 4: Deploy Workers API

```bash
# Deploy the Workers API
wrangler deploy
```

Your API will be available at:
`https://portfolio-manager.YOUR_ACCOUNT.workers.dev`

## Step 5: Deploy Frontend to Cloudflare Pages

### Option A: Via Dashboard (Easiest)

1. Go to https://dash.cloudflare.com/
2. Navigate to **Workers & Pages**
3. Click **Create Application** → **Pages**
4. Connect your GitHub repository
5. Configure build settings:
   - **Build command**: (leave empty)
   - **Build output directory**: `/`
6. Click **Save and Deploy**

### Option B: Via Wrangler CLI

```bash
# Deploy directly
wrangler pages deploy . --project-name=portfolio-manager
```

## Step 6: Update API Endpoint

Update `js/dashboard.js` to use your Workers API:

```javascript
const API_BASE = 'https://portfolio-manager.YOUR_ACCOUNT.workers.dev/api';
```

## Step 7: Configure Custom Domain (Optional)

1. Go to Cloudflare Dashboard
2. Select your Pages project
3. Go to **Custom domains**
4. Add your domain (e.g., `manager.nathaljanijman.com`)

## Free Tier Limits

**Cloudflare Workers:**
- 100,000 requests/day
- 10ms CPU time per request
- Perfect for this application!

**D1 Database:**
- 5GB storage
- 5 million reads/day
- 100,000 writes/day
- More than enough for portfolio management

**Pages:**
- 500 builds/month
- Unlimited bandwidth
- Free SSL certificate

## Testing Locally

```bash
# Test Workers API locally
wrangler dev

# This starts a local server at http://localhost:8787
```

Then update `js/dashboard.js` temporarily:
```javascript
const API_BASE = 'http://localhost:8787/api';
```

## Database Queries

### View all templates
```bash
wrangler d1 execute portfolio-manager-db --command="SELECT * FROM templates"
```

### View all websites
```bash
wrangler d1 execute portfolio-manager-db --command="SELECT * FROM websites"
```

### Add new template
```bash
wrangler d1 execute portfolio-manager-db --command="INSERT INTO templates (name, description, category) VALUES ('New Template', 'Description', 'Category')"
```

## Monitoring & Analytics

1. **Workers Analytics**: Dashboard → Workers & Pages → Your Worker → Analytics
2. **D1 Metrics**: Dashboard → D1 → Your Database → Metrics
3. **Pages Analytics**: Dashboard → Workers & Pages → Your Pages → Analytics

## Environment Variables

For sensitive data, use Wrangler secrets:

```bash
# Set a secret
wrangler secret put API_KEY

# List secrets
wrangler secret list
```

Use in your Worker:
```javascript
const apiKey = env.API_KEY;
```

## Troubleshooting

### "Database not found"
- Make sure you ran `wrangler d1 create` and updated `wrangler.toml` with correct ID

### CORS errors
- Check that `corsHeaders` are properly set in `workers/api.js`
- Verify your frontend domain is allowed

### 404 on API calls
- Ensure Workers is deployed: `wrangler deploy`
- Check routes in `wrangler.toml`

## Cost Optimization

Even though we're on free tier, here are some tips:

1. **Cache static assets** using Cloudflare CDN
2. **Use KV for frequently accessed data** (template previews, etc.)
3. **Implement request batching** to reduce API calls
4. **Add pagination** for large datasets

## Next Steps

1. Set up automatic GitHub deployments
2. Add authentication with Cloudflare Access
3. Implement real-time updates with Durable Objects
4. Add image storage with Cloudflare R2

## Support

- Cloudflare Docs: https://developers.cloudflare.com/
- Wrangler Docs: https://developers.cloudflare.com/workers/wrangler/
- D1 Docs: https://developers.cloudflare.com/d1/
