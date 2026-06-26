export function drawSun(
  ctx,
  x,
  y,
  zoom = 1,
  elapsed = 0
) {
  const radius =
    25 *
    Math.sqrt(zoom);
 
  // A slow, subtle brightness flicker so the star feels active rather
  // than a static painted disc. Two sine waves at different speeds
  // avoid an obviously periodic "breathing" pulse.
  const flicker =
    1 +
    Math.sin(elapsed * 1.3) * 0.02 +
    Math.sin(elapsed * 3.7) * 0.012;
 
  // Corona: one continuous radial gradient instead of stacked flat
  // rings. Stacked circles at constant alpha band visibly; a single
  // gradient falls off smoothly the way a glow actually looks.
  ctx.save();
  const coronaRadius = radius * 4.2 * flicker;
 
  const corona = ctx.createRadialGradient(
    x,
    y,
    radius * 0.6,
    x,
    y,
    coronaRadius
  );
 
  corona.addColorStop(0, "rgba(255, 200, 90, 0.55)");
  corona.addColorStop(0.35, "rgba(255, 153, 0, 0.18)");
  corona.addColorStop(0.7, "rgba(255, 110, 0, 0.06)");
  corona.addColorStop(1, "rgba(255, 80, 0, 0)");
 
  ctx.fillStyle = corona;
  ctx.beginPath();
  ctx.arc(x, y, coronaRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
 
  // Core
  ctx.save();
  ctx.shadowBlur =
    50 *
    Math.sqrt(zoom) *
    flicker;
  ctx.shadowColor =
    "#ff9900";
 
  const gradient =
    ctx.createRadialGradient(
      x - radius * 0.3,
      y - radius * 0.3,
      1,
      x,
      y,
      radius * flicker
    );
  gradient.addColorStop(
    0,
    "#FFF7A0"
  );
  gradient.addColorStop(
    0.4,
    "#FDB813"
  );
  gradient.addColorStop(
    1,
    "#FF6B00"
  );
  ctx.fillStyle =
    gradient;
  ctx.beginPath();
  ctx.arc(
    x,
    y,
    radius * flicker,
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.restore();
}