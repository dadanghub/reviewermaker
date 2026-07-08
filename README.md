# Review Sheet Generator

A professional web application that generates classroom-ready review sheets for educators using curriculum development best practices.

## Features

🎓 **Curriculum-Aligned** - Generates review sheets following proven instructional design principles  
📚 **Professional Quality** - One-page, printable format optimized for classroom use  
⚡ **Instant Generation** - Create complete reviews in seconds using Claude AI  
🎯 **Grade 4-6 Appropriate** - Content tailored for elementary school learners  
🌐 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile  
📄 **Multiple Export Options** - Print, download, or copy review sheets  

## What Gets Generated

Each review sheet includes:

✓ **Quick Lesson** - Brief explanations of key concepts  
✓ **Key Points** - Essential ideas students need to remember  
✓ **Real-World Examples** - Age-appropriate, practical examples  
✓ **Practice Activities** - 4 different assessment formats with 5 questions each  
✓ **Answer Key** - Complete answer key for assessment  

All formatted for a single-page printout (8.5" × 11").

## Getting Started

### Prerequisites
- Node.js 18+ (for local development)
- Vercel account (for deployment)
- Anthropic API key

### Quick Start

1. **Clone or copy the project**
   ```bash
   git clone <repository-url>
   cd review-sheet-generator
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your Anthropic API key
   ```

3. **Run locally**
   ```bash
   npm run dev
   # Visit http://localhost:3000
   ```

4. **Deploy to Vercel**
   - See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions

## Usage

1. Enter lesson topics in the textarea (one per line, or combined with commas)
2. Click "Generate Review Sheet"
3. Wait 20-30 seconds for Claude to generate the complete review
4. View, print, or download your review sheet

## Example Topics

- Matter, Physical and Chemical Changes
- Context Clues, Synonyms, Antonyms
- Plant Reproduction, Pollination, Seed Dispersal
- The Water Cycle
- Fractions and Decimals
- Photosynthesis

## Technology Stack

- **Frontend**: Next.js 14, React 18, CSS Modules
- **Backend**: Next.js API Routes (Serverless)
- **AI**: Claude 3.5 Sonnet (via Anthropic API)
- **Hosting**: Vercel
- **Language**: JavaScript/JSX

## Project Structure

```
app/
├── api/generate/route.js    # API endpoint for review generation
├── page.js                   # Main application component
├── page.module.css           # Page styling
├── layout.js                 # Root layout
└── globals.css               # Global styles

Configuration:
├── next.config.js            # Next.js config
├── package.json              # Dependencies
├── vercel.json               # Vercel deployment config
└── .env.example              # Environment variable template
```

## Configuration

### Environment Variables

```env
ANTHROPIC_API_KEY=your_api_key_here
```

### Customization

- **Styling**: Edit `/app/globals.css` and `/app/page.module.css`
- **Target Audience**: Modify the `systemPrompt` in `/app/api/generate/route.js`
- **Review Format**: Update curriculum instructions in the API route

## Deployment

### Deploy to Vercel (3 minutes)

1. Push code to GitHub
2. Go to https://vercel.com/new
3. Select your repository
4. Add `ANTHROPIC_API_KEY` environment variable
5. Click Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## API Reference

### Generate Review Sheet

**Endpoint**: `POST /api/generate`

**Request**:
```json
{
  "topics": "Matter\nPhysical and Chemical Changes"
}
```

**Response**:
```json
{
  "content": "# Review Sheet\n\n## I. Quick Lesson\n..."
}
```

**Status Codes**:
- `200` - Success
- `400` - Missing or invalid topics
- `500` - Server error

## Performance

- **Generation Time**: 20-30 seconds
- **Page Load**: <1 second
- **Print Time**: Varies by printer
- **Vercel Timeout**: 60 seconds (sufficient for typical requests)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Review generation times out

- Check your internet connection
- Verify Anthropic API key is valid
- Try with shorter topic descriptions

### Print formatting looks wrong

- Use Print Preview before printing
- Set margins to 0.5 inches
- Use Arial font (default)
- Set font size to 10-11pt

### Mobile issues

- Rotate device to landscape for better textarea experience
- Use modern browser for best compatibility

## Contributing

Improvements welcome! Consider:
- Additional assessment formats
- New language support
- Different grade level templates
- Accessibility enhancements

## Future Enhancements

- [ ] Additional language support (Spanish, Tagalog)
- [ ] Customizable grade levels (K-12)
- [ ] Multiple print format options
- [ ] Template library for common subjects
- [ ] Batch generation for multiple topics
- [ ] Save and retrieve generated reviews
- [ ] Teacher account with history
- [ ] Customizable branding/school logos

## Support & Resources

- **Anthropic Documentation**: https://docs.anthropic.com
- **Next.js Documentation**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **Issue Reporting**: Please describe steps to reproduce

## License

This project is provided for educational use.

## Disclaimer

While Claude AI generates high-quality educational content, educators should:
- Review generated content before classroom use
- Verify factual accuracy for your curriculum
- Ensure alignment with learning objectives
- Customize as needed for your students

---

**Created for educators, by using the Anthropic Claude API**

For questions or improvements, please reach out!
