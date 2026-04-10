# Design Brief — Nexus Admin War Room

## Overview
Command center dashboard for placement analytics. Dark-mode first, high-contrast blue accents. Every pixel serves data clarity. No decoration.

## Tone & Aesthetic
Authoritative tactical interface. Information-forward, zero ornamentation. Designed for rapid decision-making at 2 AM during placement season.

## Color Palette

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| `--primary` | 0.50 0.22 261 (blue) | 0.65 0.22 261 | Strategic accent, CTAs, active states |
| `--destructive` | 0.55 0.22 25 (red) | 0.60 0.22 25 | Unplaced, rejections, alerts |
| `--success` | 0.58 0.18 142 (green) | 0.68 0.17 142 | Placed status, confirmations |
| `--warning` | 0.72 0.18 64 (amber) | 0.62 0.18 64 | In-progress, caution states |
| `--background` | 0.99 (white) | 0.12 (near-black) | Page background |
| `--card` | 1.0 | 0.16 | Card/container surfaces |
| `--sidebar` | 0.98 | 0.14 | Navigation sidebar |

## Chart Colors (Recharts Integration)
- `--chart-1` to `--chart-5`: Tuned for department comparison, company tier distribution, placement trends. High luminosity variance in dark mode for contrast.

## Typography

| Tier | Family | Use | Size |
|------|--------|-----|------|
| Display | Instrument Serif Italic | Page titles, chart headings | 28–32px |
| Body | Plus Jakarta Sans | Copy, labels, data fields | 14–16px |
| Mono | JetBrains Mono | Data tables, KPI values, code | 12–14px |

## Structural Zones

| Zone | Surface | Border | Purpose |
|------|---------|--------|---------|
| Header | `bg-card` | `border-b border-border` | Top chrome (breadcrumb, filters) |
| Sidebar | `bg-sidebar` | `border-r border-sidebar-border` | Navigation, persistent context |
| Content | `bg-background` | None | KPI cards, charts, tables |
| Cards | `bg-card` | `border border-border` | Contained metrics, charts, forms |
| Tables | `font-mono text-sm` | `border-collapse` | Department/company analytics |

## Component Patterns

### KPI Cards
- Class: `.kpi-card` — card surface, subtle border, shadow-sm, rounded-lg (0.375rem). Animated counter values. Trend arrow (↑/↓).

### Status Badges
- `.status-placed` — green accent, semi-transparent background
- `.status-in-progress` — amber accent, semi-transparent background
- `.status-unplaced` — red accent, semi-transparent background

### Progress Bars (Placement Rate %)
- `.progress-placed` — gradient (green → emerald)
- `.progress-in-progress` — gradient (amber → yellow)
- `.progress-unplaced` — gradient (red → pink)

### Data Tables
- Class: `.data-table` — monospace font, compact line-height, striped rows (`bg-muted/30` alternating)

## Motion & Interaction

| Element | Animation | Timing |
|---------|-----------|--------|
| KPI counter | Fade-in + slide-up | 0.6s on mount |
| Card hover | Slight shadow lift, border highlight | 0.3s smooth |
| Row highlight | Background shift to `bg-muted/40` | 0.2s on hover |
| Drill-down expand | Accordion collapse/expand | 0.2s ease-out |

## Responsive Grid

- **Mobile** (`<640px`): Single column, full-width cards
- **Tablet** (`640–1024px`): 2–3 column grid, stacked charts
- **Desktop** (`>1024px`): 6-column grid, sidebar + content (full war room view)

## Constraints
- No gradients on backgrounds (only on progress bars & text accent)
- No shadows beyond `shadow-sm` (keeps interface crisp)
- Radius: `rounded-lg` (0.375rem) for tight, compact feel
- No animations beyond status transitions and counter increments

## Differentiation
Placement war room that reads like ops dashboard — every department, batch, company, skill gap visible in one glance. Color-coded success rates beat generic tables. Trend lines show week-over-week momentum. At-risk predictions surface before placements happen.
