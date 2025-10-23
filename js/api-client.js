/**
 * API Client for Portfolio Manager
 * Connects to Cloudflare Workers backend
 */

// Configuration
const API_CONFIG = {
    // Development: use local Wrangler dev server
    // Production: use deployed Workers URL
    baseURL: window.location.hostname === 'localhost'
        ? 'http://localhost:8787/api'
        : 'https://portfolio-manager.nathaljanijman.workers.dev/api',

    // Fallback to mock data if API is not available
    useMockData: true // Set to false when API is deployed
};

class APIClient {
    constructor(baseURL, useMockData = false) {
        this.baseURL = baseURL;
        this.useMockData = useMockData;
    }

    // Generic request method
    async request(endpoint, options = {}) {
        // If using mock data, return mock responses
        if (this.useMockData) {
            return this.getMockData(endpoint, options.method || 'GET');
        }

        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            // Fallback to mock data on error
            return this.getMockData(endpoint, options.method || 'GET');
        }
    }

    // Templates API
    async getTemplates() {
        return this.request('/templates');
    }

    async createTemplate(data) {
        return this.request('/templates', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateTemplate(id, data) {
        return this.request(`/templates/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteTemplate(id) {
        return this.request(`/templates/${id}`, {
            method: 'DELETE'
        });
    }

    // Websites API
    async getWebsites() {
        return this.request('/websites');
    }

    async createWebsite(data) {
        return this.request('/websites', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateWebsite(id, data) {
        return this.request(`/websites/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteWebsite(id) {
        return this.request(`/websites/${id}`, {
            method: 'DELETE'
        });
    }

    // Projects API
    async getProjects() {
        return this.request('/projects');
    }

    async createProject(data) {
        return this.request('/projects', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateProject(id, data) {
        return this.request(`/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteProject(id) {
        return this.request(`/projects/${id}`, {
            method: 'DELETE'
        });
    }

    // Analytics API
    async trackEvent(event) {
        return this.request('/analytics', {
            method: 'POST',
            body: JSON.stringify(event)
        });
    }

    async getAnalytics(websiteId) {
        return this.request(`/analytics?website_id=${websiteId}`);
    }

    // Stats API
    async getStats() {
        return this.request('/stats');
    }

    // Mock data for development
    getMockData(endpoint, method) {
        const mockDatabase = {
            templates: [
                {
                    id: 1,
                    name: "Professional Portfolio",
                    description: "Modern bilingual portfolio with dark mode, perfect for developers and designers",
                    category: "Professional",
                    features: JSON.stringify(["Bilingual (NL/EN)", "Dark Mode", "Responsive"]),
                    preview_gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    usage_count: 12
                },
                {
                    id: 2,
                    name: "Creative Studio",
                    description: "Bold and creative design for artists and photographers",
                    category: "Creative",
                    features: JSON.stringify(["Portfolio Gallery", "Animations", "Full Screen"]),
                    preview_gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    usage_count: 8
                },
                {
                    id: 3,
                    name: "Business Professional",
                    description: "Clean and corporate design for consultants and business professionals",
                    category: "Business",
                    features: JSON.stringify(["Contact Forms", "Testimonials", "Blog"]),
                    preview_gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                    usage_count: 15
                },
                {
                    id: 4,
                    name: "Minimal Portfolio",
                    description: "Minimalist design focusing on content and simplicity",
                    category: "Minimal",
                    features: JSON.stringify(["Clean Layout", "Fast Loading", "SEO Optimized"]),
                    preview_gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                    usage_count: 6
                }
            ],
            websites: [
                {
                    id: 1,
                    name: "John Doe - Developer",
                    url: "https://johndoe.example.com",
                    template_id: 1,
                    template_name: "Professional Portfolio",
                    status: "live",
                    deployed_date: "2025-10-15",
                    visitors: 1243,
                    revenue: 750
                },
                {
                    id: 2,
                    name: "Sarah Johnson - Designer",
                    url: "https://sarahjohnson.example.com",
                    template_id: 2,
                    template_name: "Creative Studio",
                    status: "live",
                    deployed_date: "2025-10-10",
                    visitors: 856,
                    revenue: 650
                },
                {
                    id: 3,
                    name: "Mike Peters - Consultant",
                    url: "https://staging.mikepeters.example.com",
                    template_id: 3,
                    template_name: "Business Professional",
                    status: "staging",
                    deployed_date: "2025-10-20",
                    visitors: 42,
                    revenue: 0
                }
            ],
            projects: [
                {
                    id: 1,
                    name: "Emma Williams Portfolio",
                    description: "Creative portfolio for photographer",
                    status: "backlog",
                    tags: JSON.stringify(["Design", "Photography"]),
                    client: "Emma Williams",
                    deadline: "2025-11-15"
                },
                {
                    id: 2,
                    name: "TechStart Company Site",
                    description: "Corporate website for tech startup",
                    status: "in-progress",
                    tags: JSON.stringify(["Business", "Urgent"]),
                    client: "TechStart BV",
                    deadline: "2025-11-01"
                },
                {
                    id: 3,
                    name: "Portfolio Redesign - Alex",
                    description: "Update existing portfolio with new template",
                    status: "review",
                    tags: JSON.stringify(["Update", "Quick"]),
                    client: "Alex Thompson",
                    deadline: "2025-10-28"
                },
                {
                    id: 4,
                    name: "Jane Smith - Freelancer",
                    description: "Simple portfolio for freelance writer",
                    status: "completed",
                    tags: JSON.stringify(["Writing", "Minimal"]),
                    client: "Jane Smith",
                    deadline: "2025-10-18"
                }
            ],
            activities: [
                {
                    type: "deploy",
                    message: "Deployed website for Mike Peters",
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    icon: "🚀"
                },
                {
                    type: "create",
                    message: "Created new template: Minimal Portfolio",
                    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                    icon: "✨"
                },
                {
                    type: "update",
                    message: "Updated Professional Portfolio template",
                    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    icon: "🔄"
                },
                {
                    type: "revenue",
                    message: "Received payment: €750 from John Doe project",
                    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
                    icon: "💰"
                }
            ]
        };

        // Route mock responses
        if (endpoint === '/templates') {
            return Promise.resolve(mockDatabase.templates);
        } else if (endpoint === '/websites') {
            return Promise.resolve(mockDatabase.websites);
        } else if (endpoint === '/projects') {
            return Promise.resolve(mockDatabase.projects);
        } else if (endpoint === '/stats') {
            return Promise.resolve({
                templates: mockDatabase.templates.length,
                websites: mockDatabase.websites.filter(w => w.status === 'live').length,
                projects: mockDatabase.projects.filter(p => p.status !== 'completed').length,
                revenue: mockDatabase.websites.reduce((sum, w) => sum + w.revenue, 0)
            });
        }

        return Promise.resolve({ success: true });
    }
}

// Export singleton instance
const api = new APIClient(API_CONFIG.baseURL, API_CONFIG.useMockData);
