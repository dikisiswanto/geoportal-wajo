import {
  IconAntenna,
  IconBolt,
  IconBuildingBank,
  IconDroplet,
  IconFirstAidKit,
  IconMapPin,
  IconRecycle,
  IconRoad,
  IconSchool
} from "@tabler/icons-react";

export default function LayerGlyph({
  layer,
  active
}) {
  const muted = active
    ? "text-slate-800"
    : "text-slate-400";

  if (layer.geometry === "Point") {
    const Component =
      layer.pointCategory === "energy"
        ? IconBolt
        : layer.pointCategory === "telecom"
          ? IconAntenna
          : layer.pointCategory === "water"
            ? IconDroplet
            : layer.pointCategory === "sanitation"
              ? IconRecycle
              : layer.pointCategory === "transport"
                ? IconRoad
                : layer.pointCategory === "education"
                  ? IconSchool
                  : layer.pointCategory === "health"
                    ? IconFirstAidKit
                    : layer.pointCategory === "opd"
                      ? IconBuildingBank
                      : IconMapPin;

    return (
      <Component
        size={15}
        stroke={1.7}
        className={muted}
        aria-hidden
      />
    );
  }

  if (layer.geometry === "LineString") {
    return (
      <span
        aria-hidden
        className="inline-block h-[2px] w-4"
        style={{
          backgroundColor: active
            ? layer.color
            : "#cbd5e1"
        }}
      />
    );
  }

  return (
    <span
      aria-hidden
      className="inline-block h-3 w-3 border"
      style={{
        backgroundColor: active
          ? layer.color
          : "#fff",
        borderColor: active
          ? layer.color
          : "#cbd5e1"
      }}
    />
  );
}
