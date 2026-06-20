export function drawSun(ctx, x, y) {
  // Corona layers
  for (let i = 5; i >= 1; i--) {
    ctx.globalAlpha = 0.08;

    ctx.fillStyle = "#ffb300";

    ctx.beginPath();
    ctx.arc(
      x,
      y,
      25 + i * 12,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  ctx.globalAlpha = 1;

  ctx.shadowBlur = 50;
  ctx.shadowColor = "#ff9900";

  const gradient = ctx.createRadialGradient(
    x - 8,
    y - 8,
    1,
    x,
    y,
    25
  );

  gradient.addColorStop(0, "#FFF7A0");
  gradient.addColorStop(0.4, "#FDB813");
  gradient.addColorStop(1, "#FF6B00");

  ctx.fillStyle = gradient;

  ctx.beginPath();
  ctx.arc(x, y, 25, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;
}