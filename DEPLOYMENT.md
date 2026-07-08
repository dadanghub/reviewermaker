# Review Sheet Generator - Deployment Guide

## Quick Start

This is a Next.js application that generates professional review sheets for educators using Claude AI. It's ready to deploy on Vercel.

---

## Prerequisites

- Node.js 18+ (for local development)
- Vercel account (free tier available at https://vercel.com)
- Anthropic API key (get one at https://console.anthropic.com)

---

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

Get your API key from: https://console.anthropic.com/account/keys

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

---

## Deployment on Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Deploy

```bash
vercel
```

Follow the prompts to:
- Link to your Vercel account
- Select a project name
- Confirm the framework (Next.js)

#### 3. Add Environment Variable

When prompted, or after deployment:

```bash
vercel env add ANTHROPIC_API_KEY
```

Enter your Anthropic API key when prompted.

#### 4. Redeploy with Environment Variable

```bash
vercel --prod
```

### Option 2: Deploy via GitHub (Recommended for Continuous Deployment)

#### 1. Create a GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/review-sheet-generator.git
git push -u origin main
```

#### 2. Connect to Vercel

1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Connect your GitHub account and select the repository
4. Framework: Auto-detect (should be Next.js)
5. Root Directory: `./`
6. Environment Variables:
   - Name: `ANTHROPIC_API_KEY`
   - Value: Your Anthropic API key

#### 7. Click "Deploy"

Vercel will automatically deploy and redeploy on every push to `main`.

### Option 3: Manual Deployment via Vercel Dashboard

#### 1. Prepare Your Project

```bash
# Make sure everything is committed
git add .
git commit -m "Ready for deployment"
```

#### 2. Drag & Drop

1. Go to https://vercel.com/new
2. Drag your project folder into the browser window
3. Add environment variables:
   - `ANTHROPIC_API_KEY`: Your API key
4. Click "Deploy"

---

## Configuration

### Environment Variables

The application requires:

- `ANTHROPIC_API_KEY` - Your Anthropic API key (required)

### Build Settings

- Framework: Next.js
- Build Command: `next build`
- Output Directory: `.next`
- Node Version: 18.x (or later)

---

## File Structure

```
review-sheet-generator/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.js          # API endpoint for generating reviews
│   ├── globals.css                # Global styles
│   ├── layout.js                  # Root layout
│   ├── page.js                    # Main page component
│   └── page.module.css            # Page-specific styles
├── public/                         # Static assets (if needed)
├── .env.example                    # Environment variable template
├── next.config.js                  # Next.js configuration
├── package.json                    # Dependencies
├── vercel.json                     # Vercel configuration
└── README.md                       # Project documentation
```

---

## How It Works

1. **User Input**: Educators enter lesson topics into the textarea
2. **API Request**: The frontend sends topics to `/api/generate`
3. **Claude Processing**: The API calls Claude with a curriculum development prompt
4. **Review Generation**: Claude creates a complete review sheet (lesson, key points, practice activities, answer key)
5. **Display & Export**: Users can view, print, or download the review sheet

---

## API Endpoint

### POST `/api/generate`

**Request:**
```json
{
  "topics": "Matter\nPhysical and Chemical Changes\nContext Clues"
}
```

**Response:**
```json
{
  "content": "# Review Sheet Title\n\n## I. Quick Lesson\n..."
}
```

---

## Features

✅ Professional curriculum-aligned review sheets  
✅ Grade 4-6 appropriate content  
✅ Multiple assessment formats  
✅ One-page printable format  
✅ Print and download functionality  
✅ Responsive mobile-friendly design  
✅ Error handling and user feedback  

---

## Troubleshooting

### "ANTHROPIC_API_KEY is not defined"

Make sure you've added the environment variable to your Vercel deployment:
1. Go to your Vercel project settings
2. Go to Environment Variables
3. Add `ANTHROPIC_API_KEY`
4. Redeploy

### "Failed to generate review sheet"

- Check that your Anthropic API key is valid
- Verify your account has sufficient credits
- Check the browser console for error messages

### Application Times Out

- The review sheet generation may take 20-30 seconds
- Vercel's serverless functions have a 60-second timeout by default
- This should be sufficient for most use cases

---

## Customization

### Change Target Audience

Edit `/app/api/generate/route.js` and modify the `systemPrompt` variable to change the grade level or audience.

### Customize Styling

Edit `/app/globals.css` and `/app/page.module.css` to change colors, fonts, and layout.

### Modify Review Format

Update the curriculum instructions in `systemPrompt` to change:
- Number of practice activities
- Question formats
- Review structure
- Content guidelines

---

## Support

For issues with:
- **Claude API**: https://support.anthropic.com
- **Vercel Deployment**: https://vercel.com/docs
- **Next.js**: https://nextjs.org/docs

---

## License

This project is provided as-is for educational purposes.

---

## Version Info

- Next.js: 14.0+
- React: 18.2+
- Node.js: 18+
- Framework: Next.js App Router
