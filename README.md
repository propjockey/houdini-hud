[![JaneOri](https://img.shields.io/badge/JaneOri%20%F0%9F%91%BD-I%20made%20a%20thing!-blueviolet.svg?labelColor=222222)](https://twitter.com/Jane0ri)

# houdini-hud
`augmented-ui` implemented in Houdini with hopes of future enhancements to the houdini paint api

`houdini-hud` is namespaced (all variables begin with `--hud-`) to maximize compatibility with all other libraries (tailwind, open-props, bootstrap, etc).

Projects already using augmented-ui can also use houdini-hud if needed/wanted.

[GitHub](https://github.com/propjockey/houdini-hud)

[NPM](https://www.npmjs.com/package/houdini-hud)

[Interactive Documentation (WIP)](https://houdini-hud.com)

## Documentation

`npm install houdini-hud`

`import "./node_modules/houdini-hud/index.js"`

or use it directly from your favorite CDN:

`<script src="https://unpkg.com/houdini-hud@0.0.1/index.js"></script>`

then add it to any element (except on or inside `a` tags)

`<div data-houdini-hud="both">My augmented element</div>`

and take a look at the ~150 CSS properties avaialbe to shape it however you want:

[Interactive Documentation (WIP)](https://houdini-hud.com)

`div { --hud-tl1: clip; --hud-tl1-size: 1rem; }`

## Planned Breaking Changes

* Almost all of the custom properties are currently `inherit: true`. When we can register `<image>` syntax and pass parameters to the paint worklet without flags, they will no longer need to inherit; Almost all will be set to `inherit: false`. (do not rely on `--hud-` vars being inherited to non- `data-houdini-hud` elements)

## NYI Features:

- [ ] augmented-ui's delegated border and inlay features (easy)
- [ ] length-percentage mixed calcs like `calc(100% - 30em)` aren't resolvable in Houdini/CSSOM natively yet (moderate)
- [ ] independent inlay and border top/left/right/bottom sizes (very difficult, have to manually implement stroke (again))
- [ ] Curved HUD-like bend and placement within (impossible to do well without some of the Wish-List items below)
- [ ] Static/Glitch effect (impossible with just houdini currently, though an svg displacement filter can do this very well...)

When `houdini-hud` reaches 90%+ of global users based on browsers implementing all the needed features (and [Safari fixes the old iacvt bug](https://github.com/w3c/csswg-drafts/pull/6006)), the next major version of `augmented-ui` (at that time) will be a copy of `houdini-hud` with variables prefixed with `--aug-` again.

This convergence isn't expected for several years, though `houdini-hud` as it is now works and is fully documented if you wish to use it today ~

# Houdini Paint Worklet Wish-List

- [ ] Direct px manipulation of paint ctx (px shaders!)
- [ ] paint ctx.createImageData()
- [ ] Register and use as input "&lt;image&gt;" syntax (and be able to manipulate the px imageData)
- [ ] paint() parameters without flags
- [x] [allow Houdini to read css vars when paint()ing the body tag](https://bugs.chromium.org/p/chromium/issues/detail?id=1285639)
- [ ] allow Houdini on `a` tags and decendants of `a` tags
- [ ] Register compund syntaxes & Resolve to px value in CSSOM when it can "&lt;length&gt;|initial"
- [ ] Ability to register perecent properties with width|height|inline|block dimension-resolution hints
- [ ] That ^ so that CSSOM resolves `calc(100% - 20vw)`, etc
- [ ] OffscreenCanvas in paint worklet
- [ ] new Image() in paint worklet
- [ ] ability to register properties that inherit into the psuedo elements but not further into dom

`houdini-hud` won't be feature complete until I can do a glitch and 3D curved effect on the ctx (basically any form of px reading of the ctx imageData/bitmap).

Decided to release early anyway though (instead of waiting a second year) in hopes it will encourage continued development of houdini paint api! 💜

# houdini-hud vs augmented-ui

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
  - could have used css layers instead (might switch to this)
* data-augmented-ui-reset no longer needed to [avoid the old iacvt bug that's still in Safari](https://github.com/w3c/csswg-drafts/pull/6006)
  - (can safely nest hud elements directly without reset layer between)

lost features:

* Houdini doesn't work on `a` tags or anything inside of an `a` tag
* CSS.paintWorklet does not work on http (local or https only)
