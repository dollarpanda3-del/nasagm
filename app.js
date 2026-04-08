const CURRENT_YEAR = 2026;

const LAYERS = {
  terrain: {
    name: "MODIS Terra True Color",
    description: "True-color Earth imagery for land, cloud, and ocean context.",
    overlay: null,
    legend: null,
  },
  vegetation: {
    name: "MODIS Terra NDVI 8 Day",
    description: "Vegetation vigor reveals biosphere stress and recovery.",
    overlay: "MODIS_Terra_NDVI_8Day",
    legend: "https://gibs.earthdata.nasa.gov/legends/MODIS_NDVI_H.png",
  },
  atmosphere: {
    name: "MODIS Terra Aerosol",
    description: "Aerosol depth highlights dust, smoke, and pollution patterns.",
    overlay: "MODIS_Terra_Aerosol",
    legend: null,
  },
  ocean: {
    name: "MUR Sea Surface Temperature Anomaly",
    description: "Ocean heat anomalies reveal marine stress and storm energy.",
    overlay: "GHRSST_L4_MUR_Sea_Surface_Temperature_Anomalies",
    legend:
      "https://gibs.earthdata.nasa.gov/legends/GHRSST_Sea_Surface_Temperature_Anomalies_H.png",
  },
};

const BASE_LAYER = "MODIS_Terra_CorrectedReflectance_TrueColor";
const BASE_FALLBACK =
  'radial-gradient(circle at 34% 30%, rgba(94, 210, 255, 0.45), transparent 20%), radial-gradient(circle at 55% 56%, rgba(49, 255, 186, 0.2), transparent 18%), linear-gradient(180deg, #0b2440 0%, #0e567f 32%, #1b6893 62%, #143150 100%)';

const FALLBACK_EVENTS = [
  {
    id: "fallback-amazon",
    title: "Amazon Canopy Heat Surge",
    description: "Heat stress and smoke signatures climbing over the western Amazon.",
    categories: [{ id: "wildfires", title: "Wildfires" }],
    geometry: [{ type: "Point", date: "2026-04-07T12:00:00Z", coordinates: [-63.4, -8.8] }],
  },
  {
    id: "fallback-atlantic",
    title: "Atlantic Cyclogenesis Watch",
    description: "Warm-water corridor could intensify future tropical systems.",
    categories: [{ id: "severeStorms", title: "Severe Storms" }],
    geometry: [{ type: "Point", date: "2026-04-06T12:00:00Z", coordinates: [-44.2, 17.8] }],
  },
  {
    id: "fallback-indian",
    title: "Indian Ocean Coral Bleaching Front",
    description: "Persistent marine heat is reducing resilience along reef systems.",
    categories: [{ id: "waterColor", title: "Water Color" }],
    geometry: [{ type: "Point", date: "2026-04-08T00:00:00Z", coordinates: [78.1, -12.2] }],
  },
];

const INSIGHTS = {
  terrain:
    "Terrain mode shows true-color Earth as astronauts might see it, making storm structure, coastlines, and cloud belts easy to compare at a glance.",
  vegetation:
    "Vegetation layers reveal how healthy photosynthetic activity shifts with drought, fire, and recovery, turning biosphere change into something you can see instead of read about.",
  atmosphere:
    "Atmospheric aerosol layers surface smoke, dust, and haze transport, connecting wildfires and pollution to wider weather and air-quality patterns.",
  ocean:
    "Ocean heat anomalies expose warm pools that feed stronger storms, stress reefs, and alter circulation, helping you anticipate climate pressure from orbit.",
};

const MISSION_COPY = {
  wildfires: {
    focusLayer: "atmosphere",
    objective: "Predict spread corridors and direct orbital fire-watch assets.",
    response: "Deploy FireSat thermal relays and reinforce biosphere resilience.",
  },
  severeStorms: {
    focusLayer: "ocean",
    objective: "Track intensification and project coastal risk from sea-surface heat.",
    response: "Raise storm mesh coverage and support evacuation intelligence.",
  },
  volcanoes: {
    focusLayer: "atmosphere",
    objective: "Monitor plume drift and protect the atmosphere network.",
    response: "Use aerosol scans to estimate plume transport corridors.",
  },
  floods: {
    focusLayer: "terrain",
    objective: "Analyze rainfall energy and surface runoff exposure.",
    response: "Tune rainfall watch corridors and redirect orbital mapping time.",
  },
  waterColor: {
    focusLayer: "ocean",
    objective: "Track marine stress and preserve ocean current stability.",
    response: "Route ocean relays to cooling hotspots and biodiversity zones.",
  },
};

