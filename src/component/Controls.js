import { useState } from "react";
 
// Token system, derived from the simulation itself rather than a
// generic UI kit: the accent color is the sun's own corona color
// (#ff9900), so the panel reads as part of the instrument cluster
// for this specific scene, not a borrowed dashboard skin.
const COLORS = {
  panelBg: "rgba(25, 3, 34, 0.86)",
  panelBorder: "rgba(255, 153, 0, 0.18)",
  divider: "rgba(255, 255, 255, 0.08)",
  label: "#f5f6f8",
  idle: "#cfd3dc",
  idleBg: "#11151f",
  idleBgHover: "#1c2230",
  idleBorder: "rgba(255, 255, 255, 0.07)",
  activeText: "#ffd9a0",
  activeBg: "rgba(255, 153, 0, 0.14)",
  activeBorder: "#ff9900",
  cameraAccent: "#7ec8ff",
  cameraActiveText: "#cfe9ff",
  cameraActiveBg: "rgba(126, 200, 255, 0.14)"
};
 
const FONT_STACK =
  '"JetBrains Mono", "SF Mono", "Roboto Mono", ui-monospace, monospace';
 
function Tab({ label, active, onClick, accent = COLORS.activeBorder, activeText = COLORS.activeText, activeBg = COLORS.activeBg }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        fontFamily: FONT_STACK,
        fontSize: 11,
        letterSpacing: "0.04em",
        padding: "7px 12px",
        borderRadius: 3,
        border: `1px solid ${active ? accent : COLORS.idleBorder}`,
        background: active ? activeBg : COLORS.idleBg,
        color: active ? activeText : COLORS.idle,
        cursor: "pointer",
        position: "relative",
        transition: "background 120ms ease, border-color 120ms ease, color 120ms ease",
        boxShadow: active ? `0 0 10px -2px ${accent}` : "none"
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = COLORS.idleBgHover;
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = COLORS.idleBg;
      }}
    >
      {label}
      {active && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 8,
            right: 8,
            bottom: 3,
            height: 1.5,
            background: accent,
            boxShadow: `0 0 6px ${accent}`
          }}
        />
      )}
    </button>
  );
}
 
function GroupLabel({ children }) {
  return (
    <span
      style={{
        fontFamily: FONT_STACK,
        fontSize: 9.5,
        letterSpacing: "0.14em",
        color: COLORS.label,
        textTransform: "uppercase",
        marginRight: 5,
        alignSelf: "center",
        whiteSpace: "nowrap"
      }}
    >
      {children}
    </span>
  );
}
 
function Divider() {
  return (
    <div
      style={{
        width: 1,
        alignSelf: "stretch",
        background: COLORS.divider,
        margin: "2px 4px"
      }}
    />
  );
}
 
export default function Controls({
  viewModeRef,
  speedRef,
  setTrailMode,
  resetTrails,
  cameraModeRef
}) {
  const [cameraMode, setCameraMode] = useState("heliocentric");
  const [viewMode, setViewModeState] = useState("iso");
  const [speed, setSpeedState] = useState(1);
  const [trailMode, setTrailModeState] = useState("orbit");
 
  const speeds = [1, 5, 20, 100];
 
  const setSpeed = (value) => {
    speedRef.current = value;
    setSpeedState(value);
    resetTrails();
  };
 
  const setView = (view) => {
    viewModeRef.current = view;
    setViewModeState(view);
    resetTrails();
  };
 
  const setCamera = (mode) => {
    cameraModeRef.current = mode;
    setCameraMode(mode);
    if (mode === "heliocentric") {
      setTrailMode("orbit");
      setTrailModeState("orbit");
    }
    resetTrails();
  };
 
  const chooseTrail = (mode) => {
    setTrailMode(mode);
    setTrailModeState(mode);
    resetTrails();
  };
 
  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        left: 16,
        zIndex: 10,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 6,
        maxWidth: 720,
        padding: "10px 12px",
        borderRadius: 6,
        background: COLORS.panelBg,
        border: `1px solid ${COLORS.panelBorder}`,
        backdropFilter: "blur(6px)",
        boxShadow: "0 8px 28px rgba(0, 0, 0, 0.45)"
      }}
    >
      {/* Camera Mode */}
      <GroupLabel>View origin</GroupLabel>
      <Tab
        label="Heliocentric"
        active={cameraMode === "heliocentric"}
        onClick={() => setCamera("heliocentric")}
        accent={COLORS.cameraAccent}
        activeText={COLORS.cameraActiveText}
        activeBg={COLORS.cameraActiveBg}
      />
      <Tab
        label="Galactic"
        active={cameraMode === "galactic"}
        onClick={() => setCamera("galactic")}
        accent={COLORS.cameraAccent}
        activeText={COLORS.cameraActiveText}
        activeBg={COLORS.cameraActiveBg}
      />
 
      <Divider />
 
      {/* View Mode */}
      <GroupLabel>Projection</GroupLabel>
      <Tab label="Top" active={viewMode === "top"} onClick={() => setView("top")} />
      <Tab label="3D" active={viewMode === "iso"} onClick={() => setView("iso")} />
 
      <Divider />
 
      {/* Speed */}
      <GroupLabel>Time scale</GroupLabel>
      {speeds.map((s) => (
        <Tab
          key={s}
          label={`${s}\u00D7`}
          active={speed === s}
          onClick={() => setSpeed(s)}
        />
      ))}
 
      {/* Trails only in Galactic */}
      {cameraMode === "galactic" && (
        <>
          <Divider />
          <GroupLabel>Trails</GroupLabel>
          <Tab label="Orbit" active={trailMode === "orbit"} onClick={() => chooseTrail("orbit")} />
          <Tab label="Space" active={trailMode === "space"} onClick={() => chooseTrail("space")} />
          <Tab label="Both" active={trailMode === "both"} onClick={() => chooseTrail("both")} />
        </>
      )}
 
      <Divider />
 
      <button
        onClick={resetTrails}
        style={{
          fontFamily: FONT_STACK,
          fontSize: 11,
          letterSpacing: "0.04em",
          padding: "7px 12px",
          borderRadius: 3,
          border: "1px solid rgba(11, 30, 169, 0.2)",
          background: "transparent",
          color: COLORS.label,
          cursor: "pointer",
          transition: "color 120ms ease, border-color 120ms ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = COLORS.idle;
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.18)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = COLORS.label;
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.07)";
        }}
      >
        Clear trails
      </button>
    </div>
  );
}