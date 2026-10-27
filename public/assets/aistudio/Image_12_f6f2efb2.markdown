---
name: Deep Cyan Void HUD
colors:
  surface: '#11131b'
  surface-dim: '#11131b'
  surface-bright: '#373941'
  surface-container-lowest: '#0c0e15'
  surface-container-low: '#191b23'
  surface-container: '#1d1f27'
  surface-container-high: '#272a32'
  surface-container-highest: '#32343d'
  on-surface: '#e1e2ed'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#e1e2ed'
  inverse-on-surface: '#2e3038'
  outline: '#849495'
  outline-variant: '#3b494b'
  surface-tint: '#00dbe9'
  primary: '#dbfcff'
  on-primary: '#00363a'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#006970'
  secondary: '#98cbff'
  on-secondary: '#003354'
  secondary-container: '#00a2fd'
  on-secondary-container: '#003558'
  tertiary: '#eef7ff'
  on-tertiary: '#00354a'
  tertiary-container: '#aee0ff'
  on-tertiary-container: '#00668b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#cfe5ff'
  secondary-fixed-dim: '#98cbff'
  on-secondary-fixed: '#001d33'
  on-secondary-fixed-variant: '#004a77'
  tertiary-fixed: '#c4e7ff'
  tertiary-fixed-dim: '#7bd0ff'
  on-tertiary-fixed: '#001e2c'
  on-tertiary-fixed-variant: '#004c69'
  background: '#11131b'
  on-background: '#e1e2ed'
  surface-variant: '#32343d'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.01em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.12em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 9px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.16em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

This design system establishes a high-precision, sentient mobile assistant interface designed exclusively for next-generation Android devices. Blending aerospace telemetry, holographic HUD graphics, and pure executive minimalism, it translates the archetype of an omniscient digital companion into a tangible, pocketable OS shell.

### Aesthetics & Stylistic Direction
The style balances **Dark Void Glassmorphism** with **Technical Sci-Fi Precision**:
- **Atmosphere:** Deep interstellar voids layered with luminescent, translucent glass plates.
- **Lighting Paradigm:** Elements do not catch ambient external light; they generate their own chromatic luminescence from within. Radial backlights, kinetic voice waveform ripples, and sub-pixel optical glow boundaries reinforce real-time computational activity.
- **Micro-Interactions & Telemetry:** Dynamic ring gauges, sub-second latency state shifts, precision tick marks, and scanning ray animations evoke an operational tactical console without degrading core legibility.
- **Cultural & Linguistic Tone:** Premium, warm-futuristic demeanor supporting seamless Hindi, English, and Hinglish dialogue (e.g., *"Namaste, main Shree hoon"*), prioritizing respectful authority, instantaneous responsiveness, and computational clarity.

## Colors

The chromatic architecture is built upon absolute depth and electric phosphorescence, meeting strict WCAG 2.1 AAA contrast targets against dark baselines.

### Functional Roles & Hierarchy
- **Base Canvas (`#06080F`):** Deep void black-blue providing zero-luminance foundations for OLED battery efficiency and maximum accent punch.
- **Surface Elevation 1 (`#0B111E`):** Translucent module substrate for background panels, lists, and inactive containers.
- **Surface Elevation 2 (`#111A2E`):** Interactive surface tier for interactive cards, modals, and input fields.
- **Primary Energy Accent (`#00F0FF`):** Hyper-saturated electric cyan. Reserved for active voice state waveforms, primary action triggers, focal telemetry readings, and optical focal points.
- **Secondary Atmospheric Stream (`#00A3FF`):** Deep cobalt blue. Serves as gradient termination, directional accents, and elevated borders.
- **Tertiary Cyan Highlight (`#38BDF8`):** Soft luminous blue for passive data visualization, secondary gauges, and active badge states.
- **System Diagnostics:**
  - Critical Alert: `#FF3B5C` (Crimson pulse)
  - Computational Nominal: `#00FF9D` (Phosphor green)
  - Processing Standby: `#FFB800` (Solar amber)

## Typography

The typographic hierarchy implements a high-contrast dual-family architecture configured for immediate cognitive intake and localized multilingual balance.

### Type Pairings & Intent
- **Display, Headlines & HUD Metrics (Space Grotesk):** Delivers geometric, aerodynamic character. Handles large status outputs, computational telemetry labels, and uppercase HUD indicators. Monospace-leaning forms reflect tactical computational precision.
- **Body, Conversational Stream & Transcription (Inter):** Highly legible across varied viewing distances and dynamic light environments. Optimized for multi-script rendering across Latin, Devanagari script integration, and English-Hindi mixed vocabulary.

### Letter-Spacing Rules
All `label-*` tiers enforce strict positive letter-spacing (`0.08em` to `0.16em`) and uppercase transformation for system metadata, status tags, and sensory telemetry readouts. `body-*` tokens preserve natural optical metrics for continuous conversational prose.