const dom = {
  body: document.body,
  starfield: document.getElementById("starfield"),
  earthGlobe: document.getElementById("earthGlobe"),
  earthBase: document.getElementById("earthBase"),
  earthOverlay: document.getElementById("earthOverlay"),
  earthNight: document.getElementById("earthNight"),
  markerLayer: document.getElementById("markerLayer"),
  trackLayer: document.getElementById("trackLayer"),
  scanReticle: document.getElementById("scanReticle"),
  yearRange: document.getElementById("yearRange"),
  yearLabel: document.getElementById("yearLabel"),
  layerTitle: document.getElementById("layerTitle"),
  legendImage: document.getElementById("legendImage"),
  layerControls: document.getElementById("layerControls"),
  modeControls: document.getElementById("modeControls"),
  destinationControls: document.getElementById("destinationControls"),
  speedControls: document.getElementById("speedControls"),
  missionList: document.getElementById("missionList"),
  insightText: document.getElementById("insightText"),
  missionLog: document.getElementById("missionLog"),
  dataHealth: document.getElementById("dataHealth"),
  dataTimestamp: document.getElementById("dataTimestamp"),
  sceneTitle: document.getElementById("sceneTitle"),
  destinationLabel: document.getElementById("destinationLabel"),
  modeLabel: document.getElementById("modeLabel"),
  activeMissionTitle: document.getElementById("activeMissionTitle"),
  activeMissionBody: document.getElementById("activeMissionBody"),
  clockLabel: document.getElementById("clockLabel"),
  guardianSummary: document.getElementById("guardianSummary"),
  scanTitle: document.getElementById("scanTitle"),
  scanCoordinates: document.getElementById("scanCoordinates"),
  scanStatus: document.getElementById("scanStatus"),
  tempMetric: document.getElementById("tempMetric"),
  windMetric: document.getElementById("windMetric"),
  rainMetric: document.getElementById("rainMetric"),
  solarMetric: document.getElementById("solarMetric"),
  bioMetric: document.getElementById("bioMetric"),
  aerosolMetric: document.getElementById("aerosolMetric"),
  guardianMeters: document.getElementById("guardianMeters"),
  deploySatelliteButton: document.getElementById("deploySatelliteButton"),
  scanSweepButton: document.getElementById("scanSweepButton"),
  interventionControls: document.getElementById("interventionControls"),
  orbitalStage: document.getElementById("orbitalStage"),
  planetZone: document.getElementById("planetZone"),
  orbitLongitude: document.getElementById("orbitLongitude"),
  orbitTilt: document.getElementById("orbitTilt"),
  guardianSummaryText: document.getElementById("guardianSummary"),
  layerBox: document.getElementById("legendBox"),
  clock: document.getElementById("clockLabel"),
  projectionLabel: document.getElementById("projectionLabel"),
  modeLabelText: document.getElementById("modeLabel"),
  sceneOrbitLabel: document.getElementById("destinationLabel"),
  dataHealthText: document.getElementById("dataHealth"),
  dataTimestampText: document.getElementById("dataTimestamp"),
  aerosolSlider: document.getElementById("aerosolSlider"),
  rewildingSlider: document.getElementById("rewildingSlider"),
  oceanHeatSlider: document.getElementById("oceanHeatSlider"),
  aerosolValue: document.getElementById("aerosolValue"),
  rewildingValue: document.getElementById("rewildingValue"),
  oceanHeatValue: document.getElementById("oceanHeatValue"),
};

const state = {
  mode: "mission",
  destination: "leo",
  layer: "terrain",
  year: CURRENT_YEAR,
  speed: 0,
  rotation: -18,
  tilt: 16,
  autoSpin: 0.22,
  scanPoint: {
    lat: 12.5,
    lon: -34,
    label: "Atlantic Thermal Corridor",
  },
  hoveredMissionId: null,
  activeMissionId: null,
  missions: [],
  satellites: 2,
  dragging: false,
  pointerMoved: false,
  dragStart: null,
  scanMetrics: null,
  eventsLoaded: false,
  powerAbortController: null,
  guardian: {
    atmosphere: 72,
    biosphere: 69,
    oceans: 66,
    shield: 74,
  },
  sandbox: {
    aerosol: 35,
    rewilding: 52,
    oceanHeat: 41,
  },
  syncStatus: {
    gibs: "live",
    eonet: "syncing",
    power: "idle",
  },
  sampleMaps: new Map(),
  markers: [],
  animationStart: performance.now(),
  lastFrame: performance.now(),
};

