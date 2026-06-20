export function drawPlanet(
  ctx,
  texture,
  planet,
  x,
  y,
  zoom
) {
  ctx.save();

  ctx.shadowBlur = 20;
  ctx.shadowColor = planet.color;

  const radius = planet.radius * zoom;

  if (
    texture &&
    texture.complete &&
    texture.naturalWidth > 0
  ) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.clip();

    ctx.drawImage(
      texture,
      x - radius,
      y - radius,
      radius * 2,
      radius * 2
    );
  } else {
    ctx.fillStyle = planet.color;

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

  ctx.restore();
}