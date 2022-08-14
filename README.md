[![JaneOri](https://img.shields.io/badge/JaneOri%20%F0%9F%91%BD-I%20made%20a%20thing!-blueviolet.svg?labelColor=222222)](https://twitter.com/Jane0ri)

# houdini-hud
augmented-ui implemented in Houdini with hopes of future enhancements to the houdini paint api

## houdini-hud vs augmented-ui

new features:

* independent border
  - masking the element itself now optional
  - easier to use as a decoration and less dom for glowing border filters
  - impossible to backport unfortunately
* corner region insets added
  - super asymetric elements now possible (saw it in a sci-fi show, had to have it)
  - might backport to an augmented-ui v3
* extend props renamed to region inset 1/2
  - much easier to use (improved DX)
  - might backport to an augmented-ui v3
* :where() wrapped selectors 
  - might backport to an augmented-ui v3
  - so users can override default values with element-level selector specificity
  - (devs no longer forced to use class names in their CSS)
  - could have used layers instead (might switch to this)
* data-augmented-ui-reset no longer needed to [avoid the old ivacvt bug that's still in Safari](https://github.com/w3c/csswg-drafts/pull/6006)
  - (can safely nest hud elements directly without reset layer between)

nyi or lost features:

- [ ] delegated border and inlay features (easy)
- [ ] independent inlay and border top/left/right/bottom sizes (very difficult)

# Houdini Paint Worklet Wish-List

- [ ] Direct px manipulation of paint ctx (px shaders!)
- [ ] paint ctx.createImageData()
- [ ] Register and use as input "&lt;image&gt;" syntax (and be able to manipulate the px imageData)
- [ ] Register compund syntaxes & Resolve to px value in CSSOM when it can "&lt;length&gt;|initial"
- [ ] Ability to register perecent properties with width|height|inline|block dimension-resolution hints
- [ ] That ^ so that CSSOM resolves `calc(100% - 20vw)`, etc
- [ ] OffscreenCanvas in paint worklet
- [ ] new Image() in paint worklet

houdini-hud won't reach v1 until I can do a glitch and 3D curved effect on the ctx after (basically any form of px reading of the ctx imageData/bitmap).

Decided to release early anyway though (instead of waiting a second year) in hopes it will encourage continued development of houdini paint api! 💜
