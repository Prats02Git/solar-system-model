// Update history is capped shorter on mobile to keep per-frame trail
// drawing cheap on weaker GPUs — same intent as the original, just
// without the misleading API of accepting a maxLength param and then
// immediately overwriting it.
export function updateTrail(
  trail,
  point
) {
  trail.push(point);
 
  const isMobile = window.innerWidth < 768;
  const maxLength = isMobile ? 30 : 100;
 
  if (trail.length > maxLength) {
    trail.shift();
  }
}
 
// Shared tapered, fading stroke used by both trail types. Each
// segment gets its own alpha/width based on how old it is (oldest
// point = index 0), so the trail reads as a fading motion history
// instead of a flat uniform line. A short bright glow pass is added
// near the head only, both for performance (shadowBlur is expensive
// per-call) and because a glow along the entire faded tail would
// muddy the fade rather than support it.
function strokeFadingTrail(ctx, points, color, { baseAlpha, baseWidth, glow }) {
  if (points.length < 2) return;
 
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
 
  for (let i = 1; i < points.length; i++) {
    const age = i / points.length; // 0 = oldest, 1 = newest
 
    ctx.beginPath();
    ctx.moveTo(points[i - 1].x, points[i - 1].y);
    ctx.lineTo(points[i].x, points[i].y);
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.04 + age * baseAlpha;
    ctx.lineWidth = 0.4 + age * baseWidth;
    ctx.stroke();
  }
 
  if (glow) {
    const headStart = Math.max(0, points.length - 9);
 
    ctx.shadowBlur = 6;
    ctx.shadowColor = color;
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 1.4;
 
    ctx.beginPath();
    ctx.moveTo(points[headStart].x, points[headStart].y);
    for (let i = headStart + 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
  }
 
  ctx.restore();
  ctx.globalAlpha = 1;
}
 
export function drawOrbitTrail(
  ctx,
  trail,
  sunX,
  sunY,
  camera,
  color,
  viewMode,
  isoScale = 0.4 // pass the same scale used to draw the planet itself
) {
  if (!trail.length) return;
 
  const scale = viewMode === "iso" ? isoScale : 1;
 
  const points = trail.map((point) => ({
    x: sunX + point.x - camera.x,
    y: sunY + point.y * scale - camera.y
  }));
 
  // Orbit trails are the "primary" story — relative path around the
  // sun — so they get the full bright treatment with a glowing head.
  strokeFadingTrail(ctx, points, color, {
    baseAlpha: 0.56,
    baseWidth: 1.8,
    glow: true
  });
}
 
export function drawSpaceTrail(
  ctx,
  trail,
  camera,
  color = "#bcd4ff"
) {
  if (!trail.length) return;
 
  const points = trail.map((point) => ({
    x: point.x - camera.x,
    y: point.y - camera.y
  }));
 
  // Space trails show the planet's absolute drift through the galaxy
  // alongside the sun's own motion, so they're drawn fainter and
  // thinner than the orbit trail — a secondary, quieter signal rather
  // than competing with it. Uses the planet's own color (instead of a
  // flat hardcoded white) so it's identifiable when several planets'
  // trails are visible together, but at low enough alpha that it
  // doesn't read as a second copy of the orbit trail.
  strokeFadingTrail(ctx, points, color, {
    baseAlpha: 0.22,
    baseWidth: 1.0,
    glow: false
  });
}
 
export function clearTrails(
  orbitTrails,
  spaceTrails
) {
  Object.keys(
    orbitTrails.current
  ).forEach((name) => {
 
    orbitTrails.current[name] = [];
    spaceTrails.current[name] = [];
  });
}