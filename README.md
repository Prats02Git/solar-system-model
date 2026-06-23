Solar System Simulator

A visually rich Solar System Simulator built with React and HTML5 Canvas that demonstrates planetary motion using Keplerian orbital mechanics.

The project combines scientific concepts with interactive visualization, allowing users to explore how planets orbit the Sun while the Solar System itself moves through space.

Features
Interactive Solar System visualization
Realistic elliptical planetary orbits
Variable orbital speed based on Kepler's Equation
Orbital eccentricity support for each planet
Orbital inclination for pseudo-3D visualization
Heliocentric camera mode
Galactic camera mode
Orbit Trails
Space Trails
Solar barycenter wobble influenced by planetary masses
Dynamic star field with twinkling effects
Planet information tooltips
Mouse wheel zoom support
Responsive desktop
Physics & Simulation

This project uses simplified astronomical models to create realistic planetary motion while maintaining excellent browser performance.

Keplerian Orbits

Planet positions are calculated using:

Mean Anomaly (M)
Eccentric Anomaly (E)
True Anomaly (θ)

Kepler's Equation is solved numerically using the Newton-Raphson method.

This produces:

Elliptical orbits
Faster motion near perihelion
Slower motion near aphelion

similar to how planets move in reality.

Orbital Inclination

Each planet has its own orbital inclination.

The simulation projects inclined orbits into a pseudo-3D view, allowing planets to appear above and below the orbital plane.

Solar Barycenter Wobble

The Sun does not remain perfectly stationary.

Large planets such as Jupiter and Saturn shift the Solar System's barycenter, causing a visible wobble in the Sun's position.

The simulator visualizes this effect using relative planetary masses.

Galactic Drift

The Solar System is shown moving through space.

In Galactic Mode:

The camera remains fixed.
The Sun travels across the screen.
Planets continue orbiting while moving with the Solar System.

This reveals the difference between a planet's orbit around the Sun and its overall trajectory through space.

Camera Modes
Heliocentric Mode

The camera follows the Sun.

Best for observing:

Planetary orbits
Orbital eccentricity
Relative planet motion
Galactic Mode

The camera remains stationary.

Best for observing:

Solar System motion
Space trajectories
Galactic-scale visualization
Trail Modes
Orbit Trail

Shows a planet's path relative to the Sun.

Useful for studying:

Elliptical orbits
Orbital shape
Orbital inclination
Space Trail

Shows the planet's trajectory through space while the Solar System itself moves.

Useful for understanding:

Galactic motion
Relative reference frames
Planet trajectories through space
Technology Stack
React
JavaScript (ES6+)
HTML5 Canvas
CSS3
Performance Optimizations

The simulator is designed to run efficiently in the browser.

Optimizations include:

Canvas rendering instead of DOM animation
React refs for simulation state
Limited trail history
Mobile-specific particle counts
RequestAnimationFrame rendering loop
Dynamic zoom scaling