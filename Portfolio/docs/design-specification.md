# Design Specification - Luis Reyes Portfolio

## 1. Direction & Rationale
**Style**: Modern Minimalism (Premium)
**Essence**: A bridge between precision engineering and modern technology. The design balances the "Clinical/Clean" aesthetic of Pharmaceutical Validation with the "Modern/Dynamic" feel of AI Web Development.
**Key Attributes**: Trust, Clarity, Authority, Innovation.

## 2. Design Tokens

### 2.1 Color System
**Primary (Professional Blue - Trust & Tech)**
- `primary-50`: `#E6F0FF` (Backgrounds)
- `primary-100`: `#CCE0FF` (Interactive Backgrounds)
- `primary-500`: `#0066FF` (Brand/Buttons)
- `primary-600`: `#0052CC` (Hover)
- `primary-900`: `#003D99` (Text Emphasis)

**Neutral (Clean & Structural)**
- `neutral-50`: `#FAFAFA` (Page Background)
- `neutral-100`: `#F5F5F5` (Card Surface)
- `neutral-200`: `#E5E5E5` (Borders)
- `neutral-500`: `#A3A3A3` (Icons/Disabled)
- `neutral-700`: `#404040` (Body Text)
- `neutral-900`: `#171717` (Headings)

**Semantic**
- `success`: `#10B981` (Validation Passed)
- `warning`: `#F59E0B` (Pending)
- `error`: `#EF4444` (Validation Errors)

### 2.2 Typography (Inter)
- **Family**: `Inter`, system-ui, sans-serif
- **Scale**:
  - `Display`: 64px/1.1 (Bold 700)
  - `H1`: 48px/1.2 (Bold 700)
  - `H2`: 32px/1.3 (Semibold 600)
  - `H3`: 24px/1.4 (Semibold 600)
  - `Body`: 16px/1.6 (Regular 400)
  - `Small`: 14px/1.5 (Regular 400)

### 2.3 Spacing & Radius
- **Grid**: 4pt baseline (8, 16, 24, 32, 48, 64, 96, 128px)
- **Radius**:
  - `sm`: 4px
  - `md`: 8px
  - `lg`: 12px (Buttons/Inputs)
  - `xl`: 16px (Cards)
- **Shadows**:
  - `card`: `0 1px 3px rgba(0,0,0,0.1)`
  - `hover`: `0 10px 15px rgba(0,0,0,0.1)`

## 3. Component Specifications

### 3.1 Global Navigation
**Structure**: Sticky Header, Glassmorphism backdrop.
- **Logo**: Left-aligned, bold text or icon marks "Luis Reyes".
- **Links**: Center/Right aligned (Home, Services, CV, Cool Stuff, Contact).
- **CTA**: "Book Consultation" (Primary Button) on far right.
- **Mobile**: Hamburger menu triggers slide-out drawer (neutral-50 bg).

### 3.2 Hero Sections
**Pattern A: Split (Home/Landing)**
- **Layout**: 2-column grid (Text Left, Image/Visual Right).
- **Content**: H1 Headline + Subhead + Primary CTA + Secondary Link (Video).
- **Visual**: Professional cutout image of Luis OR Abstract 3D Tech element.
- **Height**: 500-600px.

**Pattern B: Centered (Services/Subpages)**
- **Layout**: Center aligned text container (max-width 800px).
- **Content**: H1 Title + Breadcrumbs + Short description.
- **Background**: Subtle gradient `primary-50` to `white`.
- **Height**: 300-400px.

### 3.3 Service Cards (The 30+ List)
**Structure**:
- **Container**: White surface, `neutral-200` border (1px), `radius-xl`.
- **Content**: Icon (48px, primary-100 bg, primary-600 color) + H3 Title + Description (2 lines) + "Learn more" link.
- **Interaction**: Hover lifts card `-4px`, shadow `hover`, border `primary-500`.
- **Grid**: Responsive Masonry or fixed grid (1 col mobile, 2 col tablet, 3-4 col desktop).

### 3.4 Experience Timeline
**Structure**:
- **Line**: Vertical `neutral-200` line, left aligned or center.
- **Nodes**: `primary-500` dots (12px) on the line.
- **Items**: Card-like blocks attached to nodes.
- **Content**: Date (Bold) + Role (H3) + Company (Body) + Description (Bulleted).

### 3.5 Consultation Booking Form
**Structure**:
- **Layout**: 2-column layout (Left: Contact Info/Trust, Right: Form).
- **Inputs**: `radius-lg`, `neutral-100` bg, focus ring `primary-500`.
- **Service Selector**: Visual cards (Select Box) rather than simple dropdown.
- **Submit**: Full width Primary Button.

### 3.6 Data/Tech Visuals
**Pattern**:
- **Tech Stack**: Grid of monochromatic logos, hover to color.
- **Charts**: Clean SVG lines, `primary-500` stroke, gradient fill `primary-500` to transparent.
- **Validation Diagrams**: Flowcharts using `neutral-200` lines and `radius-md` boxes.

## 4. Layout & Responsive
**Breakpoints**:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

**Page Patterns (Ref: content-structure-plan.md)**:
- **Home**: Hero (Split) -> Logo Strip -> About (2-col) -> Services (Grid) -> Timeline -> CTA.
- **Service Pages**: Hero (Centered) -> Filter Bar (Sticky) -> Service Grid (Masonry) -> CTA.
- **CV Page**: Header (Profile) -> Timeline (Vertical) -> Skills (Tag Cloud).

**Grid Strategy**:
- **Desktop**: 12 columns, 32px gutter, 1200px max-width.
- **Tablet**: 8 columns, 24px gutter.
- **Mobile**: 4 columns, 16px gutter, 16px edge padding.

## 5. Interaction & Motion
**Standards**:
- **Duration**: 250ms (Standard), 400ms (Entrance).
- **Easing**: `cubic-bezier(0.2, 0.8, 0.2, 1)` (Smooth out).

**Behaviors**:
- **Scroll**: Elements fade-up (`translateY(20px)` -> `0`) as they enter viewport.
- **Hover**: Cards lift, Buttons brighten.
- **Tabs/Filters**: Cross-fade content (opacity 0->1).
- **Reduced Motion**: Respect `prefers-reduced-motion` (disable movement, keep fades).
