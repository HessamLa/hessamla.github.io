/**
 * Portfolio Site - Main Application
 * 
 * Structure:
 * 1. Configuration & State
 * 2. Minimal YAML Front Matter Parser
 * 3. Content Loader
 * 4. Router
 * 5. Renderers (Home, About, Projects, Publications, Blog)
 * 6. UI Helpers (Nav, Footer, Mobile Menu)
 * 7. Initialization
 */

/* =============================================
   1. CONFIGURATION & STATE
   ============================================= */

const CONFIG = {
  contentPath: 'content',
  defaultRoute: 'home',
};

let siteData = null;  // Loaded from site.json
let currentRoute = null;

/* =============================================
   2. MINIMAL YAML FRONT MATTER PARSER
   ============================================= */

/**
 * Parse YAML front matter from markdown content
 * Handles: key: value, key: [array, items], booleans, numbers
 * @param {string} content - Raw markdown file content
 * @returns {{ meta: Object, body: string }}
 */
function parseFrontMatter(content) {
  const meta = {};
  let body = content;

  if (!content.startsWith('---')) {
    return { meta, body };
  }

  // Find the closing '---'
  const lines = content.split('\n');
  let closingIndex = -1;

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      closingIndex = i;
      break;
    }
  }

  if (closingIndex === -1) {
    return { meta, body };
  }

  // Extract YAML portion
  const yamlLines = lines.slice(1, closingIndex);
  body = lines.slice(closingIndex + 1).join('\n');

  // Parse each YAML line
  for (const line of yamlLines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();

    // Handle arrays: [item1, item2]
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1)
        .split(',')
        .map(item => item.trim().replace(/^["']|["']$/g, ''));
    }
    // Handle booleans
    else if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    }
    // Handle numbers
    else if (!isNaN(value) && value !== '') {
      value = Number(value);
    }
    // Remove quotes from strings
    else if ((value.startsWith('"') && value.endsWith('"')) ||
             (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    meta[key] = value;
  }

  return { meta, body };
}

/* =============================================
   3. CONTENT LOADER
   ============================================= */

/**
 * Fetch and parse a markdown file with front matter
 * @param {string} path - Path to the markdown file
 * @returns {Promise<{ meta: Object, html: string }>}
 */
async function loadMarkdown(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load ${path}`);
    }
    const content = await response.text();
    const { meta, body } = parseFrontMatter(content);
    const html = marked.parse(body);
    return { meta, html };
  } catch (error) {
    console.error('Error loading markdown:', error);
    throw error;
  }
}

/**
 * Fetch and parse a JSON file
 * @param {string} path - Path to the JSON file
 * @returns {Promise<Object>}
 */
async function loadJSON(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load ${path}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading JSON:', error);
    throw error;
  }
}

/**
 * Load site configuration from site.json
 */
async function loadSiteConfig() {
  siteData = await loadJSON(`${CONFIG.contentPath}/site.json`);
  populateNav();
  populateHeaderSocial();
  populateFooter();
}

/* =============================================
   4. ROUTER
   ============================================= */

/**
 * Get current route from URL hash
 * @returns {{ page: string, slug: string|null }}
 */
function getRoute() {
  let hash = window.location.hash.slice(1); // Remove '#'

  if (!hash) {
    return { page: CONFIG.defaultRoute, slug: null };
  }

  const parts = hash.split('/');
  return {
    page: parts[0],
    slug: parts[1] || null
  };
}

/**
 * Handle route changes
 */
async function handleRoute() {
  const route = getRoute();
  currentRoute = route;

  // Update active nav link
  updateActiveNav(route.page);

  // Show loading state
  render('<div id="loading">Loading...</div>');

  // Close mobile menu if open
  const nav = document.getElementById('main-nav');
  if (nav) {
    nav.classList.remove('open');
  }

  try {
    // Call appropriate renderer based on route
    switch (route.page) {
      case 'home':
        await renderHome();
        break;
      case 'about':
        await renderAbout();
        break;
      case 'projects':
        if (route.slug) {
          await renderProject(route.slug);
        } else {
          await renderProjects();
        }
        break;
      case 'publications':
        await renderPublications();
        break;
      case 'blog':
        if (route.slug) {
          await renderPost(route.slug);
        } else {
          await renderBlog();
        }
        break;
      default:
        render404();
    }

    // Scroll to top
    window.scrollTo(0, 0);
  } catch (error) {
    console.error('Error rendering route:', error);
    render404();
  }
}

/**
 * Navigate to a route programmatically
 * @param {string} hash - Route hash (e.g., '#about')
 */
function navigate(hash) {
  window.location.hash = hash;
}

/* =============================================
   5. RENDERERS
   ============================================= */

/**
 * Render content into the main container
 * @param {string} html - HTML content to render
 * @param {string} pageClass - CSS class for the page
 */
function render(html, pageClass = '') {
  const container = document.getElementById('content');
  container.className = pageClass;
  container.innerHTML = html;
}

/**
 * Render the home page
 */
async function renderHome() {
  const { html } = await loadMarkdown(`${CONFIG.contentPath}/home.md`);
  render(`<div class="hero">${html}</div>`, 'page-home');
}

/**
 * Render the about page
 */
async function renderAbout() {
  const { html } = await loadMarkdown(`${CONFIG.contentPath}/about.md`);
  render(html, 'page-about');
}

/**
 * Render the projects listing page
 */
async function renderProjects() {
  const data = await loadJSON(`${CONFIG.contentPath}/projects/_index.json`);

  let html = `
    <h1>${data.title}</h1>
    <p class="intro">${data.intro}</p>
    <div class="project-grid">
  `;

  for (const project of data.items) {
    const tags = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    html += `
      <div class="card project-card" onclick="navigate('#projects/${project.slug}')">
        <h3>${project.title}</h3>
        <p class="summary">${project.summary}</p>
        <div class="tags">${tags}</div>
      </div>
    `;
  }

  html += '</div>';
  render(html, 'page-projects');
}

/**
 * Render a single project page
 * @param {string} slug - Project slug
 */
async function renderProject(slug) {
  const { meta, html } = await loadMarkdown(`${CONFIG.contentPath}/projects/${slug}.md`);

  let content = `
    <a href="#projects" class="back-link">← Back to Projects</a>
    <div class="project-header">
      <h1>${meta.title}</h1>
  `;

  if (meta.tags && meta.tags.length > 0) {
    const tags = meta.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    content += `<div class="tags">${tags}</div>`;
  }

  if (meta.github || meta.paper || meta.demo) {
    content += '<div class="project-links">';
    if (meta.github) {
      content += `<a href="${meta.github}" target="_blank" class="btn btn-primary icon-link">
        <i class="fab fa-github"></i> GitHub
      </a>`;
    }
    if (meta.paper) {
      content += `<a href="${meta.paper}" target="_blank" class="btn btn-primary icon-link">
        <i class="fas fa-file-alt"></i> Paper
      </a>`;
    }
    if (meta.demo) {
      content += `<a href="${meta.demo}" target="_blank" class="btn btn-primary icon-link">
        <i class="fas fa-external-link-alt"></i> Demo
      </a>`;
    }
    content += '</div>';
  }

  content += `</div>${html}`;
  render(content, 'page-project');
}

/**
 * Render the publications page
 */
async function renderPublications() {
  const data = await loadJSON(`${CONFIG.contentPath}/publications.json`);

  let html = `
    <h1>${data.title}</h1>
    <p class="intro">${data.intro}</p>
  `;

  for (const pub of data.items) {
    html += '<div class="publication-item">';

    if (pub.title) {
      html += `<div class="title">${pub.title}</div>`;
    }
    if (pub.authors) {
      html += `<div class="authors">${pub.authors}</div>`;
    }
    if (pub.venue) {
      html += `<div class="venue">${pub.venue}</div>`;
    }
    if (pub.description) {
      html += `<div class="description">${pub.description}</div>`;
    }

    // Only render links div if at least one link exists
    if (pub.paper || pub.code || pub.slides) {
      html += '<div class="links">';

      if (pub.paper) {
        html += `<a href="${pub.paper}" target="_blank" class="icon-link">
          <i class="fas fa-file-pdf"></i> Paper
        </a>`;
      }
      if (pub.code) {
        html += `<a href="${pub.code}" target="_blank" class="icon-link">
          <i class="fab fa-github"></i> Code
        </a>`;
      }
      if (pub.slides) {
        html += `<a href="${pub.slides}" target="_blank" class="icon-link">
          <i class="fas fa-presentation"></i> Slides
        </a>`;
      }

      html += '</div>';
    }

    html += '</div>';
  }

  // Add note if it exists
  if (data.note) {
    const resolvedNote = resolveTemplateVars(data.note);
    html += `<p class="mt-lg text-muted">${marked.parseInline(resolvedNote)}</p>`;
  }

  render(html, 'page-publications');
}

/**
 * Render the blog listing page
 */
async function renderBlog() {
  const data = await loadJSON(`${CONFIG.contentPath}/blog/_index.json`);

  // Filter out drafts
  const posts = data.items.filter(post => !post.draft);

  let html = `
    <h1>${data.title}</h1>
    <p class="intro">${data.intro}</p>
  `;

  if (posts.length === 0) {
    html += '<p class="text-muted">No posts yet. Check back soon!</p>';
  } else {
    for (const post of posts) {
      const tags = post.tags ? post.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';
      html += `
        <div class="blog-post-preview">
          <h2><a href="#blog/${post.slug}">${post.title}</a></h2>
          <div class="post-meta">
            <span class="date">${post.date}</span>
            ${tags}
          </div>
          <p class="summary">${post.summary}</p>
        </div>
      `;
    }
  }

  render(html, 'page-blog');
}

/**
 * Render a single blog post
 * @param {string} slug - Post slug
 */
async function renderPost(slug) {
  const { meta, html } = await loadMarkdown(`${CONFIG.contentPath}/blog/${slug}.md`);

  const tags = meta.tags ? meta.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';

  const content = `
    <a href="#blog" class="back-link">← Back to Blog</a>
    <h1>${meta.title}</h1>
    <div class="post-meta">
      <span class="date">${meta.date}</span>
      <div class="tags">${tags}</div>
    </div>
    ${html}
  `;

  render(content, 'page-post');
}

/**
 * Render 404 page
 */
function render404() {
  render(`
    <div class="text-center">
      <h1>404</h1>
      <p>Page not found</p>
      <a href="#home">Go home</a>
    </div>
  `);
}

/* =============================================
   6. UI HELPERS
   ============================================= */

/**
 * Populate navigation from site config
 */
function populateNav() {
  const nav = document.getElementById('main-nav');
  nav.innerHTML = '';

  for (const item of siteData.nav) {
    const link = document.createElement('a');
    link.href = `#${item.href}`;
    link.textContent = item.label;
    nav.appendChild(link);
  }
}

