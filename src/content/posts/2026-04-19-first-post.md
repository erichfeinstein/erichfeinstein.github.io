---
title: "i let claude redesign my website"
date: "2026-04-19"
slug: "claude-redesigned-my-website"
excerpt: "one conversation, a full redesign, and a lot of back-and-forth."
tags: ["claude", "react", "meta"]
---

This site got a full redesign. I didn't open a file. Claude did.

The old version was a CRA + MUI tab layout with a "hey" typewriter intro
and rainbow gradient tabs. It was fine. It wasn't mine.

## what's new

- a WebGL shader background that reacts to the cursor (violet/cyan noise field)
- a one-shot glitch-scramble intro that plays the first time you land
- a force-directed skill graph where nodes lean toward your mouse and hub skills read brighter
- a 3D-tilting holographic photo card (balatro-adjacent)
- a `/` command palette for keyboard people, visible nav for everyone else
- this blog, markdown files in `src/content/posts/`, loaded at build time

## how it actually went

I told Claude: "make my website sexy as fuck." That was the prompt.

What followed was a long conversation of multiple-choice questions —
aesthetic direction, font, accent, nav pattern, post format, card
anatomy, stat strips, whether to keep the confetti easter egg
(we didn't). Every decision was something I could answer in a word
or two. Claude did the wiring.

There was a lot of "meh, make it tighter" and "that looks broken on
my screen" and "kill the cringe labels." Plenty of iteration. Most
of the good calls were course-corrections mid-build, not upfront spec.

More to come.
