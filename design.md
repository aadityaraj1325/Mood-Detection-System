# PulseMind AI — Design Specification
**Version:** 2.0  
**Audience:** Frontend Agents / UI Engineers  
**Purpose:** Complete visual, interaction, and component design specification for the PulseMind AI redesign. Every section must be implemented exactly as described to achieve the intended 3D glassmorphism + neural aesthetic.

---

## 1. Design Philosophy

### 1.1 Core Aesthetic: "Neural Glass"

PulseMind AI's visual identity fuses three design languages into one coherent system:

1. **Glassmorphism** — Frosted glass panels with depth, blur, and translucency. Every card floats above a luminous background.
2. **3D Depth** — Layered z-axis hierarchy. Elements appear to exist in physical space: background → mid-layer → foreground cards → floating UI chrome.
3. **Bioluminescent Neural** — The color system references neural firing and brain activity. Neon blues, purples, and teals glow against a deep dark substrate. Think: MRI scan meets sci-fi health app.

**Guiding principle:** The UI should feel like peering through a futuristic medical interface — calm, intelligent, and slightly otherworldly. It must not feel clinical or cold. Warmth comes from the glow, animation, and micro-interactions.

### 1.2 Emotional Design Goals

- **Trust:** Calm deep colors, smooth animations, no harsh edges.
- **Safety:** Enclosed glass containers, soft borders, no aggressive reds.
- **Intelligence:** Neural network aesthetics, data visualization beauty, AI indicator elements.
- **Engagement:** Particle systems, animated gradients, reward animations for gamification.

---

## 2. Color System

### 2.1 Base Palette

```css
:root {
  /* Deep Space Background */
  --bg-void:        #050714;   /* Deepest background — near black with blue tint */
  --bg-deep:        #080d1f;   /* Primary page background */
  --bg-surface:     #0d1530;   /* Elevated surface background */

  /* Glass Layers */
  --glass-ultra:    rgba(255, 255, 255, 0.03);  /* Barely-there glass */
  --glass-light:    rgba(255, 255, 255, 0.06);  /* Standard card glass */
  --glass-medium:   rgba(255, 255, 255, 0.10);  /* Hover glass state */
  --glass-strong:   rgba(255, 255, 255, 0.15);  /* Active/selected glass */

  /* Glass Borders */
  --border-subtle:  rgba(255, 255, 255, 0.06);
  --border-glass:   rgba(255, 255, 255, 0.12);
  --border-glow:    rgba(99, 179, 237, 0.30);

  /* Neural Primary — Electric Cyan/Blue */
  --neural-50:      #e6f7ff;
  --neural-100:     #b3e8ff;
  --neural-200:     #80d9ff;
  --neural-300:     #4dcaff;
  --neural-400:     #1abbff;
  --neural-500:     #00aaff;   /* Primary brand color */
  --neural-600:     #0088cc;
  --neural-700:     #006699;
  --neural-800:     #004466;
  --neural-900:     #002233;

  /* Pulse Secondary — Violet/Purple */
  --pulse-50:       #f0e6ff;
  --pulse-100:      #d1b3ff;
  --pulse-200:      #b280ff;
  --pulse-300:      #934dff;
  --pulse-400:      #7c2dff;
  --pulse-500:      #6600ff;   /* Secondary brand color */
  --pulse-600:      #5200cc;
  --pulse-700:      #3d0099;
  --pulse-800:      #290066;
  --pulse-900:      #140033;

  /* Serenity Accent — Teal/Mint */
  --serenity-400:   #2dd4bf;
  --serenity-500:   #14b8a6;
  --serenity-600:   #0d9488;

  /* Emotional State Colors */
  --emotion-happy:   #fbbf24;   /* Amber — warm, energetic */
  --emotion-neutral: #60a5fa;   /* Sky blue — calm, balanced */
  --emotion-sad:     #818cf8;   /* Indigo — introspective */
  --emotion-stress:  #f87171;   /* Soft red — alert without alarm */

  /* Gamification */
  --gold-badge:     #f59e0b;
  --silver-badge:   #94a3b8;
  --bronze-badge:   #b45309;
  --xp-bar:         linear-gradient(90deg, #00aaff, #6600ff);

  /* Text */
  --text-primary:   rgba(255, 255, 255, 0.95);
  --text-secondary: rgba(255, 255, 255, 0.65);
  --text-muted:     rgba(255, 255, 255, 0.40);
  --text-glow:      #00aaff;

  /* Semantic */
  --success:        #10b981;
  --warning:        #f59e0b;
  --error:          #ef4444;
  --info:           #3b82f6;
}
```

