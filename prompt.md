Absolutely. Below is the kind of prompt I'd hand to a senior product designer or an AI frontend builder (Lovable, v0, Bolt, Claude Code, Cursor, etc.). It isn't just "make it look cool"—it specifies the narrative, motion, typography, timing, performance, accessibility, and implementation philosophy.

---

# MASTER DESIGN PROMPT

## Project Overview

Redesign the landing page hero section for an AI Governance & EU AI Act consultancy.

This is **NOT** a cybersecurity website.

This is **NOT** a hacker website.

This is **NOT** a cyberpunk game.

The objective is to make visitors feel they are witnessing **the beginning of regulatory enforcement** across Europe.

The emotional journey should be:

> Curiosity → Authority → Urgency → Confidence

The animation must feel like an official European regulatory system coming online—not like someone hacking into a computer.

The entire introduction lasts **6 seconds**, then seamlessly transitions into the interactive landing page.

---

# Core Story

The website should begin as if a hidden European AI Compliance Network is booting for the very first time.

Visitors should feel like they are watching infrastructure powering on.

Nothing should feel cinematic or exaggerated.

Everything should feel engineered.

Precise.

Institutional.

Deliberate.

---

# Animation Timeline

## Phase 1 — Cold Boot (0.0–0.8s)

Entire screen is black.

Background:

```
#050505
```

No navigation.

No hero.

No buttons.

A tiny blinking cursor appears.

```
█
```

After 300ms

Type

```
INITIALIZING...
```

using realistic terminal typing.

Very slight CRT bloom.

Tiny phosphor glow.

No glitches.

No distortion.

No dramatic sound.

Only a subtle monitor startup ambience.

---

## Phase 2 — Regulatory System Boot (0.8–1.8s)

Terminal begins typing.

```
EU AI ACT

REGULATION (EU) 2024/1689
```

Pause.

Then

```
CONNECTING TO MEMBER STATES...
```

Immediately below

Random system packets begin streaming.

Example

```
AUTH...
VERIFY...
NODE 01
NODE 08
NODE 15
```

Binary fragments

```
01001011
00101101
10101001
```

Packet bars

```
███████
```

Everything scrolls naturally.

Nothing should appear randomly.

Every animation has intention.

---

## Phase 3 — Europe Emerges (1.8–3.2s)

Random ASCII characters slowly begin organizing.

Characters used

```
.
+
#
░
▒
█
```

Initially

They appear meaningless.

Gradually

The viewer starts recognizing

The outline of Europe.

Not a detailed political map.

A simplified recognizable European continent.

Entire map rendered using ASCII.

Apply CRT dithering.

Very soft phosphor bloom.

Extremely subtle scanlines.

No heavy distortion.

No flickering every frame.

---

## Phase 4 — Enforcement Network (3.2–4.5s)

Individual countries begin activating.

Small pulses travel between nodes.

Countries illuminate one after another.

Example terminal output

```
DE ✔

FR ✔

NL ✔

IT ✔

SE ✔

ES ✔
```

Connection lines slowly animate.

Network topology becomes visible.

Looks like European digital infrastructure.

NOT hacking.

NOT military.

NOT cyber warfare.

Think

European Commission

Digital Governance

Compliance Infrastructure

---

## Phase 5 — Enforcement Activated (4.5–5.5s)

Terminal prints

```
STATUS

██████████████████

100%
```

Pause

Then

```
ENFORCEMENT ACTIVE
```

Pause

Then

```
AI SYSTEMS NOW SUBJECT TO REGULATION
```

Everything pauses for around 300ms.

Allow the user to absorb the message.

---

## Phase 6 — Brand Reveal (5.5–6.0s)

The Europe map begins dissolving.

ASCII characters detach.

Thousands of particles float upward.

Characters reorganize.

Those same characters construct the hero typography.

No fade.

No scaling.

No zoom.

Only reconstruction.

The website transforms from

Terminal

↓

Premium Consultancy

---

# Final Hero

Headline

```
EU AI ACT

ENFORCEMENT

HAS BEGUN.
```

The transformation should feel like the compliance network itself has become the headline.

Navigation fades down.

CTA slides upward.

Background grid fades into view.

Website becomes fully interactive.

---

# Background

Replace the current static grid with a living infrastructure grid.

Inspired by

European digital networks

Data routing

Regulatory architecture

Topology maps

Very slow movement.

Almost invisible.

No distracting animations.

Users should notice movement only after several seconds.

---

# Motion Language

Everything must feel engineered.

Avoid

• Bounce

• Elastic

• Overshoot

• Cartoon easing

Preferred easing

```
easeOutExpo

easeInOutSine

linear
```

Camera never shakes.

No fake glitches.

No Hollywood effects.

---

# Typography

## Intro

Font

IBM Plex Mono

Fallback

JetBrains Mono

Uppercase only.

Letter spacing

0.16em

Weight

600

Color

```
#9BEF74
```

Glow

Very subtle.

Looks like phosphor.

---

## Hero Heading

Font

Bebas Neue

Weight

Regular

Desktop

110px

Tablet

84px

Mobile

56px

Color

```
#F4F4F4
```

No glow.

Very crisp.

Professional.

---

Accent

```
HAS BEGUN.
```

Color

```
#9BEF74
```

Tiny glow only.

---

Body Copy

Font

Inter

Weight

400

Color

```
#D6D6D6
```

Highlighted keywords

```
#9BEF74
```

---

Buttons

IBM Plex Mono

Uppercase

Weight

600

Background

```
#0C8A63
```

Hover

```
#13A574
```

---

# Color Palette

Background

```
#050505
```

Primary White

```
#F4F4F4
```

CRT Green

```
#9BEF74
```

Muted Gray

```
#8C8C8C
```

Body Text

```
#D6D6D6
```

Amber (rare usage only)

```
#FFC857
```

Never use blue.

Never use purple.

Never use neon cyan.

---

# Visual Style

Mix these inspirations

• CRT terminal

• Government operating system

• Official EU infrastructure

• IBM mainframe

• Modern minimalism

Avoid

• Hacker aesthetic

• Matrix rain

• Anonymous masks

• Red warning screens

• Excessive glitch effects

• Gaming UI

---

# Performance Requirements

Desktop and Mobile must feel equally polished.

Target

60 FPS.

No layout shifts.

Animation should never block interaction after completion.

Use

• GSAP timeline

• SVG for Europe map

• Canvas for ASCII reconstruction

• CSS transforms only

• requestAnimationFrame

Avoid

Three.js unless absolutely necessary.

Respect

```
prefers-reduced-motion
```

If enabled

Skip intro entirely.

Load hero immediately.

---

# Accessibility

Maintain WCAG AA contrast.

Keyboard navigation available immediately after intro.

Allow users to skip intro by pressing

```
Esc

or

Skip Intro
```

Remember preference during the session.

---

# Final Emotional Impression

When visitors finish the 6-second sequence, they should feel:

> "The era of AI regulation is no longer theoretical. Enforcement is here, and this company is prepared for it."

The hero should communicate **authority, precision, trust, and urgency**—not fear or spectacle. It should position the company as a guide through a new regulatory landscape rather than as a cybersecurity firm. If executed well, the intro won't just look impressive; it will reinforce your brand's core message before the visitor reads a single paragraph.
