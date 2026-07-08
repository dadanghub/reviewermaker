# Quick Start Guide - Review Sheet Generator

Get your review sheet generator live in 5 minutes!

## Step 1: Get Your Anthropic API Key (2 minutes)

1. Go to https://console.anthropic.com
2. Sign up (or log in)
3. Navigate to **API Keys**
4. Click **Create Key**
5. Copy your new API key and keep it safe
6. You'll need this in the next steps

## Step 2: Deploy on Vercel (3 minutes)

### Option A: Deploy via GitHub (Recommended)

1. **Create a GitHub repository**:
   - Go to https://github.com/new
   - Name it `review-sheet-generator`
   - Click "Create repository"

2. **Upload your code**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/review-sheet-generator.git
   git branch -M main
   git push -u origin main
   ```

3. **Connect to Vercel**:
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Paste your GitHub repo URL
   - Click "Import"

4. **Add Environment Variable**:
   - Framework: Should auto-detect Next.js ✓
   - Root Directory: `.` ✓
   - Build Command: Should auto-fill ✓
   - **Environment Variables**:
     - Name: `ANTHROPIC_API_KEY`
     - Value: Paste your API key from Step 1
   - Click "Deploy"

5. **Wait** (usually 2-3 minutes) and you're done! 🎉

### Option B: Deploy Directly to Vercel

1. Go to https://vercel.com/new
2. Click "Deploy"
3. Sign in with GitHub/GitLab/Bitbucket
4. **Create new Git repository** (Vercel will create it for you)
5. Upload your project files
6. Add environment variable: `ANTHROPIC_API_KEY`
7. Click "Deploy"

### Option C: Use Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Login and follow prompts**:
   - Link Vercel account
   - Select project name
   - Confirm framework (Next.js)

4. **Add environment variable**:
   ```bash
   vercel env add ANTHROPIC_API_KEY
   ```
   Paste your API key

5. **Redeploy**:
   ```bash
   vercel --prod
   ```

## Step 3: Test Your Deployment

1. Vercel will give you a URL (something like `https://review-sheet-generator.vercel.app`)
2. Visit the URL
3. Enter a test topic: `"The Water Cycle"`
4. Click "Generate Review Sheet"
5. Wait 20-30 seconds and see your review!

## Success! 🎊

Your review sheet generator is now live!

---

## Testing Locally (Optional)

Want to test before deploying?

```bash
# Install dependencies
npm install

# Create .env.local file
echo "ANTHROPIC_API_KEY=your_api_key_here" > .env.local

# Start development server
npm run dev

# Visit http://localhost:3000
```

---

## Troubleshooting

### "Failed to generate review sheet"

**Solution**: Check that your Anthropic API key is correct
1. Go to your Vercel project settings
2. Click "Environment Variables"
3. Delete `ANTHROPIC_API_KEY`
4. Add it again with your correct key
5. Redeploy from the "Deployments" tab

### "Cannot find module 'next'"

**Solution**: Install dependencies on Vercel
- This usually happens automatically
- If not, go to project settings and clear build cache, then redeploy

### Page loads but button doesn't work

**Solution**: Your API key might not be set
- Check Vercel Environment Variables
- Make sure variable name is exactly `ANTHROPIC_API_KEY`
- Redeploy

### Review takes too long to generate

**Solution**: This is normal! Reviews take 20-30 seconds
- Don't close the tab
- Wait for "Generating..." to finish
- Check browser console (F12) for errors

---

## Next Steps

1. ✅ Your site is live!
2. 🎨 Customize styling in `/app/globals.css`
3. 📝 Modify the curriculum instructions in `/app/api/generate/route.js`
4. 🚀 Add more features as needed
5. 📚 Share with other educators!

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `/app/page.js` | Main application interface |
| `/app/api/generate/route.js` | AI review generation logic |
| `/app/page.module.css` | Styling |
| `.env.local` | Local environment variables |
| `vercel.json` | Vercel configuration |

---

## Common Customizations

### Change the Grade Level

Edit `/app/api/generate/route.js`, find this line in `systemPrompt`:
```javascript
// TARGET AUDIENCE:
// • Grade 4–6 students
```

Change to your desired grade level and regenerate.

### Change Colors

Edit `/app/globals.css`:
```css
:root {
  --primary: #2563eb;  /* Change this to your brand color */
  --accent: #0891b2;
  /* ... */
}
```

### Add Your School Logo

1. Place logo image in `/public` folder
2. Add to page.js:
```javascript
<img src="/logo.png" alt="School Logo" />
```

---

## Need Help?

- **Anthropic Docs**: https://docs.anthropic.com
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **API Status**: https://status.anthropic.com

---

## Cost Estimate

- **Vercel**: Free tier (up to 100GB bandwidth/month)
- **Anthropic**: Pay-as-you-go (~$0.015 per review)
  - Example: 100 reviews/month ≈ $1.50

---

**You're all set! Happy review sheet generating! 📚✨**
