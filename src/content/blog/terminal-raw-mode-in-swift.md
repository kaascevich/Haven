---
author: Kaleb A. Ascevich
pubDatetime: 2024-09-24T20:46:00.000-04
title: Terminal raw mode in Swift
tags:
  - swift
  - snippets
# draft: true
description: "When the standard library just doesn't quite cut it"
---

The Swift standard library, while quite minimal on its own, typically does its job and does it very very well. But sometimes, there's just something you need to do that the standard library can't. I ran into this some months ago while I was working on [BrainflipKit](https://github.com/kaascevich/BrainflipKit) -- I needed a way to switch the terminal to raw mode so that programs could recieve input without the terminal line-buffering it.

This sort of thing is why Swift has C interop built right in!

Granted, it's... not the most elegant thing out there, what with the bit manipulation and `withUnsafePointer(to:_:)` and C's incomprehensible identifiers. But I think that's kinda sorta the idea -- Swift makes _damn sure_ you don't shoot yourself in the foot with much of anything, but if dropping down to C was super easy, it wouldn't make much of a difference.

> **⚠️ Warning:** This code is (probably) _not_ concurrency-safe. The 6.0 compiler doesn't seem to have any issues with it, but it has to make the assumption that the code we're calling is itself concurrency-safe. With native Swift code, this is a perfectly reasonable assumption to make; but we're messing with C here, so assumptions are generally a bad idea.
>
> tl;dr: Don't use this directly in anything particularly serious without modifications.

```swift
import Darwin.C // `Glibc` on Linux
import class Foundation.FileHandle

/// The standard input file descriptor.
private let standardInput = FileHandle.standardInput.fileDescriptor

/// Encapsulates the process of enabling and disabling raw mode
/// for a terminal.
enum TerminalRawMode {
  /// Returns a `termios` struct representing the current
  /// state of the terminal.
  /// 
  /// - Returns: A `termios` struct representing the current
  ///   state of the terminal.
  private static func getTerminalState() -> termios {
    var currentTerminalState = termios()
    _ = tcgetattr(standardInput, &currentTerminalState)
    return currentTerminalState
  }

  /// Sets the terminal state to the given `termios` struct.
  /// 
  /// - Parameter state: A `termios` struct to set the terminal
  ///   state to.
  private static func setTerminalState(_ state: termios) {
    withUnsafePointer(to: state) {
      _ = tcsetattr(standardInput, TCSAFLUSH, $0)
    }
  }

  /// The original state of the terminal.
  private static let originalTerminalState = getTerminalState()
  
  /// Enables raw mode.
  ///
  /// - Parameter enableEcho: Whether to echo characters as they 
  ///   are typed.
  static func enable(echoing enableEcho: Bool) {
    var rawTerminalState = self.originalTerminalState
    
    // enable raw mode by disabling line buffering
    rawTerminalState.c_lflag &= ~UInt(ICANON)
    
    if !enableEcho {
      // disable echoing
      rawTerminalState.c_lflag &= ~UInt(ECHO)
    }
    
    // apply the new settings
    setTerminalState(rawTerminalState)
  }
  
  /// Disables raw mode.
  static func disable() {
    setTerminalState(self.originalTerminalState)
  }
}
```

And here's how you should use it:

```swift
func rawInput() {
  TerminalRawMode.enable(echoing: true)
  defer { TerminalRawMode.disable() }

  // ...
}
```

> **❗️ Important:** Don't forget to run `TerminalRawMode.disable()` at some point before your app exits -- if you forget to do this, your user's terminal will be all kinds of messed up.
