# Headless CMS Vergelijking 2025

Analyse voor Portfolio Website Platform - Focus op: Gebruiksvriendelijkheid, Kosten, Beheer

## 🏆 Top 2 Aanbevelingen

### #1 Payload CMS 3.0 (AANBEVOLEN)

**Waarom Payload:**
- ✅ **Next.js Native** - Perfect match met onze tech stack
- ✅ **TypeScript-first** - Type-safe, moderne development
- ✅ **Beste prijs/kwaliteit** - €35/maand voor cloud hosting, of gratis self-hosted
- ✅ **Code-first benadering** - Volledige controle voor developers
- ✅ **Auto-generated Admin UI** - Mooie interface zonder configuratie
- ✅ **Built-in authentication** - User management included
- ✅ **Localization support** - Multi-language out-of-the-box

**Pricing:**
- **Gratis**: Self-hosted (eigen server)
- **€35/maand**: Payload Cloud (managed hosting)
- **Schaling**: Transparant, geen verrassingen

**User Interface:**
- Modern, clean admin panel
- React-based, fully customizable
- Live preview functionaliteit
- Media library included

**Developer Experience:**
- Installeer direct in /app folder (Next.js App Router)
- TypeScript schemas → auto-generated forms
- GraphQL + REST API automatisch
- Hooks, custom components makkelijk toe te voegen

**Klant Experience (Content Editors):**
- Intuïtieve editor interface
- Live preview van wijzigingen
- Media upload drag & drop
- Version control & drafts

---

### #2 Sanity (ALTERNATIEF)

**Waarom Sanity:**
- ✅ **Beste UI voor non-technical users** - Meest gebruiksvriendelijk
- ✅ **Real-time collaboration** - Meerdere mensen tegelijk aan het werk
- ✅ **Portable Text** - Flexibel content model
- ✅ **GROQ query language** - Krachtige queries
- ✅ **Gratis tier** - Goed voor kleine projecten

**Pricing:**
- **Gratis**: Tot 20 gebruikers, 2 datasets (perfect voor MVP)
- **€15/user/maand**: Growth plan (betere features)
- **Nadeel**: Wordt snel duur bij schaling (bandwidth, API calls)

**User Interface:**
- **10/10 voor gebruiksvriendelijkheid**
- Sanity Studio (React-based editor)
- Drag & drop, visueel erg prettig
- Content preview

**Developer Experience:**
- Sanity Studio is volledig customizable
- GROQ is krachtig maar heeft learning curve
- TypeScript support (via code generation)
- Good Next.js integration (maar niet native zoals Payload)

**Klant Experience:**
- **Beste interface van allemaal**
- Non-technical users kunnen direct aan de slag
- Collaborative editing (zie wie waar aan werkt)
- Visual content building

---

## 📊 Volledige Vergelijking

| Feature | Payload 3.0 | Sanity | Contentful | Strapi | Prepr |
|---------|-------------|--------|------------|--------|-------|
| **Pricing (start)** | €35/mo | Gratis-€15/user | €300/mo | Gratis | €99/mo |
| **UI Kwaliteit** | 8/10 | 10/10 | 7/10 | 6/10 | 7/10 |
| **Next.js Native** | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No |
| **TypeScript-first** | ✅ Yes | ⚠️ Partial | ⚠️ Partial | ⚠️ Partial | ❌ No |
| **Self-hosting** | ✅ Free | ❌ No | ❌ No | ✅ Free | ❌ No |
| **Localization** | ✅ Built-in | ✅ Built-in | ✅ Built-in | ✅ Plugin | ✅ Built-in |
| **Media Management** | ✅ Excellent | ✅ Excellent | ✅ Good | ⚠️ Basic | ✅ Good |
| **Learning Curve** | Medium | Medium | Low | High | Low |
| **GraphQL + REST** | ✅ Auto | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Live Preview** | ✅ Built-in | ✅ Built-in | ⚠️ Setup | ❌ No | ✅ Yes |
| **Best For** | Developers | Teams | Enterprise | Self-host | Marketing |

---

## 💰 Cost Breakdown (5 websites scenario)

**Payload Cloud:**
- 5 websites × €35/mo = €175/maand
- Of: Self-host gratis (eigen server ~€20/mo voor allemaal)
- **Totaal: €20-175/maand**

**Sanity:**
- Free tier: 20 users (perfect voor start)
- Bij schaling: €15/user × 5 websites = €75/maand (minimaal)
- Bandwidth kosten kunnen oplopen: +€50-200/maand bij veel traffic
- **Totaal: €0-275/maand**

**Contentful:**
- €300/maand MINIMAAL (1 environment)
- **Te duur voor ons use case**

**Strapi:**
- Gratis self-hosted
- Cloud: €29/maand per project
- **Totaal: €0-145/maand**

