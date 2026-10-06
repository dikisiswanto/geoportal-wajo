"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { withAssetVersion } from "../lib/assetVersion";
import { preloadCriticalGeoData } from "../lib/geo/startupData";
import { getStartupExperienceMode, markStartupIntroSeen } from "../lib/geo/startupExperience";

const EARTH_TEXTURE_URL = withAssetVersion("/intro/earth/earth-surface.jpg");
const FAST_EARTH_URL = withAssetVersion("/intro/earth/earth-fast-wajo.png");
const EARTH_HEIGHT_URL = withAssetVersion("/intro/earth/earth-height.jpg");
const EARTH_CLOUDS_URL = withAssetVersion("/intro/earth/earth-clouds.png");
const EARTH_NIGHT_URL = withAssetVersion("/intro/earth/earth-night.jpg");
const COSMIC_TEXTURE_URL = withAssetVersion("/intro/earth/cosmic-bg.jpg");
const SUN_GLOW_URL = withAssetVersion("/intro/earth/sun-glow.png");
const LOGO_SRC = withAssetVersion("/brand/logo-kabupaten-wajo.png");

const WAJO_TARGET = { lat: -4.13, lng: 120.03 };
const INDONESIA_TARGET = { lat: -2.2, lng: 117.2 };
const SULAWESI_TARGET = { lat: -2.4, lng: 120.8 };
const EARTH_RADIUS = 1.2;

const INTRO_TIMELINE_MS = 7200;
const MIN_INTRO_MS = 6500;
const MAX_INTRO_MS = 7800;
const EXIT_FADE_MS = 180;
const THREE_LOAD_TIMEOUT_MS = 5000;
const FAST_LOADER_MIN_MS = 320;
const FAST_LOADER_TIMEOUT_MS = 12000;

let threeLoadPromise = null;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(value) {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
}

function easeInCubic(value) {
  const t = clamp(value, 0, 1);
  return t * t * t;
}

