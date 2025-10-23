/**
 * Cloudflare Workers API for Portfolio Manager
 *
 * This Worker handles all backend operations:
 * - Template management
 * - Website tracking
 * - Project management
 * - Analytics
 *
 * Uses Cloudflare D1 database (free tier)
 */

export default {
    async fetch(request, env) {
        // CORS headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(request.url);
        const path = url.pathname;

        try {
            // Route handling
            if (path.startsWith('/api/templates')) {
                return handleTemplates(request, env, corsHeaders);
            } else if (path.startsWith('/api/websites')) {
                return handleWebsites(request, env, corsHeaders);
            } else if (path.startsWith('/api/projects')) {
                return handleProjects(request, env, corsHeaders);
            } else if (path.startsWith('/api/analytics')) {
                return handleAnalytics(request, env, corsHeaders);
            } else if (path === '/api/stats') {
                return handleStats(request, env, corsHeaders);
            } else {
                return jsonResponse({ error: 'Not found' }, 404, corsHeaders);
            }
        } catch (error) {
            console.error('API Error:', error);
            return jsonResponse({ error: error.message }, 500, corsHeaders);
        }
    }
};

// Templates CRUD
async function handleTemplates(request, env, corsHeaders) {
    const url = new URL(request.url);
    const method = request.method;

    if (method === 'GET') {
        // Get all templates
        const { results } = await env.DB.prepare(
            'SELECT * FROM templates ORDER BY created_at DESC'
        ).all();

        return jsonResponse(results, 200, corsHeaders);

    } else if (method === 'POST') {
        // Create new template
        const data = await request.json();

        const result = await env.DB.prepare(`
            INSERT INTO templates (name, description, category, features, preview_gradient, usage_count)
            VALUES (?, ?, ?, ?, ?, 0)
        `).bind(
            data.name,
            data.description,
            data.category,
            JSON.stringify(data.features),
            data.preview
        ).run();

        return jsonResponse({ id: result.meta.last_row_id, ...data }, 201, corsHeaders);

    } else if (method === 'PUT') {
        // Update template
        const id = url.pathname.split('/').pop();
        const data = await request.json();

        await env.DB.prepare(`
            UPDATE templates
            SET name = ?, description = ?, category = ?, features = ?, preview_gradient = ?
            WHERE id = ?
        `).bind(
            data.name,
            data.description,
            data.category,
            JSON.stringify(data.features),
            data.preview,
            id
        ).run();

        return jsonResponse({ success: true }, 200, corsHeaders);

    } else if (method === 'DELETE') {
        // Delete template
        const id = url.pathname.split('/').pop();

        await env.DB.prepare('DELETE FROM templates WHERE id = ?').bind(id).run();

        return jsonResponse({ success: true }, 200, corsHeaders);
    }
}

// Websites CRUD
async function handleWebsites(request, env, corsHeaders) {
    const method = request.method;
    const url = new URL(request.url);

    if (method === 'GET') {
        // Get all websites
        const { results } = await env.DB.prepare(`
            SELECT w.*, t.name as template_name
            FROM websites w
            LEFT JOIN templates t ON w.template_id = t.id
            ORDER BY w.deployed_date DESC
        `).all();

        return jsonResponse(results, 200, corsHeaders);

    } else if (method === 'POST') {
        // Deploy new website
        const data = await request.json();

        const result = await env.DB.prepare(`
            INSERT INTO websites (name, url, template_id, status, deployed_date, visitors, revenue)
            VALUES (?, ?, ?, ?, ?, 0, 0)
        `).bind(
            data.name,
            data.url,
            data.template_id,
            data.status || 'staging',
            new Date().toISOString().split('T')[0]
        ).run();

        // Increment template usage count
        await env.DB.prepare(`
            UPDATE templates
            SET usage_count = usage_count + 1
            WHERE id = ?
        `).bind(data.template_id).run();

        return jsonResponse({ id: result.meta.last_row_id, ...data }, 201, corsHeaders);

    } else if (method === 'PUT') {
        // Update website stats or status
        const id = url.pathname.split('/').pop();
        const data = await request.json();

        await env.DB.prepare(`
            UPDATE websites
            SET status = ?, visitors = ?, revenue = ?
            WHERE id = ?
        `).bind(
            data.status,
            data.visitors,
            data.revenue,
            id
        ).run();

        return jsonResponse({ success: true }, 200, corsHeaders);

    } else if (method === 'DELETE') {
        // Delete website
        const id = url.pathname.split('/').pop();

        await env.DB.prepare('DELETE FROM websites WHERE id = ?').bind(id).run();

        return jsonResponse({ success: true }, 200, corsHeaders);
    }
}