**Prepr:**
- €99/maand per environment
- **Totaal: ~€100-500/maand**

---

## 🎯 Aanbeveling per Package

### Quick Start (€350) - Geen CMS
**Keuze: Static Next.js**
- Content hardcoded in code
- Wijzigingen via jou (developer)
- Goedkoop, snel, simpel

### All-In (€1.950) - CMS Required
**Keuze: Payload CMS**
- Next.js native = perfect fit
- €35/maand doorberekenen via "Onderhoud & Support"
- Klant kan zelf content aanpassen
- Live preview voor editors

**Alternatief: Sanity (als klant budget heeft)**
- Betere UI voor non-technical users
- Maar duurder op termijn

### Premium (€3.500) - Advanced CMS
**Keuze: Payload CMS + Custom Extensions**
- Custom admin panels
- Advanced permissions (multi-user)
- API integraties
- Workflow automations

---

## 🔧 Technical Integration

### Payload 3.0 Setup (Next.js)

**Install:**
```bash
npx create-payload-app@latest
```

**In existing Next.js project:**
```bash
npm install payload @payloadcms/next
```

**Config:**
```typescript
// payload.config.ts
import { buildConfig } from 'payload/config'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export default buildConfig({
  collections: [
    {
      slug: 'pages',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'content', type: 'richText', editor: lexicalEditor() },
        { name: 'slug', type: 'text', required: true, unique: true }
      ]
    }
  ],
  db: mongooseAdapter({ url: process.env.DATABASE_URI }),
  admin: {
    user: 'users'
  },
  localization: {
    locales: ['nl', 'en'],
    defaultLocale: 'nl',
    fallback: true
  }
})
```

**Live Preview:**
```typescript
// Built-in live preview met Next.js
{
  slug: 'pages',
  admin: {
    livePreview: {
      url: ({ data }) => `http://localhost:3000/preview/${data.slug}`
    }
  }
}
```

---

### Sanity Setup (Next.js)

**Install:**
```bash
npm install sanity @sanity/client next-sanity
npx sanity init
```

**Schema:**
```typescript
// sanity/schemas/page.ts
export default {
  name: 'page',
  type: 'document',
  title: 'Page',
  fields: [
    { name: 'title', type: 'string', title: 'Title' },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'content', type: 'array', of: [{ type: 'block' }] }
  ]
}
```

**Fetch data in Next.js:**
```typescript
import { client } from '@/sanity/lib/client'

export async function getPageData(slug: string) {
  return client.fetch(`*[_type == "page" && slug.current == $slug][0]`, { slug })
}
```

---

## ✅ Final Verdict

### Voor onze use case (Portfolio websites met NL/EN support):

**MVP Choice: Payload CMS 3.0**

**Redenen:**
1. ✅ **Best fit met Next.js** - Native integratie, geen friction
2. ✅ **Beste prijs/kwaliteit** - €35/maand of gratis self-hosted
3. ✅ **Localization built-in** - NL/EN out-of-the-box
4. ✅ **TypeScript** - Type-safe, moderne development
5. ✅ **Schaalbaar** - Van 1 tot 100 websites zonder problemen
6. ✅ **Control** - Volledige ownership, geen vendor lock-in
7. ✅ **Modern** - Nieuwste tech (Next.js 14 App Router, React Server Components)

**When to use Sanity instead:**
- Klant is volledig non-technical en betaalt voor beste UX
- Real-time collaboration is must-have
- Budget is geen issue (premium package)

---

## 📋 Implementation Roadmap

**Week 1-2: Setup Payload**
1. Install Payload in template projects
2. Configure content models (Page, Project, Testimonial, etc.)
3. Setup localization (NL/EN)
4. Create custom admin UI components

**Week 2-3: Client Training Materials**
1. Video tutorials (Loom)
2. Written documentation
3. Live demo environment

**Week 3-4: Integration Testing**
1. Test met "Professional" template
2. Test met "Dynamic" (athlete) template
3. Performance benchmarks

---

## 🎓 Learning Resources

**Payload:**
- Docs: https://payloadcms.com/docs
- YouTube: https://www.youtube.com/@payloadcms
- Discord: Active community

**Sanity:**
- Docs: https://www.sanity.io/docs
- Schema docs: https://www.sanity.io/docs/schema-types
- GROQ cheat sheet: https://www.sanity.io/docs/query-cheat-sheet

---

## 💡 Recommendation

**Start met Payload CMS 3.0**

Test beide tijdens development en evalueer na 5-10 websites:
- Is Payload UI voldoende voor klanten?
- Zo nee: switch naar Sanity voor premium packages
- Zo ja: blijf bij Payload (goedkoper, meer controle)

**Hybrid approach mogelijk:**
- All-In package: Payload (€35/mo, good enough)
- Premium package: Sanity (beste UI, €15/user)
- Quick Start: Geen CMS (static)
