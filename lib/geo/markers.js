import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server.browser";
import {
  IconAlertTriangle,
  IconAntenna,
  IconBuildingFactory,
  IconBus,
  IconDroplet,
  IconFish,
  IconGasStation,
  IconMapPin,
  IconRecycle,
  IconRoad,
  IconScale,
  IconShip,
  IconTarget,
  IconTrain,
  IconTrash
} from "@tabler/icons-react";

export const MARKER_ICONS = {
  bridge: IconRoad,
  terminal: IconBus,
  port: IconShip,
  fish: IconFish,
  train: IconTrain,
  scale: IconScale,
  power: IconBuildingFactory,
  bolt: IconTarget,
  gas: IconGasStation,
  telecom: IconAntenna,
  water: IconDroplet,
  recycle: IconRecycle,
  trash: IconTrash,
  sanitation: IconDroplet,
  evacuation: IconAlertTriangle,
  place: IconMapPin
};

export function pointKind(layer, feature) {
  const name = String(feature?.properties?.NAMOBJ ?? "").toLowerCase();
  if (layer.styleMode === "toponym") return "place";
  if (name.includes("jembatan timbang")) return "scale";
  if (name.includes("jembatan")) return "bridge";
  if (name.includes("terminal")) return "terminal";
  if (name.includes("pelabuhan")) return "port";
  if (name.includes("pendaratan ikan")) return "fish";
  if (name.includes("stasiun")) return "train";
  if (name.includes("gardu listrik")) return "bolt";
  if (name.includes("minyak") || name.includes("gas bumi")) return "gas";
  if (name.includes("pembangkit")) return "power";
  if (name.includes("seluler")) return "telecom";
  if (name.includes("telekomunikasi") || name.includes("jaringan tetap")) return "telecom";
  if (name.includes("evakuasi")) return "evacuation";
  if (name.includes("sampah") || name.includes("tps") || name.includes("tpst") || name.includes("tpa") || name.includes("limbah")) return "recycle";
  if (name.includes("air") || name.includes("sumber daya air") || name.includes("banjir") || name.includes("produksi")) return "water";
  return layer.pointCategory === "energy" ? "power" : layer.pointCategory === "telecom" ? "telecom" : layer.pointCategory === "water" ? "water" : layer.pointCategory === "sanitation" ? "sanitation" : "place";
}

const cache = new Map();

export function markerIconMarkup(kind, color) {
  const key = `${kind}:${color}`;
  if (cache.has(key)) return cache.get(key);
  const Component = MARKER_ICONS[kind] || IconMapPin;
  const svg = renderToStaticMarkup(createElement(Component, { size: 17, stroke: 1.8, color }));
  const html = `<div class="geo-marker" style="color:${color}">${svg}</div>`;
  cache.set(key, html);
  return html;
}
