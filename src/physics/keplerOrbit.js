import { solveKepler } from "../utils/solveKepler";
import { SIMULATION_SCALE } from "./constants";

export function calculateOrbitPosition(
  planet,
  elapsed,
  zoom
) {
  const e = planet.eccentricity;

  const a =
    Math.log(
      planet.distanceAU + 1
    ) *
    150 *
    zoom;

  const meanMotion =
    ((2 * Math.PI) /
      planet.period) *
    SIMULATION_SCALE;

  const M =
    (elapsed * meanMotion) %
    (Math.PI * 2);

  const E =
    solveKepler(M, e);

  const theta =
    2 *
    Math.atan2(
      Math.sqrt(1 + e) *
        Math.sin(E / 2),
      Math.sqrt(1 - e) *
        Math.cos(E / 2)
    );

  const r =
    a *
    (1 - e * Math.cos(E));

  const inclinationRad =
    planet.inclination *
    Math.PI /
    180;

  const relativeX =
    r * Math.cos(theta);

  const relativeY =
    r *
    Math.sin(theta) *
    Math.cos(
      inclinationRad
    );

  const z =
    r *
    Math.sin(theta) *
    Math.sin(
      inclinationRad
    );

    return {
      relativeX,
      relativeY,
      z,
      r,
      theta
    };
}