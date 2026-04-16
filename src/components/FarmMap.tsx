import { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { MapPin, Users, ShieldCheck, AlertTriangle, Wheat } from 'lucide-react';
import { farms, getWorkersForFarm, getFarmComplianceScore, getExpiringDocuments } from '../data/mockData';
import type { Farm } from '../types';

function buildIcon(color: string, count: number) {
  const html = `
    <div style="position:relative;width:36px;height:36px;">
      <div style="position:absolute;inset:0;border-radius:50%;background:${color};opacity:0.25;"></div>
      <div style="position:absolute;inset:6px;border-radius:50%;background:${color};box-shadow:0 0 0 2px white,0 4px 12px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;color:white;font-size:11px;font-weight:700;font-family:Inter,sans-serif;">
        ${count}
      </div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'yadag-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
}

function colorForCompliance(c: number) {
  if (c >= 90) return '#16a34a';
  if (c >= 70) return '#f59e0b';
  return '#ef4444';
}

function MapFlyTo({ farm }: { farm: Farm | null }) {
  const map = useMap();
  if (farm) {
    map.flyTo(farm.coordinates, 9, { duration: 0.8 });
  }
  return null;
}

function FarmSidebarItem({
  farm,
  isHighlighted,
  onHover,
  onLeave,
  onSelect,
  index,
}: {
  farm: Farm;
  isHighlighted: boolean;
  onHover: () => void;
  onLeave: () => void;
  onSelect: () => void;
  index: number;
}) {
  const workers = getWorkersForFarm(farm.id);
  const compliance = getFarmComplianceScore(farm.id);
  const expiring = getExpiringDocuments().filter((e) => e.worker.farmId === farm.id).length;
  const color = colorForCompliance(compliance);

  return (
    <motion.button
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.06 }}
      whileHover={{ scale: 1.01 }}
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`w-full text-left p-3 rounded-lg border transition-all ${
        isHighlighted
          ? 'bg-leaf-50 dark:bg-leaf-950/40 border-leaf-300 dark:border-leaf-800 shadow-md'
          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
            <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {farm.name}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{farm.location}</span>
          </div>
        </div>
        <span className="text-sm font-bold flex-shrink-0" style={{ color }}>
          {compliance}%
        </span>
      </div>
      <div className="flex items-center gap-3 mt-2 text-[11px]">
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <Users className="w-3 h-3" />
          {workers.length}
        </span>
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <Wheat className="w-3 h-3" />
          <span className="truncate">{farm.cropType}</span>
        </span>
        {expiring > 0 && (
          <span className="flex items-center gap-1 text-danger-600 dark:text-danger-400 font-semibold ml-auto">
            <AlertTriangle className="w-3 h-3" />
            {expiring}
          </span>
        )}
      </div>
    </motion.button>
  );
}

export function FarmMap() {
  const [hoveredFarm, setHoveredFarm] = useState<Farm | null>(null);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);

  const ontarioCenter: [number, number] = [45.5, -85];

  const farmData = useMemo(
    () =>
      farms.map((f) => {
        const workers = getWorkersForFarm(f.id);
        const compliance = getFarmComplianceScore(f.id);
        return { farm: f, workers, compliance, color: colorForCompliance(compliance) };
      }),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-leaf-50 dark:bg-leaf-950/40">
            <MapPin className="w-4 h-4 text-leaf-600 dark:text-leaf-400" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Farm Map</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {farms.length} active farms across {new Set(farms.map((f) => f.province)).size} provinces
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[10px] text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-leaf-500" />
            High
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-warning-500" />
            Watch
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-danger-500" />
            Critical
          </span>
          <span className="flex items-center gap-1 pl-2 border-l border-gray-200 dark:border-gray-700">
            <ShieldCheck className="w-3 h-3" />
            Compliance
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Map */}
        <div className="lg:col-span-2 h-[480px] relative">
          <MapContainer
            center={ontarioCenter}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
            attributionControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap &copy; CARTO'
            />
            <MapFlyTo farm={hoveredFarm || selectedFarm} />
            {farmData.flatMap(({ farm, workers, compliance, color }) => [
              <CircleMarker
                key={`${farm.id}-halo`}
                center={farm.coordinates}
                radius={Math.max(14, Math.min(34, workers.length * 0.9))}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: hoveredFarm?.id === farm.id ? 0.2 : 0.08,
                  weight: 0,
                }}
              />,
              <Marker
                key={farm.id}
                position={farm.coordinates}
                icon={buildIcon(color, workers.length)}
                eventHandlers={{
                  mouseover: () => setHoveredFarm(farm),
                  mouseout: () => setHoveredFarm(null),
                  click: () => setSelectedFarm(farm),
                }}
              >
                <Popup>
                  <div style={{ minWidth: 180 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{farm.name}</div>
                    <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 8 }}>{farm.location}</div>
                    <div style={{ display: 'flex', gap: 10, fontSize: 11 }}>
                      <span><strong>{workers.length}</strong> workers</span>
                      <span style={{ color }}><strong>{compliance}%</strong> compliant</span>
                    </div>
                    <div style={{ fontSize: 11, opacity: 0.7, marginTop: 6 }}>
                      {farm.cropType}
                    </div>
                  </div>
                </Popup>
              </Marker>,
            ])}
          </MapContainer>
        </div>

        {/* Sidebar */}
        <div className="border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 p-4 space-y-2.5 max-h-[480px] overflow-y-auto">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-1 mb-1">
            Farms
          </h3>
          {farmData.map(({ farm }, i) => (
            <FarmSidebarItem
              key={farm.id}
              farm={farm}
              index={i}
              isHighlighted={hoveredFarm?.id === farm.id || selectedFarm?.id === farm.id}
              onHover={() => setHoveredFarm(farm)}
              onLeave={() => setHoveredFarm(null)}
              onSelect={() => setSelectedFarm(farm)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