function buildGibsUrl(layerId, options = {}) {
  const params = new URLSearchParams({
    SERVICE: "WMS",
    REQUEST: "GetMap",
    VERSION: "1.1.1",
    LAYERS: layerId,
    STYLES: "",
    FORMAT: options.format || "image/png",
    TRANSPARENT: options.transparent === false ? "FALSE" : "TRUE",
    SRS: "EPSG:4326",
    WIDTH: String(options.width || 2048),
    HEIGHT: String(options.height || 1024),
    BBOX: "-180,-90,180,90",
  });

  return `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?${params.toString()}`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function wrapLongitude(lon) {
  let value = lon;
  while (value < -180) value += 360;
  while (value > 180) value -= 360;
  return value;
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function categoryKey(event) {
  return event?.categories?.[0]?.id || "wildfires";
}

function categoryLabel(event) {
  return event?.categories?.[0]?.title || "Wildfires";
}

function categoryClass(category) {
  if (category === "severeStorms") return "storm";
  if (category === "floods" || category === "waterColor") return "water";
  return "fire";
}

function latestGeometry(event) {
  const geometry = event.geometry || [];
  return geometry[geometry.length - 1] || geometry[0] || null;
}

function formatLatLon(lat, lon) {
  const latSuffix = lat >= 0 ? "N" : "S";
  const lonSuffix = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(1)}°${latSuffix}, ${Math.abs(lon).toFixed(1)}°${lonSuffix}`;
}

function average(values) {
  const valid = values.filter((value) => Number.isFinite(value));
  if (!valid.length) return null;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

function dateRangeForPower() {
  const end = new Date();
  const start = new Date(end);
  start.setUTCDate(end.getUTCDate() - 4);

  return {
    start: toPowerDate(start),
    end: toPowerDate(end),
  };
}

function toPowerDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function projectPoint(lat, lon) {
  const radius = dom.earthGlobe.clientWidth / 2;
  const rot = toRadians(state.rotation);
  const tilt = toRadians(state.tilt);
  const latRad = toRadians(lat);
  const lonRad = toRadians(lon);

  const x = Math.cos(latRad) * Math.sin(lonRad + rot);
  const y = Math.sin(latRad);
  const z = Math.cos(latRad) * Math.cos(lonRad + rot);

  const yTilt = y * Math.cos(tilt) - z * Math.sin(tilt);
  const zTilt = y * Math.sin(tilt) + z * Math.cos(tilt);

  return {
    x: radius + x * radius,
    y: radius - yTilt * radius,
    visible: zTilt > 0,
    depth: zTilt,
  };
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function pointToLatLon(clientX, clientY) {
  const rect = dom.earthGlobe.getBoundingClientRect();
  const radius = rect.width / 2;
  const x = (clientX - rect.left - radius) / radius;
  const yTilt = -(clientY - rect.top - radius) / radius;
  const distance = Math.hypot(x, yTilt);

  if (distance > 1) {
    return null;
  }

  const zTilt = Math.sqrt(1 - distance * distance);
  const tilt = toRadians(state.tilt);
  const rot = toRadians(state.rotation);

  const y = yTilt * Math.cos(tilt) + zTilt * Math.sin(tilt);
  const z = -yTilt * Math.sin(tilt) + zTilt * Math.cos(tilt);

  const lat = Math.asin(clamp(y, -1, 1));
  const lon = Math.atan2(x, z) - rot;

  return {
    lat: (lat * 180) / Math.PI,
    lon: wrapLongitude((lon * 180) / Math.PI),
  };
}

function projectedYearStress() {
  const yearOffset = Math.max(0, state.year - CURRENT_YEAR);
  return clamp(yearOffset * 1.35 + state.sandbox.oceanHeat * 0.22 + state.sandbox.aerosol * 0.18, 0, 100);
}

function layerBlendOpacity() {
  if (state.layer === "terrain") {
    return 0;
  }

  const stress = projectedYearStress() / 100;
  return clamp(0.56 + stress * 0.18, 0.5, 0.82);
}

function updateBodyMode() {
  dom.body.classList.toggle("is-sandbox", state.mode === "sandbox");
  dom.modeLabel.textContent =
    state.mode === "mission"
      ? "Mission Mode"
      : state.mode === "explorer"
        ? "Explorer Mode"
        : "Sandbox Mode";
}

function updateDestination() {
  const titles = {
    leo: {
      scene: "Earth in Low Orbit",
      label: "Low Earth Orbit",
    },
    station: {
      scene: "Orbital Station Watch",
      label: "Space Station",
    },
    moon: {
      scene: "Moon Base Earthrise",
      label: "Moon Base",
    },
  };

  const { scene, label } = titles[state.destination];
  dom.sceneTitle.textContent = scene;
  dom.destinationLabel.textContent = label;
  dom.planetZone.classList.remove("orbit-zone-leo", "orbit-zone-station", "orbit-zone-moon");
  dom.planetZone.classList.add(`orbit-zone-${state.destination}`);
}

function updateLayerVisuals() {
  const layer = LAYERS[state.layer];
  dom.layerTitle.textContent = layer.name;
  dom.insightText.textContent = INSIGHTS[state.layer];
  dom.legendImage.classList.toggle("hidden", !layer.legend);

  if (layer.legend) {
    dom.legendImage.src = layer.legend;
  } else {
    dom.legendImage.removeAttribute("src");
  }

  dom.earthBase.style.backgroundImage = `url("${buildGibsUrl(BASE_LAYER, {
    format: "image/jpeg",
    transparent: false,
    width: 2048,
    height: 1024,
  })}"), ${BASE_FALLBACK}`;

  if (layer.overlay) {
    dom.earthOverlay.style.backgroundImage = `url("${buildGibsUrl(layer.overlay, {
      format: "image/png",
      transparent: true,
      width: 2048,
      height: 1024,
    })}")`;
  } else {
    dom.earthOverlay.style.backgroundImage = "none";
  }

  dom.earthOverlay.style.setProperty("--overlay-opacity", layerBlendOpacity());
  document.documentElement.style.setProperty("--overlay-opacity", String(layerBlendOpacity()));
}

