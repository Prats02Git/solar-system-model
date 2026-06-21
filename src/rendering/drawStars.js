export function drawStars(
  ctx,
  stars,
  solarSystemX,
  width
) {
  stars.forEach((star) => {

    const speed =
      0.2 + star.z * 0.8;

    const x =
      star.x -
      solarSystemX * 0.02;

    const size =
      0.5 + star.z * 1.5;

    ctx.globalAlpha =
      0.3 + star.z;

    ctx.fillStyle = "white";

    ctx.beginPath();

    ctx.arc(
      x < 0 ? x + width : x,
      star.y,
      size,
      0,
      Math.PI * 2
    );

    ctx.fill();
  });

  ctx.globalAlpha = 1;
}