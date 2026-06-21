export default function PlanetTooltip({
  planet
}) {

  if (!planet) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: planet.x + 20,
        top: planet.y,
        padding: "10px",
        color: "white",
        background:
          "rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
        border:
          "1px solid rgba(255,255,255,0.2)",
        borderRadius: "12px",
        zIndex: 20
      }}
    >
      <div>
        <b>{planet.name}</b>
      </div>

      <div>
        Orbit: {planet.period} days
      </div>

      <div>
        Distance: {planet.distanceAU}
      </div>

      <div>
        Eccentricity:
        {" "}
        {planet.eccentricity}
      </div>
    </div>
  );
}