function updateRangeLabels() {
  dom.yearLabel.textContent = String(Math.round(state.year));
  dom.aerosolValue.textContent = `${state.sandbox.aerosol}%`;
  dom.rewildingValue.textContent = `${state.sandbox.rewilding}%`;
  dom.oceanHeatValue.textContent = `${state.sandbox.oceanHeat}%`;
  dom.projectionLabel.textContent =
    state.year === CURRENT_YEAR
      ? "Present-day NASA measurements with projected Earth-system stress."
      : `Future projection: ${state.year - CURRENT_YEAR} years beyond the live NASA baseline.`;
}

function updateGuardianMeters() {
  const stress = projectedYearStress();
  const adjusted = {
    atmosphere: clamp(state.guardian.atmosphere - stress * 0.18 + state.sandbox.rewilding * 0.06, 10, 100),
    biosphere: clamp(state.guardian.biosphere - stress * 0.22 + state.sandbox.rewilding * 0.18, 8, 100),
    oceans: clamp(state.guardian.oceans - stress * 0.2 - state.sandbox.oceanHeat * 0.08, 6, 100),
    shield: clamp(state.guardian.shield - stress * 0.12 + state.satellites * 1.8, 18, 100),
  };

  let total = 0;
  dom.guardianMeters.querySelectorAll(".meter").forEach((meter) => {
    const key = meter.dataset.meter;
    const value = adjusted[key];
    total += value;
    meter.querySelector("strong").textContent = `${Math.round(value)}%`;
    meter.querySelector(".meter-track span").style.width = `${value}%`;
  });

  dom.guardianSummary.textContent = `${Math.round(total / 4)}%`;
  dom.body.style.setProperty("--year-glow", String(stress));
  dom.earthGlobe.classList.toggle("future-stress", stress > 28);
}

function setActiveButtons() {
  dom.modeControls.querySelectorAll("[data-mode]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === state.mode);
  });
  dom.destinationControls.querySelectorAll("[data-destination]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.destination === state.destination);
  });
  dom.layerControls.querySelectorAll("[data-layer]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.layer === state.layer);
  });
  dom.speedControls.querySelectorAll("[data-speed]").forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.speed) === state.speed);
  });
  dom.interventionControls.querySelectorAll("[data-action]").forEach((button) => {
    button.classList.remove("is-active");
  });
}

function updateTelemetry(metrics) {
  if (!metrics) {
    dom.tempMetric.textContent = "--";
    dom.windMetric.textContent = "--";
    dom.rainMetric.textContent = "--";
    dom.solarMetric.textContent = "--";
    dom.bioMetric.textContent = "--";
    dom.aerosolMetric.textContent = "--";
    return;
  }

  dom.tempMetric.textContent = `${metrics.temperature.toFixed(1)}°C`;
  dom.windMetric.textContent = `${metrics.wind.toFixed(1)} m/s`;
  dom.rainMetric.textContent = `${metrics.precipitation.toFixed(1)} mm`;
  dom.solarMetric.textContent = `${metrics.solar.toFixed(1)} kWh`;
  dom.bioMetric.textContent = `${Math.round(metrics.biosphere)}%`;
  dom.aerosolMetric.textContent = `${Math.round(metrics.aerosol)}%`;
}

function setDataStatus() {
  const eonetLabel = state.syncStatus.eonet === "live" ? "Live EONET events" : "Fallback missions";
  const powerLabel = state.syncStatus.power === "live" ? "Live POWER metrics" : "Projected scan metrics";
  dom.dataHealth.textContent = `${eonetLabel} · ${powerLabel}`;
  dom.dataTimestamp.textContent = `NASA imagery active · ${new Date().toUTCString().replace("GMT", "UTC")}`;
}

function fallbackMetrics(lat, lon) {
  const heatBias = 30 - Math.abs(lat) * 0.22 + state.sandbox.oceanHeat * 0.04;
  const wind = 2.5 + Math.abs(Math.sin(toRadians(lon * 1.8))) * 7 + state.sandbox.aerosol * 0.01;
  const rain = Math.max(0, 5 + Math.cos(toRadians(lat * 2.6)) * 7 - state.sandbox.aerosol * 0.04);
  const solar = clamp(6.4 - Math.abs(lat) * 0.03 + Math.sin(toRadians(lon + 40)) * 0.8, 1.2, 8.5);
  const biosphere = clamp(80 - Math.abs(lat) * 0.5 + state.sandbox.rewilding * 0.26 - projectedYearStress() * 0.28, 8, 98);
  const aerosol = clamp(26 + state.sandbox.aerosol * 0.55 + Math.abs(Math.cos(toRadians(lon * 1.2))) * 16, 5, 99);

  return {
    temperature: heatBias + Math.max(0, state.year - CURRENT_YEAR) * 0.05,
    wind,
    precipitation: rain,
    solar,
    biosphere,
    aerosol,
  };
}

