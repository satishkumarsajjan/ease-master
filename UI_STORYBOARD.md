# Ease — UI Interaction Storyboard (Keyframe Flow)

> **Document Type:** Spatial UI Blueprint & Frame-by-Frame Wireframe Sequence  
> **Complements:** [USER_FLOW_NARRATIVE.md](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/ease/USER_FLOW_NARRATIVE.md) & [EASE_AUDIT.md](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/ease/EASE_AUDIT.md)  
> **Purpose:** Mathematically define what every block looks like, how it resizes, what mounts, and what unmounts across all 11 critical beats of the user journey.

---

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 THE 3 CORE LAYOUT STATES                               │
│                                                                                        │
│  STATE 1: AUDITION             STATE 2: CUSTOMIZE              STATE 3: COMPARE        │
│  ┌───┬───────────────────┬───┐ ┌───┬───────────────────┬───┐   ┌─┬─────────┬─────────┬─┐
│  │ A │ B (Full Height)   │ D │ │ A │ B1 (Top 60% Graph)│ D │   │ │ Tile 1  │ Tile 2  │ │
│  │   │                   │   │ │   ├───────────────────┤   │   │A│ (50%)   │ (50%)   │D│
│  │   │ Real UI Component │   │ │   │ B2 (Bottom 40% UI)│   │   │ │         │         │ │
│  └───┴───────────────────┴───┘ └───┴───────────────────┴───┘   └─┴─────────┴─────────┴─┘
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Frame 01: The Zero-Friction Landing

- **State:** `STATE_AUDITION`
- **Trigger:** User opens `ease.satisium.com`
- **Intent:** Explore presets on realistic UI with zero initial mathematical intimidation.

```
┌───────────────────────────────┬────────────────────────────────────────────────────────┬────────────────┐
│ [BLOCK 1] BRAND & NAV (280px) │ [BLOCK 4] CENTER HERO STAGE (100% Height Canvas)       │ [BLOCK 7]      │
├───────────────────────────────┤                                                        │ MOTION LAW,    │
│ [BLOCK 2] PRESET CATALOG      │                                                        │ PRESCRIPTIONS  │
│           & SEARCH (280px)    │                                                        │ & CODE EXPORT  │
│                               │                                                        │ (320px)        │
│                               │                                                        │                │
├───────────────────────────────┤                                                        ├────────────────┤
│ [BLOCK 3] SPONSOR / AD        ├────────────────────────────────────────────────────────┤ [BLOCK 8]      │
│           ECOSYSTEM (280px)   │ [BLOCK 5] COMPONENT SELECTOR │ [BLOCK 6] TRANSPORT DOCK│ COMPARE BENCH  │
│                               │           Dropdown (220px)   │           Scrubber, A11y│ STAGING (320px)│
└───────────────────────────────┴──────────────────────────────┴─────────────────────────┴────────────────┘
```

### Block Manifest & Theoretical Feature Allocation:

- **Block 1 (Top-Left, 280px × 48px):** Brand logo, product identity, documentation link, theme switcher.
- **Block 2 (Mid-Left, 280px × Flex):** 56 presets catalog with Bezier/Spring switcher, search, category chips, and visual mini-graphs.
- **Block 3 (Bottom-Left, 280px × 72px):** Dedicated sponsor & ecosystem monetization slot.
- **Block 4 (Center Stage, Flex × Flex):** 100% full-height real-world component audition canvas with customize trigger.
- **Block 5 (Center-Bottom Left, 220px × 48px):** Scalable component dropdown selector (supports 20+ components).
- **Block 6 (Center-Bottom Right, Flex × 48px):** Playback transport, Spacebar replay, precision speed multipliers, exact math scrubber, reduced-motion toggle.
- **Block 7 (Right Rail, 320px × Flex):** Contextual archetype motion law, target duration, curated prescriptions, and live multi-framework code export with copy action.
- **Block 8 (Right Bottom, 320px × 48px):** Compare bench staging dock (counter badge, stash action, launch duel).

---

## Frame 02: Switching UI Archetypes (Carousel)

