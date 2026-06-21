import { useState } from "react";

export default function Controls({
  viewModeRef,
  speedRef,
  setTrailMode,
  resetTrails,
  cameraModeRef
}) {

  const [cameraMode, setCameraMode] =
    useState("heliocentric");

  const speeds = [1, 5, 20, 100];

  const setSpeed = (speed) => {
    speedRef.current = speed;
    resetTrails();
  };

  const setView = (view) => {
    viewModeRef.current = view;
    resetTrails();
  };

  const setCamera = (mode) => {
    cameraModeRef.current = mode;
    setCameraMode(mode);

    if (mode === "heliocentric") {
      setTrailMode("orbit");
    }

    resetTrails();
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 20,
        zIndex: 10,
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        maxWidth: 900
      }}
    >

      {/* Camera Mode */}

      <button
        onClick={() =>
          setCamera("heliocentric")
        }
      >
        Heliocentric
      </button>

      <button
        onClick={() =>
          setCamera("galactic")
        }
      >
        Galactic
      </button>

      {/* View Mode */}

      <button
        onClick={() =>
          setView("top")
        }
      >
        Top View
      </button>

      <button
        onClick={() =>
          setView("iso")
        }
      >
        3D View
      </button>

      {/* Speed */}

      {speeds.map((speed) => (
        <button
          key={speed}
          onClick={() =>
            setSpeed(speed)
          }
        >
          {speed}x
        </button>
      ))}

      {/* Trails only in Galactic */}

      {cameraMode === "galactic" && (
        <>
          <button
            onClick={() => {
              setTrailMode("orbit");
              resetTrails();
            }}
          >
            Orbit Trail
          </button>

          <button
            onClick={() => {
              setTrailMode("space");
              resetTrails();
            }}
          >
            Space Trail
          </button>

          <button
            onClick={() => {
              setTrailMode("both");
              resetTrails();
            }}
          >
            Both
          </button>
        </>
      )}

      <button
        onClick={resetTrails}
      >
        Clear Trails
      </button>

    </div>
  );
}