function projectionAdjustedMetrics(metrics) {
  const yearOffset = Math.max(0, state.year - CURRENT_YEAR);
  return {
    temperature: metrics.temperature + yearOffset * 0.05 + state.sandbox.oceanHeat * 0.015,
    wind: metrics.wind + yearOffset * 0.02,
    precipitation: Math.max(0, metrics.precipitation + Math.sin(yearOffset / 4) * 0.9),
    solar: Math.max(0, metrics.solar - yearOffset * 0.01),
    biosphere: clamp(metrics.biosphere - yearOffset * 0.42 + state.sandbox.rewilding * 0.05, 0, 100),
    aerosol: clamp(metrics.aerosol + yearOffset * 0.35 + state.sandbox.aerosol * 0.08, 0, 100),
  };
}

async function ensureSampleMap(key) {
  if (!LAYERS[key]?.overlay || state.sampleMaps.has(key)) {
    return state.sampleMaps.get(key) || null;
  }

  const image = new Image();
  image.crossOrigin = "anonymous";
  image.decoding = "async";

  const url = buildGibsUrl(LAYERS[key].overlay, {
    format: "image/png",
    transparent: true,
    width: 1024,
    height: 512,
  });

  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
    image.src = url;
  });

  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0);
  state.sampleMaps.set(key, { canvas, context, width: image.width, height: image.height });
  return state.sampleMaps.get(key);
}

async function sampleLayerAt(key, lat, lon) {
  try {
    const sampleMap = await ensureSampleMap(key);
    if (!sampleMap) return null;

    const x = Math.floor(((wrapLongitude(lon) + 180) / 360) * sampleMap.width);
    const y = Math.floor(((90 - lat) / 180) * sampleMap.height);
    const pixel = sampleMap.context.getImageData(clamp(x, 0, sampleMap.width - 1), clamp(y, 0, sampleMap.height - 1), 1, 1).data;

    return {
      r: pixel[0],
      g: pixel[1],
      b: pixel[2],
      a: pixel[3],
    };
  } catch (error) {
    return null;
  }
}

function deriveEnvironmentalScores(samples, lat) {
  const vegetationPixel = samples.vegetation;
  const atmospherePixel = samples.atmosphere;

  const biosphereFromPixel = vegetationPixel
    ? clamp((vegetationPixel.g * 1.18 - vegetationPixel.r * 0.45 + vegetationPixel.b * 0.12) / 2.15, 0, 100)
    : clamp(74 - Math.abs(lat) * 0.42 + state.sandbox.rewilding * 0.18, 8, 98);

  const aerosolFromPixel = atmospherePixel
    ? clamp((atmospherePixel.r + atmospherePixel.g + atmospherePixel.b) / 5.6 + state.sandbox.aerosol * 0.1, 0, 100)
    : clamp(22 + state.sandbox.aerosol * 0.5, 5, 100);

  return {
    biosphere: biosphereFromPixel,
    aerosol: aerosolFromPixel,
  };
}

async function refreshScanMetrics() {
  const { lat, lon } = state.scanPoint;
  dom.scanStatus.textContent = "Linking NASA regional scan";

  if (state.powerAbortController) {
    state.powerAbortController.abort();
  }

  const controller = new AbortController();
  state.powerAbortController = controller;

  const range = dateRangeForPower();
  const url = new URL("https://power.larc.nasa.gov/api/temporal/daily/point");
  url.searchParams.set("parameters", "T2M,PRECTOTCORR,ALLSKY_SFC_SW_DWN,WS10M");
  url.searchParams.set("community", "RE");
  url.searchParams.set("longitude", lon.toFixed(4));
  url.searchParams.set("latitude", lat.toFixed(4));
  url.searchParams.set("start", range.start);
  url.searchParams.set("end", range.end);
  url.searchParams.set("format", "JSON");

  try {
    const [powerResponse, vegetationPixel, atmospherePixel] = await Promise.all([
      fetch(url, { signal: controller.signal }),
      sampleLayerAt("vegetation", lat, lon),
      sampleLayerAt("atmosphere", lat, lon),
    ]);

    if (!powerResponse.ok) {
      throw new Error(`POWER request failed: ${powerResponse.status}`);
    }

    const data = await powerResponse.json();
    const parameter = data?.properties?.parameter || {};
    const metrics = {
      temperature: average(Object.values(parameter.T2M || {})),
      precipitation: average(Object.values(parameter.PRECTOTCORR || {})),
      solar: average(Object.values(parameter.ALLSKY_SFC_SW_DWN || {})),
      wind: average(Object.values(parameter.WS10M || {})),
      ...deriveEnvironmentalScores(
        {
          vegetation: vegetationPixel,
          atmosphere: atmospherePixel,
        },
        lat,
      ),
    };

    state.syncStatus.power = "live";
    state.scanMetrics = projectionAdjustedMetrics(metrics);
    updateTelemetry(state.scanMetrics);
    dom.scanStatus.textContent = "Live NASA point data acquired";
    setDataStatus();
  } catch (error) {
    if (error.name === "AbortError") {
      return;
    }

    state.syncStatus.power = "projected";
    state.scanMetrics = projectionAdjustedMetrics(fallbackMetrics(lat, lon));
    updateTelemetry(state.scanMetrics);
    dom.scanStatus.textContent = "Projected from local simulation model";
    setDataStatus();
  }
}

