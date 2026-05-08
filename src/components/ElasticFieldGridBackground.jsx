import { useEffect, useRef } from 'react';

/** Deterministic [0, 1) — used for scatter and motion seeds */
function hash01(i, j, salt) {
  let n = i * 1274126177 + j * 668265263 + salt * 374761393;
  n = (n ^ (n >>> 13)) * 1274126177;
  // Use full 32 bits by keeping unsigned, then scale to [0,1)
  return ((n >>> 0) / 0x100000000);
}

/**
 * Random-ish node positions (no grid). Edge graph is built once on resize from base positions;
 * pairs stay fixed while points drift, like the original implementation.
 *
 * `leftOffset` / `topOffset` are ignored for placement — adding constants after normalizing to
 * [0, cssWidth] pushed most samples off-canvas (mobile Hero used large offsets meant for the old grid).
 */
function buildPoints(cssWidth, cssHeight, spacing, motionScale) {
  // Step 1: Build a symmetrical grid of points
  const cell = Math.max(40, spacing);
  const pad = cell * 0.2;
  // Calculate the number of columns and rows that fit
  const cols = Math.max(5, Math.floor((cssWidth - 2 * pad) / cell));
  const rows = Math.max(5, Math.floor((cssHeight - 2 * pad) / cell));
  const points = [];

  // Step 2: Create grid, "noise" it to not be too regular
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const k = row * cols + col;

      // Slightly "noise" each grid position so it's not perfectly regular
      // The modifier is a small random offset (+/-cell*0.28)
      const noiseModifier = 5;
      const xNoise = (hash01(row, col, 21) - 0.5) * cell * noiseModifier;
      const yNoise = (hash01(row, col, 99) - 0.5) * cell * noiseModifier;

      const baseX = pad + col * cell + xNoise;
      const baseY = pad + row * cell + yNoise;

      // Skip points outside canvas (in case noise pushes them out)
      if (baseX < 0 || baseX > cssWidth || baseY < 0 || baseY > cssHeight) continue;

      points.push({
        k, // Keep track, so we can easily reference the index for noise, etc.
        baseX,
        baseY,
      });
    }
  }

  // Step 3: Remove some random grid points to create gaps
  // For reproducibility, use hash and a threshold. About 18% will be removed.
  const density = 1;
  const desiredCount = Math.max(28, Math.floor(points.length * density));
  const filtered = [];
  // Shuffle points[] in a deterministic (seeded) random order, then select up to desiredCount of them,
  // accepting only those that pass the hash01() > threshold filter.
  // This achieves random subsampling by density.
  // Fisher-Yates shuffle, using hash01 with the point's k to generate the shuffle order.
  const indices = points.map((pt, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    // Use a deterministic hash as the shuffle "random" value so order is stable across runs/mounts
    const rand = hash01(points[indices[i]].k, 13, 71);
    const j = Math.floor(rand * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  for (let p = 0; p < indices.length && filtered.length < desiredCount; p++) {
    const idx = indices[p];
    if (hash01(points[idx].k, 23, 57) > 0.18) {
      filtered.push(points[idx]);
    }
  }

  // Step 4: Build the final points with noise, motion params
  // (and drop the 'k' used only for the deterministic steps).
  return filtered.map((pt, idx) => {
    // Deterministic "random" for each point
    const amp = (14 + hash01(idx, 0, 47) * 36) * motionScale;
    return {
      baseX: pt.baseX,
      baseY: pt.baseY,
      phaseX: hash01(idx, 0, 53) * Math.PI * 2,
      phaseY: hash01(idx, 0, 59) * Math.PI * 2,
      freq: 0.35 + hash01(idx, 0, 61) * 0.75,
      amp,
    };
  });
}

/** Create the bucket key. */
function bucketKey(bx, by) {
  return `${bx},${by}`;
}

/** Build the buckets. */
function buildBuckets(points, binSize) {
  /** Create the buckets map. */
  const buckets = new Map();
  /** For each point, calculate the bucket key and add the point to the bucket. */
  for (let i = 0; i < points.length; i++) {
    const bx = Math.floor(points[i].baseX / binSize);
    const by = Math.floor(points[i].baseY / binSize);
    /** Get the bucket key. */
    const k = bucketKey(bx, by);
    /** If the bucket does not have the key, set the key to an empty array. */
    if (!buckets.has(k)) buckets.set(k, []);
    /** Add the point to the bucket. */
    buckets.get(k).push(i);
  }
  return buckets;
}

/** Build the edges. */
function buildEdges(points, buckets, binSize, maxDist, maxNeighbors) {
  /** Create the edges array. */
  const edges = [];
  /** Calculate the maximum distance squared. */
  const maxDistSq = maxDist * maxDist;
  /** For each point, calculate the bucket key and add the point to the bucket. */

  for (let i = 0; i < points.length; i++) {
    /** Get the base x and y. */
    const px = points[i].baseX;
    const py = points[i].baseY;
    /** Get the bucket x and y. */
    const bx = Math.floor(px / binSize);
    const by = Math.floor(py / binSize);
    /** Create the candidates array. */
    const candidates = [];
    /** For each dx and dy, get the list of points in the bucket. */

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        /** Get the list of points in the bucket. */
        const list = buckets.get(bucketKey(bx + dx, by + dy));
        /** If the list is not found, continue. */
        if (!list) continue;
        /** For each point in the list, check if it is less than the current point. */
        for (const j of list) {
          /** If the point is less than the current point, continue. */
          if (j <= i) continue;
          /** Get the point. */
          const q = points[j];
          /** Get the difference in x and y. */
          const ddx = q.baseX - px;
          const ddy = q.baseY - py;
          /** Calculate the distance squared. */
          const d2 = ddx * ddx + ddy * ddy;
          /** If the distance squared is less than the maximum distance squared and greater than 1e-6, add the point to the candidates array. */
          if (d2 <= maxDistSq && d2 > 1e-6) {
            /** Add the point to the candidates array. */
            candidates.push({ j, d: Math.sqrt(d2) });
          }
        }
      }
    }

    /** Sort the candidates array by distance. */
    candidates.sort((a, b) => a.d - b.d);
    /** Get the number of candidates. */
    const n = Math.min(maxNeighbors, candidates.length);
    /** For each candidate, add the edge to the edges array. */
    for (let k = 0; k < n; k++) {
      /** Add the edge to the edges array. */
      edges.push({ i, j: candidates[k].j });
    }
  }
  return edges;
}

