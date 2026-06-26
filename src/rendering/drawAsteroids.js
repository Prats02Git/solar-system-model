// Small fixed palette of rock tones so the belt has texture without
// looking randomly noisy — real asteroids vary between dusty gray,
// iron-dark, and slightly rust-toned, not a single flat gray.
const ROCK_COLORS = ["#9a958d", "#7d7872", "#8c7a6b", "#666260"];
 
export function drawAsteroids(
  ctx,
  asteroids,
  elapsed,
  sunX,
  sunY,
  camera,
  zoom,
  viewMode
) {
  asteroids.forEach((a) => {
    const angle =
      a.angle +
      elapsed * 0.02;
    const radius =
      a.radius * zoom;
    const x =
      sunX +
      Math.cos(angle) *
      radius;
    const y =
      sunY +
      Math.sin(angle) *
      (viewMode === "iso"
        ? radius * 0.4
        : radius);
 
    const screenX =
      x - camera.x;
    const screenY =
      y - camera.y;
 
    // Stable per-asteroid variance derived from its own orbital
    // values, so each rock keeps the same size/color/depth across
    // frames instead of flickering randomly every render.
    const seed = (a.angle * 97.13 + a.radius * 13.7) % 1;
    const size = Math.max(1, zoom * (0.6 + seed * 1.6));
    const color = ROCK_COLORS[Math.floor(seed * ROCK_COLORS.length)];
 
    // Asteroids further from the sun on the far side of the belt sit
    // slightly dimmer, giving the ring a hint of depth instead of a
    // flat painted-on look.
    const depthAlpha = 0.55 + ((Math.sin(angle) + 1) / 2) * 0.45;
 
    ctx.save();
    ctx.globalAlpha = depthAlpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(
      screenX,
      screenY,
      size,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.restore();
  });
}