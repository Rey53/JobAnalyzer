# Content Structure Plan - Luis Reyes Portfolio

## 1. Material Inventory
**Content Source:**
- `servicioxpert.com` (Primary source)
- **Extracted Services**: 32 unique pharmaceutical/tech services
- **Bio/Experience**: 20+ years history (Pharma, IT, Real Estate, Renewable Energy)
- **Cool Stuff**: Weather app, Landing pages, FE Exam Flashcards

**Visual Assets (To be sourced/created):**
- `imgs/profile_hero.jpg` (Professional headshot/action shot of Luis)
- `imgs/tech_abstract.jpg` (AI/Code background)
- `imgs/pharma_cleanroom.jpg` (Validation/Pharma background)
- `imgs/logos/` (Client/Employer logos: Pfizer, Baxter, Zimmer Biomet, etc.)
- `imgs/certificates/` (Certifications)

## 2. Website Structure
**Type:** MPA (Multi-Page Application)
**Reasoning:**
- **Volume**: 30+ distinct services require dedicated space for SEO and authority.
- **Complexity**: Multiple distinct professional personas (Engineer vs. Dev vs. Real Estate) need distinct context.
- **Scalability**: Structure needs to handle future articles/FDA news updates.

## 3. Page/Section Breakdown

### Page 1: Home (`/`)
**Purpose**: Trust building, Authority establishment, Traffic routing to specific verticals.
**Content Mapping:**

| Section | Component Pattern | Content Source | Content to Extract | Visual Asset (Content) |
|---------|------------------|----------------|-------------------|------------------------|
| Hero | Hero Pattern (Split) | Home Analysis | Headline: "Future of pharma IT...", Intro, Video Link | `imgs/profile_hero.jpg` |
| Authority Bar | Logo Strip | Home Analysis | Logos of past companies (Pfizer, Baxter, etc.) | `imgs/logos/*.svg` |
| About Brief | 2-Col Layout | Home "About Me" | 20+ years experience summary, multi-industry mix | - |
| Key Services | Card Grid (3-col) | Home "What I Do" | Top level: AI Web Dev, Pharma Validation, Network Admin | - |
| Experience Highlight | Timeline Preview | Home "My Experience" | Key roles (Pfizer, Baxter, Zimmer) | - |
| CTA | Full Width CTA | Home CTA | "Ready to Transform...", Free Consultation Offer | - |

### Page 2: Pharmaceutical Validation (`/services/pharma`)
**Purpose**: Showcase the core 30+ validation services.
**Content Mapping:**

| Section | Component Pattern | Content Source | Content to Extract | Visual Asset (Content) |
|---------|------------------|----------------|-------------------|------------------------|
| Hero | Hero Pattern (Minimal) | Service List | Title: "Pharmaceutical Validation Excellence" | `imgs/pharma_bg.jpg` |
| Service Filter | Filter Bar | Analysis | Categories: CSV, Equipment, QMS, Process | - |
| Service Grid | Dense Card Grid | Service List | List of 30+ services (CSV, Autoclave, IQ/OQ/PQ, etc.) | - |
| Case Study | Feature Block | Case Studies | "GxP Documentation Crisis & n8n Solutions" | `imgs/diagrams/n8n_flow.svg` |

### Page 3: AI & Web Development (`/services/tech`)
**Purpose**: Showcase AI/Dev capabilities.
**Content Mapping:**

| Section | Component Pattern | Content Source | Content to Extract | Visual Asset (Content) |
|---------|------------------|----------------|-------------------|------------------------|
| Hero | Hero Pattern (Dark) | Home "What I Do" | AI Web Dev, Python, Docker expertise | `imgs/code_abstract.jpg` |
| Tech Stack | Icon Grid | Skills Section | Python, JS, Docker, N8N | `imgs/icons/*.svg` |
| Projects | Project Grid | "Cool Stuff" | Weather App, FE Flashcards, Landing Pages | `imgs/projects/*.jpg` |

### Page 4: Resume/CV (`/cv`)
**Purpose**: Professional history for recruiters/contracts.
**Content Mapping:**

| Section | Component Pattern | Content Source | Content to Extract | Visual Asset (Content) |
|---------|------------------|----------------|-------------------|------------------------|
| Header | Profile Header | Home Analysis | Name, Titles, Contact Info | `imgs/headshot_small.jpg` |
| Timeline | Vertical Timeline | Experience Section | 1999-Present roles detailed | - |
| Skills | Progress/Tag Cloud | Skills Section | Tech & Pharma skills | - |
| Education | List | CV Page | Degrees & Certs | - |

### Page 5: Contact & Booking (`/contact`)
**Purpose**: Conversion (Consultation Booking).
**Content Mapping:**

| Section | Component Pattern | Content Source | Content to Extract | Visual Asset (Content) |
|---------|------------------|----------------|-------------------|------------------------|
| Contact Info | Info Cards | Home Header | Phone, Email, Telegram, LinkedIn | - |
| Booking Form | Form Pattern | Home CTA | Name, Service Type (Dropdown), Date Picker | - |
| FAQ | Accordion | Home/Services | Common questions about validation/dev | - |

## 4. Content Analysis
**Information Density:** High
- **Reasoning**: Technical subject matter (FDA regulations, Validation protocols) requires precise, detailed text.
**Content Balance:**
- **Text**: 60% (Technical descriptions, methodologies)
- **Visuals**: 20% (Diagrams, Charts, UI Screenshots)
- **Trust Elements**: 20% (Logos, Certifications, Testimonials)
