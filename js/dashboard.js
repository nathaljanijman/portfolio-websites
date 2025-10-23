// Authentication check
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Logout function
function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}

// Initialize dashboard
function initDashboard() {
    if (!checkAuth()) return;

    // Display user email
    const userEmail = sessionStorage.getItem('userEmail');
    document.getElementById('userEmail').textContent = userEmail;

    // Setup navigation
    setupNavigation();

    // Load data
    loadDashboardData();
}

// Setup navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Show corresponding page
            const pageId = item.getAttribute('data-page');
            pages.forEach(page => {
                page.classList.remove('active');
                if (page.id === pageId) {
                    page.classList.add('active');
                }
            });
        });
    });
}

// Load dashboard data using API
async function loadDashboardData() {
    try {
        // Update stats
        await updateStats();

        // Load templates
        await loadTemplates();

        // Load websites
        await loadWebsites();

        // Load projects
        await loadProjects();

        // Load recent activity
        loadRecentActivity();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Update stats
async function updateStats() {
    try {
        const stats = await api.getStats();

        document.getElementById('templateCount').textContent = stats.templates || 0;
        document.getElementById('websiteCount').textContent = stats.websites || 0;
        document.getElementById('projectCount').textContent = stats.projects || 0;
        document.getElementById('revenueCount').textContent = `€${(stats.revenue || 0).toLocaleString()}`;
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// Load templates
async function loadTemplates() {
    const grid = document.getElementById('templatesGrid');
    grid.innerHTML = '<p style="text-align: center; color: #999;">Loading templates...</p>';

    try {
        const templates = await api.getTemplates();
        grid.innerHTML = '';

        templates.forEach(template => {
            const features = JSON.parse(template.features || '[]');
            const card = document.createElement('div');
            card.className = 'template-card';
            card.innerHTML = `
                <div class="template-preview" style="background: ${template.preview_gradient}">
                    <div class="template-badge">${template.category}</div>
                </div>
                <div class="template-info">
                    <h3>${template.name}</h3>
                    <p>${template.description}</p>
                    <div class="template-meta">
                        <span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                            </svg>
                            ${template.usage_count} sites
                        </span>
                        <span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            </svg>
                            ${features.length} features
                        </span>
                    </div>
                </div>
                <div class="template-actions">
                    <button class="btn-secondary" onclick="previewTemplate(${template.id})">Preview</button>
                    <button class="btn-success" onclick="useTemplate(${template.id})">Use Template</button>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading templates:', error);
        grid.innerHTML = '<p style="text-align: center; color: #c00;">Error loading templates</p>';
    }
}

// Load websites
async function loadWebsites() {
    const list = document.getElementById('websitesList');
    list.innerHTML = '<p style="text-align: center; color: #999;">Loading websites...</p>';

    try {
        const websites = await api.getWebsites();
        list.innerHTML = '';

        websites.forEach(website => {
            const card = document.createElement('div');
            card.className = 'website-card';
            card.innerHTML = `
                <div class="website-info">
                    <h3>${website.name}</h3>
                    <p>Template: ${website.template_name || 'Unknown'}</p>
                    <div class="website-url">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                        ${website.url}
                    </div>
                </div>
                <div class="website-stats">
                    <div class="website-stat">
                        <strong>${(website.visitors || 0).toLocaleString()}</strong>
                        <span>Visitors</span>
                    </div>
                    <div class="website-stat">
                        <strong>€${website.revenue || 0}</strong>
                        <span>Revenue</span>
                    </div>
                </div>
                <div class="website-status status-${website.status}">
                    ${website.status === 'live' ? '🟢 Live' : '🟡 Staging'}
                </div>
            `;
            list.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading websites:', error);
        list.innerHTML = '<p style="text-align: center; color: #c00;">Error loading websites</p>';
    }
}

// Load projects
async function loadProjects() {
    try {
        const projects = await api.getProjects();

        // Group by status
        const grouped = {
            'backlog': [],
            'in-progress': [],
            'review': [],
            'completed': []
        };

        projects.forEach(project => {
            if (grouped[project.status]) {
                grouped[project.status].push(project);
            }
        });

        // Render each column
        Object.keys(grouped).forEach(status => {
            const container = document.getElementById(status);
            container.innerHTML = '';

            grouped[status].forEach(project => {
                const tags = JSON.parse(project.tags || '[]');
                const card = document.createElement('div');
                card.className = 'project-card';
                card.innerHTML = `
                    <h4>${project.name}</h4>
                    <p>${project.description}</p>
                    <div class="project-tags">
                        ${tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                    </div>
                `;
                container.appendChild(card);
            });
        });
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Load recent activity (hardcoded for now)
function loadRecentActivity() {
    const list = document.getElementById('activityList');
    list.innerHTML = '';

    const activities = [
        {
            type: "deploy",
            message: "Deployed website for Mike Peters",
            timestamp: "2 hours ago",
            icon: "🚀"
        },
        {
            type: "create",
            message: "Created new template: Minimal Portfolio",
            timestamp: "5 hours ago",
            icon: "✨"
        },
        {
            type: "update",
            message: "Updated Professional Portfolio template",
            timestamp: "1 day ago",
            icon: "🔄"
        },
        {
            type: "revenue",
            message: "Received payment: €750 from John Doe project",
            timestamp: "2 days ago",
            icon: "💰"
        }
    ];

    activities.forEach(activity => {
        const item = document.createElement('div');
        item.className = 'activity-item';

        const colors = {
            'deploy': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'create': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'update': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'revenue': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        };

        item.innerHTML = `
            <div class="activity-icon" style="background: ${colors[activity.type]}">
                <span style="font-size: 20px;">${activity.icon}</span>
            </div>
            <div class="activity-content">
                <p>${activity.message}</p>
                <span>${activity.timestamp}</span>
            </div>
        `;
        list.appendChild(item);
    });
}

// Template actions
function previewTemplate(id) {
    const template = mockData.templates.find(t => t.id === id);
    alert(`Preview: ${template.name}\n\nThis will open a live preview of the template.`);
}

function useTemplate(id) {
    const template = mockData.templates.find(t => t.id === id);
    alert(`Use Template: ${template.name}\n\nThis will start the deployment wizard.`);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initDashboard);
