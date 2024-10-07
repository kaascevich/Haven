---
published: 2024-10-01T18:04:36-05:00
title: The apocalypse laptop (part 1)
tags:
  - mac
  - linux
description: I might have just found an actual use for that MacBook
---

> FYI: I'm putting the NixOS project on hold. I don't know for how long. Possibly indefinitely. We'll see.

If you live in the US (like me), you probably know that the results of the upcoming presidential election (as well as other factors, presumably) will likely make or break this country -- and right now, it seems to me that both candidates will break instead of make. With tensions all over this godforsaken planet that I won't delve into because I'm not even remotely qualified for it, [r/prepping] is seeming like a place more and more people will discover in the coming years/months/weeks/days/attoseconds.

Now, what the hell do American political tensions and a random subreddit have to do with a 10-year-old MacBook Air?

Well, under the assumption that I can find a decently cheap 512+ GB SSD and stuff it in the laptop (and probably get the battery replaced if at all possible, because it's also 10 years old and only holds, like, 2 hours of charge on idle), my [Early 2014 1.4GHz 4GB RAM Core i5 11" MacBook Air][MacBook Air] would actually serve as a solid offline digital library, so that if shenanigans do end up hitting the fan and the internet evaporates, melts, or otherwise becomes inaccessible, I'll still have _some_ way to avoid dying in this horror story[^1] of a world.

That was a long run-on sentence, so let's make it actually meaningful, shall we?

[r/prepping]: https://reddit.com/r/prepping
[MacBook Air]: https://everymac.com/systems/apple/macbook-air/specs/macbook-air-core-i5-1.4-11-early-2014-specs.html

## Step 1: choosing an OS

Of course, I _could_ just (re)install macOS onto the Mac like God intended and call it a day. But there are a couple issues with this:
- The last version of macOS that will run on this thing without [OpenCore patching] is 11.7.10 Big Sur. For context, macOS 15 Sequoia launched less than a month ago.
- In the apocalypse, no major corporation can be trusted -- that's just common sense. Unfortunately, even Apple counts as a major corporation.
- I just wanna have fun with Linux, okay?

After a quick [Ecosia](https://ecosia.org)[^2] search, Debian seems like a pretty solid choice to tick all these boxes:
- Debian supports most of the hardware in the laptop out-of-the-box. (Unfortunately, the Wi-Fi module is not in that list. But I have a solution for that.)
- It's more like a federation than a corporation.
- It's Linux.

It's also exceedingly stable, which is probably the #1 reason I chose it.

[OpenCore patching]: https://dortania.github.io/OpenCore-Legacy-Patcher/

## Step 2: doing the instally thing

The [live GNOME ISO] was easy enough to flash to an SD card. I stuck it in an adapter, stuck that into the MacBook, and stuck my finger onto the option key to load the boot picker.

> For some odd reason, the boot picker shows _two_ bootable external disks instead of just the one. I don't think it matters in the end what you pick, because they both seem to boot fine.

When booting the card, I chose "Start installer" instead of "Live system", because the latter left me with a broken install for some reason. I went through the installer like normal, making sure to skip networking setup since there's no Wi-Fi drivers in the installer.[^3] Since it was a GNOME live image, the installer automatically installed GNOME without needing a network connection, which was rather convenient.

Once installed, it boots on the MacBook without any trouble. But there's still no Wi-Fi -- let's fix that.

### We need the internet to download the internet

I don't remember where I got it from, but I found a copy of the needed Wi-Fi driver somewhere on the internet, which you can download [here](/public/assets/other/broadcom-sta-dkms_6.30.223.271-23_all.deb). I copied it to another spare SD card and mounted it on the newly-Debianized MacBook, opened a terminal and ran this:

```console
$ cd /media/username/diskname # replace username and diskname as needed
$ sudo dpkg -i broadcom-sta-dkms_6.30.223.271-23_all.deb
sudo: password for username: 
Unpacking broadcom-sta-dkms (6.30.223.271-23) over (6.30.223.271-23) ...
Setting up broadcom-sta-dkms (6.30.223.271-23) ...
Loading new broadcom-sta-dkms-6.30.223.271 DKMS files...
Building for 6.1.0-25-amd64
Building initial module for 6.1.0-25-amd64
Done.

wl.ko:
Running module version sanity check.
 - Original module
   - No original module exists within this kernel
 - Installation
   - Installing to /lib/modules/6.1.0-25-amd64/updates/dkms/
depmod...
```

One reboot later (why `reboot` or `shutdown` don't exist, I don't know):

```console
$ systemctl reboot
```

And just like that, Wi-Fi is up and running!

The only piece of hardware that doesn't work at all on Linux is the FaceTime camera, but since this is a laptop for the apocalypse, that's probably a good thing.

In [the next part](/posts/the-apocalypse-laptop-part-2), I'll work on actually turning this thing into an excellent offline library (to the furthest extent I can with only ~115GB to work with).

[live GNOME ISO]: https://cdimage.debian.org/debian-cd/current-live/amd64/iso-hybrid/debian-live-12.7.0-amd64-gnome.iso

------

[^1]: I don't _like_ horror stories.
[^2]: I'd rather use [Startpage](https://startpage.com), but Ecosia is what Safari's search engine picker gives me, so Ecosia it is.
[^3]: Or trackpad drivers. The trackpad worked fine after installing, so I don't know what's up with that.
