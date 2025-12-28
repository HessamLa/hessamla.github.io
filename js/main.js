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
  // TODO: Implement minimal YAML parser
  // 
  // Logic:
  // 1. Check if content starts with '---'
  // 2. Find the closing '---'
  // 3. Extract YAML portion between the two markers
  // 4. Parse each line:
  //    - Split by first ':'
  //    - Trim key and value
  //    - Handle arrays: [item1, item2] -> ['item1', 'item2']
  //    - Handle booleans: true/false -> true/false
  //    - Handle numbers: '123' -> 123
  // 5. Return { meta: parsedObject, body: remainingMarkdown }
  
  const meta = {};
  let body = content;
  
  // Placeholder implementation
  if (content.startsWith('---')) {
    // Parse front matter
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
  // TODO: Implement
  //
  // Logic:
  // 1. Fetch the file
  // 2. Parse front matter using parseFrontMatter()
  // 3. Convert markdown body to HTML using marked.parse()
  // 4. Return { meta, html }
}

/**
 * Fetch and parse a JSON file
 * @param {string} path - Path to the JSON file
 * @returns {Promise<Object>}
 */
async function loadJSON(path) {
  // TODO: Implement
  //
  // Logic:
  // 1. Fetch the file
  // 2. Parse as JSON
  // 3. Return parsed object
}

/**
 * Load site configuration from site.json
 */
async function loadSiteConfig() {
  // TODO: Implement
  //
  // Logic:
  // 1. Load content/site.json
  // 2. Store in siteData global
  // 3. Populate nav and footer
}

/* =============================================
   4. ROUTER
   ============================================= */

/**
 * Get current route from URL hash
 * @returns {{ page: string, slug: string|null }}
 */
function getRoute() {
  // TODO: Implement
  //
  // Logic:
  // 1. Get window.location.hash
  // 2. Parse into page and optional slug
  //    - '#about' -> { page: 'about', slug: null }
  //    - '#projects/my-project' -> { page: 'projects', slug: 'my-project' }
  // 3. Default to CONFIG.defaultRoute if empty
}

/**
 * Handle route changes
 */
async function handleRoute() {
  // TODO: Implement
  //
  // Logic:
  // 1. Get current route using getRoute()
  // 2. Update active nav link
  // 3. Show loading state
  // 4. Call appropriate renderer based on route.page
  // 5. Scroll to top
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
  // TODO: Implement
  //
  // Logic:
  // 1. Load content/home.md
  // 2. Render markdown as HTML
  // 3. Add page-home class
}

/**
 * Render the about page
 */
async function renderAbout() {
  // TODO: Implement
  //
  // Logic:
  // 1. Load content/about.md
  // 2. Render markdown as HTML
  // 3. Add page-about class
}

/**
 * Render the projects listing page
 */
async function renderProjects() {
  // TODO: Implement
  //
  // Logic:
  // 1. Load content/projects/_index.json
  // 2. Build HTML with project cards
  // 3. Each card links to #projects/[slug]
}

/**
 * Render a single project page
 * @param {string} slug - Project slug
 */
async function renderProject(slug) {
  // TODO: Implement
  //
  // Logic:
  // 1. Load content/projects/[slug].md
  // 2. Render front matter (tags, links) + body
  // 3. Add back link to #projects
}

/**
 * Render the publications page
 */
async function renderPublications() {
  // TODO: Implement
  //
  // Logic:
  // 1. Load content/publications.json
  // 2. Build HTML for each publication
  // 3. Group by year if desired
}

/**
 * Render the blog listing page
 */
async function renderBlog() {
  // TODO: Implement
  //
  // Logic:
  // 1. Load content/blog/_index.json
  // 2. Filter out drafts
  // 3. Build HTML with post previews
  // 4. Each preview links to #blog/[slug]
}

/**
 * Render a single blog post
 * @param {string} slug - Post slug
 */
async function renderPost(slug) {
  // TODO: Implement
  //
  // Logic:
  // 1. Load content/blog/[slug].md
  // 2. Render front matter (date, tags) + body
  // 3. Add back link to #blog
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
  // TODO: Implement
  //
  // Logic:
  // 1. Get #main-nav element
  // 2. Loop through siteData.nav
  // 3. Create anchor elements
  // 4. Append to nav
}

/**
 * Update active navigation link
 * @param {string} currentPage - Current page name
 */
function updateActiveNav(currentPage) {
  // TODO: Implement
  //
  // Logic:
  // 1. Remove 'active' class from all nav links
  // 2. Add 'active' class to matching link
}

/**
 * Populate footer with social links
 */
function populateFooter() {
  // TODO: Implement
  //
  // Logic:
  // 1. Get .social-links element
  // 2. Loop through siteData.social
  // 3. Create anchor elements with icons
  // 4. Append to container
}

/**
 * Setup mobile menu toggle
 */
function setupMobileMenu() {
  // TODO: Implement
  //
  // Logic:
  // 1. Get #mobile-menu-toggle button
  // 2. Add click listener
  // 3. Toggle 'open' class on #main-nav
}

/* =============================================
   7. INITIALIZATION
   ============================================= */

/**
 * Initialize the application
 */
async function init() {
  // TODO: Implement
  //
  // Logic:
  // 1. Load site config
  // 2. Populate nav and footer
  // 3. Setup mobile menu
  // 4. Add hashchange event listener
  // 5. Handle initial route
}

// Listen for hash changes
window.addEventListener('hashchange', handleRoute);

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