- **State:** `STATE_AUDITION`
- **Trigger:** User clicks `[ Carousel ]` in the scenario bar
- **Intent:** Experience the active curve on horizontal travel with inertia.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER: [Satisium Logo] Ease Studio  • Mode: [Cubic Bezier | Spring] • Active: [Carousel]│
├─────────────────┬────────────────────────────────────────────────────┬─────────────────┤
│ BLOCK A (280px) │ BLOCK B (Center Stage — 100% Full Height)          │ BLOCK D (320px) │
│                 │                                                    │                 │
│ [ Search... ]   │ Scenario: [Modal] [Carousel*] [Button] [Toast]...  │ CAROUSEL LAW    │
│                 │ ────────────────────────────────────────────────── │ "High travel    │
│ ▼ FLUID (14)    │      ┌─────────┐   ┌─────────┐   ┌─────────┐       │ distance needs  │
│   • Apple Decel*│      │ Card 1  │   │ Card 2  │   │ Card 3  │       │ friction glide  │
│   • iOS Sheet   │      │ (Image) │   │ (Active)│   │ (Image) │       │ without sudden  │
│                 │      └─────────┘   └─────────┘   └─────────┘       │ hard stops."    │
│                 │             [ ◄ Prev ]     [ Next ► ]              │ ─────────────── │
│                 │                                                    │ RECOMMENDED:    │
│                 │ [ Customize Curve ]                                │ [Apple Fluid]   │
│                 │                                                    │ [Soft Glide]    │
├─────────────────┴────────────────────────────────────────────────────┴─────────────────┤
│ BOTTOM DOCK: [ Replay (Space) ] [ 1x | 0.5x ] [ Scrubber: ──●── ] [ Reduced Motion ] [+ Compare]│
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Morph & Content Changes:

- **Block B:** Modal unmounts; 3-card sliding product carousel mounts with drag momentum.
- **Block D:** Automatically transitions from Modal Law to **Carousel Law**, and replaces recommendations with **Apple Fluid** and **Soft Glide Spring**.

---

## Frame 03: Precision Slow-Mo & Accessibility (A11y)

