export function drawSun(
  ctx,
  x,
  y,
  zoom = 1
) {

  const radius =
    25 *
    Math.sqrt(zoom);

  // Corona
  for (let i = 5; i >= 1; i--) {

    ctx.globalAlpha = 0.08;

    ctx.fillStyle = "#ffb300";

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      radius +
        i *
        12 *
        Math.sqrt(zoom),
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  ctx.globalAlpha = 1;

  ctx.shadowBlur =
    50 *
    Math.sqrt(zoom);

  ctx.shadowColor =
    "#ff9900";

  const gradient =
    ctx.createRadialGradient(
      x - radius * 0.3,
      y - radius * 0.3,
      1,
      x,
      y,
      radius
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
    radius,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.shadowBlur = 0;
}