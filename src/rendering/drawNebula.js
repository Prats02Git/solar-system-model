export function drawNebulaCloud(
  ctx,
  x,
  y,
  radius,
  color
) {
  const g = ctx.createRadialGradient(
    x,
    y,
    0,
    x,
    y,
    radius
  );
 
  // A midpoint stop softens the falloff so the cloud fades out
  // gradually instead of risking a faint visible edge where the
  // gradient meets full transparency.
  g.addColorStop(0, color);
  g.addColorStop(0.6, color);
  g.addColorStop(1, "rgba(0,0,0,0)");
 
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(
    x,
    y,
    radius,
    0,
    Math.PI * 2
  );
  ctx.fill();
}