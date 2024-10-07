---
published: 2024-10-05T08:09:20.000
title: The apocalypse laptop (part 2)
tags:
  - mac
  - linux
description: I like 🥝
---

In this blog post, I'll take the Debian install we made in the last post and turn it into something actually useful for the apocalypse.

## Too much stuff

So, we have a functional Debian install with a GNOME desktop, and Wi-Fi is working correctly. But there's a _lot_ of extra stuff in this GNOME install that I don't want. Rather than remove it all by hand, I'm gonna take the nuclear route and uninstall GNOME entirely, then reinstall a less bloated version.

Making sure to log out of any running GNOME sessions, I hit Control-Option-FN-F2 (Ctrl+Alt+F2 for the PC people out there) to switch to a TTY, log in on that TTY, then run this:

```console
$ sudo apt-get purge *gnome* *libreoffice* *firefox* *thunderbird* *mozc* *mlterm*
[sudo] password for kaleb: 
```

A few minutes later, and (almost) everything relating to GNOME has been wiped from the machine.

Now time to install `gnome-core`:

```console
$ sudo apt-get install gnome-core
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
E: Unable to locate package gnome-core
```

Well frick.

After scouring the internet, though, the solution appears to be pretty simple. I opened `/etc/apt/sources.list` in `nano`:

```console
$ sudo nano /etc/apt/sources.list
```

I replaced the file contents with this:

```text
deb http://deb.debian.org/debian bookworm non-free-firmware contrib main
deb-src http://deb.debian.org/debian bookworm non-free-firmware contrib main

deb http://security.debian.org/debian-security bookworm-security non-free-firmware contrib main
deb-src http://security.debian.org/debian-security bookworm-security non-free-firmware contrib main
```

Then I ran `apt update`:

```console
$ sudo apt update
Get:1 http://deb.debian.org/debian bookworm InRelease [151 kB]
Get:2 http://security.debian.org/debian-security bookworm-security InRelease [48.0 kB]
Get:3 http://security.debian.org/debian-security bookworm-security/non-free-firmware Sources [796 B]
...
Get:27 http://deb.debian.org/debian bookworm/main amd64 DEP-11 Metadata [4,492  kB]
Get:28 http://deb.debian.org/debian bookworm/main DEP-11 48x48 Icons [3,595 kB]
Get:29 http://deb.debian.org/debian bookworm/main DEP-11 64x64 Icons [7,295 kB]
Fetched 40.8 MB in 5s (8,099 kB/s)
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
225 packages can be upgraded. Run 'apt list --upgradable' to see them.
```

Alright, now we should be able to reinstall GNOME.

```console
$ sudo apt-get install gnome-core
```

Finally, get rid of the remaining unnecessary packages, upgrade everything else, and reboot:

```console
$ sudo apt-get autoremove
$ sudo apt upgrade
$ sudo systemctl reboot
```

## Okay, can I have a kiwi now?

Now we can finally set up [Kiwix](https://kiwix.org), which is what I'll use to manage my offline library. It's simple enough to install:

```console
$ sudo apt install kiwix
```
