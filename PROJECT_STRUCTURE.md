# Project Structure

```
review-sheet-generator/
│
├── app/                              # Next.js app directory
│   ├── api/
│   │   └── generate/
│   │       └── route.js              # API endpoint (POST /api/generate)
│   │
│   ├── layout.js                     # Root layout component
│   ├── page.js                       # Main page component
│   │
│   ├── globals.css                   # Global styles & CSS variables
│   ├── page.module.css               # Page-specific styles
│   │
│   └── favicon.ico                   # (Optional) favicon
│
├── public/                           # Static files (optional)
│   └── (logo, images, etc.)
│
├── Configuration Files
│   ├── package.json                  # Dependencies and scripts
│   ├── next.config.js                # Next.js configuration
│   ├── vercel.json                   # Vercel deployment settings
│   └── .gitignore                    # Git ignore patterns
│
├── Environment
│   └── .env.example                  # Template for environment variables
│
├── Documentation
│   ├── README.md                     # Project overview
│   ├── QUICKSTART.md                 # 5-minute setup guide
│   ├── DEPLOYMENT.md                 # Detailed deployment instructions
│   └── PROJECT_STRUCTURE.md          # This file
│
└── .git/                             # Git repository (after initialization)
```

## File Descriptions

### Core Application Files

#### `app/layout.js`
- Root layout component for the entire application
- Sets up metadata (title, description)
- Contains HTML structure

#### `app/page.js`
- Main React component
- Handles user input form
- Manages state for topics, review, and loading states
- Implements print and download functionality
- Contains all UI logic

#### `app/api/generate/route.js`
- Next.js API route handler
- Receives POST requests with lesson topics
- Calls Claude API with curriculum development prompt
- Returns generated review sheet
- Error handling and validation

### Styling Files

#### `app/globals.css`
- Global CSS variables (colors, fonts)
- Base styles for all HTML elements
- Consistent design tokens
- Responsive design utilities

#### `app/page.module.css`
- Component-specific styles
- Layout grid for two-column design
- Button and form styling
- Responsive breakpoints (mobile, tablet, desktop)
- Print-specific styles

### Configuration Files

#### `package.json`
```json
{
  "name": "review-sheet-generator",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",           // Local development
    "build": "next build",        // Production build
    "start": "next start",        // Production start
    "lint": "next lint"           // Code linting
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.0"
  }
}
```

#### `next.config.js`
- Next.js build configuration
- Settings for optimization and features
- Server and client configuration

#### `vercel.json`
- Vercel-specific deployment settings
- Build commands
- Node version
- Environment variable declarations

### Environment Configuration

#### `.env.example`
- Template showing required environment variables
- Instructions for setup
- Safe to commit to version control

#### `.env.local` (created locally)
- Actual environment variables
- NOT committed to git
- Contains sensitive API keys

## Architecture

### Client-Server Flow

```
User Interface (page.js)
    ↓
Form Input (topics)
    ↓
POST /api/generate (route.js)
    ↓
Claude API Call (Anthropic)
    ↓
Review Sheet Generation
    ↓
Return Content (JSON)
    ↓
Display in UI (page.js)
    ↓
Print/Download Options
```

### Component Hierarchy

```
RootLayout (layout.js)
└── Home (page.js)
    ├── Header Section
    ├── Grid Container
    │   ├── Input Section
    │   │   └── Form
    │   │       ├── Textarea
    │   │       ├── Submit Button
    │   │       └── Examples
    │   │
    │   └── Output Section
    │       ├── Empty State (initial)
    │       └── Review Display (after generation)
    │           ├── Action Buttons (Print, Download, Clear)
    │           └── Review Content
    │
    └── Footer
```

## Key Features by File

### `page.js` Features
- ✅ Form input handling
- ✅ API communication
- ✅ Loading states
- ✅ Error display
- ✅ Print functionality
- ✅ Download functionality
- ✅ Responsive layout
- ✅ Accessibility considerations

### `route.js` Features
- ✅ Input validation
- ✅ Claude API integration
- ✅ Error handling
- ✅ Response formatting
- ✅ Timeout handling
- ✅ Security (API key in environment)

### Styling Features
- ✅ CSS Grid layout
- ✅ Responsive design (mobile-first)
- ✅ Accessibility (focus states)
- ✅ Print optimization
- ✅ Consistent spacing and typography
- ✅ Color scheme for educators
- ✅ Loading states and animations

## Responsive Breakpoints

```css
Desktop:    1024px+   (2-column grid)
Tablet:     640-1024px (responsive adjustments)
Mobile:     < 640px   (1-column, stacked)
Small Mobile: < 480px (further optimizations)
```

## Environment Variables

### Required
- `ANTHROPIC_API_KEY` - Your Anthropic API key

### Optional
- None (more could be added for customization)

## Dependencies

### Production
- **React 18.2+** - UI library
- **Next.js 14+** - Framework and API routes
- **React DOM 18.2+** - React rendering

### Development
- **ESLint** - Code quality
- **Next.js ESLint Config** - Framework-specific rules

### External Services
- **Anthropic Claude API** - AI/ML for review generation
- **Vercel** - Hosting and deployment

## Performance Considerations

- **Bundle Size**: Minimal dependencies (React + Next.js only)
- **API Calls**: Single call per review generation
- **Timeout**: 60 seconds (Vercel serverless limit)
- **Caching**: Could be added for frequent topics
- **Optimization**: Code splitting handled by Next.js

## Security

- ✅ API key stored in environment variables only
- ✅ No sensitive data in client-side code
- ✅ Input validation on API route
- ✅ CORS handled by same-origin requests
- ✅ No database or persistent user data

## Scalability

Current setup supports:
- Unlimited users (serverless)
- Unlimited reviews (pay-as-you-go API)
- Automatic scaling with Vercel
- Minimal server resources needed

## Future Expansion

Possible additions:
- `/app/examples/` - Example reviews
- `/app/templates/` - Grade-specific templates
- `/app/settings/` - Customization interface
- `/app/history/` - Save/retrieve previous reviews
- `/public/images/` - Static assets
- `/lib/utils.js` - Shared utilities
- `/lib/prompts.js` - Modular prompt templates

## Testing Structure (Could be added)

```
__tests__/
├── api/
│   └── generate.test.js
├── components/
│   └── Home.test.js
└── utils/
    └── helpers.test.js
```

## Build Process

```
npm run build
  ↓
Next.js Compilation
  ↓
TypeScript Checking (if enabled)
  ↓
ESLint Analysis
  ↓
.next/ Directory
  ↓
Ready for Deployment
```

## Deployment Structure on Vercel

```
review-sheet-generator.vercel.app
├── / (Next.js App)
│   ├── / (page.js)
│   └── /api/generate (route.js)
└── /_next/ (static assets)
```

---

This structure is optimized for:
- ✅ Ease of deployment
- ✅ Minimal complexity
- ✅ Fast performance
- ✅ Easy maintenance
- ✅ Future scalability
