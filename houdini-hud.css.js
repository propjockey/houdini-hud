if (typeof document !== "undefined" && !document.querySelector("link.houdini-hud-css")) {
  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.className = "houdini-hud-css"
  link.href = URL.createObjectURL(new Blob([`
    :where([data-houdini-hud]) {
      --hud-border: ; /* ::after */
      --hud-inlay: ; /* ::before */
      --hud-mask: ; /* el itself */
      --hud-__feature: mask;
      --hud-__mask: var(--hud-mask, paint(augmented-ui));
      -webkit-mask-image: var(--hud-__mask);
      mask-image: var(--hud-__mask);
      position: relative;
      isolation: isolate;
      /* Houdini needs one or two API additions before we can turn off inheritance and remove these: */
      --hud-tl-inset: initial;
      --hud-tr-inset: initial;
      --hud-br-inset: initial;
      --hud-bl-inset: initial;
      --hud-tl-inset-x: initial;
      --hud-tr-inset-x: initial;
      --hud-br-inset-x: initial;
      --hud-bl-inset-x: initial;
      --hud-tl-inset-y: initial;
      --hud-tr-inset-y: initial;
      --hud-br-inset-y: initial;
      --hud-bl-inset-y: initial;
      --hud-t-center: initial;
      --hud-r-center: initial;
      --hud-b-center: initial;
      --hud-l-center: initial;
      --hud-t-offset: initial;
      --hud-r-offset: initial;
      --hud-b-offset: initial;
      --hud-l-offset: initial;
      --hud-tl1: initial;
      --hud-tl2: initial;
      --hud-tr1: initial;
      --hud-tr2: initial;
      --hud-br1: initial;
      --hud-br2: initial;
      --hud-bl1: initial;
      --hud-bl2: initial;
      --hud-t1: initial;
      --hud-t2: initial;
      --hud-r1: initial;
      --hud-r2: initial;
      --hud-b1: initial;
      --hud-b2: initial;
      --hud-l1: initial;
      --hud-l2: initial;
      --hud-tl1-size: initial;
      --hud-tl2-size: initial;
      --hud-tr1-size: initial;
      --hud-tr2-size: initial;
      --hud-br1-size: initial;
      --hud-br2-size: initial;
      --hud-bl1-size: initial;
      --hud-bl2-size: initial;
      --hud-t1-size: initial;
      --hud-t2-size: initial;
      --hud-r1-size: initial;
      --hud-r2-size: initial;
      --hud-b1-size: initial;
      --hud-b2-size: initial;
      --hud-l1-size: initial;
      --hud-l2-size: initial;
      --hud-tl1-width: initial;
      --hud-tl2-width: initial;
      --hud-tr1-width: initial;
      --hud-tr2-width: initial;
      --hud-br1-width: initial;
      --hud-br2-width: initial;
      --hud-bl1-width: initial;
      --hud-bl2-width: initial;
      --hud-t1-width: initial;
      --hud-t2-width: initial;
      --hud-r1-width: initial;
      --hud-r2-width: initial;
      --hud-b1-width: initial;
      --hud-b2-width: initial;
      --hud-l1-width: initial;
      --hud-l2-width: initial;
      --hud-tl1-height: initial;
      --hud-tl2-height: initial;
      --hud-tr1-height: initial;
      --hud-tr2-height: initial;
      --hud-br1-height: initial;
      --hud-br2-height: initial;
      --hud-bl1-height: initial;
      --hud-bl2-height: initial;
      --hud-t1-height: initial;
      --hud-t2-height: initial;
      --hud-r1-height: initial;
      --hud-r2-height: initial;
      --hud-b1-height: initial;
      --hud-b2-height: initial;
      --hud-l1-height: initial;
      --hud-l2-height: initial;
      --hud-tl1-inset: initial;
      --hud-tl2-inset: initial;
      --hud-tr1-inset: initial;
      --hud-tr2-inset: initial;
      --hud-br1-inset: initial;
      --hud-br2-inset: initial;
      --hud-bl1-inset: initial;
      --hud-bl2-inset: initial;
      --hud-t1-inset: initial;
      --hud-t2-inset: initial;
      --hud-r1-inset: initial;
      --hud-r2-inset: initial;
      --hud-b1-inset: initial;
      --hud-b2-inset: initial;
      --hud-l1-inset: initial;
      --hud-l2-inset: initial;
      --hud-tl1-inset-x: initial;
      --hud-tl2-inset-x: initial;
      --hud-tr1-inset-x: initial;
      --hud-tr2-inset-x: initial;
      --hud-br1-inset-x: initial;
      --hud-br2-inset-x: initial;
      --hud-bl1-inset-x: initial;
      --hud-bl2-inset-x: initial;
      --hud-t1-inset-x: initial;
      --hud-t2-inset-x: initial;
      --hud-r1-inset-x: initial;
      --hud-r2-inset-x: initial;
      --hud-b1-inset-x: initial;
      --hud-b2-inset-x: initial;
      --hud-l1-inset-x: initial;
      --hud-l2-inset-x: initial;
      --hud-tl1-inset-y: initial;
      --hud-tl2-inset-y: initial;
      --hud-tr1-inset-y: initial;
      --hud-tr2-inset-y: initial;
      --hud-br1-inset-y: initial;
      --hud-br2-inset-y: initial;
      --hud-bl1-inset-y: initial;
      --hud-bl2-inset-y: initial;
      --hud-t1-inset-y: initial;
      --hud-t2-inset-y: initial;
      --hud-r1-inset-y: initial;
      --hud-r2-inset-y: initial;
      --hud-b1-inset-y: initial;
      --hud-b2-inset-y: initial;
      --hud-l1-inset-y: initial;
      --hud-l2-inset-y: initial;
      --hud-border-bg: initial;
      --hud-inlay-bg: initial;
      --hud-border-opacity: initial;
      --hud-inlay-opacity: initial;
      --hud-border-all: initial;
      --hud-inlay-all: initial;
      --hud-border-y: initial;
      --hud-inlay-y: initial;
      --hud-border-x: initial;
      --hud-inlay-x: initial;
      --hud-border-top: initial;
      --hud-inlay-top: initial;
      --hud-border-right: initial;
      --hud-inlay-right: initial;
      --hud-border-bottom: initial;
      --hud-inlay-bottom: initial;
      --hud-border-left: initial;
      --hud-inlay-left: initial;
    }
    :where(
      [data-houdini-hud]:not(
        [data-houdini-hud~="both"],
        [data-houdini-hud~="border"],
        [data-houdini-hud~="inlay"]
      ),
      [data-houdini-hud~="all"],
      [data-houdini-hud~="mask"]
    ) {
      --hud-mask: initial;
    }
    :where(
      [data-houdini-hud~="all"],
      [data-houdini-hud~="both"],
      [data-houdini-hud~="border"]
    ) {
      --hud-border: initial;
    }
    :where(
      [data-houdini-hud~="all"],
      [data-houdini-hud~="both"],
      [data-houdini-hud~="inlay"]
    ) {
      --hud-inlay: initial;
    }
    :where([data-houdini-hud])::before {
      --hud-__feature: inlay;
      --hud-__inlay: var(--hud-inlay, paint(augmented-ui));
      -webkit-mask-image: var(--hud-__inlay);
      mask-image: var(--hud-__inlay);
      --hud-__noneIfOff: var(--hud-inlay) none;
      content: var(--hud-__noneIfOff, "");
      display: var(--hud-__noneIfOff, "block");
      position: absolute;
      inset: 0;
      z-index: -1;
      background: var(--hud-inlay-bg);
      opacity: var(--hud-inlay-opacity);
      pointer-events: none;
    }
    :where([data-houdini-hud])::after {
      --hud-__feature: border;
      --hud-__border: var(--hud-border, paint(augmented-ui));
      -webkit-mask-image: var(--hud-__border);
      mask-image: var(--hud-__border);
      --hud-__noneIfOff: var(--hud-border) none;
      content: var(--hud-__noneIfOff, "");
      display: var(--hud-__noneIfOff, "block");
      position: absolute;
      inset: 0;
      z-index: 2;
      background: var(--hud-border-bg);
      opacity: var(--hud-border-opacity);
      pointer-events: none;
    }
  `], { type: "text/css" }))
  document.head.appendChild(link)
}