### 2.2 Gradient Library

```css
/* Page background — animated slowly */
--gradient-void: radial-gradient(ellipse at 20% 20%, rgba(0, 170, 255, 0.12) 0%, transparent 50%),
                 radial-gradient(ellipse at 80% 80%, rgba(102, 0, 255, 0.12) 0%, transparent 50%),
                 radial-gradient(ellipse at 50% 50%, rgba(20, 184, 166, 0.05) 0%, transparent 70%),
                 #050714;

/* Hero gradient */
--gradient-neural: linear-gradient(135deg, #00aaff 0%, #6600ff 50%, #14b8a6 100%);

/* Card accent lines */
--gradient-card-top: linear-gradient(90deg, transparent, rgba(0,170,255,0.5), transparent);

/* Mood emotion gradients */
--gradient-happy:   linear-gradient(135deg, #fbbf24, #f59e0b);
--gradient-neutral: linear-gradient(135deg, #60a5fa, #3b82f6);
--gradient-sad:     linear-gradient(135deg, #818cf8, #6366f1);
```

---

## 3. Typography

### 3.1 Font Stack

```css
/* Display / Hero: Futuristic, sharp */
--font-display: 'Space Grotesk', 'Inter', system-ui, sans-serif;

/* Body / UI: Clean, readable */
--font-body: 'Inter', system-ui, sans-serif;

/* Monospace / Data / Code */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

Import in HTML head:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### 3.2 Type Scale

| Role | Family | Size | Weight | Color | Usage |
|------|--------|------|--------|-------|-------|
| Hero Title | Space Grotesk | 4rem / 64px | 700 | text-primary + text-shadow glow | Page hero headings |
| Page Title | Space Grotesk | 2.5rem / 40px | 600 | text-primary | Section titles |
| Card Title | Space Grotesk | 1.25rem / 20px | 600 | text-primary | Card headings |
| Body | Inter | 1rem / 16px | 400 | text-secondary | Main prose |
| Caption | Inter | 0.875rem / 14px | 400 | text-muted | Labels, timestamps |
| Data/Metric | JetBrains Mono | 2rem / 32px | 500 | neural-400 | Numbers, scores, metrics |
| Badge Label | Inter | 0.75rem / 12px | 600 | varies | Status badges |

### 3.3 Text Effects

```css
/* Glowing hero text */
.text-glow-neural {
  color: var(--neural-400);
  text-shadow: 0 0 20px rgba(0, 170, 255, 0.6),
               0 0 40px rgba(0, 170, 255, 0.3),
               0 0 80px rgba(0, 170, 255, 0.1);
}