function easeOutCubic(value) {
  const t = clamp(value, 0, 1);
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(value) {
  const t = clamp(value, 0, 1);
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeInOutQuart(value) {
  const t = clamp(value, 0, 1);
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

function latLngToVector3(THREE, lat, lng, radius = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function loadThree() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (threeLoadPromise) return threeLoadPromise;

  threeLoadPromise = import("three")
    .then((module) => module?.default ?? module)
    .catch((error) => {
      threeLoadPromise = null;
      throw error;
    });

  return threeLoadPromise;
}

function disposeObject3D(object) {
  if (!object?.traverse) return;

  object.traverse((child) => {
    child.geometry?.dispose?.();

    if (!child.material) return;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      Object.values(material).forEach((value) => {
        if (value?.isTexture) value.dispose?.();
      });
      material.dispose?.();
    });
  });
}

function createEarthSurfaceMaterial(THREE, surfaceTexture, nightTexture, heightTexture, sunDirection) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: surfaceTexture },
      uNightMap: { value: nightTexture },
      uHeightMap: { value: heightTexture ?? surfaceTexture },
      uHeightScale: { value: heightTexture ? 0.026 : 0.0 },
      uSunDirection: { value: sunDirection.clone() },
      uAtmosphere: { value: 0.12 },
      uExposure: { value: 1.08 }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;
      uniform sampler2D uHeightMap;
      uniform float uHeightScale;

      void main() {
        vUv = uv;
        float terrain = max(texture2D(uHeightMap, uv).r - 0.38, 0.0);
        vec3 displaced = position + normal * terrain * uHeightScale;
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vWorldPosition = (modelMatrix * vec4(displaced, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uMap;
      uniform sampler2D uNightMap;
      uniform vec3 uSunDirection;
      uniform float uAtmosphere;
      uniform float uExposure;

      varying vec2 vUv;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;

      void main() {
        vec3 normal = normalize(vWorldNormal);
        vec3 surface = texture2D(uMap, vUv).rgb;
        float nightTexture = texture2D(uNightMap, vUv).r;

        float lightDot = dot(normal, normalize(uSunDirection));
        float day = smoothstep(-0.24, 0.18, lightDot);
        float softDay = smoothstep(-0.05, 0.55, lightDot);
        float twilight = 1.0 - smoothstep(0.02, 0.35, abs(lightDot));

        float ocean = smoothstep(0.46, 0.62, surface.b - surface.r * 0.62);
        vec3 dayColor = surface * (0.42 + day * 0.92 + softDay * 0.14);
        dayColor += vec3(0.035, 0.065, 0.09) * twilight * uAtmosphere;

        vec3 nightColor = surface * (0.055 + nightTexture * 0.16);
        vec3 cityGlow = vec3(1.0, 0.40, 0.08) * pow(max(nightTexture, 0.0), 1.65) * 1.35;
        nightColor += cityGlow * (1.0 - day);

        vec3 oceanSpec = vec3(0.0);
        if (ocean > 0.4) {
          float specular = pow(max(dot(reflect(-normalize(uSunDirection), normal), normalize(cameraPosition - vWorldPosition)), 0.0), 74.0);
          oceanSpec = vec3(0.22, 0.48, 0.78) * specular * day;
        }

        vec3 finalColor = mix(nightColor, dayColor, day) + oceanSpec;
        finalColor = max(finalColor, vec3(0.002, 0.004, 0.008));
        finalColor *= uExposure;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
    lights: false
  });
}

function createAtmosphereMaterial(THREE, sunDirection) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uSunDirection: { value: sunDirection.clone() },
      uIntensity: { value: 0.96 }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vWorldPosition;

      void main() {
        vNormal = normalize(mat3(modelMatrix) * normal);
        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uSunDirection;
      uniform float uIntensity;

      varying vec3 vNormal;
      varying vec3 vWorldPosition;

      void main() {
        vec3 viewDir = normalize(cameraPosition - vWorldPosition);
        vec3 normal = normalize(vNormal);
        float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.15);
        float sunEdge = max(dot(normal, normalize(uSunDirection)), 0.0);
        float dayGlow = pow(sunEdge, 0.62);
        float dusk = pow(max(0.0, 1.0 - abs(dot(normal, normalize(uSunDirection)) * 2.1)), 2.0);

        vec3 blue = vec3(0.19, 0.62, 1.0);
        vec3 gold = vec3(1.0, 0.39, 0.08);
        vec3 glow = mix(blue, gold, dusk * 0.60);
        float alpha = clamp(fresnel * (0.92 + dayGlow * 1.20) * uIntensity, 0.0, 0.88);

        gl_FragColor = vec4(glow, alpha);
      }
    `,
    side: THREE.BackSide,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true
  });
}

function createNightAtmosphereMaterial(THREE, sunDirection) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uSunDirection: { value: sunDirection.clone() },
      uOpacity: { value: 0.8 }
    },
    vertexShader: `
      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;

      void main() {
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uSunDirection;
      uniform float uOpacity;

      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;

      void main() {
        vec3 normal = normalize(vWorldNormal);
        vec3 viewDir = normalize(cameraPosition - vWorldPosition);
        float terminator = smoothstep(0.28, -0.18, dot(normal, normalize(uSunDirection)));
        float rim = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.6);
        vec3 color = mix(vec3(0.035,0.12,0.24), vec3(0.18,0.44,0.72), rim);
        gl_FragColor = vec4(color, terminator * rim * uOpacity);
      }
    `,
    side: THREE.BackSide,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
}

function createCloudMaterial(THREE, cloudTexture, sunDirection) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: cloudTexture },
      uSunDirection: { value: sunDirection.clone() },
      uOpacity: { value: 0.46 }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        vUv = uv;
        vNormal = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uMap;
      uniform vec3 uSunDirection;
      uniform float uOpacity;

      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        float alpha = texture2D(uMap, vUv).a * uOpacity;
        float light = 0.45 + 0.65 * max(dot(normalize(vNormal), normalize(uSunDirection)), 0.0);
        vec3 color = vec3(0.9, 0.94, 1.0) * light;
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    depthWrite: false
  });
}

function createFlatBridgeMaterial(THREE, surfaceTexture) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: surfaceTexture },
      uCenter: { value: new THREE.Vector2((WAJO_TARGET.lng + 180) / 360, (90 - WAJO_TARGET.lat) / 180) },
      uLongitudeSpan: { value: 0.11 },
      uLatitudeSpan: { value: 0.055 },
      uLatitudeCenter: { value: WAJO_TARGET.lat },
      uOpacity: { value: 0 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uMap;
      uniform vec2 uCenter;
      uniform float uLongitudeSpan;
      uniform float uLatitudeSpan;
      uniform float uLatitudeCenter;
      uniform float uOpacity;
      varying vec2 vUv;

      float mercatorY(float latitude) {
        float lat = radians(clamp(latitude, -85.0, 85.0));
        return 0.5 - log(tan(3.14159265 * 0.25 + lat * 0.5)) / (2.0 * 3.14159265);
      }

      void main() {
        float centerY = mercatorY(uLatitudeCenter);
        vec2 mapUv;
        mapUv.x = uCenter.x + (vUv.x - 0.5) * uLongitudeSpan;
        mapUv.y = centerY + (vUv.y - 0.5) * uLatitudeSpan;
        vec3 color = texture2D(uMap, mapUv).rgb;
        gl_FragColor = vec4(color, uOpacity);
      }
    `,
    transparent: true,
    depthTest: false,
    depthWrite: false
  });
}

