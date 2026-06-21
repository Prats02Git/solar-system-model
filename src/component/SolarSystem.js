import React, { useEffect, useRef, useState } from "react";

import Controls from "./Controls";
import PlanetTooltip from "./PlanetTooltip";

import { planets } from "../data/planets";
import { getCameraPosition } from "../physics/camera";
import { getSolarSystemPosition } from "../physics/solarMotion";
import { calculateOrbitPosition } from "../physics/keplerOrbit";
import { calculateBarycenterOffset } from "../physics/barycenter";

import { drawPlanet } from "../rendering/drawPlanet";
import { drawSun } from "../rendering/drawSun";
import { drawStars } from "../rendering/drawStars";
import { drawAsteroids } from "../rendering/drawAsteroids";

import {
  updateTrail,
  drawOrbitTrail,
  drawSpaceTrail,
  clearTrails
} from "../rendering/drawTrails";

export default function SolarSystem() {
  const canvasRef = useRef(null);

  const mouseRef = useRef({ x: 0, y: 0 });

  const textures = useRef({});
  const orbitTrails = useRef({});
  const spaceTrails = useRef({});

  const cameraModeRef = useRef("heliocentric");
  const viewModeRef = useRef("iso");
  const speedRef = useRef(1);
  const zoomRef = useRef(1);
  const trailModeRef = useRef("both");

  const hoveredRef = useRef(null);

  const [hoveredPlanet, setHoveredPlanet] = useState(null);
  const [trailMode, setTrailMode] = useState("both");

  const resetTrails = () => clearTrails(orbitTrails, spaceTrails);

  const starsRef = useRef([]);
  const asteroidsRef = useRef([]);

  // =========================
  // INIT ASSETS
  // =========================
  useEffect(() => {
    planets.forEach((planet) => {
      const img = new Image();
      img.src = `${process.env.PUBLIC_URL}/images/${planet.name.toLowerCase()}.png`;
      textures.current[planet.name] = img;

      orbitTrails.current[planet.name] = [];
      spaceTrails.current[planet.name] = [];
    });
  }, []);

  // =========================
  // TRAIL MODE SYNC
  // =========================
  useEffect(() => {
    trailModeRef.current = trailMode;
  }, [trailMode]);

  // =========================
  // CANVAS + RENDER LOOP
  // =========================
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // -------------------------
    // RESIZE (DPR SAFE)
    // -------------------------
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // regenerate stars on resize
      const isMobile = window.innerWidth < 768;

      starsRef.current = Array.from(
        { length: isMobile ? 250 : 600 },
        () => ({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          z: Math.random()
        })
      );
    };

    resize();
    window.addEventListener("resize", resize);

    // -------------------------
    // INPUT
    // -------------------------
    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouch = (e) => {
      const t = e.touches[0];
      mouseRef.current = { x: t.clientX, y: t.clientY };
    };

    const handleWheel = (e) => {
      if (window.innerWidth < 768) return;

      e.preventDefault();

      const next =
        e.deltaY > 0
          ? zoomRef.current * 0.9
          : zoomRef.current * 1.1;

      zoomRef.current = Math.min(Math.max(next, 0.4), 3);
    };

    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("touchmove", handleTouch, { passive: true });
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    // -------------------------
    // ANIMATION
    // -------------------------
    const startTime = performance.now();
    let animationId;

    const render = (time) => {
      const isMobile = window.innerWidth < 768;

      const elapsed =
        ((time - startTime) / 1000) *
        speedRef.current *
        (isMobile ? 0.7 : 1);

      const w = window.innerWidth;
      const h = window.innerHeight;

      const centerX = w / 2;

      const centerY = h / 2;

      // background
      ctx.fillStyle = "#03000a";
      ctx.fillRect(0, 0, w, h);

      // solar motion
      const solarPos = getSolarSystemPosition(elapsed, w, centerY);

      drawStars(ctx, starsRef.current, solarPos.x, w);

      const barycenter = calculateBarycenterOffset(
        planets,
        elapsed,
        zoomRef.current
      );

      const sunX = solarPos.x + barycenter.x;
      const sunY = solarPos.y + barycenter.y;

      const camera = getCameraPosition(
        cameraModeRef.current,
        sunX,
        sunY,
        w,
        h
      );

      drawSun(
        ctx,
        sunX - camera.x,
        sunY - camera.y,
        zoomRef.current
      );

      drawAsteroids(
        ctx,
        asteroidsRef.current,
        elapsed,
        sunX,
        sunY,
        camera,
        zoomRef.current,
        viewModeRef.current
      );

      let hovered = null;

      planets.forEach((planet) => {
        const orbit = calculateOrbitPosition(
          planet,
          elapsed,
          zoomRef.current
        );

        const x = sunX + orbit.relativeX;

        const isoScale =
          viewModeRef.current === "iso"
            ? isMobile ? 0.25 : 0.4
            : 1;

        const y =
          sunY +
          orbit.relativeY * isoScale -
          orbit.z * 0.2;

        updateTrail(
          orbitTrails.current[planet.name],
          { x: orbit.relativeX, y: orbit.relativeY }
        );

        updateTrail(
          spaceTrails.current[planet.name],
          { x, y }
        );

        if (
          trailModeRef.current === "orbit" ||
          trailModeRef.current === "both"
        ) {
          drawOrbitTrail(
            ctx,
            orbitTrails.current[planet.name],
            sunX,
            sunY,
            camera,
            planet.color,
            viewModeRef.current
          );
        }

        if (
          trailModeRef.current === "space" ||
          trailModeRef.current === "both"
        ) {
          drawSpaceTrail(
            ctx,
            spaceTrails.current[planet.name],
            camera
          );
        }

        const screenX = x - camera.x;
        const screenY = y - camera.y;

        drawPlanet(
          ctx,
          textures.current[planet.name],
          planet,
          screenX,
          screenY,
          zoomRef.current
        );

        const dx = mouseRef.current.x - screenX;
        const dy = mouseRef.current.y - screenY;

        if (Math.sqrt(dx * dx + dy * dy) < planet.radius + 10) {
          hovered = { ...planet, x: screenX, y: screenY };
        }
      });

      if (hoveredRef.current?.name !== hovered?.name) {
        hoveredRef.current = hovered;
        setHoveredPlanet(hovered);
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    // -------------------------
    // CLEANUP
    // -------------------------
    return () => {
      cancelAnimationFrame(animationId);

      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("touchmove", handleTouch);
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <>
      <Controls
        viewModeRef={viewModeRef}
        speedRef={speedRef}
        setTrailMode={setTrailMode}
        resetTrails={resetTrails}
        cameraModeRef={cameraModeRef}
      />

      <PlanetTooltip planet={hoveredPlanet} />

      <canvas
        ref={canvasRef}
        style={{
          width: "100vw",
          height: "100vh",
          display: "block",
          position: "fixed",
          top: 0,
          left: 0
        }}
      />
    </>
  );
}