## Layout & Spacing

The layout is built for hand-held Android interaction, anchoring core control modules in the lower thumb zone while floating predictive HUD streams across the mid and upper viewports.

### Rhythm & Grid Structure
- **Mobile Foundation:** 4-column dynamic fluid grid utilizing `1.25rem` outer margins (`margin`) and `1rem` column gutters (`gutter`).
- **Telemetry Shell:** Fixed bottom 88px control tier dedicated to multimodal voice activation, peripheral audio waveform gauges, and mode shifts.
- **Vertical Rhythm:** Micro-spacers (`space-xs` = 4px, `space-sm` = 8px) govern tight sensor clusters and badge indicators. Component bodies leverage `space-md` (16px) internal padding, while section divisions use `space-xl` (36px) to maintain a spatial, floating field of view.

## Elevation & Depth

Visual depth avoids generic drop shadows. Instead, it relies on light emission, refractive glassmorphism, and atmospheric gradients.

### Layering Model
1. **Void Substrate (Layer 0):** Background foundation (`#06080F`) overlaid with low-intensity cyan radial glows (`rgba(0, 240, 255, 0.04)`) localized around active computational agents.
2. **Refractive Glass Tiles (Layer 1):** Background `rgba(11, 17, 30, 0.72)` combined with a hardware-accelerated `16px` backdrop-filter blur and an ultra-thin perimeter stroke (`1px solid rgba(0, 240, 255, 0.15)`).
3. **Elevated HUD Command Trays (Layer 2):** Background `rgba(17, 26, 46, 0.88)` with `24px` backdrop blur, illuminated by a directional top border highlighting edge glow (`1px solid rgba(0, 240, 255, 0.45)`).
4. **Active Luminescence (Focus & Overlays):** Interactive elements omit drop shadows in favor of ambient halo emissions: `box-shadow: 0 0 24px -4px rgba(0, 240, 255, 0.35)`.

## Shapes

The geometric architecture balances futuristic industrial precision with ergonomic touch profiles.

### Radius Schema
- Standard components adopt `roundedness: 2` (base 8px / `0.5rem`).
- Cards, dialogue bubbles, and modal frames use `rounded-lg` (16px / `1rem`).
- Primary interaction nodes (voice trigger pods, biometric triggers, pill tags) use `rounded-full` (9999px) to contrast technical angles against organic contact surfaces.
- Telemetry indicators, gauges, and sensor boundaries may incorporate cut-corner or segmented bracket overlays (2px technical notches) on outer borders.

## Components

### Buttons & Voice Nodes
- **Primary Voice Action Node:** A 72px circular floating control surrounded by two concentric 1px pulsing orbital rings. Core fill is a vibrant gradient (`#00F0FF` to `#00A3FF`) with a high-intensity white/cyan core icon. In listening mode, the orbital rings flex dynamically via CSS scale transforms based on incoming microphone decibels.
- **Secondary Action Buttons:** Low-opacity glass fill (`rgba(0, 240, 255, 0.08)`), crisp 1px electric cyan border (`rgba(0, 240, 255, 0.3)`), uppercase Space Grotesk typography, and zero fill-opacity transitions upon press state.

### Telemetry Cards & Conversational Frames
- **Conversational Bubbles:** Asymmetric rounding. Incoming system responses use `rounded-lg` with a top-left corner accent clip and a faint neon-cyan rim light (`rgba(0, 240, 255, 0.12)`). User prompts present muted cobalt panels (`rgba(0, 163, 255, 0.08)`).
- **Telemetry Metric Tiles:** Modular glass blocks framing real-time diagnostic readouts (e.g., CPU load, neural inference latency, network band). Accompanied by micro tick-marks and monospace uppercase labels.

### Input Fields & Multimodal Trays
- **HUD Command Input:** Pill-shaped glass container holding placeholder copy such as *"Ask Shree anything... / Kahiye, kya madad karoon?"*. Border glow expands from `rgba(0, 240, 255, 0.2)` to an active state of `rgba(0, 240, 255, 0.8)` with a soft cyan ambient field when focused.

### Status Chips & Mode Selectors
- Compact pill-shaped modules containing glowing micro-LED dots (4px diameter) indicating connection states: *ONLINE*, *STREAMING*, *PROCESSING*. Text is set in `label-sm` with active items utilizing solid neon backgrounds and darkened high-contrast typography.

### Custom Component: Audio Waveform Gauge
- A synchronized 7-bar vertical visualizer sitting directly adjacent to conversational streams. Displays real-time audio amplitude using vertical cyan-to-sky gradient bars (`#00F0FF` to `#38BDF8`) that respond to audio synthesis frequency ranges.