function normalizeEvents(events) {
  return events
    .map((event) => {
      const geometry = latestGeometry(event);
      if (!geometry || !Array.isArray(geometry.coordinates)) return null;

      const [lon, lat] = geometry.coordinates;
      const category = categoryKey(event);
      const missionConfig = MISSION_COPY[category] || MISSION_COPY.wildfires;

      return {
        ...event,
        lat,
        lon,
        category,
        categoryTitle: categoryLabel(event),
        missionConfig,
      };
    })
    .filter(Boolean)
    .slice(0, 8);
}

async function fetchEvents() {
  try {
    const response = await fetch("https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=20");
    if (!response.ok) {
      throw new Error(`EONET request failed: ${response.status}`);
    }

    const payload = await response.json();
    state.missions = normalizeEvents(payload.events || []);
    state.syncStatus.eonet = "live";
  } catch (error) {
    state.missions = normalizeEvents(FALLBACK_EVENTS);
    state.syncStatus.eonet = "fallback";
  }

  if (!state.missions.length) {
    state.missions = normalizeEvents(FALLBACK_EVENTS);
  }

  state.activeMissionId = state.activeMissionId || state.missions[0]?.id || null;
  renderMissionList();
  updateActiveMission();
  setDataStatus();
}

function renderMissionList() {
  dom.missionList.innerHTML = "";

  state.missions.forEach((mission) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "mission-item";
    if (mission.id === state.activeMissionId) {
      card.classList.add("is-active");
    }

    const severity = Math.round(
      48 + Math.abs(Math.sin(toRadians(mission.lat * 2 + mission.lon))) * 42,
    );

    card.innerHTML = `
      <div class="mission-meta">
        <span>${mission.categoryTitle}</span>
        <strong>${severity}% risk</strong>
      </div>
      <h3>${mission.title}</h3>
      <p>${mission.missionConfig.objective}</p>
    `;

    card.addEventListener("click", () => {
      state.activeMissionId = mission.id;
      state.layer = mission.missionConfig.focusLayer;
      setScanPoint({
        lat: mission.lat,
        lon: mission.lon,
        label: mission.title,
      });
      updateLayerVisuals();
      renderMissionList();
      updateActiveMission();
    });

    dom.missionList.append(card);
  });
}

function updateActiveMission() {
  const mission = state.missions.find((item) => item.id === state.activeMissionId) || state.missions[0];
  if (!mission) return;

  state.activeMissionId = mission.id;
  dom.activeMissionTitle.textContent = mission.title;
  dom.activeMissionBody.textContent = `${mission.missionConfig.response} Focus at ${formatLatLon(mission.lat, mission.lon)}.`;
}

function renderMarkers() {
  dom.markerLayer.innerHTML = "";
  dom.trackLayer.innerHTML = "";

  const scanProjection = projectPoint(state.scanPoint.lat, state.scanPoint.lon);
  if (scanProjection.visible) {
    const marker = document.createElement("button");
    marker.type = "button";
    marker.className = "globe-marker globe-marker--scan";
    marker.style.left = `${scanProjection.x}px`;
    marker.style.top = `${scanProjection.y}px`;
    marker.title = state.scanPoint.label;
    dom.markerLayer.append(marker);

    dom.scanReticle.classList.remove("hidden");
    dom.scanReticle.style.left = `${scanProjection.x}px`;
    dom.scanReticle.style.top = `${scanProjection.y}px`;
  } else {
    dom.scanReticle.classList.add("hidden");
  }

  state.missions.forEach((mission) => {
    const projection = projectPoint(mission.lat, mission.lon);
    if (!projection.visible) return;

    const marker = document.createElement("button");
    marker.type = "button";
    marker.className = `globe-marker globe-marker--${categoryClass(mission.category)}`;
    marker.style.left = `${projection.x}px`;
    marker.style.top = `${projection.y}px`;
    marker.title = mission.title;
    marker.addEventListener("click", (event) => {
      event.stopPropagation();
      state.activeMissionId = mission.id;
      setScanPoint({
        lat: mission.lat,
        lon: mission.lon,
        label: mission.title,
      });
      renderMissionList();
      updateActiveMission();
    });
    dom.markerLayer.append(marker);

    if (mission.id === state.activeMissionId && Array.isArray(mission.geometry) && mission.geometry.length > 1) {
      const visiblePoints = mission.geometry
        .map((entry) => {
          const [lon, lat] = entry.coordinates;
          const projected = projectPoint(lat, lon);
          return projected.visible ? `${(projected.x / dom.earthGlobe.clientWidth) * 100},${(projected.y / dom.earthGlobe.clientHeight) * 100}` : null;
        })
        .filter(Boolean);

      if (visiblePoints.length > 1) {
        const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        polyline.setAttribute("points", visiblePoints.join(" "));
        polyline.setAttribute("fill", "none");
        polyline.setAttribute("stroke", "rgba(255, 206, 120, 0.85)");
        polyline.setAttribute("stroke-width", "0.7");
        polyline.setAttribute("stroke-linecap", "round");
        polyline.setAttribute("stroke-dasharray", "1.4 1.6");
        dom.trackLayer.append(polyline);
      }
    }
  });
}