/** Clamp the value between 0 and 1. */
function clamp01(t) {
  /** Return the clamped value. */
  return Math.min(1, Math.max(0, t));
}

/** Quantized stroke key for sorting/batching (same idea as the original field). */
function packStrokeKey(lineWidth, alpha) {
  /** Get the line width. */
  const lw = Math.round(lineWidth * 1000) & 0xffff;
  /** Get the alpha.  */
  const al = Math.round(alpha * 10000) & 0xffff;
  /** Return the packed stroke key. */
  return (lw << 16) | al;
}

/** Unpack the stroke key. */
function unpackStrokeKey(key) {
  /** Get the line width. */
  return {
    lineWidth: ((key >>> 16) & 0xffff) / 1000,
    /** Get the alpha. */
    alpha: (key & 0xffff) / 10000,
  };
}

/**
 * Edge bow amount — replaces value-noise with a few trig terms (same role, far cheaper).
 * Reads like layered sine waves across the canvas so curves feel elastic / “bouncy”.
 */
function bowAmount(midX, midY, animTime, timeScale, k, breatheAmp) {
  /** Get the time. */
  const t = animTime * timeScale * Math.PI * 2;
  /** Get the sine x and y. */
  const sx = midX * k;
  const sy = midY * k;
  /** Compute the bow amount with the sine and cosine functions. Each value is multiplied by a constant and added to the time. Constant values are chosen to create a smooth, elastic motion. */
  return (
    breatheAmp *
    (Math.sin(sx * 0.9 + sy * 0.31 + t * 0.85) *
      Math.cos(sx * 0.62 - sy * 0.88 + t * 0.9) +
      0.38 * Math.sin((sx + sy) * 0.52 + t * 1.05))
  );
}

/**
 * Plexus background: scattered nodes, curved links, cheap sin/cos drift (no value noise).
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {number} [props.cellSize] — average spacing between nodes (drives count)
 * @param {number} [props.maxLinkDistance]
 * @param {number} [props.maxNeighbors]
 * @param {number} [props.jitterFraction] — scales drift amplitude (default 8 ≈ baseline)
 * @param {boolean} [props.mouseInfluence]
 * @param {boolean} [props.runLoop]
 * @param {boolean} [props.isStatic]
 * @param {number} [props.maxDpr]
 */
