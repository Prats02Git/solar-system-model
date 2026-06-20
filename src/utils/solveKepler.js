export function solveKepler(M, e) {
  let E = M;

  for (let i = 0; i < 5; i++) {
    E =
      E -
      (E - e * Math.sin(E) - M) /
      (1 - e * Math.cos(E));
  }

  return E;
}