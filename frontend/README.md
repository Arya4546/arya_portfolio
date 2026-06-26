# 🌌 A Journey Through Pixels & Logic

This is a premium, cinematic developer portfolio built for **Arya Deep Singh**. It leverages advanced scroll-driven storytelling techniques to create a high-end, editorial-style experience.

## ✨ Core Concept
The portfolio follows a "stacked depth" architecture:
1. **Stable Hero**: A fixed anchor landing page.
2. **Overlapping Narrative**: Subsequent sections slide over the hero and each other, creating a physical sense of depth as you explore the milestones.
3. **Scroll-Driven Motion**: Every interaction—from horizontal project showcases to card-stacking expertise—is driven by the user's scroll position.

## 🛠️ Technology Stack
- **Framework**: Vite + React + TypeScript
- **Styling**: Tailwind CSS v4 (Light Premium Theme)
- **Animation**: Framer Motion (useScroll, useTransform)
- **Icons**: Lucide React
- **Typography**: 
  - `Instrument Serif`: For editorial, expressive headings.
  - `Inter`: For technical, readable body text.

## 📁 Project Structure
- `src/components/`: Modular UI sections (Hero, About, Projects, etc.)
- `src/index.css`: Global styles, Tailwind v4 theme, and smooth scroll configuration.
- `src/App.tsx`: Main architecture and section layering logic.

## 🚀 How to Move Forward
1. **Adding Sections**: New sections should be added to `App.tsx` within the `relative z-10` content wrapper to maintain the overlapping effect.
2. **Customizing Content**: Update constants within each component in `src/components/` to personalize the data.
3. **Fluid Motion**: Use `Framer Motion` for any new animations to maintain the cohesive cinematic feel.

## 📱 Responsiveness
The site is fully responsive, moving from expansive editorial layouts on desktop to focused, readable stacks on mobile devices.

---
Built with technical precision and cinematic vision.
