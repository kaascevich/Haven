---
layout: ../layouts/AboutLayout.astro
title: "about me"
---

![Me! But not quite.](/src/assets/images/me.png "Me! But not quite.")

いらっしゃいませ to my little online home!

I'm Kaleb Ascevich, another random person on the internet doing internet things. I love [Swift] programming, especially for Mac apps. I'm also dabbling in [Rust], [NixOS], [GarageBand], and Japanese (because those things clearly belong in the same sentence).

Here's some basic information about me:

```swift
import Foundation

struct Me: Person {
  let name = Name("Kaleb A. Ascevich", pronunciation: "KAY-lub AICE-uh-vitch")
  let pronouns = ("he", "him", "his")
  let birthday: Date = DateComponents(
    calendar: .current,
    year: 2007, month: 11, day: 9
  ).date!

  var devices: [_: (any Device, OS)] = [
    "Kaleb's MacBook": (Mac(.macbookAir, 10, 1), .macOS),
    "macbookair61": (Mac(.macbookAir, 6, 1), .linux("NixOS"))
  ]
  var langs: [Lang] = [.swift, .rust]
  let shell = Shell.nushell

  var apps: [_: [App]] = [
    "ide": ["Xcode", "VSCodium"],
    "term": ["iTerm2"],
  ]
}

extension Me {
  var age: Int {
    Calendar.current.components(
      [.year], from: birthday, to: .now
    ).year!
  }
}
```

> Oh, and in case anyone was curious, [JavaScript is bad](http://destroyallsoftware.com/talks/wat). Especially from the perspective of a Swift developer (or, well, any developer who uses a language that's even _remotely_ type-safe).

[Swift]: https://swift.org
[Rust]: https://rust-lang.org
[NixOS]: https://nixos.org
[GarageBand]: https://apple.com/mac/garageband/
