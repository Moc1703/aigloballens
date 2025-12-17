# 🚀 Deployment Guide - GlobalLens AI to Vercel

## Prerequisites
-   Vercel account (free tier is fine)
-   Vercel CLI installed: `npm install -g vercel`

## Step 1: Setup Vercel Postgres

1.  Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2.  Create a new project or use existing
3.  Go to **Storage** → **Create Database** → **Postgres**
4.  Select **Free tier** (Hobby)
5.  After creation, go to **`.env.local`** tab and note down the connection strings

## Step 2: Run Database Migration

1.  In Vercel Dashboard, go to your Postgres database
2.  Click **Query** tab
3.  Copy and paste the content of `frontend/schema.sql`
4.  Click **Run** to create the `articles` table

## Step 3: Set Environment Variables

In your Vercel project settings → **Environment Variables**, add:

```
SYNC_API_KEY=<generate-a-random-string>
```

To generate a secure API key (Windows):
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

Or online: https://www.random.org/strings/

**IMPORTANT**: Copy this key! You'll need it for the local PC.

## Step 4: Deploy Frontend to Vercel

```bash
cd ai-news-portal/frontend
vercel --prod
```

Follow the prompts:
-   Link to existing project or create new
-   Set build command: `npm run build`
-   Set output directory: `.next`

After deployment, note your URL: `https://your-app.vercel.app`

## Step 5: Configure Local PC

1.  Copy `.env.example` to `.env` in the `backend` folder:
    ```bash
    cp .env.example .env
    ```

2.  Edit `.env`:
    ```
    VERCEL_URL=https://your-app.vercel.app
    SYNC_API_KEY=<paste-the-same-key-from-step-3>
    ```

## Step 6: Test the System

### Generate News Locally:
```bash
cd ai-news-portal/backend
..\venv\Scripts\python main.py
```

### Upload to Vercel:
```bash
..\venv\Scripts\python upload.py
```

You should see:
```
✅ Success!
   - Inserted: X new articles
   - Updated: Y existing articles
```

### Verify on Live Site:
Open `https://your-app.vercel.app` and check if articles are visible!

## Step 7 (Optional): Run Local Dashboard

For a GUI interface to control everything:

```bash
cd ai-news-portal/backend
..\venv\Scripts\python server.py
```

Then open `http://localhost:5000/dashboard.html` in your browser.

The dashboard has buttons for:
-   🔄 Generate Fresh News
-   ☁️ Upload to Vercel
-   👁️ Preview Local Site

## Troubleshooting

### "API key not set" error
-   Make sure `SYNC_API_KEY` is set in both Vercel (env vars) AND local `.env` file
-   They must match exactly

### "Database connection failed"
-   Verify Vercel Postgres is provisioned
-   Check that environment variables are set correctly in Vercel
-   Redeploy: `vercel --prod --force`

### "No articles appearing on site"
-   Check if database has data: Go to Vercel Dashboard → Storage → Query
    ```sql
    SELECT COUNT(*) FROM articles;
    ```
-   If 0, re-run `upload.py`

## Maintenance Workflow

1.  **Daily/Weekly** (on your local PC):
    ```bash
    python main.py    # Generate fresh news
    python upload.py  # Push to Vercel
    ```

2.  **Or** use the dashboard at `http://localhost:5000/dashboard.html`

3.  Vercel will automatically serve the updated content!

## Next Steps

-   Set up a **cron job** or **Windows Task Scheduler** to run `main.py` + `upload.py` automatically
-   Add **image optimization** to reduce bandwidth
-   Implement **pagination** for older articles