function setScanPoint(point) {
  state.scanPoint = {
    lat: point.lat,
    lon: point.lon,
    label: point.label || "Orbital Scan",
  };
  dom.scanTitle.textContent = state.scanPoint.label;
  dom.scanCoordinates.textContent = formatLatLon(state.scanPoint.lat, state.scanPoint.lon);
  refreshScanMetrics();
  renderMarkers();
}

function pulseLog(message) {
  dom.missionLog.textContent = message;
}

function applyIntervention(action) {
  const changes = {
    "storm-mesh": {
      atmosphere: 5,
      shield: 3,
      message: "Storm mesh satellites boosted atmosphere tracking and disaster readiness.",
    },
    rewild: {
      biosphere: 8,
      atmosphere: 2,
      message: "Rewilding pulse improved vegetation recovery and atmospheric stability.",
    },
    "ocean-relay": {
      oceans: 7,
      biosphere: 2,
      message: "Ocean relays cooled marine hotspots and reduced storm fuel.",
    },
    "solar-shield": {
      shield: 9,
      atmosphere: 2,
      message: "Solar shield absorbed orbital stress and asteroid debris risk.",
    },
  }[action];

  if (!changes) return;

  state.guardian.atmosphere = clamp(state.guardian.atmosphere + (changes.atmosphere || 0), 0, 100);
  state.guardian.biosphere = clamp(state.guardian.biosphere + (changes.biosphere || 0), 0, 100);
  state.guardian.oceans = clamp(state.guardian.oceans + (changes.oceans || 0), 0, 100);
  state.guardian.shield = clamp(state.guardian.shield + (changes.shield || 0), 0, 100);

  pulseLog(changes.message);
  updateGuardianMeters();
  dom.interventionControls.querySelectorAll("[data-action]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.action === action);
  });
}

function deploySatellite() {
  state.satellites += 1;
  state.guardian.shield = clamp(state.guardian.shield + 4, 0, 100);
  pulseLog(`Satellite ${state.satellites} deployed. Orbital shield coverage expanded.`);
  updateGuardianMeters();
}

function sweepCurrentRegion() {
  const nextLon = wrapLongitude(state.scanPoint.lon + 18);
  const nextLat = clamp(state.scanPoint.lat + Math.sin(toRadians(nextLon)) * 6, -70, 70);
  setScanPoint({
    lat: nextLat,
    lon: nextLon,
    label: "Automated Sweep Corridor",
  });
  pulseLog("Orbital sweep advanced to the next data-rich corridor.");
}

function wireEvents() {
  dom.layerControls.querySelectorAll("[data-layer]").forEach((button) => {
    button.addEventListener("click", () => {
      state.layer = button.dataset.layer;
      setActiveButtons();
      updateLayerVisuals();
      renderMissionList();
      renderMarkers();
    });
  });

  dom.modeControls.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.mode = button.dataset.mode;
      updateBodyMode();
      setActiveButtons();
    });
  });

  dom.destinationControls.querySelectorAll("[data-destination]").forEach((button) => {
    button.addEventListener("click", () => {
      state.destination = button.dataset.destination;
      updateDestination();
      setActiveButtons();
    });
  });

  dom.speedControls.querySelectorAll("[data-speed]").forEach((button) => {
    button.addEventListener("click", () => {
      state.speed = Number(button.dataset.speed);
      setActiveButtons();
    });
  });

  dom.yearRange.addEventListener("input", () => {
    state.year = Number(dom.yearRange.value);
    updateRangeLabels();
    updateGuardianMeters();
    refreshScanMetrics();
  });

  dom.aerosolSlider.addEventListener("input", () => {
    state.sandbox.aerosol = Number(dom.aerosolSlider.value);
    updateRangeLabels();
    updateGuardianMeters();
    refreshScanMetrics();
  });

  dom.rewildingSlider.addEventListener("input", () => {
    state.sandbox.rewilding = Number(dom.rewildingSlider.value);
    updateRangeLabels();
    updateGuardianMeters();
    refreshScanMetrics();
  });

  dom.oceanHeatSlider.addEventListener("input", () => {
    state.sandbox.oceanHeat = Number(dom.oceanHeatSlider.value);
    updateRangeLabels();
    updateGuardianMeters();
    refreshScanMetrics();
  });

  dom.deploySatelliteButton.addEventListener("click", deploySatellite);
  dom.scanSweepButton.addEventListener("click", sweepCurrentRegion);

  dom.interventionControls.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => applyIntervention(button.dataset.action));
  });

  dom.earthGlobe.addEventListener("pointerdown", (event) => {
    state.dragging = true;
    state.pointerMoved = false;
    state.dragStart = {
      x: event.clientX,
      y: event.clientY,
      rotation: state.rotation,
      tilt: state.tilt,
    };
    dom.earthGlobe.setPointerCapture(event.pointerId);
  });

  dom.earthGlobe.addEventListener("pointermove", (event) => {
    if (!state.dragging || !state.dragStart) return;

    const deltaX = event.clientX - state.dragStart.x;
    const deltaY = event.clientY - state.dragStart.y;
    state.pointerMoved = state.pointerMoved || Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3;

    state.rotation = wrapLongitude(state.dragStart.rotation + deltaX * 0.25);
    state.tilt = clamp(state.dragStart.tilt - deltaY * 0.12, -45, 45);
    renderMarkers();
  });

  dom.earthGlobe.addEventListener("pointerup", (event) => {
    if (!state.dragging) return;
    dom.earthGlobe.releasePointerCapture(event.pointerId);

    if (!state.pointerMoved) {
      const point = pointToLatLon(event.clientX, event.clientY);
      if (point) {
        setScanPoint({
          ...point,
          label: "Orbital Region Scan",
        });
      }
    }

    state.dragging = false;
    state.dragStart = null;
  });

  window.addEventListener("keydown", (event) => {
    const rotationStep = event.shiftKey ? 8 : 4;
    if (event.key === "ArrowLeft") {
      state.rotation = wrapLongitude(state.rotation - rotationStep);
      renderMarkers();
    } else if (event.key === "ArrowRight") {
      state.rotation = wrapLongitude(state.rotation + rotationStep);
      renderMarkers();
    } else if (event.key === "ArrowUp") {
      state.tilt = clamp(state.tilt + 3, -45, 45);
      renderMarkers();
    } else if (event.key === "ArrowDown") {
      state.tilt = clamp(state.tilt - 3, -45, 45);
      renderMarkers();
    }
  });

  window.addEventListener("resize", renderMarkers);
}

