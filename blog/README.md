# Blog source (Quarto)

Proof-of-concept research blog, published to `hessamla.github.io/blog/`.
This directory holds only the Quarto **source** (`.qmd`, config, bib, assets);
rendered HTML is never committed here.

## How it's wired

- This directory lives on the `blog-source` branch, not `main`. The portfolio
  on `main` (root `index.html`, `content/`, etc.) is untouched by anything here.
- A push to `blog-source` that touches `blog/**` triggers
  `.github/workflows/blog-deploy.yml`, which runs `quarto render blog` and
  publishes the output to the **`blog/` subdirectory of `main`** (nothing else
  on `main` is touched — see `destination_dir` in the workflow).
- GitHub Pages already serves `main` from its root, so no Pages settings
  changes were needed — `/blog/` just becomes a reachable path once it exists.

## Local preview

```bash
pip install -r blog/requirements.txt
quarto preview blog
```

## Adding a post

Create `posts/<slug>/index.qmd` with front matter:

```yaml
---
title: "..."
date: YYYY-MM-DD
categories: [...]
draft: true
---
```

`draft: true` renders the page (so you can preview it) but excludes it from
the listing, RSS feed, and sitemap. For anything you don't want built into
the live site at all, don't push it to `blog-source` until it's ready —
draft on a feature branch, merge when done.

## Reverting this experiment

Everything here is additive and isolated:

1. Delete the `blog-source` branch.
2. Delete `.github/workflows/blog-deploy.yml`.
3. Delete the `blog/` directory from `main` (one commit).

The portfolio itself was never modified.