/* Gradient text */
.text-gradient-neural {
  background: var(--gradient-neural);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## 4. Component Library

### 4.1 Glass Card (Base Component)

The Glass Card is the fundamental container unit for all content.

```css
.glass-card {
  /* Background */
  background: var(--glass-light);
  
  /* Blur */
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  
  /* Border */
  border: 1px solid var(--border-glass);
  border-radius: 20px;
  
  /* 3D Shadow Stack */
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.3),
    0 12px 24px rgba(0, 0, 0, 0.4),
    0 24px 48px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.08),     /* Top edge highlight */
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);            /* Bottom inner shadow */
  
  /* Transition */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Position for pseudo-elements */
  position: relative;
  overflow: hidden;
}

/* Glowing top border accent line */
.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  height: 1px;
  background: var(--gradient-card-top);
  opacity: 0.6;
}

/* Hover state */
.glass-card:hover {
  background: var(--glass-medium);
  border-color: var(--border-glow);
  box-shadow: 
    0 8px 12px rgba(0, 0, 0, 0.4),
    0 20px 40px rgba(0, 0, 0, 0.5),
    0 32px 64px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(0, 170, 255, 0.15),
    0 0 30px rgba(0, 170, 255, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
}
```

### 4.2 Card Variants

**Metric Card** — Displays a single number/KPI:
```
┌─────────────────────────────┐  ← glass-card, 180px height
│ ✦ [ICON]                    │  ← 32px icon, neural-500 color
│                             │
│ [LARGE NUMBER]              │  ← 2.5rem, font-mono, text-gradient
│ [Label]                     │  ← 0.875rem, text-muted
│ ▲ 12% vs last week          │  ← small trend indicator
└─────────────────────────────┘
```

Left border: 3px solid neural-500 with glow effect.

**Mood Card** — Current emotion display:
```
┌─────────────────────────────┐  ← glass-card with emotion-color tint
│  [ANIMATED EMOTION ICON]    │  ← 64px, pulsing animation
│                             │
│  HAPPY                      │  ← 2rem, text-gradient-happy
│  Confidence: 87%            │  ← progress bar in emotion color
│  Detected 2 min ago         │  ← text-muted timestamp
└─────────────────────────────┘
```

Background tint: `rgba(var(--emotion-happy-rgb), 0.05)`.

**Recommendation Card**:
```
┌─────────────────────────────┐
│ [Category badge]            │  ← pill badge: CBT / ACT / Mindfulness
│ [Title]                     │  ← 1.1rem, text-primary
│ [Description]               │  ← text-secondary, 2-3 lines
│ ─────────────────────────── │
│ [Start Activity →]          │  ← ghost button, right aligned
└─────────────────────────────┘
```

**Achievement/Badge Card**:
```
┌─────────────────────────────┐
│      ⬡ [BADGE ICON] ⬡      │  ← hexagonal badge shape, gold glow
│      [Badge Name]           │
│      [XP Points earned]     │
│   ★★★★☆  Rarity: Rare      │
└─────────────────────────────┘
```

Unlocked state: full opacity + glow. Locked: grayscale + blur(2px).

---

### 4.3 Navigation

**Sidebar Navigation (Desktop):**

```
┌──────────────────┐
│ ⬡ PulseMind AI  │  ← Logo with neural glow, 72px height
│ ─────────────── │
│ 🧠 Dashboard    │  ← active item: glass-strong bg + left border
│ 😊 Mood Detect  │
│ 📊 Analytics    │
│ ✨ Recommend    │
│ 🏆 Achievements │
│ 💬 Community    │
│                 │
│ ─────────────── │
│ [User Avatar]   │  ← bottom: user info + settings
│ @username       │
│ ⚙  Settings    │
└──────────────────┘
```

Sidebar specs:
- Width: 260px (collapsed: 72px icon-only).
- Background: `glass-ultra` with `backdrop-filter: blur(40px)`.
- Right border: `1px solid var(--border-subtle)`.
- Collapse toggle: animated hamburger → arrow chevron.

Active nav item:
```css
.nav-item.active {
  background: var(--glass-medium);
  border-left: 3px solid var(--neural-500);
  color: var(--neural-400);
  box-shadow: inset 0 0 20px rgba(0, 170, 255, 0.05);
}
```

**Mobile Navigation — Bottom Bar:**
- Fixed bottom, 5 icons: Dashboard, Mood, Analytics, Recommend, Profile.
- Glass background with blur.
- Active icon: neural-500 + upward floating animation.

---

### 4.4 Buttons

```css
/* Primary button — Electric Neural */
.btn-primary {
  background: linear-gradient(135deg, #00aaff, #6600ff);
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  color: white;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(0, 170, 255, 0.3),
              0 8px 30px rgba(102, 0, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.btn-primary:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 170, 255, 0.5),
              0 16px 40px rgba(102, 0, 255, 0.3);
}

.btn-primary:active {
  transform: translateY(0) scale(0.98);
}

/* Shimmer effect on hover */
.btn-primary::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -100%;
  width: 80px;
  height: 200%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
  transform: skewX(-20deg);
  transition: left 0.5s ease;
}

.btn-primary:hover::after {
  left: 200%;
}

/* Ghost / Secondary button */
.btn-ghost {
  background: transparent;
  border: 1px solid var(--border-glow);
  border-radius: 12px;
  padding: 12px 24px;
  color: var(--neural-400);
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  background: var(--glass-light);
  border-color: var(--neural-500);
  box-shadow: 0 0 20px rgba(0, 170, 255, 0.15);
}

/* Danger button */
.btn-danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
}

/* Icon button */
.btn-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--glass-light);
  border: 1px solid var(--border-glass);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}
```

---

### 4.5 Form Elements

```css
/* Input field */
.input {
  background: var(--glass-ultra);
  border: 1px solid var(--border-glass);
  border-radius: 12px;
  padding: 14px 18px;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 1rem;
  width: 100%;
  transition: all 0.2s ease;
  outline: none;
}

.input:focus {
  border-color: var(--neural-500);
  box-shadow: 0 0 0 3px rgba(0, 170, 255, 0.15),
              0 0 20px rgba(0, 170, 255, 0.1);
  background: var(--glass-light);
}

.input::placeholder {
  color: var(--text-muted);
}

/* Select / Dropdown */
.select {
  /* Same as input + custom arrow */
  appearance: none;
  background-image: url("data:image/svg+xml,..."); /* neural blue chevron */
}

/* Range slider for confidence visualization */
.slider {
  -webkit-appearance: none;
  height: 4px;
  border-radius: 2px;
  background: var(--border-glass);
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00aaff, #6600ff);
  box-shadow: 0 0 10px rgba(0, 170, 255, 0.5);
  cursor: pointer;
}
```

---

### 4.6 Data Visualization Components

**Mood Trend Chart:**
- Library: Recharts (React) or Chart.js.
- Type: Area chart with gradient fill.
- X-axis: Dates, font-mono, text-muted.
- Y-axis: Mood score 0–100.
- Area fill: Gradient from neural-500 (bottom) to transparent.
- Line: 2px solid neural-400.
- Data points: 6px circles with glow on hover.
- Grid lines: `rgba(255,255,255,0.05)`.
- Tooltip: glass-card style with backdrop blur.
- Animation: 800ms ease-in-out draw animation on mount.

**Stress Gauge (Radial):**
- SVG-based arc gauge, 180° semi-circle.
- Background arc: border-glass color.
- Fill arc: gradient from serenity-400 (low) → emotion-stress (high).
- Center: large metric number + label.
- Animated fill on mount.

**Confidence Bar:**
```
[████████░░] 87%
```
- Height: 8px, border-radius: 4px.
- Background: glass-light.
- Fill: gradient neural-500 → pulse-500.
- Animated width fill on mount (500ms ease-out).
- Label: text-muted on left, percentage in font-mono on right.

---

## 5. Page Layouts

### 5.1 Dashboard Page

```
┌─────────────────────────────────────────────────────────────────┐
│ SIDEBAR │                    DASHBOARD                           │
│         │ ┌── Hero Greeting ─────────────────────────────────┐  │
│         │ │ "Good Evening, [Name] 🌙"                        │  │
│         │ │ [Mood Status Pill] [Streak Badge] [XP Bar]       │  │
│         │ └──────────────────────────────────────────────────┘  │
│         │                                                        │
│         │ ┌── Metric Cards Row ──────────────────────────────┐  │
│         │ │ [Stress Score] [Mood Today] [7-Day Streak]       │  │
│         │ │ [XP Points]   [Badges]     [Prediction]          │  │
│         │ └──────────────────────────────────────────────────┘  │
│         │                                                        │
│         │ ┌── Mood Trend Chart ──────────────────────────────┐  │
│         │ │  [AREA CHART — 30 days, mood score over time]    │  │
│         │ │  [Prediction overlay — dashed line, next 3 days] │  │
│         │ └──────────────────────────────────────────────────┘  │
│         │                                                        │
│         │ ┌── Quick Actions ────┐  ┌── Live Feed ────────────┐  │
│         │ │ [Check Mood Now]   │  │ [WebSocket live events] │  │
│         │ │ [View Recommend]   │  │ Badge earned! ⚡        │  │
│         │ │ [Start Game]       │  │ Mood saved ✓            │  │
│         │ └────────────────────┘  └────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

Hero greeting section: Full-width glass card with animated background particle system (15–20 floating orbs, very subtle, neural colors).

### 5.2 Mood Detection Page

```
┌─────────────────────────────────────────────────────────────────┐
│ SIDEBAR │                MOOD DETECTION                          │
│         │                                                        │
│         │ ┌── Webcam Panel ──────────────────────────────────┐  │
│         │ │                                                   │  │
│         │ │    [WEBCAM FEED — 16:9, rounded corners]          │  │
│         │ │    [Face detection overlay — neural mesh grid]   │  │
│         │ │    [Scanning animation when processing]          │  │
│         │ │                                                   │  │
│         │ │  [Start Camera]  [Capture]  [Analyze]            │  │
│         │ └──────────────────────────────────────────────────┘  │
│         │                                                        │
│         │ ┌── Analysis Result ───────────────────────────────┐  │
│         │ │ [EMOTION ICON animated]  HAPPY                   │  │
│         │ │ [Confidence bar: 87%]                            │  │
│         │ │ [Raw score breakdown: Happy/Neutral/Sad bars]    │  │
│         │ │                                                   │  │
│         │ │  [Save Mood Entry →]                             │  │
│         │ └──────────────────────────────────────────────────┘  │
│         │                                                        │
│         │ ┌── Recent History (mini) ─────────────────────────┐  │
│         │ │  Today: Happy → Neutral → Happy                  │  │
│         │ │  [Timeline dots with emotion colors]             │  │
│         │ └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Webcam panel special effects:**
- Neural mesh overlay: SVG grid of triangles that pulse on face detection.
- Scanning animation: Horizontal scan line that sweeps top-to-bottom during analysis.
- Face bounding box: Animated rounded rectangle, neural-500 color, pulsing.
- Corner brackets: L-shaped corner markers at each bounding box corner.
- No detection state: Grid dims; "Position your face..." caption blinks gently.

### 5.3 Analytics Page

```
┌─────────────────────────────────────────────────────────────────┐
│ SIDEBAR │              ANALYTICS & HISTORY                       │
│         │                                                        │
│         │ [Week / Month / All Time toggle tabs]                  │
│         │                                                        │
│         │ ┌── Stress Gauge ─────┐  ┌── Resilience Score ─────┐  │
│         │ │  [Radial gauge]     │  │  [Radial gauge]         │  │
│         │ │  72 / 100           │  │  68 / 100               │  │
│         │ └─────────────────────┘  └─────────────────────────┘  │
│         │                                                        │
│         │ ┌── Monthly Mood Distribution ─────────────────────┐  │
│         │ │  [Bar chart: Happy/Neutral/Sad counts per week]  │  │
│         │ └──────────────────────────────────────────────────┘  │
│         │                                                        │
│         │ ┌── Confidence Trend ──────────────────────────────┐  │
│         │ │  [Line chart: Detection confidence over time]    │  │
│         │ └──────────────────────────────────────────────────┘  │
│         │                                                        │
│         │ ┌── History Table ─────────────────────────────────┐  │
│         │ │  Date/Time    Emotion    Confidence    Method     │  │
│         │ │  [glass rows with emotion color left-border]     │  │
│         │ └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 5.4 Recommendations Page

```
┌─────────────────────────────────────────────────────────────────┐
│ SIDEBAR │            RECOMMENDATIONS                             │
│         │                                                        │
│         │ ┌── Today's Insight ───────────────────────────────┐  │
│         │ │ "Based on your recent mood, here's what we      │  │
│         │ │  suggest for you today..."                       │  │
│         │ │ [Current mood context pill]                      │  │
│         │ └──────────────────────────────────────────────────┘  │
│         │                                                        │
│         │ [RECOMMENDATION CARDS GRID — 2 columns]               │
│         │ ┌──────────────────┐  ┌──────────────────┐           │
│         │ │ CBT              │  │ Mindfulness       │           │
│         │ │ Breathing Box    │  │ Memory Garden     │           │
│         │ │ Start →          │  │ Start →           │           │
│         │ └──────────────────┘  └──────────────────┘           │
│         │                                                        │
│         │ ┌── Journal Prompt ────────────────────────────────┐  │
│         │ │ 📝 "What's one thing that made you smile today?" │  │
│         │ │ [Text area — glass style]                        │  │
│         │ │ [Save Journal Entry]                             │  │
│         │ └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 5.5 Authentication Page

Full-screen split layout:

```
┌────────────────────────────┬────────────────────────────────────┐
│  LEFT PANEL                │  RIGHT PANEL                       │
│  (50% width)               │  (50% width)                       │
│                            │                                    │
│  Animated 3D Brain/Neural  │  [Glass auth card — centered]      │
│  network visualization     │                                    │
│                            │  ⬡ PulseMind AI                   │
│  Floating particles        │                                    │
│  Rotating neural orbs      │  [Email input]                     │
│                            │  [Password input]                  │
│  "Your mental wellness,    │  [Sign In button]                  │
│   intelligently guided."   │                                    │
│                            │  ─── or ───                        │
│  [Feature pills floating]: │                                    │
│  • AI Mood Detection       │  [Create Account]                  │
│  • Personalized Insights   │                                    │
│  • 100% Private            │  [Forgot Password?]               │
└────────────────────────────┴────────────────────────────────────┘
```

Left panel: Dark with animated CSS/Canvas 3D neural network. Use Three.js or CSS 3D transforms for orbiting spheres and connecting lines.

---

## 6. Animation & Motion Design

### 6.1 Global Animation Principles

- **Easing default:** `cubic-bezier(0.4, 0, 0.2, 1)` — Material's standard easing.
- **Fast interactions:** 150–200ms (hover states, button presses).
- **Page transitions:** 300–400ms (route changes, panel slides).
- **Ambient animations:** 3000–8000ms (background particles, neural orbs, breathing effects).
- **Never animate opacity below 0 for content users need to read during loading.**

### 6.2 Specific Animations

**Page Enter:**
```css
@keyframes pageEnter {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.page-content { animation: pageEnter 0.4s ease forwards; }
```

**Card Stagger:**
Each card in a grid enters with 80ms stagger delay. Use CSS custom property `--stagger-index`.

**Neural Background Particles:**
```
20 particles, each:
- Position: random within viewport
- Size: 2–6px radius circle
- Color: neural-500 or pulse-500, opacity 0.3–0.6
- Motion: slow drift (sin/cos wave), 8–15s period
- Connections: SVG lines drawn between particles < 150px apart, opacity proportional to distance
```

**Webcam Scanning Line:**
```css
@keyframes scanLine {
  from { top: 0%; opacity: 0.8; }
  to   { top: 100%; opacity: 0; }
}
.scan-line {
  position: absolute; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, var(--neural-400), transparent);
  animation: scanLine 2s ease-in-out infinite;
}
```

**Emotion Reveal:**
When emotion is detected, card enters with:
1. Scale from 0.8 → 1.0 (300ms spring).
2. Emotion icon bounces in (scale 0 → 1.2 → 1.0).
3. Confidence bar fills from left (500ms ease-out).
4. Glow pulse on card (3 pulses, 600ms each).

**Badge Unlock Animation:**
1. Badge card shakes gently (100ms).
2. Hexagonal sparkle particles burst from center.
3. Card scales 1.0 → 1.15 → 1.0.
4. Gold glow sweeps across badge.
5. Toast notification slides in from top-right.

**Mood Save Success:**
1. Check mark draws itself (SVG stroke animation, 400ms).
2. Green/teal ripple expands from check center.
3. XP number increments with count-up animation.

**Loading States:**
Skeleton screens instead of spinners:
```css
.skeleton {
  background: linear-gradient(90deg, var(--glass-light) 25%, var(--glass-medium) 50%, var(--glass-light) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}
@keyframes shimmer {
  from { background-position: 200% center; }
  to   { background-position: -200% center; }
}
```

---

## 7. 3D Visual Elements

### 7.1 Neural Network Hero (Auth Page Left Panel)

Implementation: Three.js or CSS 3D.

Description:
- 40–60 sphere nodes, 8–12px radius, neural-500 color with emissive glow.
- Nodes connected by thin lines (1px, opacity 0.2–0.4) when within 180px of each other.
- All nodes slowly drift in 3D space (X, Y, Z motion with sin waves).
- Camera slowly rotates around the cluster (0.3 deg/second).
- On hover: nearest node cluster illuminates brighter, connection lines pulse.

Fallback (CSS-only): 2D canvas with above behavior but no Z-axis rotation.

### 7.2 Brain Mesh Dashboard Widget

A decorative 3D element on the dashboard hero section:
- Low-poly brain mesh, wireframe style.
- Color: `neural-500` lines, `glass-ultra` fill.
- Slowly rotates on Y-axis (360° in 20s).
- Pulses in sync with WebSocket mood events.
- Positioned: top-right of hero card, 200x200px, partially cropped.

If Three.js not available: Use animated SVG brain illustration with CSS rotate keyframes.

### 7.3 Emotion Orbs

On the mood detection page's result panel:
- Three glowing orbs representing Happy (amber), Neutral (blue), Sad (purple).
- Size proportional to confidence score.
- Currently highest confidence orb is front-and-center, others behind it.
- Orbs have inner glow + outer atmospheric halo.
- Hover: orb swells 20%, label appears below.

---

## 8. Micro-Interactions

### 8.1 Navigation Item Hover
- Background slides in from left (150ms width transition from 0% to 100%).
- Icon shifts right by 4px.
- Left border brightens.

### 8.2 Card Hover
- Card lifts +2px (translateY).
- Shadow deepens.
- Top border glow brightens.

### 8.3 Button Click Feedback
- Immediate scale(0.97) on mousedown.
- Shimmer sweep on release.
- No cursor jank — never use `cursor: default` on interactive elements.

### 8.4 Input Focus
- Border color transitions to neural-500 (200ms).
- Outer glow ring fades in (200ms).
- Label floats up if floating-label pattern.

### 8.5 Data Point Hover (Charts)
- Tooltip fades in (150ms) with glass-card styling.
- Data point expands from 6px → 10px.
- Vertical reference line drops from point to x-axis.

### 8.6 Toast Notifications
- Slide in from top-right (300ms spring).
- Progress bar depletes over 4s.
- Dismiss on click: slide out right (200ms).
- Types: success (teal), info (neural), warning (amber), error (red).

---

## 9. Responsive Design

### 9.1 Breakpoints

```css
/* Mobile first */
--breakpoint-sm: 640px;    /* Large phones */
--breakpoint-md: 768px;    /* Tablets */
--breakpoint-lg: 1024px;   /* Small desktop */
--breakpoint-xl: 1280px;   /* Standard desktop */
--breakpoint-2xl: 1536px;  /* Large screens */
```

### 9.2 Layout Adaptations

| Viewport | Sidebar | Layout | Cards |
|----------|---------|--------|-------|
| < 768px | Hidden, bottom tab bar | Single column | Full width |
| 768–1024px | Icon-only (collapsed) | 2 column | Adaptive |
| > 1024px | Full expanded (260px) | 3–4 column grid | Fixed sizes |

### 9.3 Mobile-Specific Patterns

- Bottom navigation: 5 icons, glass background.
- Swipe gestures: Swipe right to open sidebar drawer.
- Haptic feedback triggers (mobile web vibration API) on badge unlock.
- Camera access: Full-screen camera mode on mobile.
- Touch targets: Minimum 44×44px for all interactive elements.

---

## 10. Accessibility

- All color contrast ratios: ≥ 4.5:1 for normal text (WCAG AA).
- Focus indicators: 2px solid neural-500 outline, never removed, only restyled.
- `prefers-reduced-motion`: All ambient animations paused. Transitions capped at 100ms.
- `prefers-color-scheme`: Dark mode is default; light mode variant available.
- Keyboard navigation: Full tab order for all interactive elements. Modal traps focus correctly.
- Screen readers: All icons have `aria-label`. Charts have `aria-describedby` text alternatives.

---

## 11. Asset Requirements

### 11.1 Icons

Use Lucide React icon library as primary. Supplement with custom SVG for:
- PulseMind logo (hexagonal P mark + wordmark).
- Emotion icons: Happy face, Neutral face, Sad face — custom, animated SVG.
- Neural brain mark for loading screens.
- Hexagonal badge frame for achievements.

### 11.2 Illustrations

- Empty state illustrations: Custom SVG, minimal line art in neural-500 color.
- Onboarding hero: Animated SVG of neural network.
- Achievement unlock: Particle burst SVG animation.

### 11.3 Textures

- Noise texture overlay: 3% opacity PNG noise layered over glass cards (adds tactility).
- Grid pattern: CSS SVG background `url("data:image/svg+xml,...")` — very subtle dot grid on page background.

---

## 12. Design System Tokens Reference

```json
{
  "spacing": {
    "1": "4px",   "2": "8px",   "3": "12px",  "4": "16px",
    "5": "20px",  "6": "24px",  "8": "32px",  "10": "40px",
    "12": "48px", "16": "64px", "20": "80px", "24": "96px"
  },
  "radius": {
    "sm": "8px", "md": "12px", "lg": "20px", "xl": "28px", "full": "9999px"
  },
  "blur": {
    "sm": "8px", "md": "20px", "lg": "40px", "xl": "60px"
  },
  "transition": {
    "fast": "150ms ease",
    "normal": "300ms cubic-bezier(0.4, 0, 0.2, 1)",
    "slow": "600ms cubic-bezier(0.4, 0, 0.2, 1)"
  },
  "zIndex": {
    "background": 0,
    "cards": 10,
    "sidebar": 100,
    "modal-backdrop": 200,
    "modal": 300,
    "toast": 400,
    "tooltip": 500
  }
}
```
