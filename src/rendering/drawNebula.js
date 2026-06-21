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

  g.addColorStop(0, color);
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