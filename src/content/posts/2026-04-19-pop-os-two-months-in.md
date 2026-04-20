---
title: "pop!_os, two months in"
date: "2026-04-19"
slug: "pop-os-two-months-in"
excerpt: "i tried pop!_os for a weekend. two months later it's my daily driver."
tags: ["linux", "claude", "dev-setup"]
---

Two months ago I installed Pop!_OS to see what it was like. I figured I'd test it for a weekend, probably bounce off, and crawl back to Windows.

It's now my daily driver. The thing that changed the calculus was Claude Code running in a terminal alongside everything else. What used to be a weekend of wiki-crawling and forum archaeology to make Linux behave is now a conversation. Claude has become something like an operating system assistant — a second brain that understands my setup and can explain, diagnose, and fix things in plain English.

That's the post.

## the setup

- Pop!_OS on the daily drive
- Windows on a second physical drive for a handful of games with Linux-hostile anti-cheat. Boot selection is just BIOS pick-a-drive.
- Tilix + Brave + VSCode + Discord + Steam as the daily software
- Claude Code via nvm/npm — the most important app on the machine

## why I left

It wasn't one thing. Years of updates layered over relics I remember from childhood, still unchanged, still there. UX choices with no off switch. A secure-boot configuration on my machine that Windows 10 refused to accept, so the upgrade to 11 was never an option.

Given what 11 has been up to — calculator bugs that trended, a story about an Artemis II astronaut getting locked out of his Outlook account from orbit — I wasn't exactly fighting to fix it.

## gaming

Where I expected pain, I got almost none. Proton handles Steam on Linux well enough that most of my library runs fine, and a few games actually perform a little better than they did on Windows. The holdouts are the anti-cheat-gated ones, and for those I reboot into Windows. No drama.

## where the time actually went

Two things took real effort:

1. **Discord screenshare on the Flatpak build** — getting audio to capture during a share is its own story, and auto-updates come with their own Flatpak-sandbox wrinkles.
2. **Wayland vs X11** — I'm still figuring out which session to run, what breaks where, and how to get my apps to behave consistently across the two.

Neither would have stopped me. Both would have been weekend-eating side quests a few years ago.

## claude as an os assistant

This is the real argument. I'm not running Claude Code just to write code — I'm running it as a daily driver for the system itself. When a package behaves weirdly, I ask. When a service is failing, I ask. When I don't even know what to call the thing I'm looking for, I describe it.

Linux has always been powerful and always been spiky at the onboarding edges. The answers have always existed — they were just scattered across wikis, reddit threads from 2016, and forum posts quoting a stack trace nobody understands. Having an LLM aware of my specific setup read all of that and reply in plain English collapses the distance.

The experience is closer to using an OS with a built-in expert than to using Linux in the 2010s sense.

## next up

- Settling Wayland vs X11 for good
- Probably swapping Tilix — I rotate terminals

If you've considered switching and bounced off the learning curve, the curve is smaller now.
