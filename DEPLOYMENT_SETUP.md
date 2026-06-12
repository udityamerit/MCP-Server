# Automatic Deployment Setup Guide

Your GitHub Actions workflow is now configured to automatically deploy your website whenever you push changes.

## ✅ What's Configured

The `.github/workflows/deploy.yml` is set up to:
- ✅ Trigger automatically on every push to `main` or `master` branch
- ✅ Build and upload your HTML files to GitHub Pages
- ✅ Deploy your website automatically

## 📋 Required Setup Steps

### Step 1: Enable GitHub Pages in Your Repository

1. Go to your GitHub repository
2. Click **Settings** (top right)
3. Scroll down to **"Pages"** section on the left sidebar
4. Under **"Build and deployment"**:
   - **Source**: Select `GitHub Actions`
   - This tells GitHub to use your workflow files
5. Click **Save**

### Step 2: Clean Up Duplicate Workflow (Important!)

You have a duplicate workflow file that should be removed:
- Delete `.github/workflows/static.yml` 
- Keep only `.github/workflows/deploy.yml`

Run this command in your terminal:
```bash
git rm .github/workflows/static.yml
git commit -m "Remove duplicate workflow file"
git push origin main
```

### Step 3: Trigger the First Deployment

Make any small change to your code and commit:
```bash
git add .
git commit -m "Enable automatic deployment"
git push origin main
```

## 🚀 How It Works Now

Every time you:
1. Commit changes locally
2. Push to GitHub (`git push`)

Your website automatically:
1. GitHub detects the push
2. Runs the deploy workflow
3. Uploads your HTML files
4. Deploys to GitHub Pages
5. Your website is updated within 1-2 minutes

## 📊 Monitor Your Deployments

- Go to your GitHub repository
- Click **Actions** tab
- You'll see your workflow runs
- Click on any run to see detailed logs

## ✨ Your Website URL

Once deployed, your site will be available at:
```
https://[your-github-username].github.io/[repo-name]/
```

Or if your repo name is `[username].github.io`, it will be:
```
https://[your-github-username].github.io/
```

## 🔍 Troubleshooting

**If deployment fails:**
1. Check the Actions tab for error messages
2. Ensure GitHub Pages is set to use "GitHub Actions"
3. Verify your repository is public (private repos need GitHub Pro)

**If files aren't updating:**
1. Clear your browser cache (Ctrl+Shift+Delete)
2. Wait 2-3 minutes for GitHub Pages to propagate
3. Check that your push was successful (git push)

---

**All set!** Your static website will now auto-deploy on every push. 🎉