export default function ElasticFieldGridBackground({
  className = '',
  cellSize = 80,
  maxLinkDistance = 200,
  maxNeighbors = 7,
  jitterFraction = 0,
  mouseInfluence = true,
  runLoop = true,
  isStatic = false,
  maxDpr = 3,
}) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const rafRef = useRef(0);
  const runningRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const runLoopRef = useRef(runLoop);
  runLoopRef.current = runLoop;

  const engineRef = useRef(null);

  const stateRef = useRef({
    points: [],
    edges: [],
    cssW: 0,
    cssH: 0,
    dpr: 1,
    time: 0,
    mouseX: 0.5,
    mouseY: 0.5,
    mouseActive: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    /** If the canvas or wrap is not found, return undefined. */
    if (!canvas || !wrap) return undefined;

    function resolveCanvasDpr(cap) {
      /** Get the raw device pixel ratio. */
      const raw = window.devicePixelRatio || 1;
      /** Return the minimum of the raw device pixel ratio and the cap. */
      return Math.min(raw, cap);
    }

    /** Minimum frame time in milliseconds. */
    const MIN_FRAME_MS = 1000 / 45;

    /** Get the canvas context. */
    const ctx = canvas.getContext('2d', { alpha: true });
    /** If the context is not found, return undefined. */
    if (!ctx) return undefined;

    /** Get the media query for reduced motion. */
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    function setReduced() {
      /** Set the reduced motion reference to the matches of the media query. */
      reducedMotionRef.current = mqReduce.matches;
    }
    setReduced();

    /** Same clock as the original noise-based field so motion feels familiar */
    /** Time scale for the animation. */
    const timeScale = 0.00002;
    /** Noise coordinate scale for the animation. */
    const noiseCoordScale = 1;
    /** Breathe amplitude for the animation. */
    const breatheAmp = 10;
    /**
     * Wave amplitude for the synchronous global time-warp.
     * Larger values make motion stall harder at troughs and burst faster at peaks.
     * Effective speed swings between (1 - waveAmp*0.1) and (1 + waveAmp*0.1) — at 10 the field
     * momentarily freezes when the wave bottoms out.
     */
    const waveAmp = 100;
    /** Wave frequency in cycles per ms — at 0.0002 the cycle lasts ≈ 5 seconds. */
    const waveFreq = 0.00005;
    /** Mouse radius in pixels. */
    const mouseRadiusPx = 100;
    /** Mouse strength for the animation. */
    const mouseStrength = 0.5;
    /** Smoothed cursor follow rate (higher = less lag / inertia on the pull). */
    const mouseFollowHz = 14;
    /** How fast pull influence fades when the pointer leaves (release inertia). */
    const mouseBlendHz = 10;
    /** Motion scale for the animation. */
    const motionScale = jitterFraction / 8;

    /** Stroke color for the animation. */
    const strokeRgb = 'rgb(44, 40, 36)';
    /** Dot fill color for the animation. */
    const dotFill = 'rgba(44, 40, 36, 0.15)';

    /** Position x array. */
    let posX = new Float32Array(0);
    /** Position y array. */
    let posY = new Float32Array(0);
    /** Edge start x array. */
    let eAx = new Float32Array(0);
    /** Edge start y array. */
    let eAy = new Float32Array(0);
    /** Edge control point x array. */
    let eCpX = new Float32Array(0);
    /** Edge control point y array. */
    let eCpY = new Float32Array(0);
    /** Edge end x array. */
    let eBx = new Float32Array(0);
    /** Edge end y array. */
    let eBy = new Float32Array(0);
    /** Edge key array. */
    let eKey = new Uint32Array(0);
    /** Sort index array. */
    let sortIdx = new Uint32Array(0);

    function growBuffers(pointCount, edgeCount) {
      /** If the position x array is less than the point count, grow the position x array. */
      if (posX.length < pointCount) {
        posX = new Float32Array(pointCount);
        posY = new Float32Array(pointCount);
      }
      /** If the edge start x array is less than the edge count, grow the edge start x array. */
      if (eAx.length < edgeCount) {
        /** Grow the edge start x array. */
        eAx = new Float32Array(edgeCount);
        eAy = new Float32Array(edgeCount);
        /** If the edge control point x array is less than the edge count, grow the edge control point x array. */
        eCpX = new Float32Array(edgeCount);
        eCpY = new Float32Array(edgeCount);
        /** If the edge end x array is less than the edge count, grow the edge end x array. */
        eBx = new Float32Array(edgeCount);
        eBy = new Float32Array(edgeCount);
        /** If the edge key array is less than the edge count, grow the edge key array. */
        eKey = new Uint32Array(edgeCount);
        /** Grow the sort index array. */
        sortIdx = new Uint32Array(edgeCount);
      }
    }

    /** Inverse mouse radius squared. */
    const invMouseRadiusSq = 1 / (mouseRadiusPx * mouseRadiusPx);

    /** Inertial mouse: smoothed cursor position (px) and fade for pull after pointer leaves. */
    let prevSmoothMs = 0;
    let smoothMouseXPx = null;
    let smoothMouseYPx = null;
    let mousePullBlend = 0;

    /**
     * Bitmap + simulation space must match the **rendered** canvas box.
     * Setting `canvas.width` / `canvas.height` updates intrinsic bitmap size; relying only on `%`
     * width/height can leave the layout box at the default (300×150), so the mesh appears as a
     * small tile in the top-left. Pin display size with explicit `px` after each bitmap resize.
     * Sizes come from `wrap.getBoundingClientRect()` plus `Math.max` against `canvas.clientWidth`.
     */
    function layoutWithSize(cssW, cssH) {
      /** Resolve the canvas dpr. */
      const dpr = resolveCanvasDpr(maxDpr);
      /** Set the css width and height. */
      stateRef.current.cssW = cssW;
      stateRef.current.cssH = cssH;
      /** Set the dpr. */
      stateRef.current.dpr = dpr;
      /** If the css width and height are less than 2, set the points and edges to an empty array, set the canvas width and height to 0, and return. */
      if (cssW < 2 || cssH < 2) {
        stateRef.current.points = [];
        stateRef.current.edges = [];
        canvas.style.width = '0px';
        canvas.style.height = '0px';
        canvas.width = 0;
        canvas.height = 0;
        return;
      }

      /** Set the canvas width and height. */
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      /** Set the canvas style width and height. */
      // canvas.style.width = `${cssW}px`;
      // canvas.style.height = `${cssH}px`;

      /** Build the points, bins, and edges. */
      const points = buildPoints(cssW, cssH, cellSize, motionScale);
      /** Get the bin size. */
      const binSize = maxLinkDistance;
      /** Build the buckets. */
      const buckets = buildBuckets(points, binSize);
      /** Build the edges. */
      const edges = buildEdges(points, buckets, binSize, maxLinkDistance, maxNeighbors);
      /** Set the points and edges. */
      stateRef.current.points = points;
      /** Set the edges. */
      stateRef.current.edges = edges;
      growBuffers(points.length, edges.length);
      prevSmoothMs = 0;
      smoothMouseXPx = null;
      smoothMouseYPx = null;
      mousePullBlend = 0;
    }

    function layout() {
      // canvas.style.display = 'block';
      /** Force a reflow to ensure the canvas is the correct size. */
      void wrap.offsetHeight;
      /** Get the section bounds. */
      const section = wrap.closest('section');
      /** Get the wrap bounds. */
      const wr = wrap.getBoundingClientRect();
      /** Get the parent bounds. */
      const pr = wrap.parentElement?.getBoundingClientRect();
      /** Get the section bounds. */
      const sr = section?.getBoundingClientRect();
      /** Section is the real hero bounds; inner wraps can be anomalously small under lazy + motion. */
      const base = sr ?? wr;
      /** Calculate the canvas width and height. */
      let cssW = Math.max(2, Math.round(base.width));
      let cssH = Math.max(2, Math.round(base.height));
      /** If the parent is smaller than the wrap, use the parent's bounds. */
      if (pr) {
        cssW = Math.max(cssW, Math.round(pr.width));
        cssH = Math.max(cssH, Math.round(pr.height));
      }
      /** If the wrap is smaller than the canvas, use the wrap's bounds. */
      cssW = Math.max(cssW, Math.round(wr.width));
      cssH = Math.max(cssH, Math.round(wr.height));
      /** Set the canvas width and height. */
      // canvas.style.width = `${cssW}px`;
      // canvas.style.height = `${cssH}px`;
      /** Get the canvas client width and height. */
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (cw >= 2 && ch >= 2) {
        /** If the canvas client width and height are smaller than the canvas width and height, use the canvas client width and height. */
        cssW = Math.max(cssW, cw);
        cssH = Math.max(cssH, ch);
      }
      /** Layout the canvas with the calculated width and height. */
      layoutWithSize(cssW, cssH);
    }

    /** Last draw time. */
    let lastDrawMs = 0;

    function updatePositions(animTime) {
      /** Get the state. */
      const st = stateRef.current;
      /** Get the points, css width, and css height. */
      const { points, cssW, cssH } = st;
      const nPoints = points.length;
      const t = isStatic || reducedMotionRef.current ? 0 : animTime * timeScale;

      /** Update the positions of the points. */
      for (let i = 0; i < nPoints; i++) {
        const p = points[i];
        posX[i] = p.baseX + Math.sin(t * p.freq + p.phaseX) * 10;
        posY[i] = p.baseY + Math.cos(t * p.freq * 1.03 + p.phaseY) * 10;
      }
    }

    function drawFrame(tMs) {
      /** Get the state. */
      const st = stateRef.current;
      /** Get the points, edges, css width, css height, and dpr. */
      const { points, edges, cssW, cssH, dpr } = st;
      if (!ctx || cssW === 0) return;

      /** Get the animation time. */
      const animTime =
        isStatic || reducedMotionRef.current ? 0 : tMs;
      st.time = animTime;

      /**
       * Synchronous global wave: warp `animTime` so every point and edge accelerates and stalls
       * together instead of drifting at a constant phase. The instantaneous speed
       * (d wavyAnimTime / d animTime) is `1 + waveAmp * 0.1 * sin(wavePhase)`, so with the
       * default waveAmp=10 it swings between 0 (paused) and 2x (burst). The integrated
       * `(1 - cos)` form keeps wavyAnimTime monotonic, so motion never plays backwards.
       */
      const wavePhase = animTime * waveFreq * Math.PI * 2;
      const waveStrength = waveAmp * 0.1;
      const wavyAnimTime =
        animTime * 16 + (waveStrength / (waveFreq * Math.PI * 2)) * (1 - Math.cos(wavePhase));

      /** Get the number of points and edges. */
      const nPoints = points.length;
      const E = edges.length;
      /** Grow the buffers. */
      growBuffers(nPoints, E);

      /** Update the positions. */
      updatePositions(wavyAnimTime);

      /** Set the transform. */
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /** Fill the canvas with a semi-transparent background. */
      ctx.fillStyle = 'rgb(250 248 244 / 0.02)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      /** Set the transform. */
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      /** Raw / smoothed mouse position (px); smoothed lags the cursor for inertial pull. */
      const rawMx = st.mouseX * cssW;
      const rawMy = st.mouseY * cssH;
      /** Get whether the mouse is on the canvas. */
      const mouseOn = mouseInfluence && !isStatic && st.mouseActive;

      let mx = rawMx;
      let my = rawMy;
      if (mouseInfluence && !isStatic) {
        if (smoothMouseXPx === null) {
          smoothMouseXPx = rawMx;
          smoothMouseYPx = rawMy;
        }
        const dtSec =
          prevSmoothMs > 0 ? Math.min(0.08, (tMs - prevSmoothMs) / 1000) : 1 / 60;
        prevSmoothMs = tMs;
        const followLambda = 1 - Math.exp(-dtSec * mouseFollowHz);
        smoothMouseXPx += (rawMx - smoothMouseXPx) * followLambda;
        smoothMouseYPx += (rawMy - smoothMouseYPx) * followLambda;

        const blendTarget = mouseOn ? 1 : 0;
        const blendLambda = 1 - Math.exp(-dtSec * mouseBlendHz);
        mousePullBlend += (blendTarget - mousePullBlend) * blendLambda;

        mx = smoothMouseXPx;
        my = smoothMouseYPx;
      }

      const mousePullActive =
        mouseInfluence && !isStatic && (mouseOn || mousePullBlend > 1e-4);

      /** Draw the edges. */
      for (let e = 0; e < E; e++) {
        const { i, j } = edges[e];
        /** Get the position of the start point. */
        const ax = posX[i];
        const ay = posY[i];
        /** Get the position of the end point. */
        const bx = posX[j];
        const by = posY[j];
        /** Get the distance between the start and end points. */
        const dx = bx - ax;
        const dy = by - ay;
        /** Get the length squared of the distance between the start and end points. */
        const lenSq = dx * dx + dy * dy;
        /** Get the length of the distance between the start and end points. */
        const len = lenSq > 1e-12 ? Math.sqrt(lenSq) : 1;
        /** Get the normal vector of the distance between the start and end points. */
        const nx = -dy / len;
        const ny = dx / len;
        /** Get the middle point of the start and end points. */
        const midX = (ax + bx) * 0.5;
        const midY = (ay + by) * 0.5;

        /** Get the bow amount (uses the same wavyAnimTime as updatePositions so edges and points share the wave phase). */
        let s = bowAmount(midX, midY, wavyAnimTime, timeScale, noiseCoordScale, breatheAmp);

        /** Get the bow cap. */
        const bowCap = Math.max(breatheAmp * 2.2, len * 5.5);
        /** If the bow amount is greater than the bow cap, set the bow amount to the bow cap. */
        if (s > bowCap) s = bowCap;
        /** If the bow amount is less than the bow cap, set the bow amount to the bow cap. */
        else if (s < -bowCap) s = -bowCap;

        /** Get the control point x and y. */
        let cpX = midX + nx * s;
        let cpY = midY + ny * s;

        /** Bend each link toward the (smoothed) cursor; blend fades out for inertial release. */
        if (mousePullActive) {
          /** Get the distance between the middle point and the mouse. */
          const ddx = mx - midX;
          const ddy = my - midY;
          /** Get the falloff of the distance between the middle point and the mouse. */
          const falloff = Math.exp(-(ddx * ddx + ddy * ddy) * invMouseRadiusSq);
          /** Get the pull of the distance between the middle point and the mouse. */
          const pull = falloff * mouseStrength;
          /** Update the control point x and y. */
          cpX += ddx * pull ** 1.5 * mousePullBlend;
          cpY += ddy * pull ** 1.5 * -1 * mousePullBlend;
        }

        /** Set the edge x and y. */
        eAx[e] = ax;
        eAy[e] = ay;
        /** Set the control point x and y. */
        eCpX[e] = cpX;
        eCpY[e] = cpY;
        /** Set the edge x and y. */
        eBx[e] = bx;
        eBy[e] = by;

        /** Get the normalized distance between the start and end points. */
        const distNorm = clamp01(len / maxLinkDistance);
        /** Get the line width. */
        const lineWidth = 0.5 + (1 - distNorm) * 0.82;
        /** Get the alpha. */
        const alpha = 0.026 + (1 - distNorm) * 0.35;
        /** Set the edge key. */
        eKey[e] = packStrokeKey(lineWidth, alpha);
      }

      /** Sort the edges. */
      for (let i = 0; i < E; i++) sortIdx[i] = i;
      /** If the number of edges is greater than 1, sort the edges. */
      if (E > 1) {
        sortIdx.subarray(0, E).sort((a, b) => eKey[a] - eKey[b]);
      }

      /** Set the line cap. */
      ctx.lineCap = 'round';
      ctx.strokeStyle = strokeRgb;

      /** Draw the edges. */
      let g = 0;
      /** While the group is less than the number of edges, draw the edges. */
      while (g < E) {
        /** Get the key. */
        const key = eKey[sortIdx[g]];
        /** Get the line width and alpha. */
        const { lineWidth: lw, alpha: al } = unpackStrokeKey(key);
        /** Get the next index. */
        let h = g + 1;
        /** While the next index is less than the number of edges and the key is the same, increment the next index. */
        while (h < E && eKey[sortIdx[h]] === key) h++;

        /** Set the global alpha. */
        ctx.globalAlpha = al;
        /** Set the line width. */
        ctx.lineWidth = lw;
        /** Draw the edges. */
        for (let k = g; k < h; k++) {
          /** Get the edge index. */
          const ei = sortIdx[k];
          ctx.beginPath();
          /** Move to the edge x and y. */
          ctx.moveTo(eAx[ei], eAy[ei]);
          /** Quadratic curve to the control point x and y. */
          ctx.quadraticCurveTo(eCpX[ei], eCpY[ei], eBx[ei], eBy[ei]);
          /** Stroke the path. */
          ctx.stroke();
        }
        /** Set the group to the next index. */
        g = h;
      }
      ctx.globalAlpha = 1;

      /** One subpath per dot — batched `arc` + single `fill` draws connector segments between circles (grey triangles). */
      if (nPoints > 0) {
        ctx.fillStyle = dotFill;
        for (let i = 0; i < nPoints; i++) {
          /** Begin the path. */
          ctx.beginPath();
          /** Arc to the position x and y. */
          ctx.arc(posX[i], posY[i], 1, 0, Math.PI * 2);
          /** Fill the path. */
          ctx.fill();
        }
      }
    }

    function loop(tMs) {
      /** If the running reference is not current, return. */
      if (!runningRef.current) return;
      /** If the time since the last draw is less than the minimum frame time, request an animation frame. */
      if (tMs - lastDrawMs < MIN_FRAME_MS) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      /** Set the last draw time. */
      lastDrawMs = tMs;
      /** Draw the frame. */
      drawFrame(tMs);
      if (!reducedMotionRef.current) {
        rafRef.current = requestAnimationFrame(loop);
      }
    }

    function startLoop() {
      if (runningRef.current) return;
      runningRef.current = true;
      rafRef.current = requestAnimationFrame(loop);
    }

    function stopLoop() {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
    }

    function tryStartLoop() {
      if (isStatic) return;
      if (!runLoopRef.current) return;
      if (reducedMotionRef.current) return;
      if (document.hidden) return;
      startLoop();
    }

    function redrawNow() {
      drawFrame(performance.now());
    }

    function onResize() {
      stopLoop();
      layout();
      drawFrame(performance.now());
      tryStartLoop();
    }

    function onMotionPreferenceChange() {
      setReduced();
      if (mqReduce.matches) {
        stopLoop();
        drawFrame(performance.now());
      } else {
        drawFrame(performance.now());
        tryStartLoop();
      }
    }
    mqReduce.addEventListener('change', onMotionPreferenceChange);

    function onVisibility() {
      if (document.hidden) {
        stopLoop();
      } else {
        drawFrame(performance.now());
        tryStartLoop();
      }
    }
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', onResize);

    const ro = new ResizeObserver(() => {
      onResize();
    });
    ro.observe(wrap);
    const sectionObs = wrap.closest('section');
    if (sectionObs) ro.observe(sectionObs);

    const io = new IntersectionObserver(
      ([entry]) => {
        const vis = entry?.isIntersecting ?? true;
        if (!vis) {
          stopLoop();
          return;
        }
        drawFrame(performance.now());
        tryStartLoop();
      },
      { threshold: 0, rootMargin: '80px' },
    );
    io.observe(wrap);

    function onMove(ev) {
      const proxy = wrap.closest('section') ?? wrap;
      const rect = proxy.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      const st = stateRef.current;
      st.mouseX = (ev.clientX - rect.left) / w;
      st.mouseY = (ev.clientY - rect.top) / h;
      st.mouseActive = true;
    }
    function onLeave() {
      stateRef.current.mouseActive = false;
    }

    if (mouseInfluence && !isStatic) {
      window.addEventListener('mousemove', onMove, { passive: true });
      window.addEventListener('blur', onLeave);
    }

    layout();
    drawFrame(performance.now());

    /** First measure can run before absolute layers finish layout — remeasure on the next frame(s). */
    let remeasureRaf1 = 0;
    let remeasureRaf2 = 0;
    remeasureRaf1 = requestAnimationFrame(() => {
      layout();
      drawFrame(performance.now());
      tryStartLoop();
      remeasureRaf2 = requestAnimationFrame(() => {
        layout();
        drawFrame(performance.now());
        tryStartLoop();
      });
    });

    engineRef.current = {
      tryStartLoop,
      stopLoop,
      redrawNow,
    };
    tryStartLoop();

    return () => {
      cancelAnimationFrame(remeasureRaf1);
      cancelAnimationFrame(remeasureRaf2);
      engineRef.current = null;
      stopLoop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      mqReduce.removeEventListener('change', onMotionPreferenceChange);
      if (mouseInfluence && !isStatic) {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('blur', onLeave);
      }
    };
  }, [cellSize, maxLinkDistance, maxNeighbors, jitterFraction, mouseInfluence, isStatic, maxDpr]);

  useEffect(() => {
    const e = engineRef.current;
    if (!e) return;
    if (runLoop) {
      e.redrawNow();
      e.tryStartLoop();
    } else {
      e.stopLoop();
    }
  }, [runLoop]);

  return (
    <div
      ref={wrapRef}
      className={`pointer-events-none absolute inset-0 ${className}`.trim()}
      aria-hidden
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
