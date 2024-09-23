---
pubDatetime: 2024-09-23T14:43:15.000
title: MacBookAir6,1 (part 1)
tags:
  - linux
  - nixos
  - mac
draft: true
description: Putting far too much effort into an obsolete MacBook
---

One day a few months ago, I ran into this glorious little thing known as [NixOS](https://nixos.org). Being a Swift developer who's favorite-ish word is "declarative", I naturally wanted to give this a shot. But, of course, I can't just summon a perfectly-configured NixOS machine out of thin air (as nice as that would be). So I had to choose a device to be the victim of my experimentation.

I own a total of 3 laptops and one desktop:
- a 13" M1 MacBook Air, which serves as my more-than-capable daily driver
- an ASUS Zenbook something-or-other that does everything else
- an 11" early-2014 MacBook Air, which doesn't really serve any useful purpose[^1]
- an iMac G4 that's 3 years older than me

Obviously, the 20-year-old iMac is not a contender. My M1 MacBook, by the virture of being an M1 MacBook, is also off the table. The Zenbook has historically served as my all-around plaything, but I had just reinstalled Windows and spent far too much time getting it to a usable state, so I wasn't gonna be touching that for a while.

So, my brain went: "Hey, I have that old Intel MacBook lying around. Why don't I try NixOS on that?"

That was... absolutely not a mistake, but still a bit of a pain.

## Why, Fi?

Marginally surprisingly (or unsurprisingly, depending on how you look at it), Linux on non-T2 Intel Macs actually has a fair bit of support. I flashed an SD card[^2] with a GNOME NixOS image from the Zenbook, and the MacBook booted it just fine.

It was when I started exploring the live ISO when I realized that no, the MacBook had _not_ booted it just fine, it had booted it _mostly_ fine. Trying to connect to the network results in literally nothing, because there's nothing to connect to the network with:

<!-- TODO: insert screenshot here -->

Checking from the terminal reveals that the Wi-Fi adapter just... doesn't exist:

```console
$ ip link

```

I found this to be rather puzzling. After a whole bunch of internet-ing, though, the problem turned out to be rather simple: the official NixOS ISOs don't include the `broadcom-sta` driver, which is the only one that supports the BCM4360 Wi-Fi card in my particular MacBook. The reason for this omission? Licensing.

Who would've guessed.

At least it's a relatively simple fix. I created a file called `iso.nix` and pasted in something like this:

```nix
{ config, pkgs, ... }: {
  imports = [
    <nixpkgs/nixos/modules/installer/cd-dvd/installation-cd-graphical-gnome.nix>
    <nixpkgs/nixos/modules/installer/cd-dvd/channel.nix>
  ];

  nixpkgs.config.allowUnfree = true;
  boot = {
    kernelModules = [ "wl" ];
    extraModulePackages = [ config.boot.kernelPackages.broadcom_sta ];
    blacklistedKernelModules = [ "b43" "bcma" ];
  };
}
```

Then (with an existing Nix install, of course) I ran this:

```console
$ sudo nix-build "<nixpkgs/nixos>" -A config.system.build.isoImage -I nixos-config=iso.nix
Password:

...blah blah blah, fans turn on at full blast for 15 minutes, et cetera...

$ ls ./result/iso
nixos-21.11.333823.96b4157790f-x86_64-linux.iso
```

Reflash the SD card with this new image, boot it, and...

```console
$ ip link

```

Nope, that ain't it.

### `wpa_supplican't`

Long story short: `wpa_supplicant` is the thing NixOS uses by default to manage Wi-Fi connections. Apparently, it sucks. (At least, for me, it does.)

`iwd` worked a whole lot better for me, and was also a whole lot easier to use from the command line. So, I added this to my `iso.nix`:

```nix
{ config, pkgs, ... }: {
  # ...

  networking = {
    wireless = {
      enable = false;
      iwd.enable = true;
    };
    networkmanager.wifi.backend = "iwd";
  };
}
```

Yet another reflash, yet another reboot, and oh would you look at that, it actually works this time!

```console
$ ip link

```

Now that the live ISO is actually functional (well, save for the camera, but who the hell actually cares about the camera in a 10-year-old MacBook Air), we can use it for its intended purpose in the next part. Somewhat.

----------

[^1]: FYI: it still doesn't. None of this madness actually serves a practical purpose. I just get bored sometimes.
[^2]: Owning a lot of Nintendo consoles results in you having a lot of SD cards lying around.
