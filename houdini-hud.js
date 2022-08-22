/**
 * houdini-hud
 * BSD 2-Clause License
 * Copyright (c) 2020 Jane Ori, PropJockey
 */
(() => {
  const IGNORE = -90000 // we can't currently register a non-* prop AND let it be initial, so we need a sentinel to enable composition in the meantime
  const inherits = true
  const init0lp = { syntax: "<length-percentage>", initialValue: "0px", inherits }
  const initIGNORElp = Object.assign({}, init0lp, { initialValue: IGNORE + "px" })
  const cornerRegions = ["tl", "tr", "br", "bl"]
  const edgeRegions = ["t", "r", "b", "l"]
  const cornerPositions = ["tl1", "tl2", "tr1", "tr2", "br1", "br2", "bl1", "bl2"]
  const edgePositions = ["t1", "t2", "r1", "r2", "b1", "b2", "l1", "l2"]
  const positions = [...cornerPositions, ...edgePositions]
  const features = ["border", "inlay"]
  CSS.paintWorklet.addModule(URL.createObjectURL(new Blob(
    [`const inputProperties = ${JSON.stringify([
      { name: `--hud-__feature`, syntax: "border|inlay|mask|none", initialValue: "none", inherits: false },
      /* Since we can't calc(100% - 20px) with mixed length percent, maybe */
      /* we could use a multiplied <length-percentage>+ (or #) and sum the */
      /* values once that works. For now though, this is a new limitation. */
      ...cornerRegions.map(r => ({ name: `--hud-${r}-inset`, ...init0lp })), // tl-inset is shorthand for tl-inset-x and tl-inset-y
      ...cornerRegions.map(r => ({ name: `--hud-${r}-inset-x`, ...initIGNORElp })),
      ...cornerRegions.map(r => ({ name: `--hud-${r}-inset-y`, ...initIGNORElp })),
      ...edgeRegions.map(r => ({ name: `--hud-${r}-center`, ...initIGNORElp })),
      ...edgeRegions.map(r => ({ name: `--hud-${r}-offset`, ...init0lp })),
      ...positions.map(p => ({ name: `--hud-${p}`, syntax: "clip|scoop|round|rect|step|none", initialValue: "none", inherits })),
      ...positions.map(p => ({ name: `--hud-${p}-size`, ...init0lp })),
      ...positions.map(p => ({ name: `--hud-${p}-width`, ...initIGNORElp })),
      ...positions.map(p => ({ name: `--hud-${p}-height`, ...initIGNORElp })),
      ...positions.map(p => ({ name: `--hud-${p}-inset`, ...init0lp })), // bl1-inset is shorthand for bl1-inset-x and bl1-inset-y
      ...positions.map(p => ({ name: `--hud-${p}-inset-x`, ...initIGNORElp })),
      ...positions.map(p => ({ name: `--hud-${p}-inset-y`, ...initIGNORElp })),
      { name: `--hud-border-bg`, syntax: "*", initialValue: "currentColor", inherits },
      { name: `--hud-inlay-bg`, syntax: "*", initialValue: "rgb(128 128 128 / 0.5)", inherits },
      ...features.map(f => ({ name: `--hud-${f}-opacity`, syntax: "<number>", initialValue: 1, inherits })),
      ...features.map(f => ({ name: `--hud-${f}-all`, ...init0lp })),
      // TODO: implement stroke manually to bring back these feature features:
      ...features.map(f => ({ name: `--hud-${f}-y`, ...initIGNORElp })),
      ...features.map(f => ({ name: `--hud-${f}-x`, ...initIGNORElp })),
      ...features.map(f => ({ name: `--hud-${f}-top`, ...initIGNORElp })),
      ...features.map(f => ({ name: `--hud-${f}-right`, ...initIGNORElp })),
      ...features.map(f => ({ name: `--hud-${f}-bottom`, ...initIGNORElp })),
      ...features.map(f => ({ name: `--hud-${f}-left`, ...initIGNORElp }))
    ].map(p => (CSS.registerProperty(p), p.name)))}; (${(() => {
      registerPaint("augmented-ui", class {
        static get contextOptions () { return { alpha: false } }
        static get inputProperties () { return inputProperties }
        IGNORE = -90000
        px (varObj, wh = 1) {
          return (varObj.unit === "px" ? varObj.value : (wh * varObj.value / 100))
        }
        compose (props, wh, ...vars /* last param is the fallback, required */) {
          const len = vars.length - 1
          for (let i = 0; i < len; i++) {
            const val = this.px(props.get("--hud-" + vars[i]), wh)
            if (val !== this.IGNORE) return val
          }
          return vars[len]
        }
        center (props, wh, edge, edgeMeta, positiveAlongProp) {
          const edgeMetaData = edgeMeta[edge]
          const val = this.px(props.get("--hud-" + edge + "-center"), wh)
          return (val !== this.IGNORE) ? val : (edgeMetaData[positiveAlongProp] + (wh - edgeMetaData.inAlong - edgeMetaData.outAlong) / 2)
        }
        border (props, width, height) {
          return {
            top: this.compose(props, height, "border-top", "border-y", "border-all", 0),
            right: this.compose(props, width, "border-right", "border-x", "border-all", 0),
            bottom: this.compose(props, height, "border-bottom", "border-y", "border-all", 0),
            left: this.compose(props, width, "border-left", "border-x", "border-all", 0)
          }
        }
        inlay (props, width, height) {
          return {
            top: this.compose(props, height, "inlay-top", "inlay-y", "inlay-all", 0),
            right: this.compose(props, width, "inlay-right", "inlay-x", "inlay-all", 0),
            bottom: this.compose(props, height, "inlay-bottom", "inlay-y", "inlay-all", 0),
            left: this.compose(props, width, "inlay-left", "inlay-x", "inlay-all", 0)
          }
        }
        regionInset (props, width, height) {
          return {
            tlx: this.compose(props, width, "tl-inset-x", "tl-inset", 0),
            tly: this.compose(props, height, "tl-inset-y", "tl-inset", 0),
            trx: this.compose(props, width, "tr-inset-x", "tr-inset", 0),
            try: this.compose(props, height, "tr-inset-y", "tr-inset", 0),
            brx: this.compose(props, width, "br-inset-x", "br-inset", 0),
            bry: this.compose(props, height, "br-inset-y", "br-inset", 0),
            blx: this.compose(props, width, "bl-inset-x", "bl-inset", 0),
            bly: this.compose(props, height, "bl-inset-y", "bl-inset", 0)
          }
        }
        positionInset (props, width, height, equippedAugs) {
          return {
            tl1x: (equippedAugs.tl1 && this.compose(props, width, "tl1-inset-x", "tl1-inset", 0)) || 0,
            tl1y: (equippedAugs.tl1 && this.compose(props, height, "tl1-inset-y", "tl1-inset", 0)) || 0,
            tl2x: (equippedAugs.tl2 && this.compose(props, width, "tl2-inset-x", "tl2-inset", 0)) || 0,
            tl2y: (equippedAugs.tl2 && this.compose(props, height, "tl2-inset-y", "tl2-inset", 0)) || 0,
            t1x: (equippedAugs.t1 && this.compose(props, width, "t1-inset-x", "t1-inset", 0)) || 0,
            t1y: (equippedAugs.t1 && this.compose(props, height, "t1-inset-y", "t1-inset", 0)) || 0,
            t2x: (equippedAugs.t2 && this.compose(props, width, "t2-inset-x", "t2-inset", 0)) || 0,
            t2y: (equippedAugs.t2 && this.compose(props, height, "t2-inset-y", "t2-inset", 0)) || 0,
            tr1x: (equippedAugs.tr1 && this.compose(props, width, "tr1-inset-x", "tr1-inset", 0)) || 0,
            tr1y: (equippedAugs.tr1 && this.compose(props, height, "tr1-inset-y", "tr1-inset", 0)) || 0,
            tr2x: (equippedAugs.tr2 && this.compose(props, width, "tr2-inset-x", "tr2-inset", 0)) || 0,
            tr2y: (equippedAugs.tr2 && this.compose(props, height, "tr2-inset-y", "tr2-inset", 0)) || 0,
            r1x: (equippedAugs.r1 && this.compose(props, width, "r1-inset-x", "r1-inset", 0)) || 0,
            r1y: (equippedAugs.r1 && this.compose(props, height, "r1-inset-y", "r1-inset", 0)) || 0,
            r2x: (equippedAugs.r2 && this.compose(props, width, "r2-inset-x", "r2-inset", 0)) || 0,
            r2y: (equippedAugs.r2 && this.compose(props, height, "r2-inset-y", "r2-inset", 0)) || 0,
            br1x: (equippedAugs.br1 && this.compose(props, width, "br1-inset-x", "br1-inset", 0)) || 0,
            br1y: (equippedAugs.br1 && this.compose(props, height, "br1-inset-y", "br1-inset", 0)) || 0,
            br2x: (equippedAugs.br2 && this.compose(props, width, "br2-inset-x", "br2-inset", 0)) || 0,
            br2y: (equippedAugs.br2 && this.compose(props, height, "br2-inset-y", "br2-inset", 0)) || 0,
            b1x: (equippedAugs.b1 && this.compose(props, width, "b1-inset-x", "b1-inset", 0)) || 0,
            b1y: (equippedAugs.b1 && this.compose(props, height, "b1-inset-y", "b1-inset", 0)) || 0,
            b2x: (equippedAugs.b2 && this.compose(props, width, "b2-inset-x", "b2-inset", 0)) || 0,
            b2y: (equippedAugs.b2 && this.compose(props, height, "b2-inset-y", "b2-inset", 0)) || 0,
            bl1x: (equippedAugs.bl1 && this.compose(props, width, "bl1-inset-x", "bl1-inset", 0)) || 0,
            bl1y: (equippedAugs.bl1 && this.compose(props, height, "bl1-inset-y", "bl1-inset", 0)) || 0,
            bl2x: (equippedAugs.bl2 && this.compose(props, width, "bl2-inset-x", "bl2-inset", 0)) || 0,
            bl2y: (equippedAugs.bl2 && this.compose(props, height, "bl2-inset-y", "bl2-inset", 0)) || 0,
            l1x: (equippedAugs.l1 && this.compose(props, width, "l1-inset-x", "l1-inset", 0)) || 0,
            l1y: (equippedAugs.l1 && this.compose(props, height, "l1-inset-y", "l1-inset", 0)) || 0,
            l2x: (equippedAugs.l2 && this.compose(props, width, "l2-inset-x", "l2-inset", 0)) || 0,
            l2y: (equippedAugs.l2 && this.compose(props, height, "l2-inset-y", "l2-inset", 0)) || 0
          }
        }
        centerOffset (props, width, height, edgeMeta) {
          return {
            tcenter: this.center(props, width, "t", edgeMeta, "inAlong"),
            toffset: this.compose(props, width, "t-offset", 0),

            rcenter: this.center(props, height, "r", edgeMeta, "inAlong"),
            roffset: this.compose(props, height, "r-offset", 0),

            bcenter: this.center(props, width, "b", edgeMeta, "outAlong"),
            boffset: this.compose(props, width, "b-offset", 0),

            lcenter: this.center(props, height, "l", edgeMeta, "outAlong"),
            loffset: this.compose(props, height, "l-offset", 0)
          }
        }
        positionSize (props, width, height, equippedAugs) {
          return {
            tl1w: (equippedAugs.tl1 && this.compose(props, width, "tl1-width", "tl1-size", 0)) || 0,
            tl1h: (equippedAugs.tl1 && this.compose(props, height, "tl1-height", "tl1-size", 0)) || 0,
            tl2w: (equippedAugs.tl2 && this.compose(props, width, "tl2-width", "tl2-size", 0)) || 0,
            tl2h: (equippedAugs.tl2 && this.compose(props, height, "tl2-height", "tl2-size", 0)) || 0,
            t1w: (equippedAugs.t1 && this.compose(props, width, "t1-width", "t1-size", 0)) || 0,
            t1h: (equippedAugs.t1 && this.compose(props, height, "t1-height", "t1-size", 0)) || 0,
            t2w: (equippedAugs.t2 && this.compose(props, width, "t2-width", "t2-size", 0)) || 0,
            t2h: (equippedAugs.t2 && this.compose(props, height, "t2-height", "t2-size", 0)) || 0,
            tr1w: (equippedAugs.tr1 && this.compose(props, width, "tr1-width", "tr1-size", 0)) || 0,
            tr1h: (equippedAugs.tr1 && this.compose(props, height, "tr1-height", "tr1-size", 0)) || 0,
            tr2w: (equippedAugs.tr2 && this.compose(props, width, "tr2-width", "tr2-size", 0)) || 0,
            tr2h: (equippedAugs.tr2 && this.compose(props, height, "tr2-height", "tr2-size", 0)) || 0,
            r1w: (equippedAugs.r1 && this.compose(props, width, "r1-width", "r1-size", 0)) || 0,
            r1h: (equippedAugs.r1 && this.compose(props, height, "r1-height", "r1-size", 0)) || 0,
            r2w: (equippedAugs.r2 && this.compose(props, width, "r2-width", "r2-size", 0)) || 0,
            r2h: (equippedAugs.r2 && this.compose(props, height, "r2-height", "r2-size", 0)) || 0,
            br1w: (equippedAugs.br1 && this.compose(props, width, "br1-width", "br1-size", 0)) || 0,
            br1h: (equippedAugs.br1 && this.compose(props, height, "br1-height", "br1-size", 0)) || 0,
            br2w: (equippedAugs.br2 && this.compose(props, width, "br2-width", "br2-size", 0)) || 0,
            br2h: (equippedAugs.br2 && this.compose(props, height, "br2-height", "br2-size", 0)) || 0,
            b1w: (equippedAugs.b1 && this.compose(props, width, "b1-width", "b1-size", 0)) || 0,
            b1h: (equippedAugs.b1 && this.compose(props, height, "b1-height", "b1-size", 0)) || 0,
            b2w: (equippedAugs.b2 && this.compose(props, width, "b2-width", "b2-size", 0)) || 0,
            b2h: (equippedAugs.b2 && this.compose(props, height, "b2-height", "b2-size", 0)) || 0,
            bl1w: (equippedAugs.bl1 && this.compose(props, width, "bl1-width", "bl1-size", 0)) || 0,
            bl1h: (equippedAugs.bl1 && this.compose(props, height, "bl1-height", "bl1-size", 0)) || 0,
            bl2w: (equippedAugs.bl2 && this.compose(props, width, "bl2-width", "bl2-size", 0)) || 0,
            bl2h: (equippedAugs.bl2 && this.compose(props, height, "bl2-height", "bl2-size", 0)) || 0,
            l1w: (equippedAugs.l1 && this.compose(props, width, "l1-width", "l1-size", 0)) || 0,
            l1h: (equippedAugs.l1 && this.compose(props, height, "l1-height", "l1-size", 0)) || 0,
            l2w: (equippedAugs.l2 && this.compose(props, width, "l2-width", "l2-size", 0)) || 0,
            l2h: (equippedAugs.l2 && this.compose(props, height, "l2-height", "l2-size", 0)) || 0
          }
        }
        drawAugFromTL (augPath, lastPoint, aug, augWidth, augHeight) {
          switch (aug) {
            case "none": break
            case "clip":
              lastPoint.x += augWidth
              lastPoint.y -= augHeight
              augPath.lineTo(lastPoint.x, lastPoint.y)
              break
            case "scoop":
              lastPoint.y -= augHeight
              augPath.ellipse(lastPoint.x, lastPoint.y, augWidth, augHeight, 0, Math.PI / 2, 0, true)
              lastPoint.x += augWidth
              break
            case "round":
              lastPoint.x += augWidth
              augPath.ellipse(lastPoint.x, lastPoint.y, augWidth, augHeight, 0, Math.PI, 3 * Math.PI / 2, false)
              lastPoint.y -= augHeight
              break
            case "rect":
              lastPoint.x += augWidth
              augPath.lineTo(lastPoint.x, lastPoint.y)
              lastPoint.y -= augHeight
              augPath.lineTo(lastPoint.x, lastPoint.y)
              break
            case "step":
              lastPoint.y -= augHeight
              augPath.lineTo(lastPoint.x, lastPoint.y)
              lastPoint.x += augWidth
              augPath.lineTo(lastPoint.x, lastPoint.y)
              break
          }
          return lastPoint
        }
        drawAugFromTR (augPath, lastPoint, aug, augWidth, augHeight) {
          switch (aug) {
            case "none": break
            case "clip":
              lastPoint.x += augWidth
              lastPoint.y += augHeight
              augPath.lineTo(lastPoint.x, lastPoint.y)
              break
            case "scoop":
              lastPoint.x += augWidth
              augPath.ellipse(lastPoint.x, lastPoint.y, augWidth, augHeight, 0, Math.PI, Math.PI / 2, true)
              lastPoint.y += augHeight
              break
            case "round":
              lastPoint.y += augHeight
              augPath.ellipse(lastPoint.x, lastPoint.y, augWidth, augHeight, 0, 3 * Math.PI / 2, 0, false)
              lastPoint.x += augWidth
              break
            case "rect":
              lastPoint.y += augHeight
              augPath.lineTo(lastPoint.x, lastPoint.y)
              lastPoint.x += augWidth
              augPath.lineTo(lastPoint.x, lastPoint.y)
              break
            case "step":
              lastPoint.x += augWidth
              augPath.lineTo(lastPoint.x, lastPoint.y)
              lastPoint.y += augHeight
              augPath.lineTo(lastPoint.x, lastPoint.y)
              break
          }
          return lastPoint
        }
        drawAugFromBR (augPath, lastPoint, aug, augWidth, augHeight) {
          switch (aug) {
            case "none": break
            case "clip":
              lastPoint.x -= augWidth
              lastPoint.y += augHeight
              augPath.lineTo(lastPoint.x, lastPoint.y)
              break
            case "scoop":
              lastPoint.y += augHeight
              augPath.ellipse(lastPoint.x, lastPoint.y, augWidth, augHeight, 0, 3 * Math.PI / 2, Math.PI, true)
              lastPoint.x -= augWidth
              break
            case "round":
              lastPoint.x -= augWidth
              augPath.ellipse(lastPoint.x, lastPoint.y, augWidth, augHeight, 0, 0, Math.PI / 2, false)
              lastPoint.y += augHeight
              break
            case "rect":
              lastPoint.x -= augWidth
              augPath.lineTo(lastPoint.x, lastPoint.y)
              lastPoint.y += augHeight
              augPath.lineTo(lastPoint.x, lastPoint.y)
              break
            case "step":
              lastPoint.y += augHeight
              augPath.lineTo(lastPoint.x, lastPoint.y)
              lastPoint.x -= augWidth
              augPath.lineTo(lastPoint.x, lastPoint.y)
              break
          }
          return lastPoint
        }
        drawAugFromBL (augPath, lastPoint, aug, augWidth, augHeight) {
          switch (aug) {
            case "none": break
            case "clip":
              lastPoint.x -= augWidth
              lastPoint.y -= augHeight
              augPath.lineTo(lastPoint.x, lastPoint.y)
              break
            case "scoop":
              lastPoint.x -= augWidth
              augPath.ellipse(lastPoint.x, lastPoint.y, augWidth, augHeight, 0, 0, 3 * Math.PI / 2, true)
              lastPoint.y -= augHeight
              break
            case "round":
              lastPoint.y -= augHeight
              augPath.ellipse(lastPoint.x, lastPoint.y, augWidth, augHeight, 0, Math.PI / 2, Math.PI, false)
              lastPoint.x -= augWidth
              break
            case "rect":
              lastPoint.y -= augHeight
              augPath.lineTo(lastPoint.x, lastPoint.y)
              lastPoint.x -= augWidth
              augPath.lineTo(lastPoint.x, lastPoint.y)
              break
            case "step":
              lastPoint.x -= augWidth
              augPath.lineTo(lastPoint.x, lastPoint.y)
              lastPoint.y -= augHeight
              augPath.lineTo(lastPoint.x, lastPoint.y)
              break
          }
          return lastPoint
        }
        buildTopLeftRegion (augPath, lastPoint, aug1, aug2, positionInset, size) {
          lastPoint.x += positionInset.tl1x
          augPath.lineTo(lastPoint.x, lastPoint.y)

          this.drawAugFromTL(augPath, lastPoint, aug1, size.tl1w, size.tl1h)

          lastPoint.y -= positionInset.tl1y
          augPath.lineTo(lastPoint.x, lastPoint.y)

          lastPoint.x += positionInset.tl2x
          augPath.lineTo(lastPoint.x, lastPoint.y)

          this.drawAugFromTL(augPath, lastPoint, aug2, size.tl2w, size.tl2h)

          lastPoint.y -= positionInset.tl2y
          augPath.lineTo(lastPoint.x, lastPoint.y)

          return lastPoint
        }
        buildTopRegion (augPath, lastPoint, aug1, aug2, positionInset, size, centerOffset, regionInset) {
          lastPoint.x = centerOffset.tcenter - (size.t1w + positionInset.t1x + positionInset.t2x + size.t2w) / 2 + centerOffset.toffset
          augPath.lineTo(lastPoint.x, lastPoint.y)

          const crossAxis1Deepest = regionInset.tly + positionInset.t1y + size.t1h
          const crossAxis2Deepest = regionInset.try + positionInset.t2y + size.t2h
          const crossAxisMostDeepest = Math.max(crossAxis1Deepest, crossAxis2Deepest)
          // position inset-y acts as a minimum distance from the edge of the region's inset that may grow
          // end goal is that the bottom edge of the t1 and t2 augs line up

          lastPoint.y = (crossAxisMostDeepest - size.t1h) // set directly
          augPath.lineTo(lastPoint.x, lastPoint.y)

          this.drawAugFromTR(augPath, lastPoint, aug1, size.t1w, size.t1h)

          lastPoint.x += (positionInset.t1x + positionInset.t2x)
          augPath.lineTo(lastPoint.x, lastPoint.y)

          this.drawAugFromTL(augPath, lastPoint, aug2, size.t2w, size.t2h)

          lastPoint.y = regionInset.try // set directly
          augPath.lineTo(lastPoint.x, lastPoint.y)

          return lastPoint
        }
        buildTopRightRegion (augPath, lastPoint, aug1, aug2, positionInset, size) {
          lastPoint.y += positionInset.tr1y
          augPath.lineTo(lastPoint.x, lastPoint.y)

          this.drawAugFromTR(augPath, lastPoint, aug1, size.tr1w, size.tr1h)

          lastPoint.x += positionInset.tr1x
          augPath.lineTo(lastPoint.x, lastPoint.y)

          lastPoint.y += positionInset.tr2y
          augPath.lineTo(lastPoint.x, lastPoint.y)

          this.drawAugFromTR(augPath, lastPoint, aug2, size.tr2w, size.tr2h)

          lastPoint.x += positionInset.tr2x
          augPath.lineTo(lastPoint.x, lastPoint.y)

          return lastPoint
        }
        buildRightRegion (augPath, lastPoint, aug1, aug2, positionInset, size, centerOffset, regionInset, width) {
          lastPoint.y = centerOffset.rcenter - (size.r1h + positionInset.r1y + positionInset.r2y + size.r2h) / 2 + centerOffset.roffset
          augPath.lineTo(lastPoint.x, lastPoint.y)

          const crossAxis1Deepest = regionInset.trx + positionInset.r1x + size.r1w
          const crossAxis2Deepest = regionInset.brx + positionInset.r2x + size.r2w
          const crossAxisMostDeepest = Math.max(crossAxis1Deepest, crossAxis2Deepest)
          // position inset-x acts as a minimum distance from the edge of the region's inset that may grow
          // end goal is that the leftmost edge of the r1 and r2 augs line up

          lastPoint.x = width - (crossAxisMostDeepest - size.r1w) // set directly
          augPath.lineTo(lastPoint.x, lastPoint.y)

          this.drawAugFromBR(augPath, lastPoint, aug1, size.r1w, size.r1h)

          lastPoint.y += (positionInset.r1y + positionInset.r2y)
          augPath.lineTo(lastPoint.x, lastPoint.y)

          this.drawAugFromTR(augPath, lastPoint, aug2, size.r2w, size.r2h)

          lastPoint.x = (width - regionInset.brx) // set directly
          augPath.lineTo(lastPoint.x, lastPoint.y)

          return lastPoint
        }
        buildBottomRightRegion (augPath, lastPoint, aug1, aug2, positionInset, size) {
          lastPoint.x -= positionInset.br1x
          augPath.lineTo(lastPoint.x, lastPoint.y)

          this.drawAugFromBR(augPath, lastPoint, aug1, size.br1w, size.br1h)

          lastPoint.y += positionInset.br1y
          augPath.lineTo(lastPoint.x, lastPoint.y)

          lastPoint.x -= positionInset.br2x
          augPath.lineTo(lastPoint.x, lastPoint.y)

          this.drawAugFromBR(augPath, lastPoint, aug2, size.br2w, size.br2h)

          lastPoint.y += positionInset.br2y
          augPath.lineTo(lastPoint.x, lastPoint.y)

          return lastPoint
        }
        buildBottomRegion (augPath, lastPoint, aug1, aug2, positionInset, size, centerOffset, regionInset, height) {
          lastPoint.x = centerOffset.bcenter + (size.b1w + positionInset.b1x + positionInset.b2x + size.b2w) / 2 + centerOffset.boffset
          augPath.lineTo(lastPoint.x, lastPoint.y)

          const crossAxis1Deepest = regionInset.bry + positionInset.b1y + size.b1h
          const crossAxis2Deepest = regionInset.bly + positionInset.b2y + size.b2h
          const crossAxisMostDeepest = Math.max(crossAxis1Deepest, crossAxis2Deepest)
          // position inset-y acts as a minimum distance from the edge of the region's inset that may grow
          // end goal is that the top edge of the b1 and b2 augs line up

          lastPoint.y = height - (crossAxisMostDeepest - size.b1h) // set directly
          augPath.lineTo(lastPoint.x, lastPoint.y)

          this.drawAugFromBL(augPath, lastPoint, aug1, size.b1w, size.b1h)

          lastPoint.x -= (positionInset.b1x + positionInset.b2x)
          augPath.lineTo(lastPoint.x, lastPoint.y)

          this.drawAugFromBR(augPath, lastPoint, aug2, size.b2w, size.b2h)

          lastPoint.y = (height - regionInset.bly) // set directly
          augPath.lineTo(lastPoint.x, lastPoint.y)

          return lastPoint
        }
        buildBottomLeftRegion (augPath, lastPoint, aug1, aug2, positionInset, size) {
          lastPoint.y -= positionInset.bl1y
          augPath.lineTo(lastPoint.x, lastPoint.y)

          this.drawAugFromBL(augPath, lastPoint, aug1, size.bl1w, size.bl1h)

          lastPoint.x -= positionInset.bl1x
          augPath.lineTo(lastPoint.x, lastPoint.y)

          lastPoint.y -= positionInset.bl2y
          augPath.lineTo(lastPoint.x, lastPoint.y)

          this.drawAugFromBL(augPath, lastPoint, aug2, size.bl2w, size.bl2h)

          lastPoint.x -= positionInset.bl2x
          augPath.lineTo(lastPoint.x, lastPoint.y)

          return lastPoint
        }
        buildLeftRegion (augPath, lastPoint, aug1, aug2, positionInset, size, centerOffset, regionInset) {
          lastPoint.y = centerOffset.lcenter + (size.l1h + positionInset.l1y + positionInset.l2y + size.l2h) / 2 + centerOffset.loffset
          augPath.lineTo(lastPoint.x, lastPoint.y)

          const crossAxis1Deepest = regionInset.blx + positionInset.l1x + size.l1w
          const crossAxis2Deepest = regionInset.tlx + positionInset.l2x + size.l2w
          const crossAxisMostDeepest = Math.max(crossAxis1Deepest, crossAxis2Deepest)
          // position inset-x acts as a minimum distance from the edge of the region's inset that may grow
          // end goal is that the rightmost edge of the l1 and l2 augs line up

          lastPoint.x = (crossAxisMostDeepest - size.l1w) // set directly
          augPath.lineTo(lastPoint.x, lastPoint.y)

          this.drawAugFromTL(augPath, lastPoint, aug1, size.l1w, size.l1h)

          lastPoint.y -= (positionInset.l1y + positionInset.l2y)
          augPath.lineTo(lastPoint.x, lastPoint.y)

          this.drawAugFromBL(augPath, lastPoint, aug2, size.l2w, size.l2h)

          lastPoint.x = regionInset.tlx // set directly
          augPath.lineTo(lastPoint.x, lastPoint.y)

          return lastPoint
        }
        equippedAugs (props) {
          return ["tl1", "tl2", "t1", "t2", "tr1", "tr2", "r1", "r2", "br1", "br2", "b1", "b2", "bl1", "bl2", "l1", "l2"].reduce(
            (augs, position) => {
              const aug = props.get("--hud-" + position).value
              augs[position] = aug === "none" ? false : aug
              return augs
            },
            {}
          )
        }
        edgeMeta (regionInset, positionInset, size) {
          return {
            t: {
              balance: regionInset.tly - regionInset.try,
              inAlong: regionInset.tlx + positionInset.tl1x + size.tl1w + positionInset.tl2x + size.tl2w,
              outAlong: regionInset.trx + positionInset.tr2x + size.tr2w + positionInset.tr1x + size.tr1w
            },
            r: {
              balance: regionInset.trx - regionInset.brx,
              inAlong: regionInset.try + positionInset.tr1y + size.tr1h + positionInset.tr2y + size.tr2h,
              outAlong: regionInset.bry + positionInset.br2y + size.br2h + positionInset.br1y + size.br1h
            },
            b: {
              balance: regionInset.bry - regionInset.bly,
              inAlong: regionInset.brx + positionInset.br1x + size.br1w + positionInset.br2x + size.br2w,
              outAlong: regionInset.blx + positionInset.bl2x + size.bl2w + positionInset.bl1x + size.bl1w
            },
            l: {
              balance: regionInset.blx - regionInset.tlx,
              inAlong: regionInset.bly + positionInset.bl1y + size.bl1h + positionInset.bl2y + size.bl2h,
              outAlong: regionInset.tly + positionInset.tl2y + size.tl2h + positionInset.tl1y + size.tl1h
            }
          }
        }
        // backupAsImageAndClear (ctx, w, h) {
        //   const imgData = ctx.createImageData(w, h) // not implemented ;_;
        //   ctx.globalCompositeOperation = "source-over"
        //   ctx.fillStyle = "#000000"
        //   ctx.fillRect(0, 0, w, h)
        //   return imgData
        // }
        paint (ctx, {width, height}, props) {
          const feature = props.get("--hud-__feature").value

          if (feature === "none") {
            return
          }

          const equippedAugs = this.equippedAugs(props)
          const border = this.border(props, width, height)
          const inlay = this.inlay(props, width, height)
          const regionInset = this.regionInset(props, width, height)
          const positionInset = this.positionInset(props, width, height, equippedAugs)
          const size = this.positionSize(props, width, height, equippedAugs)
          const edgeMeta = this.edgeMeta(regionInset, positionInset, size)
          const centerOffset = this.centerOffset(props, width, height, edgeMeta)

          const augPath = new Path2D()

          // start at beginning of tl region
          let lastPoint = { x: regionInset.tlx, y: edgeMeta.l.outAlong }
          augPath.moveTo(lastPoint.x, lastPoint.y)

          this.buildTopLeftRegion(
            augPath,
            lastPoint,
            equippedAugs.tl1,
            equippedAugs.tl2,
            positionInset,
            size
          )

          this.buildTopRegion(
            augPath,
            lastPoint,
            equippedAugs.t1,
            equippedAugs.t2,
            positionInset,
            size,
            centerOffset,
            regionInset
          )

          // draw to beinning of tr region
          lastPoint.x = width - edgeMeta.t.outAlong
          augPath.lineTo(lastPoint.x, lastPoint.y)

          this.buildTopRightRegion(
            augPath,
            lastPoint,
            equippedAugs.tr1,
            equippedAugs.tr2,
            positionInset,
            size
          )

          this.buildRightRegion(
            augPath,
            lastPoint,
            equippedAugs.r1,
            equippedAugs.r2,
            positionInset,
            size,
            centerOffset,
            regionInset,
            width
          )

          // draw to beinning of br region
          lastPoint.y = height - edgeMeta.r.outAlong
          augPath.lineTo(lastPoint.x, lastPoint.y)

          this.buildBottomRightRegion(
            augPath,
            lastPoint,
            equippedAugs.br1,
            equippedAugs.br2,
            positionInset,
            size
          )

          this.buildBottomRegion(
            augPath,
            lastPoint,
            equippedAugs.b1,
            equippedAugs.b2,
            positionInset,
            size,
            centerOffset,
            regionInset,
            height
          )

          // draw to beinning of bl region
          lastPoint.x = edgeMeta.b.outAlong
          augPath.lineTo(lastPoint.x, lastPoint.y)

          this.buildBottomLeftRegion(
            augPath,
            lastPoint,
            equippedAugs.bl1,
            equippedAugs.bl2,
            positionInset,
            size
          )

          this.buildLeftRegion(
            augPath,
            lastPoint,
            equippedAugs.l1,
            equippedAugs.l2,
            positionInset,
            size,
            centerOffset,
            regionInset
          )

          augPath.closePath()

          ctx.globalCompositeOperation = "source-over"
          ctx.fillStyle = "#000000"
          ctx.fillRect(0, 0, width, height)

          switch (feature) {
            case "border": {
              ctx.save()
              ctx.globalCompositeOperation = "xor"
              // TODO: implement stroke manually for individual t/l/r/b border sizes:
              ctx.lineWidth = border.top * 2
              ctx.strokeStyle = "#000000"
              ctx.clip(augPath)
              ctx.stroke(augPath)
              ctx.restore()
              break
            }
            case "inlay": {
              ctx.globalCompositeOperation = "xor"
              ctx.fillStyle = "#000000"
              ctx.fill(augPath)
              ctx.globalCompositeOperation = "source-over"
              // TODO: implement stroke manually for individual t/l/r/b inlay distances:
              ctx.lineWidth = (border.top + inlay.top) * 2
              ctx.strokeStyle = "#000000"
              ctx.stroke(augPath)
              break
            }
            case "mask": {
              ctx.globalCompositeOperation = "xor"
              ctx.fillStyle = "#000000"
              ctx.fill(augPath)
              break
            }
          }

          ctx.globalCompositeOperation = "xor"
          ctx.fillStyle = "#000000"
          ctx.fillRect(0, 0, width, height)
          ctx.globalCompositeOperation = "source-over"

          // console.log(typeof ctx.drawImage) // why is this implemented? I want to play with the ctx pixels. ;_;
          // const baseImg = this.backupAsImageAndClear(ctx, width, height)

          // // todo: effects relative to hud: horizontal glitch animation, curved surface and positioning within, both, etc
          // note: Math.seedRandom for glitch animations
          // ctx.drawImage(
          //   baseImg,
          //   0, 0, width, height, // source dx, dy, w, h (element override sizes)
          //   50, 50, width, weight // destination dx, dy, w, h (element size positioned inside hud sizes)
          //   // test ^. todo: throw this in a loop and distort it in slices
          // )

          // const effectImg = this.backupAsImageAndClear(ctx, width, height)

          // ctx.drawImage(
          //   effectImg, // todo: hud width and height (maybe need this to be a slice of img already)
          //   0, 0, width, height // acutal element size // todo: offset inside element
          // )
        }
      })
    }).toString()})()`],
    { type: "text/javascript" }
  )))
})()
