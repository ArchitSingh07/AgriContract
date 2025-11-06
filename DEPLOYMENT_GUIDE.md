# 🚀 Deployment Guide - CropContract Platform

This guide explains how to deploy the CropContract platform with the backend on Render and frontend on Vercel.

## 📋 Prerequisites

- MongoDB Atlas account (for production database)
- GitHub repository with your code
- Render account (free tier available)
- Vercel account (free tier available)

## 🎯 Deployment Overview

- **Backend**: Node.js Express API → Render
- **Frontend**: React + Vite → Vercel
- **Database**: MongoDB Atlas

---

## 📦 Part 1: Deploy Backend on Render

### Prerequisites
- MongoDB Atlas account (already setup)
- GitHub account with your repository
- Render account (free tier works)

### Step 1: Prepare Backend

1. **Verify Environment Variables**
   Your backend needs these environment variables (already in `.env`):
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   NODE_ENV=production
   ```

2. **Ensure `.env` is in `.gitignore`**
   - ✅ Already done (`.env` should NOT be pushed to GitHub)

### Step 2: Create Render Account

1. Go to [https://render.com](https://render.com)
2. Click **"Get Started"** or **"Sign Up"**
3. Sign up with **GitHub** (recommended for easier deployment)
4. Authorize Render to access your GitHub repositories

### Step 3: Create New Web Service

1. **Dashboard** → Click **"New +"** → Select **"Web Service"**

2. **Connect Repository**
   - Click **"Connect account"** if not connected
   - Search for `AgriContract` repository
   - Click **"Connect"**

3. **Configure Web Service**
   Fill in the following details:

   **Name:** `agricontract-backend` (or any name you prefer)
   
   **Region:** Choose closest to you (e.g., Singapore, Oregon)
   
   **Branch:** `main`
   
   **Root Directory:** `backend`
   
   **Runtime:** `Node`
   
   **Build Command:** 
   ```bash
   npm install
   ```
   
   **Start Command:**
   ```bash
   npm start
   ```
   
   **Instance Type:** `Free` (or choose paid if needed)

### Step 4: Add Environment Variables

1. Scroll down to **"Environment Variables"** section
2. Click **"Add Environment Variable"**
3. Add these variables one by one:

   ```
   KEY: MONGODB_URI
   VALUE: mongodb+srv://username:password@cluster.mongodb.net/agricontract?retryWrites=true&w=majority
   
   KEY: JWT_SECRET
   VALUE: your_super_secret_jwt_key_min_32_characters_long
   
   KEY: NODE_ENV
   VALUE: production
   
   KEY: PORT
   VALUE: 5000
   ```

   **⚠️ Important:** 
   - Copy your actual MongoDB URI from MongoDB Atlas
   - Generate a strong JWT_SECRET (at least 32 characters)
   - You can use this command to generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Step 5: Deploy

1. Click **"Create Web Service"** button
2. Wait for deployment (usually 2-5 minutes)
3. You'll see logs showing the deployment progress
4. Once done, you'll see: ✅ **"Live"** status

### Step 6: Get Backend URL

1. Your backend URL will be: `https://agricontract-backend.onrender.com`
2. Test it by visiting: `https://agricontract-backend.onrender.com/api/health`
3. You should see the API welcome message

### Step 7: Configure CORS for Vercel

Before deploying frontend, update CORS in backend:

1. In Render dashboard, go to **Environment** tab
2. Add a new environment variable:
   ```
   KEY: FRONTEND_URL
   VALUE: https://your-app-name.vercel.app
   ```
   (You'll update this after deploying frontend)

---

## 🚀 Part 2: Deploy Frontend on Vercel

### Step 1: Prepare Frontend

1. **Update API Base URL**
   
   Open `frontend/src/lib/api.ts` and change:
   ```typescript
   const api = axios.create({
     baseURL: process.env.VITE_API_URL || 'https://agricontract-backend.onrender.com/api',
     headers: {
       'Content-Type': 'application/json',
     },
   });
   ```

2. **Create Environment Variable File Template**
   
   Create `frontend/.env.example`:
   ```
   VITE_API_URL=https://agricontract-backend.onrender.com/api
   ```

3. **Commit and Push Changes**
   ```bash
   git add .
   git commit -m "feat: update API URL for production deployment"
   git push origin main
   ```

### Step 2: Create Vercel Account

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your repositories

### Step 3: Import Project

1. Click **"Add New..."** → **"Project"**
2. Find **"AgriContract"** repository
3. Click **"Import"**

### Step 4: Configure Project

1. **Framework Preset:** Vercel should auto-detect `Vite`
   - If not, select **"Vite"** from dropdown

2. **Root Directory:** Click **"Edit"** → Select `frontend`

3. **Build Settings:**
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `dist` (auto-filled)
   - **Install Command:** `npm install` (auto-filled)

### Step 5: Add Environment Variables

1. Click **"Environment Variables"** section
2. Add this variable:
   ```
   KEY: VITE_API_URL
   VALUE: https://agricontract-backend.onrender.com/api
   ```
   (Replace with your actual Render backend URL)

3. Apply to: **Production, Preview, and Development**

### Step 6: Deploy

1. Click **"Deploy"** button
2. Wait for build and deployment (2-5 minutes)
3. You'll see build logs in real-time
4. Once done: ✅ **"Deployment Completed"**

### Step 7: Get Frontend URL

1. Your app will be live at: `https://your-project-name.vercel.app`
2. Vercel assigns a random name, but you can change it
3. Click **"Settings"** → **"Domains"** → Edit project name

### Step 8: Update Backend CORS

1. Go back to **Render Dashboard**
2. Open your backend service
3. Go to **"Environment"** tab
4. Update or add:
   ```
   KEY: FRONTEND_URL
   VALUE: https://your-project-name.vercel.app
   ```
5. Click **"Save Changes"**
6. Backend will automatically redeploy

---

## 🔧 Post-Deployment Configuration

### Update Backend CORS Settings

Edit `backend/server.js` to use environment variable:

```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

Then commit and push - Render will auto-redeploy.

---

## ✅ Testing Deployment

### Test Backend
1. Visit: `https://your-backend.onrender.com/api/health`
2. Should see API info

### Test Frontend
1. Visit: `https://your-app.vercel.app`
2. Try to register/login
3. Test all features

### Common Issues & Fixes

**Backend Issues:**
- ❌ **"Application failed to respond"**
  - Check Render logs
  - Verify MongoDB URI is correct
  - Ensure PORT is set to 5000

- ❌ **"Cannot connect to database"**
  - Check MongoDB Atlas whitelist (allow all IPs: `0.0.0.0/0`)
  - Verify connection string

**Frontend Issues:**
- ❌ **"Network Error" or "CORS Error"**
  - Check FRONTEND_URL in backend env vars
  - Verify VITE_API_URL in Vercel env vars
  - Make sure CORS is configured correctly

- ❌ **"Build Failed"**
  - Check build logs in Vercel
  - Verify all dependencies are in package.json
  - Try `npm run build` locally first

---

## 🔄 Automatic Deployments

Both platforms support auto-deployment:

**Render:**
- Automatically redeploys when you push to `main` branch
- Can disable in Settings → Build & Deploy

**Vercel:**
- Auto-deploys on every push to `main` (production)
- Auto-deploys preview for pull requests
- Can configure in Settings → Git

---

## 📝 Environment Variables Checklist

### Backend (Render)
- [x] MONGODB_URI
- [x] JWT_SECRET
- [x] NODE_ENV=production
- [x] PORT=5000
- [x] FRONTEND_URL

### Frontend (Vercel)
- [x] VITE_API_URL

---

## 🎯 Final Steps

1. ✅ Both services deployed
2. ✅ Environment variables configured
3. ✅ CORS updated
4. ✅ Test all features
5. ✅ Update README with live URLs
6. 🎉 **Your app is live!**

---

## 📱 Custom Domain (Optional)

### For Vercel (Frontend)
1. Go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate auto-configured

### For Render (Backend)
1. Upgrade to paid plan for custom domains
2. Or use Render's provided URL

---

## 💡 Tips

- **Free Tier Limitations:**
  - Render: Service sleeps after 15 min inactivity (takes ~30s to wake up)
  - Vercel: Unlimited bandwidth but 100GB/month limit
  
- **Keep Services Warm:**
  - Use a service like UptimeRobot to ping your backend every 5-10 minutes
  
- **Monitor Logs:**
  - Render: Real-time logs in dashboard
  - Vercel: Function logs in dashboard

---

## 🆘 Need Help?

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com

---

**Deployment Date:** November 4, 2025
**Tech Stack:** MongoDB + Express + React + Node.js (MERN)
**Platforms:** Render (Backend) + Vercel (Frontend)
