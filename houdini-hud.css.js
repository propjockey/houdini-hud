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
    }
    :where(
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
    }
  `], { type: "text/css" }))
  document.head.appendChild(link)
}
