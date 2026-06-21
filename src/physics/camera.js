export function getCameraPosition(
  mode,
  sunX,
  sunY,
  w,
  h
) {

  switch(mode) {

    case "heliocentric":
      return {
        x: sunX - w / 2,
        y: sunY - h / 2
      };

    case "galactic":
      return {
        x: 0,
        y: 0
      };

    default:
      return {
        x: sunX - w / 2,
        y: sunY - h / 2
      };
  }
}