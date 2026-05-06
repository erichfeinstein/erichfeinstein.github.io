---
title: "pop!_os, two months in"
date: "2026-04-19"
slug: "pop-os-two-months-in"
excerpt: "i tried pop!_os for a weekend. two months later it's my daily driver."
tags: ["linux", "claude", "dev-setup"]
---

Two months ago I installed Pop!_OS as a weekend project. The plan was simple: partition one drive, choose a distro, and most importantly install an LLM assistant like Claude Code, just to see how it could help navigate the Linux landscape as a total noobie.

---

I could not have anticipated just how much of a game changer that last part was.

---

Suddenly, Linux stopped being a knowledge moat full of forum archaeology and wiki deep-dives. It became a conversation. I'd ask a question — about a package, a service, a thing I didn't even have a name for — and get a straight answer tailored to my setup. Having an AI that understands *your* particular machine and can explain things in plain English doesn't just flatten the learning curve. It collapses it.

---

This is the story of what happens when you pair the freedom of Linux with an assistant that actually knows your system.

## the setup

- Pop!_OS on the daily drive
- Windows on a second physical drive for a handful of games with Linux-hostile anti-cheat. Boot selection is just BIOS pick-a-drive.
- Terminal + Brave + VSCode + Discord + Steam as my typical daily software
- Claude Code via nvm/npm

## why I left

It wasn't one thing. Years of updates layered over relics of Windows past that I remember from childhood, still unchanged, still there. UX choices with no off switch. A secure-boot configuration on my machine that Windows 10 refused to accept, so the upgrade to 11 was never an option.

---

Given what 11 has been up to — calculator bugs trending on social media, the Artemis II astronaut getting locked out of his Outlook account from orbit — I wasn't exactly fighting to fix it.

## gaming

Where I expected pain, I got almost none. Valve's contributions in this space cannot be overstated. Proton handles Steam on Linux well enough that most of my library runs fine, and a few games actually perform a little better than they did on Windows. Gaming on emulators is seemless, and even niche fan-mods I've messed around with (OpenGOAL, Archipelago.gg) has even been made easier to install and maintain with the help of an LLM.

---

The holdouts are the anti-cheat-gated ones, and the excuses for not supporting Linux on their end are wearing thin. For those few, I reboot into Windows. No drama.

## side quests 

---

Two things are still front of mind:

---

1. **Discord screenshare on the Flatpak build** — getting audio to capture during screenshare involves PipeWire which is its own story, and auto-updates come with their own Flatpak-sandbox wrinkles.
2. **Wayland vs X11** — I'm still figuring out which session to run, what breaks where, and how to get my apps to behave with each other juuuust the way I want. Custom keybinds, audio routing for music production... it's a rabbit hole for another day.

## claude as an OS assistant

This is the real crux of the story. Claude Code, or really any CLI assistant can be your Control Panel, your System Preferences, your key to unlocking what a "personal" computer was really supposed to be all along. Linux has always been powerful but rough at the onboarding edges. The answers have always existed — they were just scattered across wikis, reddit threads from 2016, and Stack Overflow posts. Having an LLM aware of my specific setup read all of that and parse it in plain, tailored English has enabled me to feel what we all want to feel with our devices: it just works. Not every tech company can earnestly say that about their products these days, and its an open secret.

---

The experience is closer to using an OS with a built-in expert than to using Linux in the 2010s sense. Think Clippy from the XP days, but he's gone Super Saiyan. And as models become more memory-efficient with performant, lower param models being able to be run on any gaming PC with a decent enough graphics card, you could even see this being the norm; an LLM running on your device that tailors the experience to exactly your wants and needs. No cloud. No subscription required.

## next up

- Settling Wayland vs X11 for good (hopefully)
- Swapping terminals
- Exploring open source Linux plugins and tweaks to contribute to

---

If you've ever considered switching but hesistated out of fear of the learning curve, the curve is smaller now. And if you were capable of installing a Minecraft mod circa 2012, then this is something you're more than capable of today.
