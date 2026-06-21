export function drawStars(
  ctx,
  stars,
  solarSystemX,
  width,
  elapsed
) {
  stars.forEach((star) => {

    const x =
      star.x -
      solarSystemX * 0.02;

    const size =
      star.size ||
      (0.5 + star.z * 1.5);

    const twinkle =
      0.5 +
      Math.sin(
        elapsed * 2 +
        star.phase
      ) * 0.5;

    const alpha =
      0.2 +
      twinkle * 0.8;

    ctx.save();

    ctx.globalAlpha = alpha;

    if (size > 1.5) {
      ctx.shadowBlur =
        size * 8;

      ctx.shadowColor =
        "white";
    }


    ctx.fillStyle = star.color;

    ctx.beginPath();

    ctx.arc(
      x < 0 ? x + width : x,
      star.y,
      size,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.restore();
  });
}