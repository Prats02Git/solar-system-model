import React, { useEffect, useRef, useState } from "react";
import { drawPlanet } from "../utils/drawPlanet";
import { drawSun } from "../utils/drawSun";
import { solveKepler } from "../utils/solveKepler";

const planets = [
  { name: "Mercury", distance: 50, period: 88, radius: 10, eccentricity: 0.2056, color: "#A5A5A5" },
  { name: "Venus", distance: 80, period: 225, radius: 14, eccentricity: 0.0068, color: "#E3BB76" },
  { name: "Earth", distance: 120, period: 365, radius: 15, eccentricity: 0.0167, color: "#92b8ea" },
  { name: "Mars", distance: 160, period: 687, radius: 12, eccentricity: 0.0934, color: "#E27B58" },
  { name: "Jupiter", distance: 220, period: 4333, radius: 28, eccentricity: 0.0489, color: "#D39C7E" },
  { name: "Saturn", distance: 280, period: 10759, radius: 24, eccentricity: 0.0565, color: "#C5AB6E" },
  { name: "Uranus", distance: 340, period: 30687, radius: 18, eccentricity: 0.0463, color: "#BBE1E4" },
  { name: "Neptune", distance: 400, period: 60190, radius: 18, eccentricity: 0.0086, color: "#6081FF" }
];