/**
 * Update active navigation link
 * @param {string} currentPage - Current page name
 */
function updateActiveNav(currentPage) {
  const navLinks = document.querySelectorAll('#main-nav a');

  navLinks.forEach(link => {
    link.classList.remove('active');
    const linkPage = link.getAttribute('href').slice(1); // Remove '#'
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });
}

/**
 * Resolve template variables in strings
 * @param {string} str - String with potential template variables like {contact.email}
 * @returns {string} - Resolved string
 */
function resolveTemplateVars(str) {
  if (!str || typeof str !== 'string') return str;

  return str.replace(/\{contact\.(\w+)\}/g, (match, key) => {
    return siteData.contact && siteData.contact[key] ? siteData.contact[key] : match;
  });
}

/**
 * Populate header with social links
 */
function populateHeaderSocial() {
  const socialContainer = document.querySelector('.header-social-links');
  if (!socialContainer) return;

  socialContainer.innerHTML = '';

  // Icon mapping for common social platforms
  const iconMap = {
    github: 'fab fa-github',
    twitter: 'fab fa-twitter',
    linkedin: 'fab fa-linkedin',
    email: 'fas fa-envelope',
    scholar: 'fas fa-graduation-cap'
  };

  for (const item of siteData.social) {
    const link = document.createElement('a');
    link.href = resolveTemplateVars(item.url);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', item.label);

    const icon = document.createElement('i');
    icon.className = iconMap[item.platform] || 'fas fa-link';
    link.appendChild(icon);

    socialContainer.appendChild(link);
  }
}

