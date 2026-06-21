import {
  PLANET_MASSES,
  SUN_WOBBLE_SCALE
} from "./constants";

export function calculateBarycenterOffset(
  planets,
  elapsed,
  zoom
) {
  let offsetX = 0;
  let offsetY = 0;

  planets.forEach((planet) => {

    const mass =
      PLANET_MASSES[
        planet.name
      ] || 0;

    const angle =
      elapsed *
      (2 * Math.PI) /
      planet.period;

    const distance =
      planet.distanceAU * zoom;

    offsetX +=
      Math.cos(angle) *
      distance *
      mass;

    offsetY +=
      Math.sin(angle) *
      distance *
      mass;
  });

  return {
    x:
      -offsetX *
      SUN_WOBBLE_SCALE,
    y:
      -offsetY *
      SUN_WOBBLE_SCALE
  };
}