export const drawShip = (ctx, ship) => {
  ctx.save();

  ctx.translate(ship.x, ship.y);
  ctx.rotate(ship.angle);

  ctx.shadowBlur = 20;
  ctx.shadowColor = "#00ffff";

  ctx.fillStyle = "white";

  ctx.beginPath();
  ctx.moveTo(18, 0);
  ctx.lineTo(-12, -10);
  ctx.lineTo(-6, 0);
  ctx.lineTo(-12, 10);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#00ffff";

  ctx.beginPath();
  ctx.moveTo(-12, 0);
  ctx.lineTo(-22, -4);
  ctx.lineTo(-22, 4);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
};