/**
 * Populate footer with social links
 */
function populateFooter() {
  const socialContainer = document.querySelector('.social-links');
  socialContainer.innerHTML = '';

  // Icon mapping for common social platforms
  const iconMap = {
    github: 'fab fa-github',
    twitter: 'fab fa-twitter',
    linkedin: 'fab fa-linkedin',
    email: 'fas fa-envelope',
    scholar: 'fas fa-graduation-cap'
  };

  for (const item of siteData.social) {
    const link = document.createElement('a');
    link.href = resolveTemplateVars(item.url);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', item.label);

    const icon = document.createElement('i');
    icon.className = iconMap[item.platform] || 'fas fa-link';
    link.appendChild(icon);

    socialContainer.appendChild(link);
  }
}

/**
 * Setup mobile menu toggle
 */
function setupMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const nav = document.getElementById('main-nav');

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

/* =============================================
   7. INITIALIZATION
   ============================================= */

/**
 * Initialize the application
 */
async function init() {
  try {
    // Load site config
    await loadSiteConfig();

    // Setup mobile menu
    setupMobileMenu();

    // Handle initial route
    await handleRoute();
  } catch (error) {
    console.error('Failed to initialize application:', error);
    render('<div class="text-center"><h1>Error</h1><p>Failed to load site. Please refresh the page.</p></div>');
  }
}

// Listen for hash changes
window.addEventListener('hashchange', handleRoute);

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