- **State:** `STATE_AUDITION`
- **Trigger:** User drags Scrubber to 45% and clicks `[ Reduced Motion ]`
- **Intent:** Inspect intermediate frame values and test `prefers-reduced-motion` safety.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER: [Satisium Logo] Ease Studio  • Reduced Motion: ACTIVE (Simulated)              │
├─────────────────┬────────────────────────────────────────────────────┬─────────────────┤
│ BLOCK A (280px) │ BLOCK B (Center Stage — 100% Full Height)          │ BLOCK D (320px) │
│                 │                                                    │                 │
│ Presets List    │ Scenario: [Modal*] [Carousel] [Button] [Toast]...  │ A11Y NOTICE     │
│ (Unchanged)     │ ────────────────────────────────────────────────── │ "Vestibular safe│
│                 │                                                    │ degradation:    │
│                 │           ┌───────────────────────┐                │ scale=1 (fixed) │
│                 │           │   Modal (Safe Fade)   │                │ opacity=0.72    │
│                 │           │   Opacity: 72% (Frozen│                │ duration: 0.1s" │
│                 │           └───────────────────────┘                │                 │
├─────────────────┴────────────────────────────────────────────────────┴─────────────────┤
│ BOTTOM DOCK: [ Pause ] [ 0.25x* ] [ Scrubber: ────●───── 45% ] [ Reduced Motion ON ]    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Morph & Content Changes:

- **Block B:** The modal freezes mid-flight at $45\%$ timeline progression. Scale animation is suppressed; only opacity cross-fade renders.
- **Bottom Dock:** `0.25x` badge is highlighted; Scrubber thumb sits at 45%; A11y badge glows amber.

---

## Frame 04: The "Customize" Morph

- **State:** Transition from `STATE_AUDITION` $\longrightarrow$ `STATE_CUSTOMIZE`
- **Trigger:** User clicks `[ Customize Curve ]` (or presses shortcut `2`)
- **Intent:** Unroll the curve editing graph while keeping real-time component feedback.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER: [Satisium Logo] Ease Studio  • STAGE: [Audition] [Customize*] [Compare]        │
├─────────────────┬────────────────────────────────────────────────────┬─────────────────┤
│ BLOCK A (280px) │ BLOCK B1: Center-Top (60% Height)                  │ BLOCK D (320px) │
│                 │ ┌────────────────────────────────────────────────┐ │                 │
│ ▼ MY VARIANTS   │ │  SVG Cubic-Bezier Canvas                       │ │ CODE EXPORT     │
│   (Empty - 0)   │ │  • Handle P1 (0.25, 0.10) [Draggable]          │ │ ─────────────── │
│                 │ │  • Handle P2 (0.25, 1.00) [Draggable]          │ │ [CSS] [Tailwind]│
│ ─────────────── │ ├────────────────────────────────────────────────┤ │ [Motion] [GSAP] │
│ ▼ PRESETS (56)  │ │ Sliders: X1: 0.25 | Y1: 0.10 | X2: 0.25 | Y2: 1│ │                 │
│   • Apple Decel │ ├────────────────────────────────────────────────┤ │ transition: all │
│   • Material 3* │ BLOCK B2: Center-Bottom (40% Height)             │ │ 300ms cubic-    │
│   • Cushioned   │ ┌────────────────────────────────────────────────┐ │ bezier(0.25... │
│                 │ │ [ Live Modal Micro-Preview: Reacts on Drag ]   │ │                 │
│ [ Fork Curve ]  │ └────────────────────────────────────────────────┘ │ [ Copy Code ]   │
├─────────────────┴────────────────────────────────────────────────────┴─────────────────┤
│ BOTTOM DOCK: [ Replay (Space) ] [ 1x ] [ Scrubber: ──●── ] [ + Add to Compare ]         │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Spatial Morph Mechanics:

- **Block B splits horizontally:**
  - **Block B1 (Top 60%):** Smoothly unrolls the interactive SVG Bezier graph and coordinate sliders.
  - **Block B2 (Bottom 40%):** Shrinks gracefully, keeping the live Modal dialog active for real-time drag feedback!
- **Block A:** Adds "My Variants" section at the top.
- **Block D:** Design rationale slides away; **Multi-Framework Code Export Panel** mounts.

---

## Frame 05: Spring Physics & Velocity Derivative

- **State:** `STATE_CUSTOMIZE`
- **Trigger:** User switches engine to **Spring Physics** and adjusts `stiffness: 360`, `damping: 22`
- **Intent:** Sculpt under-damped harmonic physics with visible overshoot and velocity tracking.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER: [Satisium Logo] Ease Studio  • Engine: [Spring Physics*] • Settle: 270ms       │
├─────────────────┬────────────────────────────────────────────────────┬─────────────────┤
│ BLOCK A (280px) │ BLOCK B1: Center-Top (60% Height)                  │ BLOCK D (320px) │
│                 │ ┌────────────────────────────────────────────────┐ │                 │
│ ▼ MY VARIANTS   │ │  Dynamic SVG Spring Canvas (Auto-Zoom y: 1.25) │ │ SPRING TOKENS   │
│   (Draft *)     │ │   Crest: y = 1.06 (6% Overshoot crest visible) │ │ ─────────────── │
│                 │ │  ── Cyan Line: Velocity Derivative (v) ─────── │ │ Mass:      1.0  │
│ ▼ PRESETS (56)  │ │   ● Animated Cursor Dot tracking curve         │ │ Stiffness: 360  │
│   • Glitch Pop  │ ├────────────────────────────────────────────────┤ │ Damping:    22  │
│   • Soft Spring │ │ k: ──●── 360  |  c: ──●── 22  |  m: ──●── 1.0  │ │ Velocity:  0.0  │
│                 │ ├────────────────────────────────────────────────┤ │ ─────────────── │
│                 │ BLOCK B2: Center-Bottom (40% Height)             │ │ linear(0, 0.08, │
│                 │ ┌────────────────────────────────────────────────┐ │ 0.31, 0.65,     │
│ [ Fork Preset ] │ │ [ Modal scales in, rebounds 6%, settles ]      │ │ 1.06, 0.98, 1)  │
├─────────────────┴────────────────────────────────────────────────────┴─────────────────┤
│ BOTTOM DOCK: [ Replay (Space) ] [ 1x ] [ Scrubber ] [ + Add to Compare ]              │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Morph & Content Changes:

- **Block B1:**
  - Graph renders damped harmonic oscillation curve.
  - **Dynamic Auto-Zoom:** SVG viewBox y-axis auto-scales from `1.0` to `1.25`, ensuring the 6% overshoot crest is clearly visible.
  - **Cyan Velocity Overlay:** Displays the first derivative curve ($v = dx/dt$).
  - **Cursor Dot:** Animated dot rides the curve in exact sync with Block B2.
- **Block D:** Export panel generates modern CSS `linear()` sampled curve points.

---

## Frame 06: Steps Mode, Parametrics & Curve Import Bar

- **State:** `STATE_CUSTOMIZE`
- **Trigger:** User toggles mode to `steps()` or opens the Curve Import Bar
- **Intent:** Explore staircase timing functions, parametric curves, or reverse-engineer existing code.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER: [Satisium Logo] Ease Studio  • Engine: [Steps Mode*]                           │
├─────────────────┬────────────────────────────────────────────────────┬─────────────────┤
│ BLOCK A (280px) │ BLOCK B1: Center-Top (60% Height)                  │ BLOCK D (320px) │
│                 │ ┌────────────────────────────────────────────────┐ │                 │
│ Mode Select:    │ │ [ Import Bar: "cubic-bezier(0.33, 1, 0.68, 1)" ] [Parse]        │
│ [Bezier/Spring] │ ├────────────────────────────────────────────────┤ │ STEPS EXPORT    │
│ [Steps*]        │ │  Staircase SVG Graph (8 Steps, jump-end)       │ │ ─────────────── │
│ [Parametric]    │ │  ┌───┐                                         │ │ steps(8,        │
│                 │ │  │   └───┐                                     │ │   jump-end)     │
│ Jump Term:      │ │  │       └───┐                                 │ │                 │
│ (•) jump-end    │ ├────────────────────────────────────────────────┤ │ Use Cases:      │
│ ( ) jump-start  │ │ Steps: ──●── 8   |   Jump: [jump-end ▼]        │ │ • Typewriter    │
│ ( ) jump-none   │ ├────────────────────────────────────────────────┤ │ • Clock ticks   │
│                 │ BLOCK B2: Center-Bottom (40% Height)             │ │ • Spritesheets  │
│                 │ ┌────────────────────────────────────────────────┐ │                 │
│                 │ │ [ Pixel-Art Typewriter Preview: Chunks 8 steps]│ │ [ Copy Code ]   │
└─────────────────┴─┴────────────────────────────────────────────────┴─┴─────────────────┘
```

### Morph & Content Changes:

- **Import Bar:** A 32px slide-down input bar mounted above the graph parses pasted strings into bezier handles.
- **Block B1:** SVG visualizer renders discrete stepped staircases.
- **Block B2:** Micro-preview switches to stepped typewriter typography.

---

## Frame 07: The Git Fork & Variant Tree Commit

- **State:** `STATE_CUSTOMIZE`
- **Trigger:** User clicks `[ Fork Preset ]`, names it `Brand Modal / Snappy`, and commits a snapshot
- **Intent:** Persist custom brand motion tokens with visual diffing against parent presets.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER: [Satisium Logo] Ease Studio  • Saved to Local: "Brand Modal / Snappy"          │
├─────────────────┬────────────────────────────────────────────────────┬─────────────────┤
│ BLOCK A (280px) │ BLOCK B1: Center-Top (60% Height)                  │ BLOCK D (320px) │
│                 │ ┌────────────────────────────────────────────────┐ │                 │
│ ▼ MY VARIANTS(1)│ │  Active Curve (Cyan): Brand Modal / Snappy     │ │ VARIANT INFO    │
│ ▼ Material 3    │ │  -- Ghost Outline (Gray): Parent Material 3 -- │ │ ─────────────── │
│   └── Snappy*   │ │                                                │ │ Parent: M3 Emph │
│                 │ │ [ Diff: +60 Stiffness, -8 Damping, -70ms settle│ │ Commits: 1      │
│ [ Commit Snap ] │ ├────────────────────────────────────────────────┤ │ Snapshot #1:    │
│ "Crisp rebound" │ │ Controls: [k: 360] [c: 22] [m: 1]              │ │ "Crisp rebound" │
│ ─────────────── │ ├────────────────────────────────────────────────┤ │                 │
│ ▼ PRESETS (56)  │ BLOCK B2: Center-Bottom (40% Height)             │ │ [ Revert Snap ] │
│   • Apple Decel │ ┌────────────────────────────────────────────────┐ │                 │
│   • Glitch Pop  │ │ [ Live Modal Preview: Brand Snappy Physics ]   │ │ [ New Branch ]  │
├─────────────────┴─┴────────────────────────────────────────────────┴─┴─────────────────┤
│ BOTTOM DOCK: [ Replay (Space) ] [ 1x ] [ Scrubber ] [ + Pin to Compare Tray (1) ]       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Morph & Content Changes:

- **Block A:** Tree updates with `Brand Modal / Snappy` branch under parent `Material 3`.
- **Block B1 (Diff Mode):** The original parent curve renders as a dashed gray reference line; the active custom curve renders in bright cyan, highlighting the exact visual delta.
- **Block D:** Displays commit history and diff telemetry.

---

## Frame 08: Populating the Compare Tray

- **State:** `STATE_CUSTOMIZE`
- **Trigger:** User pins 3 curves (`Browser Ease`, `Apple Fluid`, `Brand Modal / Snappy`)
- **Intent:** Stage multiple curves into a comparison tray before launching the duel.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER: [Satisium Logo] Ease Studio  • Active: Brand Modal / Snappy                    │
├─────────────────┬────────────────────────────────────────────────────┬─────────────────┤
│ BLOCK A (280px) │ BLOCK B1 & B2 (Same as Frame 07)                   │ BLOCK D (320px) │
│                 │                                                    │                 │
│ [x] Browser Ease│                                                    │                 │
│ [x] Apple Fluid │                                                    │                 │
│ [x] Brand Snappy│                                                    │                 │
├─────────────────┴────────────────────────────────────────────────────┴─────────────────┤
│ FLOATING COMPARE TRAY POPOVER (Expands from Bottom Dock):                              │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ COMPARE TRAY (3 Curves Selected)                                                   │ │
│ │ [1. Browser Ease x]  [2. Apple Fluid x]  [3. Brand Modal / Snappy x]               │ │
│ │                                                        [ Launch Compare Duel ]     │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Morph & Content Changes:

- A sleek floating tray popover expands from the bottom dock showing pill chips for all 3 staged curves, with an active **`[ Launch Compare Duel ]`** action button.

---

## Frame 09: The 3-Tile Benchmark Duel

- **State:** Transition from `STATE_CUSTOMIZE` $\longrightarrow$ `STATE_COMPARE`
- **Trigger:** User clicks `[ Launch Compare Duel ]` (or presses shortcut `3`)
- **Intent:** Benchmark 3 curves simultaneously side-by-side with synchronized trigger and interruption testing.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER: [Satisium Logo] Ease Studio  • STAGE: [Audition] [Customize] [Compare*]         │
├───┬──────────────────────┬──────────────────────┬──────────────────────┬───────────────┤
│ A │ TILE 1 (33% Width)   │ TILE 2 (33% Width)   │ TILE 3 (33% Width)   │ D             │
│   │                      │                      │                      │               │
│ 48│ Browser 'ease'       │ Apple Fluid Decel    │ Brand Modal / Snappy │ 48px          │
│ px│ [ Component: Modal ▼]│ [ Component: Modal ▼]│ [ Component: Modal ▼]│ Slim          │
│ S │ ┌──────────────────┐ │ ┌──────────────────┐ │ ┌──────────────────┐ │ Rail          │
│ l │ │   Live Modal A   │ │ │   Live Modal B   │ │ │   Live Modal C   │ │               │
│ i │ └──────────────────┘ │ └──────────────────┘ │ └──────────────────┘ │ [Export Icon] │
│ m │                      │                      │                      │ [Info Icon]   │
│ R │ Settle: 480ms (Slow) │ Settle: 340ms        │ Settle: 270ms (Fast) │               │
│ a │ [ ✕ Dismiss ]        │ [ ✕ Dismiss ]        │ [ ✕ Dismiss ]        │               │
├───┴──────────────────────┴──────────────────────┴──────────────────────┴───────────────┤
│ SYNCHRONIZED DOCK: [ Trigger All (Spacebar) ]  [ Interruption Stress Test ] [ 1x|0.5x ] │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Spatial Morph Mechanics:

- **Blocks A & D smoothly contract from 280px/320px down to 48px slim vertical icon rails.**
- **Block B expands to full width (~1184px net on a 1280px screen) and partitions into 3 equal 390px tiles.**
- Each tile has its own independent component selector, live preview, settle timer, and dismiss button.
- Single press of **`Spacebar`** synchronously triggers all 3 viewports at $t = 0$.

---

## Frame 10: Tile Dismissal & 50/50 Grid Reflow

- **State:** `STATE_COMPARE`
- **Trigger:** User clicks `[ ✕ Dismiss ]` on Tile 1 (Browser Ease)
- **Intent:** Eliminate the losing curve and inspect the top 2 contenders in a spacious split-screen.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER: [Satisium Logo] Ease Studio  • STAGE: Compare (2 Contenders)                   │
├───┬───────────────────────────────────┬───────────────────────────────────┬────────────┤
│ A │ TILE 2 (50% Net Width)            │ TILE 3 (50% Net Width)            │ D          │
│   │                                   │                                   │            │
│ 48│ Apple Fluid Decel                 │ Brand Modal / Snappy (Winner)     │ 48px       │
│ px│ [ Component: Modal ▼ ]            │ [ Component: Modal ▼ ]            │ Slim       │
│   │                                   │                                   │ Rail       │
│   │      ┌─────────────────────┐      │      ┌─────────────────────┐      │            │
│   │      │    Live Modal B     │      │      │    Live Modal C     │      │            │
│   │      │    (340ms settle)   │      │      │    (270ms settle)   │      │            │
│   │      └─────────────────────┘      │      └─────────────────────┘      │            │
│   │                                   │                                   │            │
│   │ [ ✕ Dismiss ]                     │ [ ✕ Dismiss ]                     │            │
├───┴───────────────────────────────────┴───────────────────────────────────┴────────────┤
│ SYNCHRONIZED DOCK: [ Trigger Both (Spacebar) ]  [ Settle Delta: Variant is 70ms faster] │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Spatial Morph Mechanics:

- **Tile 1 unmounts with a smooth fade-out and width-collapse animation.**
- **Tiles 2 & 3 dynamically expand to fill the void (50% width each), reflowing into a clean, spacious 2-column comparison duel with zero page refresh.**

---

## Frame 11: Production Code Export & Shareable URL

- **State:** Handoff / Final Export
- **Trigger:** User clicks the Export icon on Tile 3
- **Intent:** Copy production-ready component code, share reproducible URL, and jump to docs.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER: [Satisium Logo] Ease Studio  • [ Share URL (Copied) ] • [ Read Docs ]          │
├───┬───────────────────────────────────────────────────┬────────────────────────────────┤
│ A │ CENTER: TILE 3 PREVIEW (60% Width)                │ BLOCK D: EXPANDED EXPORT (40%) │
│   │                                                   │                                │
│ 48│ Brand Modal / Snappy                              │ TARGET: [Framer Motion Snippet]│
│ px│                                                   │ ────────────────────────────── │
│   │              ┌──────────────────┐                 │ export const modalVariant = {  │
│   │              │   Modal Dialog   │                 │   initial: { scale: 0.92 },    │
│   │              │   (Winner!)      │                 │   animate: { scale: 1 },       │
│   │              └──────────────────┘                 │   transition: {                │
│   │                                                   │     type: "spring",            │
│   │ Settle: 270ms | Overshoot: 6%                     │     stiffness: 360,            │
│   │                                                   │     damping: 22,               │
│   │                                                   │     mass: 1                    │
│   │                                                   │   }                            │
│   │                                                   │ };                             │
│   │                                                   │ ────────────────────────────── │
│   │                                                   │ [ ⌘ Copy Production Snippet ]  │
└───┴───────────────────────────────────────────────────┴────────────────────────────────┘
```

### Morph & Content Changes:

- **Block D expands open** to 40% width.
- Dropdown allows selecting **Framer Motion `<motion.div>`**, **Tailwind arbitrary classes**, or **Radix UI Dialog overrides**.
- Top Header **Share Button** copies the state-preserving URL:  
  `https://ease.satisium.com/app?stage=compare&items=apple-fluid,brand-modal-snappy`
- Header badge links directly to `/docs/playbook/modals-and-dialogs`.

---

## Storyboard Verification: The Layout Transition State Machine

This table acts as our mathematical implementation contract:

| Transition          | From Frame | To Frame | Block A (Left)       | Block B (Center)                                 | Block D (Right)               | Bottom Dock              |
| :------------------ | :--------- | :------- | :------------------- | :----------------------------------------------- | :---------------------------- | :----------------------- |
| **Landing**         | —          | **01**   | Mounted (280px)      | 100% Full Height (Modal)                         | Mounted (320px, Rationale)    | Transport Active         |
| **Archetype Swap**  | 01         | **02**   | Unchanged            | Modal unmounts $\to$ Carousel mounts             | Prescriptions update          | Unchanged                |
| **A11y Scrub**      | 02         | **03**   | Unchanged            | Freezes at 45% (A11y mode)                       | A11y notice mounts            | Amber A11y badge         |
| **Customize Morph** | 03         | **04**   | "My Variants" mounts | **Splits 60% Top / 40% Bottom**                  | Rationale swaps to Export     | + Compare pin active     |
| **Spring Sculpt**   | 04         | **05**   | Unchanged            | SVG ViewBox auto-zooms to 1.25                   | Export shows `linear()`       | Unchanged                |
| **Steps / Import**  | 05         | **06**   | Unchanged            | Staircase graph & Import bar mount               | Steps export active           | Unchanged                |
| **Fork Variant**    | 06         | **07**   | Branch tree mounts   | Visual Diff ghost outline mounts                 | Variant history mounts        | Tray counter = 1         |
| **Compare Staging** | 07         | **08**   | Tray checkboxes      | Unchanged                                        | Unchanged                     | **Tray popover expands** |
| **Duel Launch**     | 08         | **09**   | **Shrinks to 48px**  | **Partitions into 3 Equal Tiles**                | **Shrinks to 48px**           | Sync Spacebar active     |
| **Tile Dismiss**    | 09         | **10**   | 48px rail            | **Tile 1 unmounts; Tiles 2 & 3 reflow to 50/50** | 48px rail                     | Settle delta updates     |
| **Final Export**    | 10         | **11**   | 48px rail            | 60% Width Preview                                | **Expands to 40% (Snippets)** | URL copied toast         |

---

## Conclusion

We now possess the complete product trifecta:

1. **[EASE_AUDIT.md](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/ease/EASE_AUDIT.md)** — The 19 Required Features.
2. **[USER_FLOW_NARRATIVE.md](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/ease/USER_FLOW_NARRATIVE.md)** — The Living Script.
3. **[UI_STORYBOARD.md](file:///home/satishkumar/Desktop/The%20Satisium%20Umbrella/ease/UI_STORYBOARD.md)** — The Keyframe Wireframes & Layout State Machine.

Every block, every dimension, and every pixel transition has been accounted for. We are ready to begin implementation with 100% confidence.
