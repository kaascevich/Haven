---
published: 2024-09-27T20:29:24-05:00
modified: 2024-09-30T07:35:05-05:00
title: MacBookAir6,1 (part 2)
tags:
  - linux
  - nixos
  - mac
description: 🪩 Disko time!
---

Here's the part of my `macbookair61` NixOS config that handles partitioning:

```nix
{ internalDisk, bootDisk }: {
  disko.devices.disk = {
    internal = {
      type = "disk";
      device = internalDisk;
      content = {
        type = "gpt";
        partitions.primary = {
          size = "100%";
          label = "primary";
          content = {
            type = "luks";
            name = "crypt";
            extraFormatArgs = [ "--header ${bootDisk}1" ];
            extraOpenArgs = [
              "--header ${bootDisk}1"
              "--allow-discards"
              "--perf-no_read_workqueue"
              "--perf-no_write_workqueue"
            ];
            content = {
              type = "btrfs";
              extraArgs = [ "-L" "root" "-f" ];
              subvolumes = let
                compress = "compress-force=zstd";
                noatime = "noatime";
              in {
                "/nix" = {
                  mountpoint = "/nix";
                  mountOptions = [ "subvol=nix" compress noatime ];
                };
                "/persist" = {
                  mountpoint = "/persist";
                  mountOptions = [ "subvol=persist" compress noatime ];
                };
                "/config" = {
                  mountpoint = "/config";
                  mountOptions = [ "subvol=config" compress noatime ];
                };
                "/swap" = {
                  mountpoint = "/swap";
                  swap.swapfile.size = "4G";
                };
              };
            };
          };
        };
      };
    };
    boot = {
      type = "disk";
      device = bootDisk;
      content = {
        type = "gpt";
        partitions = {
          header = {
            size = "32M";
            label = "header";
          };
          esp = {
            size = "100%";
            label = "boot";
            name = "esp";
            type = "ef00";
            content = {
              type = "filesystem";
              format = "vfat";
              mountpoint = "/boot";
              mountOptions = [ "defaults" ];
            };
          };
        };
      };
    };
  };

  fileSystems."/nix".neededForBoot = true;
  fileSystems."/persist".neededForBoot = true;
}
```

It's a bit of a doozy, to put it lightly, so I'll walk y'all through it step by step. But first, here's what I'm aiming for in general with this partitioning layout:
- Impermanence support
- Plausible deniability[^1]
- Working well on a really old MacBook

## Contents

<!-- TOC -->

## Internal disk

```nix
internal = {
  type = "disk";
  device = internalDisk;
  content = {
    type = "gpt";
    partitions.primary = {
      size = "100%";
      label = "primary";
      content = {
        # ...
      };
    };
  };
};
```

Simple enough. Declare a single partition taking up the whole disk.

### Primary partition

```nix
content = {
  type = "luks";
  name = "crypt";
  extraFormatArgs = [ "--header ${bootDisk}1" ];
  extraOpenArgs = [
    "--header ${bootDisk}1"
    "--allow-discards"
    "--perf-no_read_workqueue"
    "--perf-no_write_workqueue"
  ];
  content = {
    # ...
  };
};
```

The partition is a LUKS partition, which for the uninitiated is an encrypted partition containing an arbitrary filesystem.

To help with plausible deniability, we move the LUKS header (where all the metadata is) to a different physical disk (in this case, a 4GB SD card that I had lying around).

#### LUKS partition content

```nix
content = {
  type = "btrfs";
  extraArgs = [ "-L" "root" "-f" ];
  subvolumes = let
    compress = "compress-force=zstd";
    noatime = "noatime";
  in {
    "/" = {
      mountpoint = "/";
      mountOptions = [ "subvol=@" compress noatime ];
    };
    "/nix" = {
      mountpoint = "/nix";
      mountOptions = [ "subvol=@nix" compress noatime ];
    };
    "/persist" = {
      mountpoint = "/persist";
      mountOptions = [ "subvol=@persist" compress noatime ];
    };
    "/config" = {
      mountpoint = "/config";
      mountOptions = [ "subvol=@config" compress noatime ];
    };
    "/swap" = {
      mountpoint = "/swap";
      swap.swapfile.size = "4G";
    };
  };
};
```

We set up a `btrfs` filesystem on the LUKS partition and create several subvolumes.

- `/` is the root subvolume, which will be deleted and recreated on every reboot. This will enable us to set up [impermanence](https://github.com/nix-community/impermanence). You can find more details on the particular technique I'll use [here](https://mt-caret.github.io/blog/posts/2020-06-29-optin-state.html).
- `/nix` is where the Nix store is, well, stored.
- `/persist` is where miscellaneous data that should survive a reboot will be kept (such as network configurations and the user's Documents folder).
- `/config` is a dedicated subvolume for the NixOS configuration, simply to make my life easier.
- `/swap` is where we keep our swapfile -- 4 gigs in this case, since that's the amount of RAM in my MacBook.

To keep my measly 128 gigs of SSD space relatively clear, we pass `compress-force=zstd` as a mount option for all subvolumes (except for swap). We also pass `noatime` to save SSD writes.

## Boot disk

```nix
boot = {
  type = "disk";
  device = bootDisk;
  content = {
    type = "gpt";
    partitions = {
      header = {
        # ...
      };
      esp = {
        # ...
      };
    };
  };
};
```

Nothing too fancy here.

### Header partition

```nix
header = {
  size = "32M";
  label = "header";
};
```

We declare a tiny 32-meg partition for the LUKS header, which is _way_ more than enough. We don't need to bother with a filesystem, becuase the header will just get stored raw on the partition.

### EFI partition

```nix
esp = {
  size = "100%";
  label = "boot";
  name = "esp";
  type = "ef00";
  content = {
    type = "filesystem";
    format = "vfat";
    mountpoint = "/boot";
    mountOptions = [ "defaults" ];
  };
};
```

Even Apple's quite minimal EFI implementation is still an EFI implementation, and so we need an ESP to feed it. We declare that here, letting it take up the rest of the disk (which, remember, is only 4GB total). We don't do anything particularly fancy with it otherwise, just the bare minimum required for the MacBook to recognize it.

The reason the ESP is on a separate disk is for the plausible deniability I mentioned earlier -- no one can definitively prove that the internal SSD actually contains anything meaningful without access to the boot SD card.[^2]

------

So that's the disk partitioning squared away. In the next part, I think I'll give a brief overview of the rest of my config.[^3]

------

[^1]: I'll be honest, this is quite pointless -- why the hell would an ordinary human being lug around a 10-year-old MacBook Air that's been securely wiped and doesn't have an OS, and why would they also carry a 4GB SD card with them at all times? But this whole thing is more of a practical thought experiment than anything else, so I'll just push all the doubts aside. I'm never actually going to use this for anything important anyway.
[^2]: But they will most certainly suspect it.
[^3]: Don't hold your breath, it'll be a while -- I'm not even remotely finished with the config yet.
