---
published: 2024-09-27T18:45:03-05:00
title: MacBookAir6,1 (part 1)
tags:
  - linux
  - nixos
  - mac
description: Putting far too much effort into an obsolete MacBook
---

One day a few months ago, I ran into this glorious little thing known as [NixOS](https://nixos.org). Being a Swift developer whose favorite-ish word is "declarative", I naturally wanted to give this a shot. But, of course, I can't just summon a perfectly-configured NixOS machine out of thin air (as nice as that would be). So I had to choose a device to be the victim of my experimentation.

I own a total of 3 laptops and one desktop:
- a 13" M1 MacBook Air, which serves as my more-than-capable daily driver
- an ASUS Zenbook something-or-other that does everything else
- an 11" early-2014 MacBook Air, which doesn't really serve any useful purpose[^1]
- an iMac G4 that's 3 years older than me

Obviously, the 20-year-old iMac is not a contender. My M1 MacBook, by virture of being an M1 MacBook, is also off the table. The Zenbook has historically served as my all-around plaything, but I had just reinstalled Windows and spent far too much time getting it to a usable state, so I wasn't gonna be touching that for a while.

So, my brain went: "Hey, I have that old Intel MacBook lying around. Why don't I try NixOS on that?"

That was... absolutely not a mistake, but still a bit of a pain.

## Why, Fi?

Marginally surprisingly (or unsurprisingly, depending on how you look at it), Linux on non-T2 Intel Macs actually has a fair bit of support. I flashed an SD card[^2] with a GNOME NixOS image from the Zenbook, and the MacBook booted it just fine.

It was when I started exploring the live ISO when I realized that no, the MacBook had _not_ booted it just fine, it had booted it _mostly_ fine. Trying to connect to the network results in literally nothing, because there's nothing to connect to the network with:[^3]

!["What's this Wi-Fi thing you keep rambling about?"](../../assets/images/no-wifi.png "A screenshot of the GNOME status menus, showing a complete lack of Wi-Fi options.")

Checking from the terminal reveals that the Wi-Fi adapter just... doesn't exist:

```console
$ ip link
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
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
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UNKNOWN mode DORMANT group default qlen 1000
    link/ether 34:36:3b:5f:e0:2a brd ff:ff:ff:ff:ff:ff
```

Eyy, we're getting somewhere!

Nothing seems to appear in the Wi-Fi networks list, though... that's weird.

### `wpa_supplican't`

So, long story short[^4]: `wpa_supplicant` is the thing NixOS uses by default to manage Wi-Fi connections. Apparently, it sucks. (At least, for me, it does.)

`iwd` worked a whole lot better for me, and was also a whole lot easier to use from the command line. The primary downside is that you can't specify connections declaratively in your configuration, but since this is an inherently portable device, it's easier to just connect to networks on-the-fly with `iwctl` or the GUI like you would on macOS.

So, I added this to my `iso.nix`:

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

Yet another reflash, yet another reboot, and a brief sanity check:

```console
$ ip link
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UNKNOWN mode DORMANT group default qlen 1000
    link/ether 34:36:3b:5f:e0:2a brd ff:ff:ff:ff:ff:ff
```

Good, I didn't fry anything.

Now for the ultimate test:

```console
$ iwctl
NetworkConfigurationEnabled: disabled
StateDirectory: /var/lib/iwd
Version: 2.19
[iwd]# station eth0 scan
[iwd]# station eth0 get-networks
                               Available Networks
--------------------------------------------------------------------------------
      Network Name                      Security            Signal
--------------------------------------------------------------------------------
      da house 5                        psk                 ****
      da house 5 Game                   psk                 ****
      da house 2.4                      psk                 ****

[iwd]# station eth0 connect "da house 5"
Type the network passphrase for da house 5 psk.
Passphrase: **********************
[iwd]# exit

[iwd]#
```

And finally, a good ol' `ping`:

```console
$ ping -c 2 example.com
PING example.com (93.184.215.14) 56(84) bytes of data.
64 bytes from 93.184.215.14: icmp_seq=1 ttl=53 time=24.8 ms
64 bytes from 93.184.215.14: icmp_seq=2 ttl=53 time=28.9 ms

--- example.com ping statistics ---
2 packets transmitted, 2 recieved, 0% packet loss, time 1002ms
rtt min/avg/max/mdev - 24.785/26.845/28.905/2.060 ms
```

Now that the live ISO is actually functional (well, save for the camera, but who the hell actually cares about the camera in a 10-year-old MacBook Air), we can use it for its intended purpose in [the next part](/posts/macbookair61-part-2). Somewhat.

----------

[^1]: FYI: it still doesn't. None of this madness actually serves a practical purpose. I just get bored sometimes.
[^2]: Owning a lot of Nintendo consoles results in you having a lot of SD cards lying around.
[^3]: In case you were curious: yes, I did try Bluetooth tethering at some point. Here's what I learned from it: don't try Bluetooth tethering if you don't have an unlimited hotspot plan and a heck of a lot of time to gruesomely murder.
[^4]: Because I don't exactly remember the long story. This was a while ago.