function createMarker(THREE, targetVector) {
  const group = new THREE.Group();
  const surfacePosition = targetVector.clone().multiplyScalar(EARTH_RADIUS * 1.025);
  group.position.copy(surfacePosition);
  group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), targetVector);

  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.004, 0.011, 0.24, 12, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0x8bdcff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  beam.position.z = 0.12;
  group.add(beam);

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.022, 18, 14),
    new THREE.MeshBasicMaterial({ color: 0xd5f1ff, transparent: true, opacity: 0, depthWrite: false })
  );
  group.add(core);

  const halo = new THREE.Mesh(
    new THREE.RingGeometry(0.046, 0.065, 48),
    new THREE.MeshBasicMaterial({
      color: 0x8bdcff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  halo.position.z = 0.009;
  group.add(halo);

  return { group, beam, core, halo };
}

function createStarField(THREE) {
  const groups = [];
  let state = 72137;
  const random = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };

  const layers = [
    { count: 1350, minRadius: 18, maxRadius: 30, minSize: 1.0, maxSize: 2.4, minOpacity: 0.34, maxOpacity: 0.92 },
    { count: 450, minRadius: 12, maxRadius: 19, minSize: 0.72, maxSize: 1.65, minOpacity: 0.20, maxOpacity: 0.58 }
  ];

  layers.forEach((layer) => {
    const positions = new Float32Array(layer.count * 3);
    const sizes = new Float32Array(layer.count);
    const opacities = new Float32Array(layer.count);
    const phases = new Float32Array(layer.count);

    for (let index = 0; index < layer.count; index += 1) {
      const radius = layer.minRadius + random() * (layer.maxRadius - layer.minRadius);
      const theta = random() * Math.PI * 2;
      const z = random() * 2 - 1;
      const radial = Math.sqrt(1 - z * z);
      positions[index * 3] = radius * radial * Math.cos(theta);
      positions[index * 3 + 1] = radius * z;
      positions[index * 3 + 2] = radius * radial * Math.sin(theta);
      sizes[index] = layer.minSize + random() * (layer.maxSize - layer.minSize);
      opacities[index] = layer.minOpacity + random() * (layer.maxOpacity - layer.minOpacity);
      phases[index] = random() * Math.PI * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aOpacity", new THREE.BufferAttribute(opacities, 1));
    geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader: `
        attribute float aSize;
        attribute float aOpacity;
        attribute float aPhase;
        varying float vOpacity;
        varying float vPhase;

        void main() {
          vOpacity = aOpacity;
          vPhase = aPhase;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = aSize;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying float vOpacity;
        varying float vPhase;

        void main() {
          vec2 centered = gl_PointCoord - vec2(0.5);
          float radius = length(centered);
          float softEdge = 1.0 - smoothstep(0.34, 0.50, radius);
          float core = 1.0 - smoothstep(0.02, 0.20, radius);
          float twinkle = 0.88 + 0.12 * sin(uTime * 0.9 + vPhase);
          vec3 white = mix(vec3(0.62, 0.76, 0.92), vec3(1.0), core * 0.82);
          float alpha = softEdge * vOpacity * twinkle;

          if (alpha < 0.01) discard;
          gl_FragColor = vec4(white, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geometry, material);
    points.userData.starMaterial = material;
    groups.push(points);
  });

  return groups;
}
function buildScene(THREE, host) {
  const width = Math.max(host.clientWidth, window.innerWidth || 1);
  const height = Math.max(host.clientHeight, window.innerHeight || 1);
  const renderer = new THREE.WebGLRenderer({
    antialias: Math.min(window.devicePixelRatio || 1, 1.5) <= 1.25,
    alpha: false,
    powerPreference: "high-performance"
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(width, height, false);
  renderer.setClearColor(0x010207, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.domElement.setAttribute("aria-hidden", "true");
  renderer.domElement.className = "geoportal-intro-canvas";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, width / height, 0.06, 120);
  const targetCenter = new THREE.Vector3();
  const cameraFront = new THREE.Vector3(0, 0, 1);

  const sunDirection = new THREE.Vector3(-5.2, 2.2, 5.7).normalize();
  const earthTilt = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 0, 1),
    THREE.MathUtils.degToRad(-23.44)
  );

  const earthAnchor = new THREE.Group();
  const earthSpin = new THREE.Group();
  earthAnchor.add(earthSpin);
  scene.add(earthAnchor);

  const targetVector = latLngToVector3(THREE, WAJO_TARGET.lat, WAJO_TARGET.lng).normalize();
  const indonesiaVector = latLngToVector3(THREE, INDONESIA_TARGET.lat, INDONESIA_TARGET.lng).normalize();
  const sulawesiVector = latLngToVector3(THREE, SULAWESI_TARGET.lat, SULAWESI_TARGET.lng).normalize();
  const inverseTilt = earthTilt.clone().invert();
  const desiredLocalFront = cameraFront.clone().applyQuaternion(inverseTilt);
  const makeTargetQuaternion = (vector) => new THREE.Quaternion().setFromUnitVectors(vector, desiredLocalFront);

  const wajoQuaternion = makeTargetQuaternion(targetVector);
  const indonesiaQuaternion = makeTargetQuaternion(indonesiaVector);
  const sulawesiQuaternion = makeTargetQuaternion(sulawesiVector);
  const startOffset = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 1, 0),
    THREE.MathUtils.degToRad(152)
  );
  const startQuaternion = wajoQuaternion.clone().multiply(startOffset);
  earthSpin.quaternion.copy(startQuaternion);

  const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 144, 96);
  let earthMaterial = new THREE.MeshStandardMaterial({
    color: 0x174b70,
    roughness: 0.88,
    metalness: 0,
    transparent: true,
    opacity: 1
  });
  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  earthSpin.add(earth);

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(EARTH_RADIUS * 1.045, 112, 72),
    createAtmosphereMaterial(THREE, sunDirection)
  );
  earthSpin.add(atmosphere);

  const nightAtmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(EARTH_RADIUS * 1.038, 96, 64),
    createNightAtmosphereMaterial(THREE, sunDirection)
  );
  earthSpin.add(nightAtmosphere);

  const marker = createMarker(THREE, targetVector);
  earthSpin.add(marker.group);

  const starGroups = createStarField(THREE);
  starGroups.forEach((group) => scene.add(group));

  let sunSprite = null;
  let clouds = null;
  let flatBridge = null;
  let flatBridgeMaterial = null;

  const cosmicFallback = new THREE.Mesh(
    new THREE.SphereGeometry(55, 64, 32),
    new THREE.MeshBasicMaterial({
      color: 0x02040b,
      side: THREE.BackSide,
      depthWrite: false,
      toneMapped: false
    })
  );
  cosmicFallback.renderOrder = -30;
  scene.add(cosmicFallback);

  const keyLight = new THREE.DirectionalLight(0xffffff, 3.6);
  keyLight.position.copy(sunDirection).multiplyScalar(8);
  scene.add(keyLight);

  const fillLight = new THREE.HemisphereLight(0x7fb8e8, 0x020309, 0.06);
  scene.add(fillLight);

  const textureLoader = new THREE.TextureLoader();
  const texturePromise = Promise.allSettled([
    textureLoader.loadAsync(EARTH_TEXTURE_URL),
    textureLoader.loadAsync(EARTH_HEIGHT_URL),
    textureLoader.loadAsync(EARTH_CLOUDS_URL),
    textureLoader.loadAsync(EARTH_NIGHT_URL),
    textureLoader.loadAsync(COSMIC_TEXTURE_URL),
    textureLoader.loadAsync(SUN_GLOW_URL)
  ]).then((results) => {
    const [surface, height, cloudTexture, nightTexture, cosmicTexture, sunTexture] = results.map((result) =>
      result.status === "fulfilled" ? result.value : null
    );

    if (stopped) {
      [surface, height, cloudTexture, nightTexture, cosmicTexture, sunTexture].forEach((texture) => texture?.dispose?.());
      return;
    }

    if (surface) {
      surface.colorSpace = THREE.SRGBColorSpace;
      surface.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy?.() || 1, 8);
    }
    if (height) height.colorSpace = THREE.NoColorSpace ?? height.colorSpace;
    if (nightTexture) nightTexture.colorSpace = THREE.NoColorSpace ?? nightTexture.colorSpace;
    if (cloudTexture) cloudTexture.colorSpace = THREE.NoColorSpace ?? cloudTexture.colorSpace;

    if (surface && nightTexture) {
      const nextMaterial = createEarthSurfaceMaterial(THREE, surface, nightTexture, height, sunDirection);
      nextMaterial.transparent = true;
      nextMaterial.opacity = earthMaterial.opacity;
      const previousMaterial = earth.material;
      earth.material = nextMaterial;
      earthMaterial = nextMaterial;
      previousMaterial?.dispose?.();
    } else if (surface) {
      const nextMaterial = new THREE.MeshStandardMaterial({
        map: surface,
        roughness: 0.92,
        metalness: 0,
        transparent: true,
        opacity: earthMaterial.opacity
      });
      const previousMaterial = earth.material;
      earth.material = nextMaterial;
      earthMaterial = nextMaterial;
      previousMaterial?.dispose?.();
    }

    if (cloudTexture) {
      clouds = new THREE.Mesh(
        new THREE.SphereGeometry(EARTH_RADIUS * 1.013, 112, 72),
        createCloudMaterial(THREE, cloudTexture, sunDirection)
      );
      earthSpin.add(clouds);
    }

    if (surface) {
      flatBridgeMaterial = createFlatBridgeMaterial(THREE, surface);
      flatBridge = new THREE.Mesh(new THREE.PlaneGeometry(6.8, 3.55, 1, 1), flatBridgeMaterial);
      flatBridge.position.set(0, 0, -0.15);
      flatBridge.renderOrder = 50;
      scene.add(flatBridge);
    }

    if (cosmicTexture) {
      cosmicTexture.colorSpace = THREE.SRGBColorSpace;
      scene.background = cosmicTexture;
      cosmicFallback.visible = false;
    }

    if (sunTexture) {
      sunTexture.colorSpace = THREE.SRGBColorSpace;
      sunSprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: sunTexture,
          color: 0xfff1ce,
          transparent: true,
          opacity: 0.34,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          toneMapped: false
        })
      );
      sunSprite.position.copy(sunDirection).multiplyScalar(16);
      sunSprite.scale.setScalar(4.6);
      scene.add(sunSprite);
    }
  });

  let stopped = false;
  let frameId = 0;
  const startTime = performance.now();
  let previousTime = startTime;

  const resize = () => {
    if (stopped) return;
    const nextWidth = Math.max(host.clientWidth, 1);
    const nextHeight = Math.max(host.clientHeight, 1);
    camera.aspect = nextWidth / nextHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(nextWidth, nextHeight, false);
  };

  const render = (time) => {
    if (stopped) return;

    const elapsed = time - startTime;
    const deltaSeconds = Math.min((time - previousTime) / 1000, 0.05);
    previousTime = time;
    const timeline = clamp(elapsed / INTRO_TIMELINE_MS, 0, 1);

    if (timeline < 0.18) {
      earthSpin.quaternion.slerpQuaternions(
        startQuaternion,
        indonesiaQuaternion,
        easeInOutCubic(clamp(timeline / 0.18, 0, 1))
      );
    } else if (timeline < 0.48) {
      earthSpin.quaternion.slerpQuaternions(
        indonesiaQuaternion,
        sulawesiQuaternion,
        easeInOutQuart(clamp((timeline - 0.18) / 0.30, 0, 1))
      );
    } else if (timeline < 0.88) {
      earthSpin.quaternion.slerpQuaternions(
        sulawesiQuaternion,
        wajoQuaternion,
        easeInOutCubic(clamp((timeline - 0.48) / 0.40, 0, 1))
      );
    } else {
      earthSpin.quaternion.copy(wajoQuaternion);
    }

    if (timeline < 0.28) {
      const microSpin = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        deltaSeconds * 0.018
      );
      earthSpin.quaternion.multiply(microSpin);
    }

    const spaceProgress = easeOutCubic(clamp(timeline / 0.22, 0, 1));
    const indonesiaProgress = easeInOutCubic(clamp((timeline - 0.16) / 0.34, 0, 1));
    const regionalProgress = easeInOutCubic(clamp((timeline - 0.40) / 0.34, 0, 1));
    const landingProgress = easeOutCubic(clamp((timeline - 0.68) / 0.20, 0, 1));
    const flattenProgress = smoothstep(clamp((timeline - 0.88) / 0.12, 0, 1));

    const distance = 10.7
      - spaceProgress * 3.0
      - indonesiaProgress * 1.55
      - regionalProgress * 2.0
      - landingProgress * 0.80;

    camera.position.set(
      Math.sin(landingProgress * Math.PI) * 0.08,
      Math.sin(landingProgress * Math.PI) * 0.035,
      Math.max(2.48, distance)
    );
    camera.lookAt(targetCenter);
    camera.fov = 35 - landingProgress * 5.2;
    camera.updateProjectionMatrix();

    const farFade = smoothstep(clamp((timeline - 0.01) / 0.12, 0, 1));
    earthSpin.scale.set(
      1 + flattenProgress * 0.09,
      1 + flattenProgress * 0.03,
      1 - flattenProgress * 0.96
    );

    if (earthMaterial?.uniforms?.uExposure) {
      earthMaterial.uniforms.uExposure.value = 1.02 + spaceProgress * 0.06;
    }
    if (earthMaterial) {
      earthMaterial.opacity = 1 - flattenProgress * 0.96;
      earthMaterial.transparent = true;
    }
    if (clouds?.material?.uniforms?.uOpacity) {
      clouds.material.uniforms.uOpacity.value = (0.45 - flattenProgress * 0.45) * farFade;
    }
    if (atmosphere?.material?.uniforms?.uIntensity) {
      atmosphere.material.uniforms.uIntensity.value = (0.94 - flattenProgress * 0.90) * farFade;
    }
    if (nightAtmosphere?.material?.uniforms?.uOpacity) {
      nightAtmosphere.material.uniforms.uOpacity.value = 0.66 - flattenProgress * 0.64;
    }

    const markerProgress = smoothstep(clamp((timeline - 0.56) / 0.18, 0, 1)) * (1 - flattenProgress);
    marker.beam.material.opacity = markerProgress * 0.72;
    marker.core.material.opacity = markerProgress;
    marker.halo.material.opacity = markerProgress * (0.68 + 0.20 * Math.sin(elapsed / 180));
    marker.halo.scale.setScalar(1 + 0.17 * Math.sin(elapsed / 220));

    if (flatBridgeMaterial) {
      flatBridgeMaterial.uniforms.uOpacity.value = easeOutCubic(clamp((timeline - 0.89) / 0.09, 0, 1)) * 0.92;
    }
    if (sunSprite) sunSprite.material.opacity = 0.34 * (1 - flattenProgress);
    starGroups.forEach((group, index) => {
      if (index === 0) group.rotation.y += deltaSeconds * 0.00045;
      else group.rotation.y -= deltaSeconds * 0.00065;
      if (group.userData.starMaterial?.uniforms?.uTime) {
        group.userData.starMaterial.uniforms.uTime.value = elapsed / 1000;
      }
    });

    // Once the camera enters the handoff window, deliberately reduce Three.js
    // render pressure so Leaflet/GeoJSON can hydrate without competing for
    // every animation frame. The scene remains visually smooth because the
    // camera is already decelerating and the globe is nearly locked.
    const handoffThrottle = timeline >= 0.74 && timeline < 0.92;
    if (!handoffThrottle || Math.floor(elapsed / 48) !== Math.floor((elapsed - deltaSeconds * 1000) / 48)) {
      renderer.render(scene, camera);
    }
    frameId = window.requestAnimationFrame(render);
  };

  frameId = window.requestAnimationFrame(render);

  const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
  resizeObserver?.observe(host);
  window.addEventListener("resize", resize, { passive: true });

  return {
    texturePromise,
    stop() {
      stopped = true;
      window.cancelAnimationFrame(frameId);
      resizeObserver?.disconnect?.();
      window.removeEventListener("resize", resize);
      const backgroundTexture = scene.background;
      scene.background = null;
      backgroundTexture?.dispose?.();
      disposeObject3D(scene);
      renderer.dispose();
      renderer.forceContextLoss?.();
      renderer.domElement.remove();
    }
  };
}

export default function GeoPortalIntro({ onComplete, onMapWarmup, mapReady = false, vectorReady = false }) {
  const hostRef = useRef(null);
  const mapReadyRef = useRef(mapReady);
  const vectorReadyRef = useRef(vectorReady);
  const mapWarmupRequestedRef = useRef(false);
  const completedRef = useRef(false);
  const exitTimerRef = useRef(null);
  const [closing, setClosing] = useState(false);
  const [status, setStatus] = useState("Menyiapkan peta Wajo…");
  const [experienceMode, setExperienceMode] = useState("checking");

  useEffect(() => {
    mapReadyRef.current = mapReady;
  }, [mapReady]);

  useEffect(() => {
    vectorReadyRef.current = vectorReady;
  }, [vectorReady]);

  useEffect(() => {
    setExperienceMode(getStartupExperienceMode(window.location.search));
  }, []);

  const requestMapWarmup = () => {
    if (mapWarmupRequestedRef.current) return;
    mapWarmupRequestedRef.current = true;
    onMapWarmup?.();
  };

  useEffect(() => {
    if (experienceMode === "checking") return undefined;

    let cancelled = false;
    let sceneHandle = null;
    let finishTimer = null;
    let maxTimer = null;
    let statusTimers = [];

    const clearTimers = () => {
      statusTimers.forEach((timer) => window.clearTimeout(timer));
      statusTimers = [];
      window.clearTimeout(finishTimer);
      window.clearTimeout(maxTimer);
    };

    const waitForStartupReady = (timeoutMs) => new Promise((resolve) => {
      if (mapReadyRef.current && vectorReadyRef.current) {
        resolve(true);
        return;
      }

      const startedAt = performance.now();
      const check = () => {
        const ready = mapReadyRef.current && vectorReadyRef.current;
        if (cancelled || ready || performance.now() - startedAt >= timeoutMs) {
          resolve(ready);
          return;
        }
        window.requestAnimationFrame(check);
      };
      window.requestAnimationFrame(check);
    });

    const finish = () => {
      if (cancelled || completedRef.current) return;
      completedRef.current = true;
      if (experienceMode === "cinematic") {
        markStartupIntroSeen();
      }
      clearTimers();
      setClosing(true);
      exitTimerRef.current = window.setTimeout(() => {
        onComplete?.();
      }, EXIT_FADE_MS);
    };

    const run = async () => {
      const mode = experienceMode;
      const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
      const startedAt = performance.now();
      const criticalReady = preloadCriticalGeoData().catch(() => null);

      if (mode === "fast") {
        setStatus("Menyiapkan peta interaktif…");
        requestMapWarmup();
        await Promise.allSettled([
          criticalReady,
          waitForStartupReady(FAST_LOADER_TIMEOUT_MS)
        ]);
        if (cancelled) return;

        const remaining = Math.max(0, FAST_LOADER_MIN_MS - (performance.now() - startedAt));
        finishTimer = window.setTimeout(() => finish(), remaining);
        return;
      }

      let THREE = null;
      try {
        THREE = await Promise.race([
          loadThree(),
          new Promise((resolve) => window.setTimeout(() => resolve(null), THREE_LOAD_TIMEOUT_MS))
        ]);
        if (THREE && hostRef.current && !cancelled) {
          sceneHandle = buildScene(THREE, hostRef.current);
        }
      } catch {
        THREE = null;
      }

      if (cancelled) return;

      statusTimers = [
        window.setTimeout(() => setStatus("Menyusuri Asia Tenggara…"), 950),
        window.setTimeout(() => setStatus("Mendekati Indonesia…"), 2200),
        window.setTimeout(() => setStatus("Sulawesi Selatan"), 3600),
        window.setTimeout(() => setStatus("Kabupaten Wajo"), 5000),
        window.setTimeout(() => {
          setStatus("Menyiapkan tampilan peta…");
          requestMapWarmup();
        }, 5000),
        window.setTimeout(() => setStatus("Membuka peta interaktif…"), 6450)
      ];

      void criticalReady;
      void (sceneHandle?.texturePromise ?? Promise.resolve());

      const cinematicTimeout = reducedMotion ? 4500 : Math.max(0, MAX_INTRO_MS - (performance.now() - startedAt));
      await waitForStartupReady(cinematicTimeout);
      requestMapWarmup();

      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(0, MIN_INTRO_MS - elapsed);
      finishTimer = window.setTimeout(finish, remaining);
      maxTimer = window.setTimeout(finish, Math.max(0, MAX_INTRO_MS - elapsed));
    };
    run();

    return () => {
      cancelled = true;
      clearTimers();
      window.clearTimeout(exitTimerRef.current);
      sceneHandle?.stop?.();
    };
  }, [experienceMode, onComplete, onMapWarmup]);

  const skip = () => {
    if (completedRef.current || experienceMode === "checking") return;
    requestMapWarmup();
    if (experienceMode === "cinematic") {
      markStartupIntroSeen();
    }
    completedRef.current = true;
    setClosing(true);
    window.clearTimeout(exitTimerRef.current);
    exitTimerRef.current = window.setTimeout(() => onComplete?.(), EXIT_FADE_MS);
  };

  return (
    <div
      className={`geoportal-intro geoportal-intro--${experienceMode} ${closing ? "geoportal-intro--closing" : ""}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div ref={hostRef} className="geoportal-intro__scene" aria-hidden="true" />
      <div
        className="geoportal-intro__fast-cosmos"
        style={{ backgroundImage: `url(${COSMIC_TEXTURE_URL})` }}
        aria-hidden="true"
      >
        <div className="geoportal-intro__fast-nebula" />
        <div className="geoportal-intro__fast-stars" />
        <div
          className="geoportal-intro__fast-earth"
          style={{ backgroundImage: `url(${FAST_EARTH_URL})` }}
        >
          <span className="geoportal-intro__fast-earth-atmosphere" />
          <span className="geoportal-intro__fast-earth-target" aria-hidden="true" />
        </div>
        <span
          className="geoportal-intro__fast-sun"
          style={{ backgroundImage: `url(${SUN_GLOW_URL})` }}
        />
      </div>
      <div className="geoportal-intro__fast-orbit" aria-hidden="true"><span /></div>
      <div className="geoportal-intro__space-glow" aria-hidden="true" />
      <div className="geoportal-intro__vignette" aria-hidden="true" />

      <div className="geoportal-intro__content">
        <div className="geoportal-intro__identity">
          <Image
            src={LOGO_SRC}
            alt="Lambang Kabupaten Wajo"
            width={76}
            height={76}
            priority
            className="geoportal-intro__logo"
          />
          <div>
            <div className="geoportal-intro__eyebrow">Pemerintah Kabupaten Wajo</div>
            <div className="geoportal-intro__title">Peta Interaktif Kabupaten Wajo</div>
          </div>
        </div>

        <div className="geoportal-intro__destination" aria-hidden="true">
          <span className="geoportal-intro__destination-line" />
          <span>Sulawesi Selatan · Indonesia</span>
        </div>

        <div className="geoportal-intro__status">
          <span className="geoportal-intro__status-dot" aria-hidden="true" />
          <span>{status}</span>
        </div>

      </div>

      {experienceMode === "cinematic" && (
        <button type="button" className="geoportal-intro__skip" onClick={skip}>
          Lewati intro
        </button>
      )}

      <div className="geoportal-intro__credit">Globe visualization · GeoPortal Kabupaten Wajo</div>
    </div>
  );
}