// Projects CRUD
async function handleProjects(request, env, corsHeaders) {
    const method = request.method;
    const url = new URL(request.url);

    if (method === 'GET') {
        // Get all projects
        const { results } = await env.DB.prepare(
            'SELECT * FROM projects ORDER BY created_at DESC'
        ).all();

        return jsonResponse(results, 200, corsHeaders);

    } else if (method === 'POST') {
        // Create new project
        const data = await request.json();

        const result = await env.DB.prepare(`
            INSERT INTO projects (name, description, status, tags, client, deadline)
            VALUES (?, ?, ?, ?, ?, ?)
        `).bind(
            data.name,
            data.description,
            data.status || 'backlog',
            JSON.stringify(data.tags),
            data.client,
            data.deadline
        ).run();

        return jsonResponse({ id: result.meta.last_row_id, ...data }, 201, corsHeaders);

    } else if (method === 'PUT') {
        // Update project
        const id = url.pathname.split('/').pop();
        const data = await request.json();

        await env.DB.prepare(`
            UPDATE projects
            SET name = ?, description = ?, status = ?, tags = ?, client = ?, deadline = ?
            WHERE id = ?
        `).bind(
            data.name,
            data.description,
            data.status,
            JSON.stringify(data.tags),
            data.client,
            data.deadline,
            id
        ).run();

        return jsonResponse({ success: true }, 200, corsHeaders);

    } else if (method === 'DELETE') {
        // Delete project
        const id = url.pathname.split('/').pop();

        await env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(id).run();

        return jsonResponse({ success: true }, 200, corsHeaders);
    }
}

// Analytics tracking
async function handleAnalytics(request, env, corsHeaders) {
    const method = request.method;

    if (method === 'POST') {
        // Track event
        const data = await request.json();

        await env.DB.prepare(`
            INSERT INTO analytics (event_type, website_id, metadata, timestamp)
            VALUES (?, ?, ?, ?)
        `).bind(
            data.event_type,
            data.website_id,
            JSON.stringify(data.metadata || {}),
            new Date().toISOString()
        ).run();

        return jsonResponse({ success: true }, 201, corsHeaders);

    } else if (method === 'GET') {
        // Get analytics for a website
        const url = new URL(request.url);
        const websiteId = url.searchParams.get('website_id');

        const { results } = await env.DB.prepare(`
            SELECT * FROM analytics
            WHERE website_id = ?
            ORDER BY timestamp DESC
            LIMIT 100
        `).bind(websiteId).all();

        return jsonResponse(results, 200, corsHeaders);
    }
}

// Dashboard stats
async function handleStats(request, env, corsHeaders) {
    // Get overall statistics
    const stats = await Promise.all([
        env.DB.prepare('SELECT COUNT(*) as count FROM templates').first(),
        env.DB.prepare('SELECT COUNT(*) as count FROM websites WHERE status = "live"').first(),
        env.DB.prepare('SELECT COUNT(*) as count FROM projects WHERE status != "completed"').first(),
        env.DB.prepare('SELECT COALESCE(SUM(revenue), 0) as total FROM websites').first(),
    ]);

    return jsonResponse({
        templates: stats[0].count,
        websites: stats[1].count,
        projects: stats[2].count,
        revenue: stats[3].total
    }, 200, corsHeaders);
}

// Helper function for JSON responses
function jsonResponse(data, status = 200, corsHeaders = {}) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
        }
    });
}
