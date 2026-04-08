# Orbital: Earth Guardian

A standalone browser prototype for a space-themed Earth observation game built around real NASA feeds:

- NASA GIBS imagery for the planet and science layers
- NASA EONET for live natural hazard missions
- NASA POWER for scanned regional weather and climate metrics

## Run

Any static server works. For example:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Controls

- Drag the globe or use arrow keys to change orbit perspective
- Click Earth to scan a visible region
- Switch layers to inspect terrain, vegetation, aerosols, and ocean heat
- Use Mission, Explorer, and Sandbox modes to change the play style
- Fast-forward the year to visualize future Earth-system stress

## Notes

- If any NASA API is unavailable, the prototype falls back to local simulated missions or projected scan metrics so the experience still works.
- The science overlays are grounded in NASA products, while some gameplay values are stylized for responsiveness and game feel.
