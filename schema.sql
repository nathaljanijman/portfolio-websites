-- Portfolio Manager Database Schema
-- For Cloudflare D1 (SQLite)

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    features TEXT, -- JSON array
    preview_gradient TEXT,
    usage_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Websites table
CREATE TABLE IF NOT EXISTS websites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    template_id INTEGER,
    status TEXT DEFAULT 'staging', -- 'staging', 'live', 'archived'
    deployed_date DATE,
    visitors INTEGER DEFAULT 0,
    revenue REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES templates(id)
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'backlog', -- 'backlog', 'in-progress', 'review', 'completed'
    tags TEXT, -- JSON array
    client TEXT,
    deadline DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL, -- 'pageview', 'click', 'conversion', etc.
    website_id INTEGER,
    metadata TEXT, -- JSON object
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (website_id) REFERENCES websites(id)
);

-- Activities log table
CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL, -- 'deploy', 'create', 'update', 'revenue'
    message TEXT NOT NULL,
    icon TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_websites_status ON websites(status);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_analytics_website ON analytics(website_id);
CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities(timestamp DESC);

-- Insert seed data
INSERT INTO templates (name, description, category, features, preview_gradient, usage_count) VALUES
    ('Professional Portfolio', 'Modern bilingual portfolio with dark mode, perfect for developers and designers', 'Professional', '["Bilingual (NL/EN)", "Dark Mode", "Responsive"]', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 12),
    ('Creative Studio', 'Bold and creative design for artists and photographers', 'Creative', '["Portfolio Gallery", "Animations", "Full Screen"]', 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 8),
    ('Business Professional', 'Clean and corporate design for consultants and business professionals', 'Business', '["Contact Forms", "Testimonials", "Blog"]', 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 15),
    ('Minimal Portfolio', 'Minimalist design focusing on content and simplicity', 'Minimal', '["Clean Layout", "Fast Loading", "SEO Optimized"]', 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', 6);

INSERT INTO websites (name, url, template_id, status, deployed_date, visitors, revenue) VALUES
    ('John Doe - Developer', 'https://johndoe.example.com', 1, 'live', '2025-10-15', 1243, 750),
    ('Sarah Johnson - Designer', 'https://sarahjohnson.example.com', 2, 'live', '2025-10-10', 856, 650),
    ('Mike Peters - Consultant', 'https://staging.mikepeters.example.com', 3, 'staging', '2025-10-20', 42, 0);

INSERT INTO projects (name, description, status, tags, client, deadline) VALUES
    ('Emma Williams Portfolio', 'Creative portfolio for photographer', 'backlog', '["Design", "Photography"]', 'Emma Williams', '2025-11-15'),
    ('TechStart Company Site', 'Corporate website for tech startup', 'in-progress', '["Business", "Urgent"]', 'TechStart BV', '2025-11-01'),
    ('Portfolio Redesign - Alex', 'Update existing portfolio with new template', 'review', '["Update", "Quick"]', 'Alex Thompson', '2025-10-28'),
    ('Jane Smith - Freelancer', 'Simple portfolio for freelance writer', 'completed', '["Writing", "Minimal"]', 'Jane Smith', '2025-10-18');

INSERT INTO activities (type, message, icon, timestamp) VALUES
    ('deploy', 'Deployed website for Mike Peters', '🚀', datetime('now', '-2 hours')),
    ('create', 'Created new template: Minimal Portfolio', '✨', datetime('now', '-5 hours')),
    ('update', 'Updated Professional Portfolio template', '🔄', datetime('now', '-1 day')),
    ('revenue', 'Received payment: €750 from John Doe project', '💰', datetime('now', '-2 days'));
