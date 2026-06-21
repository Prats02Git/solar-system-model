export function updateTrail(
  trail,
  point,
  maxLength = 100
) {
  trail.push(point);

  const isMobile = window.innerWidth < 768;

  maxLength = isMobile ? 30 : 100;

  if (trail.length > maxLength) {
    trail.shift();
  }
}

export function drawOrbitTrail(
  ctx,
  trail,
  sunX,
  sunY,
  camera,
  color,
  viewMode
) {
  if (!trail.length) return;

  ctx.beginPath();

  trail.forEach((point, index) => {

    const px =
      sunX +
      point.x -
      camera.x;

    const py =
      sunY +
      point.y *
      (
        viewMode === "iso"
          ? 0.4
          : 1
      ) -
      camera.y;

    if (index === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  });

  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.8;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.globalAlpha = 1;
}

export function drawSpaceTrail(
  ctx,
  trail,
  camera
) {
  if (!trail.length) return;

  ctx.beginPath();

  trail.forEach((point, index) => {

    const x =
      point.x -
      camera.x;

    const y =
      point.y -
      camera.y;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.strokeStyle = "white";
  ctx.globalAlpha = 0.2;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.globalAlpha = 1;
}

export function clearTrails(
  orbitTrails,
  spaceTrails
) {
  Object.keys(
    orbitTrails.current
  ).forEach((name) => {

    orbitTrails.current[name] = [];
    spaceTrails.current[name] = [];
  });
}