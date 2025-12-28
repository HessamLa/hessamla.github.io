# hessamla.github.io

Personal portfolio website built with vanilla HTML/CSS/JS (SPA architecture).

## Structure

```
├── index.html          # Single HTML entry point
├── css/style.css       # Styling
├── js/main.js          # Router, content loader, renderers
├── content/            # All content as Markdown + JSON
│   ├── site.json       # Global config
│   ├── home.md
│   ├── about.md
│   ├── publications.json
│   ├── projects/
│   └── blog/
└── assets/             # Images, resume PDF
```

## How It Works

- Single `index.html` with a content container
- JavaScript handles hash-based routing (`#about`, `#projects`, etc.)
- Content files use Markdown with YAML front matter
- Minimal YAML parser (no external dependency)
- Markdown rendered via marked.js (CDN)

## Local Development

```bash
# Serve locally (any static server works)
python -m http.server 8000
# or
npx serve .
```

Then visit `http://localhost:8000`

## Deployment

Push to GitHub. Enable GitHub Pages in repo settings (deploy from main branch).

No build step required—it's all static files.

## Adding Content

**New project:**
1. Add entry to `content/projects/_index.json`
2. Create `content/projects/your-project.md`

**New blog post:**
1. Add entry to `content/blog/_index.json`
2. Create `content/blog/your-post.md`

## Customization

- Edit `content/site.json` for nav, social links, meta
- Edit `css/style.css` for styling
- Edit `js/main.js` for behavior