function animateStarfield(time) {
  const canvas = dom.starfield;
  const context = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const width = Math.floor(window.innerWidth * dpr);
  const height = Math.floor(window.innerHeight * dpr);

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  context.clearRect(0, 0, width, height);
  context.fillStyle = "rgba(255,255,255,0.92)";

  const starCount = Math.min(220, Math.floor((width * height) / 24000));
  for (let i = 0; i < starCount; i += 1) {
    const seed = i * 97.531;
    const x = ((Math.sin(seed * 12.9898) + 1) * 0.5 * width + time * (0.004 + (i % 5) * 0.0006)) % width;
    const y = ((Math.cos(seed * 78.233) + 1) * 0.5 * height + (i % 9) * 0.12) % height;
    const size = ((i % 4) + 1) * dpr * 0.45;
    const alpha = 0.24 + ((Math.sin(time * 0.001 + i) + 1) / 2) * 0.52;
    context.globalAlpha = alpha;
    context.fillRect(x, y, size, size);
  }

  context.globalAlpha = 1;
}

function animateScene(now) {
  const delta = now - state.lastFrame;
  state.lastFrame = now;

  if (!state.dragging) {
    state.rotation = wrapLongitude(state.rotation + delta * 0.0014 * state.autoSpin);
  }

  if (state.speed > 0) {
    state.year = clamp(state.year + delta * 0.000005 * state.speed, CURRENT_YEAR, 2100);
    dom.yearRange.value = String(Math.round(state.year));
    updateRangeLabels();
    updateGuardianMeters();
  }

  const seconds = now / 1000;
  const shadowAngle = 34 + Math.sin(seconds * 0.22) * 28;
  const backgroundPan = 50 + state.rotation * 0.36;

  document.documentElement.style.setProperty("--earth-shadow-angle", `${shadowAngle}deg`);
  document.documentElement.style.setProperty("--earth-pan", `${backgroundPan}%`);
  document.documentElement.style.setProperty("--overlay-opacity", String(layerBlendOpacity()));

  dom.earthBase.style.backgroundPosition = `${backgroundPan}% center`;
  dom.earthOverlay.style.backgroundPosition = `${backgroundPan * 1.02}% center`;
  dom.earthNight.style.background = `linear-gradient(${shadowAngle}deg, rgba(0,0,0,0.84) 10%, rgba(0,0,0,0.48) 34%, rgba(0,0,0,0.12) 52%, rgba(255,210,126,0.04) 68%, rgba(255,255,255,0) 82%)`;

  dom.orbitLongitude.textContent = `${state.rotation.toFixed(1)}°`;
  dom.orbitTilt.textContent = `${state.tilt.toFixed(1)}°`;
  dom.clock.textContent = new Date(Date.now() + state.year * 12000 + now * 8).toUTCString().slice(17, 25) + " UTC";

  renderMarkers();
  animateStarfield(now);
  requestAnimationFrame(animateScene);
}

async function initialize() {
  updateBodyMode();
  updateDestination();
  updateLayerVisuals();
  updateRangeLabels();
  updateGuardianMeters();
  setActiveButtons();
  setDataStatus();
  wireEvents();

  dom.scanTitle.textContent = state.scanPoint.label;
  dom.scanCoordinates.textContent = formatLatLon(state.scanPoint.lat, state.scanPoint.lon);

  renderMarkers();
  await Promise.allSettled([fetchEvents(), refreshScanMetrics()]);
  requestAnimationFrame(animateScene);
}

initialize();
