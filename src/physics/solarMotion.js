import { GALACTIC_DRIFT_SPEED } from "./constants";

export function getSolarSystemPosition(
  elapsed,
  width,
  centerY
) {

  const startX = -250;

  const travelDistance =
    width + 1000;

  const x =
    startX +
    (
      (elapsed * GALACTIC_DRIFT_SPEED)
      % travelDistance
    );

  return {
    x,
    y: centerY
  };
}