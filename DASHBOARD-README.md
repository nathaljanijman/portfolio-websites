# Portfolio Manager Dashboard

Professional dashboard voor het beheren van portfolio templates, live websites en client projecten.

## Overzicht

Het Portfolio Manager Dashboard is een volledig geïntegreerd systeem dat draait op **Cloudflare's gratis tier**:

- **Frontend**: Responsive dashboard gebouwd met vanilla JavaScript
- **Backend**: Cloudflare Workers (100K requests/dag gratis)
- **Database**: Cloudflare D1 SQLite (5GB gratis)
- **Hosting**: Cloudflare Pages (unlimited bandwidth)

## Features

### Completed

- **Login Systeem**
  - Simpele authenticatie met session management
  - Demo credentials: `demo@portfoliomanager.com` / `demo123`
  - Admin access: `nathaljanijman@hotmail.com` / `admin123`

- **Dashboard Overview**
  - Live statistieken (templates, websites, projecten, revenue)
  - Recent activity feed
  - Real-time updates

- **Template Gallery**
  - Overzicht van alle beschikbare templates
  - Preview en deployment opties
  - Usage tracking per template

- **Website Management**
  - Lijst van alle live en staging websites
  - Visitor en revenue tracking
  - Status monitoring

- **Project Management**
  - Kanban board (Backlog, In Progress, Review, Completed)
  - Client en deadline tracking
  - Tag systeem voor categorisatie

- **Cloudflare Integration**
  - D1 database backend
  - Workers API met CRUD operations
  - Automatic fallback naar mock data

## Bestanden

```
portfolio-websites/
├── login.html              # Entry point met authenticatie
├── dashboard.html          # Main dashboard interface
├── css/
│   └── dashboard.css       # Dashboard styling
├── js/
│   ├── dashboard.js        # Dashboard logic
│   └── api-client.js       # Cloudflare API client
├── workers/
│   └── api.js             # Cloudflare Workers API
├── schema.sql             # D1 database schema
├── wrangler.toml          # Cloudflare configuratie
├── CLOUDFLARE-SETUP.md    # Deployment guide
└── DASHBOARD-README.md    # This file
```

## Snelstart (Lokaal Testen)

### 1. Open login page
```bash
python3 -m http.server 8080
```

Ga naar: `http://localhost:8080/login.html`

Login met demo credentials:
- Email: `demo@portfoliomanager.com`
- Password: `demo123`

### 2. Test de interface

Het dashboard werkt met **mock data** totdat je Cloudflare deployt.

Alle features zijn functioneel:
- ✅ Overview met statistieken
- ✅ Template gallery
- ✅ Website lijst
- ✅ Project kanban board

## Deployment naar Cloudflare

Volg de complete guide in **CLOUDFLARE-SETUP.md**.

### Quick Deploy

```bash
# 1. Install Wrangler
npm install -g wrangler

# 2. Login
wrangler login

# 3. Create database
wrangler d1 create portfolio-manager-db

# 4. Update wrangler.toml met database ID

# 5. Initialize database
wrangler d1 execute portfolio-manager-db --file=./schema.sql

# 6. Deploy Workers API
wrangler deploy

# 7. Deploy frontend
wrangler pages deploy . --project-name=portfolio-manager
```

### Live API aanzetten

In `js/api-client.js`, wijzig:

```javascript
const API_CONFIG = {
    baseURL: 'https://portfolio-manager.YOUR_ACCOUNT.workers.dev/api',
    useMockData: false  // Zet op false voor live data
};
```

## API Endpoints

De Cloudflare Workers API biedt de volgende endpoints:

### Templates
- `GET /api/templates` - Alle templates
- `POST /api/templates` - Nieuwe template
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Verwijder template

### Websites
- `GET /api/websites` - Alle websites
- `POST /api/websites` - Deploy nieuwe website
- `PUT /api/websites/:id` - Update website stats
- `DELETE /api/websites/:id` - Verwijder website

### Projects
- `GET /api/projects` - Alle projecten
- `POST /api/projects` - Nieuw project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Verwijder project

### Analytics & Stats
- `GET /api/stats` - Dashboard statistieken
- `POST /api/analytics` - Track event
- `GET /api/analytics?website_id=X` - Website analytics

## Database Schema

### Tables

**templates**
- id, name, description, category
- features (JSON), preview_gradient
- usage_count, created_at, updated_at

**websites**
- id, name, url, template_id
- status (staging/live/archived)
- deployed_date, visitors, revenue
- created_at, updated_at

**projects**
- id, name, description, status
- tags (JSON), client, deadline
- created_at, updated_at

**analytics**
- id, event_type, website_id
- metadata (JSON), timestamp

**activities**
- id, type, message, icon
- timestamp

## Features Roadmap

### Fase 1: Core Dashboard (COMPLETED)
- [x] Login systeem
- [x] Dashboard overview
- [x] Template gallery
- [x] Website management
- [x] Project kanban
- [x] Cloudflare D1 integration

### Fase 2: Enhanced Features (TODO)
- [ ] Template builder/editor
- [ ] One-click deployment wizard
- [ ] Real-time visitor analytics
- [ ] Revenue tracking & invoicing
- [ ] Client portal access
- [ ] Email notifications

### Fase 3: Advanced (TODO)
- [ ] Automated backups (R2 storage)
- [ ] Multi-user support met rollen
- [ ] Webhooks voor CI/CD
- [ ] A/B testing templates
- [ ] SEO monitoring
- [ ] Performance metrics

## Kosten (Cloudflare Free Tier)

**Workers:**
- 100,000 requests/dag = GRATIS
- 10ms CPU per request
- Meer dan genoeg voor dashboard gebruik

**D1 Database:**
- 5GB storage = GRATIS
- 5 miljoen reads/dag
- 100,000 writes/dag

**Pages:**
- Unlimited bandwidth = GRATIS
- 500 builds/maand
- Gratis SSL certificaat

**Totaal: €0/maand** voor normale gebruik!

## Development Tips

### Lokaal Testen met Wrangler
```bash
wrangler dev
```

Dit start een local server op `http://localhost:8787`

Update `js/api-client.js`:
```javascript
baseURL: 'http://localhost:8787/api'
```

### Database Queries Testen
```bash
# View data
wrangler d1 execute portfolio-manager-db --command="SELECT * FROM templates"

# Insert data
wrangler d1 execute portfolio-manager-db --command="INSERT INTO templates (name) VALUES ('Test')"
```

### Debugging

Open browser console (F12) om:
- API calls te monitoren
- Error messages te zien
- Network requests te inspecteren

## Security

### Huidige Implementatie
- Session-based authentication (client-side)
- CORS headers configured
- Input validation in API

### Production Recommendations
- Implement Cloudflare Access voor SSO
- Add API rate limiting
- Use JWT tokens i.p.v. session storage
- Encrypt sensitive data in D1
- Add CSRF protection

## Support & Documentatie

- Main README: `README.md`
- Cloudflare Setup: `CLOUDFLARE-SETUP.md`
- Template Guide: `TEMPLATE-SETUP.md`
- CSS Theming: `CSS-THEMING-GUIDE.md`

## Contact

Built by: **Nathalja Nijman**
Email: nathaljanijman@hotmail.com
LinkedIn: linkedin.com/in/nathalja-nijman-86410389
