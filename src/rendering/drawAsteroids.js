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

    ctx.fillStyle = "#888";

    ctx.beginPath();

    const screenX =
      x - camera.x;

    const screenY =
      y - camera.y;

    ctx.arc(
      screenX,
      screenY,
      Math.max(1, zoom),
      0,
      Math.PI * 2
    );

    ctx.fill();
  });
}