export default function SolarSystem() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const textures = useRef({});
  
  const hoveredRef = useRef(null);

  const viewModeRef = useRef("iso");

  const trailModeRef = useRef("both");
  
  const [hoveredPlanet, setHoveredPlanet] = useState(null);

  const zoomRef = useRef(1);
  const speedRef = useRef(1);

  const lastPlanetX = useRef({});

  const orbitTrails = useRef({});
  const spaceTrails = useRef({});

  const [trailMode, setTrailMode] = useState("both");

  const starsRef = useRef(
   Array.from({ length: 600 }, () => ({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          z: Math.random(), // depth
          seed: Math.random() * Math.PI * 2
        }))
  )

  const asteroidsRef = useRef(
    Array.from({ length: 300 }, () => ({
        angle: Math.random() * Math.PI * 2,
        radius: 185 + Math.random() * 25
    }))
    );


  const clearTrails = () => {
  Object.keys(orbitTrails.current)
    .forEach(name => {
      orbitTrails.current[name] = [];
      spaceTrails.current[name] = [];
    });
  };

  useEffect(() => {
    trailModeRef.current = trailMode;
  }, [trailMode]);

  useEffect(() => {
    planets.forEach((planet) => {
        const img = new Image();
        img.src = `/images/${planet.name.toLowerCase()}.png`;
        textures.current[planet.name] = img;
        orbitTrails.current[planet.name] = [];
        spaceTrails.current[planet.name] = [];
    });
    }, []);


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let animationId;

    const stars = starsRef.current;

    const asteroids = asteroidsRef.current;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    canvas.addEventListener("mousemove", handleMouseMove);


    const handleWheel = (e) => {
        e.preventDefault();

        let next =
        e.deltaY > 0
            ? zoomRef.current * 0.9
            : zoomRef.current * 1.1;

        next = Math.min(Math.max(next, 0.4), 3);

        zoomRef.current = next;
    };

        canvas.addEventListener(
        "wheel",
        handleWheel,
        { passive: false }
        );

    const startTime = performance.now();

    const render = (time) => {
      const elapsed = ((time - startTime) / 1000) * speedRef.current;

      const w = canvas.width;
      const h = canvas.height;

      
      const centerX = w / 2;
      const centerY = h / 2;

      const sunX =
        ((centerX + elapsed * 4) % w + w) % w;

        const sunY =
        centerY +
        Math.sin(elapsed * 0.05) * 40;

          ctx.fillStyle = "#03000a";
          ctx.fillRect(0, 0, w, h);

        

      stars.forEach((star) => {
      const speed = 0.2 + star.z * 0.8;

      const x = (star.x - elapsed * speed * 20) % w;
      const y = star.y;

      const size = 0.5 + star.z * 1.5;

      ctx.globalAlpha = 0.3 + star.z;

      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(x < 0 ? x + w : x, y, size, 0, Math.PI * 2);
      ctx.fill();
    });

      ctx.globalAlpha = 1;

      const nebulaX =
        centerX +
        Math.sin(elapsed * 0.02) * 300;

        const nebulaY =
        centerY +
        Math.cos(elapsed * 0.015) * 200;

      const nebula = ctx.createRadialGradient(
        nebulaX,
        nebulaY,
        0,
        nebulaX,
        nebulaY,
        w
      );

      nebula.addColorStop(0, "rgba(120,80,255,0.25)");
      nebula.addColorStop(0.5, "rgba(60,120,255,0.08)");
      nebula.addColorStop(1, "transparent");

      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, w, h);

      drawSun(
        ctx,
        sunX,
        sunY
        );

      asteroids.forEach((a) => {
        const angle = a.angle + elapsed * 0.02;

        const beltRadius =
            a.radius * zoomRef.current;

        const x =
            sunX +
            Math.cos(angle) *
            beltRadius;

        const y =
            sunY +
            Math.sin(angle) *
            (viewModeRef.current === "iso"
                ? beltRadius * 0.4
                : beltRadius);

        ctx.fillStyle = "#888";

        ctx.beginPath();
        ctx.arc(
        x,
        y,
        Math.max(
            1,
            zoomRef.current
        ),
        0,
        Math.PI * 2
        );
        ctx.fill();
        });

      let hovered = null;

    const previousSunX = lastPlanetX.current.sun;

    if (
      previousSunX !== undefined &&
      previousSunX > canvas.width - 20 &&
      sunX < 20
    ) {
      clearTrails();
    }

    lastPlanetX.current.sun = sunX;

    planets.forEach((p) => {

  const e = p.eccentricity;

  const a =
    p.distance * zoomRef.current;

  // --------------------
  // KEPLER SECOND LAW
  // --------------------

  const simulationScale = 500;

  const meanMotion =
    ((2 * Math.PI) / p.period) *
    simulationScale;

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

  // distance from sun
  const r =
    a *
    (1 - e * Math.cos(E));

  // --------------------
  // SUN AT FOCUS
  // --------------------

  const relativeX =
    r * Math.cos(theta);

  const relativeY =
    r * Math.sin(theta);

  const x =
    sunX + relativeX;

  const y =
    sunY +
    relativeY *
      (viewModeRef.current === "iso"
        ? 0.4
        : 1);

  // --------------------
  // ORBIT TRAIL
  // --------------------

  orbitTrails.current[p.name].push({
    x: relativeX,
    y: relativeY
  });

  if (
    orbitTrails.current[p.name]
      .length > 200
  ) {
    orbitTrails.current[p.name]
      .shift();
  }

  // --------------------
  // SPACE TRAIL
  // --------------------

  spaceTrails.current[p.name].push({
    x,
    y
  });

  if (
    spaceTrails.current[p.name]
      .length > 200
  ) {
    spaceTrails.current[p.name]
      .shift();
  }

  // --------------------
  // ORBIT TRAIL DRAW
  // --------------------

  if (
    trailModeRef.current === "orbit" ||
    trailModeRef.current === "both") {

    const trail =
      orbitTrails.current[p.name];

    ctx.beginPath();

    trail.forEach(
      (point, index) => {

        const px =
          sunX + point.x;

        const py =
          sunY +
          point.y *
            (viewModeRef.current === "iso"
              ? 0.4
              : 1);

        if (index === 0)
          ctx.moveTo(px, py);
        else
          ctx.lineTo(px, py);
      }
    );

    ctx.strokeStyle =
      p.color;

    ctx.globalAlpha = 0.8;

    ctx.lineWidth = 1;

    ctx.stroke();

    ctx.globalAlpha = 1;
  }

  // --------------------
  // SPACE TRAIL DRAW
  // --------------------

  if (
    trailModeRef.current === "space" ||
    trailModeRef.current === "both"
  ) {

    const trail =
      spaceTrails.current[p.name];

    ctx.beginPath();

    trail.forEach(
      (point, index) => {

        if (index === 0)
          ctx.moveTo(
            point.x,
            point.y
          );
        else
          ctx.lineTo(
            point.x,
            point.y
          );
      }
    );

    ctx.strokeStyle =
      "white";

    ctx.globalAlpha = 0.2;

    ctx.lineWidth = 1;

    ctx.stroke();

    ctx.globalAlpha = 1;
  }

  // --------------------
  // PLANET
  // --------------------

  drawPlanet(
    ctx,
    textures.current[p.name],
    p,
    x,
    y,
    zoomRef.current
  );

  // --------------------
  // HOVER
  // --------------------

  const dx =
    mouseRef.current.x - x;

  const dy =
    mouseRef.current.y - y;

  if (
    Math.sqrt(dx * dx + dy * dy) <
    p.radius + 10
  ) {
    hovered = {
      ...p,
      x,
      y
    };
  }
});

      if (
        hoveredRef.current?.name !== hovered?.name ||
        hoveredRef.current?.x !== hovered?.x ||
        hoveredRef.current?.y !== hovered?.y
        ){
        hoveredRef.current = hovered;
        setHoveredPlanet(hovered);
    }

      animationId =
        requestAnimationFrame(render);
    };

    animationId =
      requestAnimationFrame(render);

    return () => {

        canvas.removeEventListener(
        "wheel",
        handleWheel
        );

      cancelAnimationFrame(animationId);
      window.removeEventListener(
        "resize",
        resize
      );
      canvas.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };
  }, []);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 10,
          display: "flex",
          gap: 10
        }}
      >
        <button
          onClick={() => {
              viewModeRef.current = "top";
             clearTrails();
            }
          }
        >
          Top View
        </button>

        <button
          onClick={() =>
            { 
                 viewModeRef.current = "iso";
                clearTrails();
            }
        }
        >
          3D View
        </button>

        <button
          onClick={() => {
            speedRef.current = 1;
            clearTrails();
            }}
        >
          1x
        </button>

        <button
          onClick={() => {
            speedRef.current = 5;
            clearTrails();
          }}
        >
          5x
        </button>

        <button
          onClick={() => {
            speedRef.current = 20;
            clearTrails();
          }}
        >
          20x
        </button>

        <button
          onClick={() => {
            speedRef.current = 50;
            clearTrails();
          }}
        >
          50x
        </button>

        <button
          onClick={() => {
            clearTrails();
          }}
        >
          100x
        </button>

        <button onClick={() => {
          setTrailMode("orbit");
          clearTrails();
        }}>
        Orbit Trail
      </button>

      <button onClick={() => {
        setTrailMode("space")
        clearTrails();
      }}>
        Space Trail
      </button>

      <button onClick={() => {
        setTrailMode("both");
        clearTrails();
        }}>
        Both
      </button>

      </div>

      {hoveredPlanet && (
        <div
          style={{
            position: "absolute",
            left: hoveredPlanet.x + 20,
            top: hoveredPlanet.y,
            padding: "10px",
            color: "white",
            background:
              "rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "12px",
            zIndex: 20
          }}
        >
          <div>
            <b>{hoveredPlanet.name}</b>
          </div>
          <div>
            Orbit: {hoveredPlanet.period}
            days
          </div>
          <div>
            Distance:
            {" "}
            {hoveredPlanet.distance}
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100vw",
          height: "100vh"
        }}
      />
    </>
  );
}