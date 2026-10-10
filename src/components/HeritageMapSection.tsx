import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  ArrowRight,
  Play,
  Pause,
  Globe,
  MapPin,
  Check,
  Shield,
  Palette,
  Sun,
  Flame,
  ChevronLeft,
  ChevronRight,
  Eye,
  Camera,
  Map as MapIcon,
  Navigation,
  ExternalLink,
  Info,
} from 'lucide-react';
import {
  HERITAGE_LOCATIONS,
  REGIONS_META,
  HeritageLocationNode,
} from '../data/heritageMapData';
import { soundEngine } from '../utils/audioSynth';
import { PRESET_OUTFITS, PresetOutfit } from '../data/vietPhucData';
import { useAppTheme } from '../context/ThemeContext';

interface HeritageMapSectionProps {
  onStartFitting?: () => void;
  onSelectTopItem?: (topId: string) => void;
  onApplyPreset?: (preset: PresetOutfit) => void;
}

// Satellite Tile API (Esri World Imagery) - photorealistic high-res satellite imagery
const SATELLITE_TILE_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const SATELLITE_ATTRIBUTION = '&copy; Esri, Maxar, Earthstar Geographics, USDA, USGS, AeroGRID, IGN';

// Satellite Hybrid Reference Layer (Boundaries, coastlines, provinces & place names on satellite)
const SATELLITE_LABELS_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}';

// Landmarks defining the national sovereignty & geographic boundaries of Vietnam
interface SovereigntyLandmark {
  id: string;
  name: string;
  historicalName?: string;
  region: string;
  lat: number;
  lng: number;
  role: string;
  color: string;
  icon: string;
}

const SOVEREIGNTY_LANDMARKS: SovereigntyLandmark[] = [
  {
    id: 'hoang-sa',
    name: 'Quần Đảo Hoàng Sa',
    historicalName: 'Bãi Cát Vàng (Triều Nguyễn lập Hải đội Hoàng Sa)',
    region: 'Huyện đảo Hoàng Sa, TP. Đà Nẵng',
    lat: 16.5333,
    lng: 111.6167,
    role: 'Chủ quyền thiêng liêng muôn đời trên Biển Đông',
    color: '#F59E0B',
    icon: '🌊',
  },
  {
    id: 'truong-sa',
    name: 'Quần Đảo Trường Sa',
    historicalName: 'Vạn Lý Trường Sa (Đội Bắc Hải triều Nguyễn kiêm quản)',
    region: 'Huyện đảo Trường Sa, Tỉnh Khánh Hòa',
    lat: 9.8833,
    lng: 114.2833,
    role: 'Chủ quyền biển đảo muôn đời của Tổ quốc',
    color: '#EF4444',
    icon: '🌊',
  },
  {
    id: 'lung-cu',
    name: 'Cột Cờ Lũng Cú',
    historicalName: 'Địa đầu Long Cổ (Nơi đặt trống đồng thời Lý Thường Kiệt)',
    region: 'Huyện Đồng Văn, Tỉnh Hà Giang (Cực Bắc 23°23\'B)',
    lat: 23.364,
    lng: 105.319,
    role: 'Nóc nhà địa đầu dải đất chữ S',
    color: '#DC2626',
    icon: '🚩',
  },
  {
    id: 'dat-mui',
    name: 'Đất Mũi Cà Mau',
    historicalName: 'Mũi Cà Mau (Gia Định Thành Thông Chí)',
    region: 'Huyện Ngọc Hiển, Tỉnh Cà Mau (Cực Nam 8°36\'B)',
    lat: 8.6044,
    lng: 104.7175,
    role: 'Gót sen phương Nam phù sa màu mỡ',
    color: '#10B981',
    icon: '⛵',
  },
  {
    id: 'phu-quoc',
    name: 'Đảo Ngọc Phú Quốc',
    historicalName: 'Vùng đất mở cõi trấn Hà Tiên thời Mạc Cửu',
    region: 'TP. Phú Quốc, Tỉnh Kiên Giang',
    lat: 10.2289,
    lng: 103.9572,
    role: 'Hòn ngọc viễn tây biển đảo Việt Nam',
    color: '#06B6D4',
    icon: '🏝️',
  },
  {
    id: 'con-dao',
    name: 'Quần Đảo Côn Đảo',
    historicalName: 'Côn Lôn Đảo (Địa dư chí cổ)',
    region: 'Huyện Côn Đảo, Tỉnh Bà Rịa - Vũng Tàu',
    lat: 8.6833,
    lng: 106.6000,
    role: 'Di tích lịch sử oai hùng giữa trùng khơi',
    color: '#8B5CF6',
    icon: '⚓',
  },
];

// Coordinates along Vietnam's authentic S-curve spine from North to South
const VIETNAM_S_SPINE_LATLNGS: [number, number][] = [
  [23.364, 105.319], // Lũng Cú
  [21.850, 105.500], // Tuyên Quang
  [21.0285, 105.8542], // Hà Nội
  [20.2506, 105.9744], // Hoa Lư Ninh Bình
  [19.8000, 105.7800], // Thanh Hóa
  [18.6700, 105.6800], // Vinh Nghệ An
  [18.0500, 106.1500], // Hà Tĩnh
  [17.4800, 106.6000], // Quảng Bình
  [16.8000, 107.1000], // Quảng Trị
  [16.4637, 107.5909], // Huế
  [16.0500, 108.2000], // Đà Nẵng
  [15.8801, 108.3380], // Hội An Quảng Nam
  [15.1200, 108.8000], // Quảng Ngãi
  [13.7800, 109.2200], // Quy Nhơn Bình Định
  [12.8500, 109.4700], // Mũi Điện Phú Yên
  [12.2500, 109.1900], // Nha Trang
  [11.5600, 108.9900], // Phan Rang
  [10.9300, 108.1000], // Phan Thiết
  [10.7769, 106.7009], // Sài Gòn
  [10.3500, 106.3600], // Mỹ Tho Tiền Giang
  [10.0300, 105.7800], // Cần Thơ
  [9.1800, 105.1500],  // Cà Mau
  [8.6044, 104.7175],  // Đất Mũi Cà Mau
];

export const HeritageMapSection: React.FC<HeritageMapSectionProps> = ({
  onStartFitting,
  onSelectTopItem,
  onApplyPreset,
}) => {
  // Map Container Ref & Leaflet Instances
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const activeTileLayerRef = useRef<L.TileLayer | null>(null);
  const satelliteLabelsLayerRef = useRef<L.TileLayer | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const landmarksGroupRef = useRef<L.LayerGroup | null>(null);
  const spinePolylineRef = useRef<L.Polyline | null>(null);

  // Theme
  const { theme } = useAppTheme();
  const isCream = theme === 'cream';

  // States
  const [showPlaceLabels, setShowPlaceLabels] = useState<boolean>(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('hue');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSSpine, setShowSSpine] = useState<boolean>(false);
  const [showSovereignty, setShowSovereignty] = useState<boolean>(true);
  const [isAutoTouring, setIsAutoTouring] = useState<boolean>(false);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  // Current selected location node
  const selectedNode = useMemo(() => {
    return HERITAGE_LOCATIONS.find((n) => n.id === selectedNodeId) || HERITAGE_LOCATIONS[0];
  }, [selectedNodeId]);

  // Filtered locations
  const filteredLocations = useMemo(() => {
    return HERITAGE_LOCATIONS.filter((loc) => {
      const matchRegion = selectedRegionFilter === 'all' || loc.regionId === selectedRegionFilter;
      const matchQuery =
        !searchQuery.trim() ||
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.mainGarmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.historicalName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.dynasties.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchRegion && matchQuery;
    });
  }, [selectedRegionFilter, searchQuery]);

  // Initialize Leaflet Map once with Satellite Base Layer
  useEffect(() => {
    if (!mapContainerRef.current || leafletMapRef.current) return;

    // Center squarely on the Vietnam S-shape [16.2, 107.5]
    const map = L.map(mapContainerRef.current, {
      center: [16.2, 107.5],
      zoom: 6,
      minZoom: 5,
      maxZoom: 16,
      zoomControl: false, // Custom styled zoom controls
      attributionControl: true,
      scrollWheelZoom: true,
      maxBounds: [
        [6.0, 100.0],
        [25.5, 120.0],
      ],
      maxBoundsViscosity: 0.8,
    });

    leafletMapRef.current = map;

    // Initialize High-Resolution Satellite Base Layer (Esri World Imagery)
    const tileLayer = L.tileLayer(SATELLITE_TILE_URL, {
      attribution: SATELLITE_ATTRIBUTION,
      maxZoom: 18,
    }).addTo(map);

    activeTileLayerRef.current = tileLayer;

    // Initialize Satellite Hybrid Labels Layer (Province boundaries & place names)
    const labelsLayer = L.tileLayer(SATELLITE_LABELS_URL, {
      maxZoom: 18,
      opacity: 0.9,
    });
    if (showPlaceLabels) {
      labelsLayer.addTo(map);
    }
    satelliteLabelsLayerRef.current = labelsLayer;

    // Groups for markers & overlays
    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;

    const landmarksGroup = L.layerGroup().addTo(map);
    landmarksGroupRef.current = landmarksGroup;

    // Initialize S-Spine golden Polyline directly on satellite
    const spineLine = L.polyline(VIETNAM_S_SPINE_LATLNGS, {
      color: '#FBBF24',
      weight: 4.5,
      opacity: 0.95,
      dashArray: '8, 6',
      lineCap: 'round',
      lineJoin: 'round',
    });
    spinePolylineRef.current = spineLine;
    if (showSSpine) {
      spineLine.addTo(map);
    }

    // Listen for resize and ensure correct rendering
    setTimeout(() => {
      map.invalidateSize();
      setMapLoaded(true);
    }, 250);

    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, []);

  // Toggle Satellite Place Labels & Boundaries
  useEffect(() => {
    if (!leafletMapRef.current || !satelliteLabelsLayerRef.current) return;
    const map = leafletMapRef.current;
    const labelsLayer = satelliteLabelsLayerRef.current;

    if (showPlaceLabels) {
      if (!map.hasLayer(labelsLayer)) {
        labelsLayer.addTo(map);
      }
    } else {
      if (map.hasLayer(labelsLayer)) {
        map.removeLayer(labelsLayer);
      }
    }
  }, [showPlaceLabels]);

  // Toggle S-Spine visibility
  useEffect(() => {
    if (!spinePolylineRef.current || !leafletMapRef.current) return;
    const map = leafletMapRef.current;
    if (showSSpine) {
      if (!map.hasLayer(spinePolylineRef.current)) {
        spinePolylineRef.current.addTo(map);
      }
    } else {
      if (map.hasLayer(spinePolylineRef.current)) {
        map.removeLayer(spinePolylineRef.current);
      }
    }
  }, [showSSpine]);

const SHORT_LOCATION_NAMES: Record<string, string> = {
  'thang-long': 'Thăng Long',
  'kinh-bac': 'Kinh Bắc',
  'tay-bac': 'Sa Pa',
  'hoa-lu': 'Hoa Lư',
  'dong-son': 'Lam Kinh',
  'hue': 'Cố Đô Huế',
  'hoi-an': 'Hội An',
  'cham-pa': 'Champa',
  'tay-nguyen': 'Tây Nguyên',
  'sai-gon': 'Sài Gòn',
  'tan-chau': 'Tân Châu',
};

const SHORT_SOVEREIGNTY_NAMES: Record<string, string> = {
  'hoang-sa': 'Hoàng Sa',
  'truong-sa': 'Trường Sa',
  'lung-cu': 'Lũng Cú',
  'dat-mui': 'Đất Mũi',
  'phu-quoc': 'Phú Quốc',
  'con-dao': 'Côn Đảo',
};

  // Render Sovereignty Landmarks (Hoàng Sa, Trường Sa, Lũng Cú, Cà Mau, Phú Quốc, Côn Đảo)
  useEffect(() => {
    if (!landmarksGroupRef.current || !leafletMapRef.current) return;
    const group = landmarksGroupRef.current;
    group.clearLayers();

    if (!showSovereignty) return;

    SOVEREIGNTY_LANDMARKS.forEach((lm) => {
      const isIsland = lm.id === 'hoang-sa' || lm.id === 'truong-sa';
      const shortName = SHORT_SOVEREIGNTY_NAMES[lm.id] || lm.name;

      const iconHtml = `
        <div class="relative flex flex-col items-center group cursor-pointer transition-transform duration-200 hover:scale-115">
          <!-- Pin Circle -->
          <div class="relative flex items-center justify-center w-7 h-7 rounded-full shadow-xl ${
            isIsland ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300' : 'bg-rose-600 text-white ring-2 ring-rose-400'
          }">
            <span class="text-xs select-none">${lm.icon}</span>
            <span class="absolute -top-1 -right-1 flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${isIsland ? 'bg-amber-400 opacity-75' : 'bg-rose-400 opacity-75'}"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 ${isIsland ? 'bg-amber-400' : 'bg-rose-500'}"></span>
            </span>
          </div>
          <!-- Compact Badge -->
          <div class="mt-0.5 px-2 py-0.5 rounded-full bg-slate-950/90 backdrop-blur-md border ${
            isIsland ? 'border-amber-400/60 text-amber-200' : 'border-rose-400/60 text-rose-100'
          } shadow-lg whitespace-nowrap text-[10px] font-bold pointer-events-none">
            <span>${shortName}</span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-sovereignty-icon',
        html: iconHtml,
        iconSize: [70, 48],
        iconAnchor: [35, 14],
      });

      const marker = L.marker([lm.lat, lm.lng], { icon: customIcon });

      // Cultural & Sovereignty Tooltip on Hover
      marker.bindTooltip(`
        <div class="cultural-tooltip-card min-w-[250px] max-w-[290px] p-2.5 text-slate-100 font-sans-vi">
          <div class="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-amber-500/25">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
              isIsland ? 'bg-amber-500/20 border-amber-400/50 text-amber-200' : 'bg-rose-500/20 border-rose-400/50 text-rose-200'
            } border text-[10px] font-semibold">
              <span>${lm.icon}</span>
              <span>${isIsland ? 'Chủ Quyền Biển Đảo' : 'Cương Vực Lãnh Thổ'}</span>
            </span>
            <span class="text-[10px] font-mono text-slate-400">
              ${lm.lat.toFixed(2)}°B, ${lm.lng.toFixed(2)}°Đ
            </span>
          </div>

          <div class="mb-1.5">
            <h4 class="font-serif-vi font-bold text-amber-200 text-sm leading-tight">
              ${lm.name}
            </h4>
            ${
              lm.historicalName
                ? `<div class="text-[10px] text-amber-300/90 font-mono italic mt-0.5 flex items-center gap-1">
                    <span class="text-[9px] px-1 py-0.2 rounded bg-amber-950/70 border border-amber-600/40 text-amber-300 not-italic">CỔ SỬ</span>
                    <span>${lm.historicalName}</span>
                  </div>`
                : ''
            }
            <div class="text-[10px] text-sky-200 mt-1 flex items-center gap-1 bg-slate-900/90 px-1.5 py-0.5 rounded border border-sky-500/20">
              <span class="text-[9px] px-1 py-0.2 rounded bg-sky-950 border border-sky-600/40 text-sky-300 font-medium">HÀNH CHÍNH</span>
              <span class="truncate">${lm.region}</span>
            </div>
          </div>

          <div class="p-1.5 rounded-lg bg-slate-950/80 border border-amber-500/20 mb-1.5 text-[10px] text-amber-100/95 leading-relaxed">
            <div class="flex items-start gap-1">
              <span class="text-amber-400 shrink-0">🇻🇳</span>
              <span>${lm.role}</span>
            </div>
          </div>

          <div class="text-[9px] text-center text-amber-300 font-medium flex items-center justify-center gap-1 bg-amber-500/10 py-0.5 rounded border border-amber-500/20">
            <span>👆 Nhấp để định vị chi tiết</span>
          </div>
        </div>
      `, {
        direction: 'top',
        offset: [0, -18],
        className: 'heritage-cultural-tooltip',
        opacity: 1,
        sticky: false,
      });

      marker.bindPopup(`
        <div class="p-3 text-slate-100 max-w-xs">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-lg">${lm.icon}</span>
            <h4 class="font-bold text-amber-300 text-sm">${lm.name}</h4>
          </div>
          ${lm.historicalName ? `<p class="text-[11px] text-amber-200/90 font-mono italic mb-1">🏛️ Cổ danh: ${lm.historicalName}</p>` : ''}
          <p class="text-xs text-sky-300 mb-1.5 flex items-center gap-1">
            <span class="text-[10px] text-slate-400">📍 Hành chính:</span> ${lm.region}
          </p>
          <div class="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-100/90 leading-relaxed">
            ${lm.role}
          </div>
        </div>
      `);

      marker.on('click', () => {
        soundEngine.playPluck(587.33);
        if (leafletMapRef.current) {
          leafletMapRef.current.flyTo([lm.lat, lm.lng], 8.5, {
            duration: 1.2,
            easeLinearity: 0.25,
          });
        }
      });

      group.addLayer(marker);
    });
  }, [showSovereignty]);

  // Render Heritage Fashion Location Markers
  useEffect(() => {
    if (!markersGroupRef.current || !leafletMapRef.current) return;
    const group = markersGroupRef.current;
    group.clearLayers();

    filteredLocations.forEach((loc) => {
      const isSelected = loc.id === selectedNodeId;
      const [lng, lat] = loc.coordinates; // Notice GeoJSON is [lng, lat]
      const shortName = SHORT_LOCATION_NAMES[loc.id] || loc.name.split(' ')[0];

      const markerHtml = `
        <div class="relative flex flex-col items-center group cursor-pointer transition-all duration-300 ${
          isSelected ? 'scale-120 z-50' : 'hover:scale-110 z-20'
        }">
          <!-- Pulse animation for selected -->
          ${
            isSelected
              ? `<div class="absolute -top-1 -inset-x-2 h-10 rounded-full bg-amber-400/50 animate-ping pointer-events-none"></div>`
              : ''
          }
          <!-- Central Icon Pin -->
          <div class="relative flex items-center justify-center w-8 h-8 rounded-full shadow-2xl transition-all ${
            isSelected
              ? 'bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-100 text-slate-950 ring-4 ring-amber-400/90 shadow-amber-500/70 scale-105'
              : 'bg-slate-950/90 text-amber-300 ring-2 ring-amber-500/50 hover:ring-amber-300 hover:bg-slate-900 shadow-slate-950/90'
          }">
            <span class="text-sm font-bold select-none">${loc.icon || '🏛️'}</span>
          </div>

          <!-- Compact Clean Badge Underneath -->
          <div class="mt-1 px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-xl whitespace-nowrap text-[11px] font-semibold transition-all pointer-events-none flex items-center gap-1 ${
            isSelected
              ? 'bg-amber-500 text-slate-950 border border-amber-300 font-bold shadow-amber-500/40 ring-2 ring-amber-400/60'
              : 'bg-slate-950/90 border border-slate-700/80 text-amber-100/95 group-hover:border-amber-400 group-hover:text-amber-200'
          }">
            <span>${shortName}</span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-heritage-marker',
        html: markerHtml,
        iconSize: [80, 54],
        iconAnchor: [40, 16],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Custom Cultural Tooltip on Hover
      marker.bindTooltip(`
        <div class="cultural-tooltip-card min-w-[260px] max-w-[310px] p-2.5 text-slate-100 font-sans-vi">
          <!-- Top badge + Coordinates -->
          <div class="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-amber-500/25">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/35 text-[10px] font-semibold text-amber-300">
              <span>${loc.icon || '🏛️'}</span>
              <span>${loc.elevationBadge || 'Di Tích Cổ Phong'}</span>
            </span>
            <span class="text-[10px] font-mono text-slate-400">
              ${lat.toFixed(2)}°B, ${lng.toFixed(2)}°Đ
            </span>
          </div>

          <!-- Title & Historical / Modern naming -->
          <div class="mb-1.5">
            <h4 class="font-serif-vi font-bold text-amber-200 text-sm leading-snug">
              ${loc.name}
            </h4>
            ${
              loc.historicalName
                ? `<div class="text-[10px] text-amber-300/85 font-mono italic mt-0.5 flex items-center gap-1">
                    <span class="text-[9px] px-1 py-0.2 rounded bg-amber-950/70 border border-amber-600/40 text-amber-300 not-italic">CỔ DANH</span>
                    <span>${loc.historicalName}</span>
                  </div>`
                : ''
            }
            <div class="text-[10px] text-sky-200 mt-1 flex items-center gap-1 bg-slate-900/90 px-1.5 py-0.5 rounded border border-sky-500/20">
              <span class="text-[9px] px-1 py-0.2 rounded bg-sky-950 border border-sky-600/40 text-sky-300 font-medium">HIỆN NAY</span>
              <span class="truncate">${loc.modernLocation}</span>
            </div>
          </div>

          <!-- Cultural Core Info Box -->
          <div class="space-y-1 p-2 rounded-lg bg-slate-950/80 border border-amber-500/20 mb-1.5 text-[10px]">
            <div class="flex items-start gap-1">
              <span class="text-amber-400 shrink-0">👘</span>
              <div class="leading-tight">
                <span class="text-slate-400 font-medium">Cổ phục:</span>
                <span class="text-amber-200 font-semibold ml-1">${loc.mainGarmentName}</span>
              </div>
            </div>
            <div class="flex items-start gap-1">
              <span class="text-amber-400 shrink-0">🧵</span>
              <div class="text-slate-300 leading-tight">
                <span class="text-slate-400 font-medium">Chất liệu:</span>
                <span class="ml-1">${loc.craftAndFabric.length > 70 ? loc.craftAndFabric.slice(0, 68) + '...' : loc.craftAndFabric}</span>
              </div>
            </div>
            ${
              loc.dynasties && loc.dynasties.length > 0
                ? `<div class="flex items-center gap-1 pt-1 border-t border-slate-800 text-[10px] text-slate-400">
                    <span class="text-amber-400">📜</span>
                    <span>Triều đại:</span>
                    <span class="text-amber-200/90 font-medium ml-1">${loc.dynasties.join(' • ')}</span>
                  </div>`
                : ''
            }
          </div>

          <!-- Call to action hint -->
          <div class="text-[9px] text-center text-amber-300 font-medium flex items-center justify-center gap-1 bg-amber-500/10 py-1 rounded border border-amber-500/20">
            <span>✨ Nhấp để mở hồ sơ di sản & mặc thử</span>
          </div>
        </div>
      `, {
        direction: 'top',
        offset: [0, -18],
        className: 'heritage-cultural-tooltip',
        opacity: 1,
        sticky: false,
      });

      marker.on('click', () => {
        soundEngine.playPluck(523.25);
        setSelectedNodeId(loc.id);
        if (leafletMapRef.current) {
          leafletMapRef.current.flyTo([lat, lng], 8, {
            duration: 1.2,
            easeLinearity: 0.25,
          });
        }
      });

      marker.on('mouseover', () => {
        setHoveredNodeId(loc.id);
      });

      marker.on('mouseout', () => {
        setHoveredNodeId(null);
      });

      group.addLayer(marker);
    });
  }, [filteredLocations, selectedNodeId]);

  // Fly to node smoothly
  const flyToNode = useCallback((node: HeritageLocationNode, zoomLevel = 8) => {
    if (!leafletMapRef.current) return;
    const [lng, lat] = node.coordinates;
    leafletMapRef.current.flyTo([lat, lng], zoomLevel, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, []);

  // Handle jump along the S-Curve sections
  const handleJumpToSection = (section: 'north' | 'central' | 'south' | 'islands' | 'full') => {
    if (!leafletMapRef.current) return;
    soundEngine.playPluck(440);

    if (section === 'north') {
      // Focus on Thăng Long & Bắc Bộ
      leafletMapRef.current.flyTo([21.2, 105.8], 7.5, { duration: 1.2 });
      setSelectedNodeId('thang-long');
    } else if (section === 'central') {
      // Focus on Cố Đô Huế & Hội An
      leafletMapRef.current.flyTo([16.2, 107.8], 7.5, { duration: 1.2 });
      setSelectedNodeId('hue');
    } else if (section === 'south') {
      // Focus on Sài Gòn & Nam Bộ
      leafletMapRef.current.flyTo([10.5, 106.2], 7.5, { duration: 1.2 });
      setSelectedNodeId('saigon');
    } else if (section === 'islands') {
      // Focus on Hoàng Sa & Trường Sa (Biển Đông)
      leafletMapRef.current.flyTo([13.5, 112.5], 6.2, { duration: 1.2 });
    } else {
      // Reset full view of Vietnam S-Shape
      leafletMapRef.current.flyTo([16.2, 107.5], 6, { duration: 1.2 });
    }
  };

  // Zoom buttons
  const handleZoomIn = () => {
    if (!leafletMapRef.current) return;
    soundEngine.playPluck(440);
    leafletMapRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (!leafletMapRef.current) return;
    soundEngine.playPluck(330);
    leafletMapRef.current.zoomOut();
  };

  const handleResetView = () => {
    handleJumpToSection('full');
  };

  // Auto-tour along Vietnam's S-curve
  useEffect(() => {
    if (!isAutoTouring) return;

    const interval = setInterval(() => {
      setSelectedNodeId((currentId) => {
        const currentIndex = HERITAGE_LOCATIONS.findIndex((n) => n.id === currentId);
        const nextIndex = (currentIndex + 1) % HERITAGE_LOCATIONS.length;
        const nextNode = HERITAGE_LOCATIONS[nextIndex];
        flyToNode(nextNode, 7.5);
        soundEngine.playPluck(440 + (nextIndex % 5) * 45);
        return nextNode.id;
      });
    }, 4800);

    return () => clearInterval(interval);
  }, [isAutoTouring, flyToNode]);

  // Navigate next/prev location in inspector
  const handleNavigateNext = () => {
    const currentIndex = HERITAGE_LOCATIONS.findIndex((n) => n.id === selectedNodeId);
    const nextIndex = (currentIndex + 1) % HERITAGE_LOCATIONS.length;
    const nextNode = HERITAGE_LOCATIONS[nextIndex];
    setSelectedNodeId(nextNode.id);
    flyToNode(nextNode, 8);
  };

  const handleNavigatePrev = () => {
    const currentIndex = HERITAGE_LOCATIONS.findIndex((n) => n.id === selectedNodeId);
    const prevIndex = (currentIndex - 1 + HERITAGE_LOCATIONS.length) % HERITAGE_LOCATIONS.length;
    const prevNode = HERITAGE_LOCATIONS[prevIndex];
    setSelectedNodeId(prevNode.id);
    flyToNode(prevNode, 8);
  };

  // Try on garment action
  const handleTryOnGarment = () => {
    soundEngine.playCloudPartChime();
    if (selectedNode.targetPresetId) {
      const matchedPreset = PRESET_OUTFITS.find((p) => p.id === selectedNode.targetPresetId);
      if (matchedPreset && onApplyPreset) {
        onApplyPreset(matchedPreset);
      }
    }
    if (selectedNode.targetTopId && onSelectTopItem) {
      onSelectTopItem(selectedNode.targetTopId);
    }
    if (onStartFitting) {
      onStartFitting();
    }
  };

  return (
    <section className={`relative w-full py-16 px-4 md:px-8 overflow-hidden transition-colors duration-500 ${
      isCream
        ? 'bg-gradient-to-b from-[#FAF7F0] via-[#F4EFE6] to-[#FAF7F0] text-stone-900'
        : 'bg-gradient-to-b from-[#0A0E17] via-[#0E1526] to-[#0A0E17] text-slate-100'
    }`}>
      {/* Decorative Traditional Patterns & Ambient Glow */}
      <div className={`absolute top-0 inset-x-0 h-px ${
        isCream ? 'bg-gradient-to-r from-transparent via-amber-600/30 to-transparent' : 'bg-gradient-to-r from-transparent via-amber-500/40 to-transparent'
      }`}></div>
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] blur-[140px] pointer-events-none rounded-full ${
        isCream ? 'bg-amber-400/10' : 'bg-amber-500/5'
      }`}></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Section Header (Centered) */}
        <div className={`flex flex-col items-center text-center max-w-3xl mx-auto pb-6 border-b ${
          isCream ? 'border-amber-900/15' : 'border-amber-500/20'
        }`}>
          <div className="space-y-2 flex flex-col items-center">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase ${
              isCream
                ? 'bg-amber-100/90 border border-amber-400 text-amber-900'
                : 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
            }`}>
              <Globe className={`w-3.5 h-3.5 ${isCream ? 'text-amber-700' : 'text-amber-400'}`} />
              <span>Bản Đồ Vệ Tinh Độ Nét Cao</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-serif-vi font-bold text-center ${
              isCream
                ? 'text-amber-950 font-extrabold'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100'
            }`}>
              Dải Non Sông Chữ S & Khởi Nguyên Cổ Phục
            </h2>
            <p className={`text-xs sm:text-sm max-w-2xl text-center leading-relaxed ${
              isCream ? 'text-stone-700 font-normal' : 'text-slate-300 font-light'
            }`}>
              Khám phá cội nguồn di sản Việt phục trên nền không ảnh vệ tinh chân thực toàn cảnh Việt Nam — từ đỉnh Lũng Cú đến Mũi Cà Mau, cùng chủ quyền thiêng liêng Hoàng Sa — Trường Sa.
            </p>
          </div>
        </div>

        {/* Unified Map Navigation & Controls Hub */}
        <div className={`p-3 sm:p-4 rounded-2xl border backdrop-blur-md shadow-xl space-y-3 transition-colors ${
          isCream
            ? 'bg-white/95 border-amber-300 shadow-[0_4px_24px_rgba(180,130,60,0.08)] text-stone-900'
            : 'bg-[#0A0F1E]/90 border-amber-500/25 shadow-xl text-slate-100'
        }`}>
          {/* Tier 1: Search & Regional S-Curve Navigation */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Box */}
            <div className="relative w-full md:w-72">
              <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
                isCream ? 'text-stone-500' : 'text-slate-400'
              }`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kinh đô, áo cổ trang..."
                className={`w-full pl-8 pr-7 py-2 text-xs rounded-xl border focus:outline-none transition-all ${
                  isCream
                    ? 'bg-stone-50 border-stone-300 text-stone-900 placeholder:text-stone-400 focus:border-amber-500'
                    : 'bg-slate-950/80 border-slate-700/80 focus:border-amber-400 text-slate-200 placeholder-slate-500'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 text-xs ${
                    isCream ? 'text-stone-400 hover:text-stone-700' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ✕
                </button>
              )}
            </div>

            {/* S-Curve Regional Jumps (Single Horizontal Bar) */}
            <div className={`flex items-center gap-1.5 p-1 rounded-xl border overflow-x-auto scrollbar-none ${
              isCream ? 'bg-stone-100/90 border-stone-200' : 'bg-slate-950/80 border-slate-800'
            }`}>
              <span className={`text-[11px] font-semibold px-2 hidden lg:flex items-center gap-1 whitespace-nowrap ${
                isCream ? 'text-amber-800' : 'text-amber-400/80'
              }`}>
                <Navigation className={`w-3 h-3 ${isCream ? 'text-amber-700' : 'text-amber-400'}`} />
                <span>Trục chữ S:</span>
              </span>
              <button
                type="button"
                onClick={() => handleJumpToSection('full')}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium border transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  selectedRegionFilter === 'all'
                    ? isCream
                      ? 'bg-amber-400 text-slate-950 font-bold border-amber-500 shadow-xs'
                      : 'bg-amber-500/20 text-amber-200 border-amber-400/60 shadow-sm'
                    : isCream
                    ? 'text-stone-700 hover:text-stone-900 hover:bg-white border-transparent'
                    : 'text-slate-300 hover:text-amber-200 hover:bg-slate-800 border-transparent'
                }`}
              >
                🇻🇳 Toàn cảnh
              </button>
              <button
                type="button"
                onClick={() => handleJumpToSection('north')}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium border transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  selectedRegionFilter === 'bac'
                    ? isCream
                      ? 'bg-amber-400 text-slate-950 font-bold border-amber-500 shadow-xs'
                      : 'bg-amber-500/20 text-amber-200 border-amber-400/60 shadow-sm'
                    : isCream
                    ? 'text-stone-700 hover:text-stone-900 hover:bg-white border-transparent'
                    : 'text-slate-300 hover:text-amber-200 hover:bg-slate-800 border-transparent'
                }`}
              >
                🏛️ Bắc Bộ
              </button>
              <button
                type="button"
                onClick={() => handleJumpToSection('central')}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium border transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  selectedRegionFilter === 'trung'
                    ? isCream
                      ? 'bg-amber-400 text-slate-950 font-bold border-amber-500 shadow-xs'
                      : 'bg-amber-500/20 text-amber-200 border-amber-400/60 shadow-sm'
                    : isCream
                    ? 'text-stone-700 hover:text-stone-900 hover:bg-white border-transparent'
                    : 'text-slate-300 hover:text-amber-200 hover:bg-slate-800 border-transparent'
                }`}
              >
                🏯 Trung Bộ
              </button>
              <button
                type="button"
                onClick={() => handleJumpToSection('south')}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium border transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  selectedRegionFilter === 'nam'
                    ? isCream
                      ? 'bg-amber-400 text-slate-950 font-bold border-amber-500 shadow-xs'
                      : 'bg-amber-500/20 text-amber-200 border-amber-400/60 shadow-sm'
                    : isCream
                    ? 'text-stone-700 hover:text-stone-900 hover:bg-white border-transparent'
                    : 'text-slate-300 hover:text-amber-200 hover:bg-slate-800 border-transparent'
                }`}
              >
                🚣 Nam Bộ
              </button>
              <button
                type="button"
                onClick={() => handleJumpToSection('islands')}
                className={`px-3 py-1.5 text-xs rounded-lg font-semibold border transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  selectedRegionFilter === 'islands'
                    ? isCream
                      ? 'bg-amber-400 text-slate-950 font-bold border-amber-500 shadow-xs'
                      : 'bg-amber-500/20 text-amber-200 border-amber-400/60 shadow-sm'
                    : isCream
                    ? 'bg-amber-100 text-amber-950 border-amber-300 hover:bg-amber-200'
                    : 'text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30'
                }`}
              >
                🌊 Biển Đảo (Hoàng Sa - Trường Sa)
              </button>
            </div>
          </div>

          {/* Tier 2: Layer Toggles & Auto Tour Bar */}
          <div className={`flex flex-wrap items-center justify-between gap-3 pt-3 border-t ${
            isCream ? 'border-stone-200' : 'border-slate-800/80'
          }`}>
            {/* Layer & Feature Toggles */}
            <div className="flex flex-wrap items-center gap-2">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs shadow-inner ${
                isCream ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-slate-950/90 border-emerald-500/40 text-emerald-300'
              }`}>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold">🛰️ Vệ Tinh Trực Tuyến</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playPluck(480);
                  setShowPlaceLabels(!showPlaceLabels);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                  showPlaceLabels
                    ? isCream
                      ? 'bg-amber-200/90 border-amber-400 text-amber-950 font-bold shadow-xs'
                      : 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-sm'
                    : isCream
                    ? 'bg-stone-50 border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-100'
                    : 'bg-slate-950/70 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
                title="Bật/Tắt nhãn địa danh tỉnh thành trên ảnh vệ tinh"
              >
                <Layers className={`w-3.5 h-3.5 ${isCream ? 'text-amber-700' : 'text-amber-400'}`} />
                <span>{showPlaceLabels ? 'Nhãn địa danh: Bật' : 'Nhãn: Tắt'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playPluck(440);
                  setShowSSpine(!showSSpine);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                  showSSpine
                    ? isCream
                      ? 'bg-amber-200/90 border-amber-400 text-amber-950 font-bold shadow-xs'
                      : 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-sm'
                    : isCream
                    ? 'bg-stone-50 border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-100'
                    : 'bg-slate-950/70 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
                title="Bật/Tắt đường chỉ lụa vàng hình chữ S"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isCream ? 'text-amber-700' : 'text-amber-400'}`} />
                <span>Trục chữ S</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playPluck(440);
                  setShowSovereignty(!showSovereignty);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                  showSovereignty
                    ? isCream
                      ? 'bg-amber-200/90 border-amber-400 text-amber-950 font-bold shadow-xs'
                      : 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-sm'
                    : isCream
                    ? 'bg-stone-50 border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-100'
                    : 'bg-slate-950/70 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
                title="Bật/Tắt mốc chủ quyền biển đảo"
              >
                <Shield className={`w-3.5 h-3.5 ${isCream ? 'text-amber-700' : 'text-amber-400'}`} />
                <span>Mốc chủ quyền</span>
              </button>
            </div>

            {/* Auto-Tour & Cultural Hint */}
            <div className="flex items-center gap-2.5">
              <div
                className={`hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-normal select-none ${
                  isCream ? 'bg-amber-50 border-amber-200 text-stone-700' : 'bg-amber-500/10 border-amber-500/20 text-amber-200/90'
                }`}
                title="Rê chuột (hover) vào bất kỳ điểm mốc nào trên bản đồ để xem thẻ chú thích văn hóa tức thì"
              >
                <Info className={`w-3.5 h-3.5 ${isCream ? 'text-amber-700' : 'text-amber-400'} shrink-0`} />
                <span>Rê chuột vào điểm mốc xem văn hóa</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playPluck(523.25);
                  setIsAutoTouring(!isAutoTouring);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shadow-sm ${
                  isAutoTouring
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-amber-500/30 animate-pulse'
                    : isCream
                    ? 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-950 font-bold'
                    : 'bg-amber-500/15 border-amber-500/30 text-amber-200 hover:bg-amber-500/25'
                }`}
              >
                {isAutoTouring ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isAutoTouring ? 'Dừng du ngoạn' : 'Du ngoạn'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Map Viewport + Heritage Detail Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Map Viewport Area (8 cols) */}
          <div className={`lg:col-span-7 xl:col-span-8 relative rounded-3xl border overflow-hidden shadow-2xl heritage-map-container h-[640px] md:h-[720px] flex flex-col ${
            isCream ? 'bg-stone-100 border-amber-300/80 shadow-[0_8px_30px_rgba(180,130,60,0.12)]' : 'bg-slate-950/90 border-amber-500/30'
          }`}>
            {/* The Actual Leaflet Map Canvas */}
            <div ref={mapContainerRef} className="w-full h-full z-0 relative" />

            {/* Map Controls: Floating Action Buttons (Bottom Left) */}
            <div className="absolute bottom-5 left-4 z-10 flex flex-col gap-1.5">
              <button
                onClick={handleZoomIn}
                className={`w-9 h-9 rounded-xl border shadow-xl flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                  isCream ? 'bg-white hover:bg-amber-50 text-amber-950 border-amber-300 shadow-md' : 'bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/30'
                }`}
                title="Phóng to bản đồ"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomOut}
                className={`w-9 h-9 rounded-xl border shadow-xl flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                  isCream ? 'bg-white hover:bg-amber-50 text-amber-950 border-amber-300 shadow-md' : 'bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/30'
                }`}
                title="Thu nhỏ bản đồ"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetView}
                className={`w-9 h-9 rounded-xl border shadow-xl flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                  isCream ? 'bg-white hover:bg-amber-50 text-amber-950 border-amber-300 shadow-md' : 'bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/30'
                }`}
                title="Đặt lại góc nhìn trọn vẹn hình chữ S"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Location Dock: All 11 Heritage Locations Carousel (Bottom Dock) */}
            <div className="absolute bottom-5 left-16 right-4 sm:left-20 sm:right-auto sm:max-w-xl z-10 pointer-events-auto">
              <div className={`flex items-center gap-1.5 p-1.5 rounded-2xl backdrop-blur-xl border shadow-2xl overflow-x-auto scrollbar-none ${
                isCream ? 'bg-white/95 border-amber-300 text-stone-900 shadow-[0_8px_30px_rgba(180,130,60,0.15)]' : 'bg-slate-950/90 border-amber-500/30 text-slate-100'
              }`}>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 hidden sm:inline whitespace-nowrap ${
                  isCream ? 'text-amber-800' : 'text-amber-400'
                }`}>
                  Di sản:
                </span>
                {HERITAGE_LOCATIONS.map((node) => {
                  const isSelected = node.id === selectedNodeId;
                  const shortName = SHORT_LOCATION_NAMES[node.id] || node.name.split(' ')[0];
                  return (
                    <button
                      key={node.id}
                      onClick={() => {
                        soundEngine.playPluck(523.25);
                        setSelectedNodeId(node.id);
                        flyToNode(node, 8);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/40 scale-105'
                          : isCream
                          ? 'bg-stone-50 hover:bg-amber-50 text-stone-700 hover:text-amber-950 border border-stone-200'
                          : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-amber-200 border border-slate-700/60'
                      }`}
                    >
                      <span>{node.icon}</span>
                      <span>{shortName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Heritage Detail Inspector Card (4 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className={`rounded-3xl border p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden transition-colors ${
                  isCream
                    ? 'bg-white/95 border-amber-300 shadow-[0_12px_40px_rgba(180,130,60,0.12)] text-stone-900'
                    : 'bg-slate-900/90 border-amber-500/30 shadow-2xl text-slate-100'
                }`}
              >
                {/* Accent glow corner */}
                <div
                  className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl opacity-30 pointer-events-none"
                  style={{ backgroundColor: selectedNode.accentColor || '#D4AF37' }}
                />

                {/* Card Header Top Row: Region Badge & Location Navigation */}
                <div className={`flex items-center justify-between gap-3 pb-3.5 border-b ${
                  isCream ? 'border-stone-200' : 'border-slate-800'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedNode.icon}</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                      isCream ? 'bg-amber-100 border-amber-300 text-amber-950 font-bold' : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                    }`}>
                      {selectedNode.regionTitle}
                    </span>
                  </div>

                  {/* Next / Prev Location controls */}
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border shrink-0 ${
                    isCream ? 'bg-stone-50 border-stone-200' : 'bg-slate-950 border-slate-800'
                  }`}>
                    <button
                      type="button"
                      onClick={handleNavigatePrev}
                      className={`p-1 rounded-lg transition-all cursor-pointer ${
                        isCream ? 'text-stone-600 hover:text-amber-900 hover:bg-stone-200' : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800'
                      }`}
                      title="Địa danh trước"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className={`text-[11px] font-mono font-medium px-1 ${
                      isCream ? 'text-amber-900 font-bold' : 'text-amber-300/90'
                    }`}>
                      {HERITAGE_LOCATIONS.findIndex((n) => n.id === selectedNode.id) + 1}/{HERITAGE_LOCATIONS.length}
                    </span>
                    <button
                      type="button"
                      onClick={handleNavigateNext}
                      className={`p-1 rounded-lg transition-all cursor-pointer ${
                        isCream ? 'text-stone-600 hover:text-amber-900 hover:bg-stone-200' : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800'
                      }`}
                      title="Địa danh kế tiếp"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Centered Main Location Title & Ancient Name */}
                <div className={`py-3 text-center flex flex-col items-center border-b ${
                  isCream ? 'border-stone-200' : 'border-slate-800/60'
                }`}>
                  <h3 className={`text-2xl sm:text-3xl font-serif-vi font-bold text-center leading-tight ${
                    isCream ? 'text-amber-950 font-bold' : 'text-amber-100'
                  }`}>
                    {selectedNode.name}
                  </h3>
                  {selectedNode.historicalName && (
                    <p className={`text-xs font-mono italic text-center mt-1.5 ${
                      isCream ? 'text-amber-800 font-semibold' : 'text-amber-400/90'
                    }`}>
                      Cổ danh: {selectedNode.historicalName}
                    </p>
                  )}
                </div>

                {/* Dynasties / Historic Eras (Centered) */}
                <div className="py-2.5 flex flex-wrap gap-1.5 items-center justify-center text-center">
                  <span className={`text-[11px] font-medium ${isCream ? 'text-stone-600' : 'text-slate-400'}`}>
                    Triều đại tiêu biểu:
                  </span>
                  {selectedNode.dynasties.map((dynasty) => (
                    <span
                      key={dynasty}
                      className={`text-xs px-2.5 py-0.5 rounded-lg border font-medium ${
                        isCream
                          ? 'bg-amber-100/80 text-amber-950 border-amber-300 font-semibold'
                          : 'bg-slate-800/80 text-amber-200 border-amber-500/20'
                      }`}
                    >
                      {dynasty}
                    </span>
                  ))}
                </div>

                {/* Historical vs Modern Comparison Box */}
                <div className={`my-3 p-3.5 rounded-2xl border space-y-2.5 ${
                  isCream ? 'bg-amber-50/50 border-amber-200/90' : 'bg-slate-950/80 border-amber-500/25'
                }`}>
                  <div className={`flex items-center justify-between text-[11px] font-semibold border-b pb-1.5 ${
                    isCream ? 'text-amber-900 border-amber-200' : 'text-amber-300 border-slate-800/80'
                  }`}>
                    <span className="flex items-center gap-1.5">
                      <Compass className={`w-3.5 h-3.5 ${isCream ? 'text-amber-700' : 'text-amber-400'}`} />
                      <span>Đối chiếu Địa Danh Xưa & Nay</span>
                    </span>
                    <span className={`text-[10px] font-mono flex items-center gap-1 ${
                      isCream ? 'text-amber-800 font-semibold' : 'text-amber-400/90'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Tọa độ vệ tinh
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className={`p-3 rounded-xl border ${
                      isCream ? 'bg-white border-amber-300/80 shadow-xs' : 'bg-[#111A2E] border-amber-500/20'
                    }`}>
                      <span className={`text-[10px] font-mono font-semibold block mb-1 ${
                        isCream ? 'text-amber-900 font-bold' : 'text-amber-400'
                      }`}>🏛️ THỜI XƯA (CỔ DANH)</span>
                      <p className={`text-xs font-medium leading-relaxed ${
                        isCream ? 'text-stone-900 font-bold' : 'text-amber-100'
                      }`}>
                        {selectedNode.historicalName || selectedNode.name}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl border ${
                      isCream ? 'bg-white border-stone-200 shadow-xs' : 'bg-[#111A2E] border-slate-700/80'
                    }`}>
                      <span className={`text-[10px] font-mono font-semibold block mb-1 ${
                        isCream ? 'text-stone-600 font-bold' : 'text-slate-300'
                      }`}>📍 NGÀY NAY (HÀNH CHÍNH)</span>
                      <p className={`text-xs font-medium leading-relaxed ${
                        isCream ? 'text-stone-800' : 'text-slate-200'
                      }`}>
                        {selectedNode.modernLocation}
                      </p>
                    </div>
                  </div>

                  <div className={`pt-2 border-t space-y-1.5 ${isCream ? 'border-amber-200/80' : 'border-slate-800/80'}`}>
                    <div className={`flex items-center justify-between text-[10.5px] font-mono ${
                      isCream ? 'text-stone-600' : 'text-slate-400'
                    }`}>
                      <span>Tọa độ vệ tinh:</span>
                      <span className={`font-semibold ${isCream ? 'text-amber-900 font-bold' : 'text-amber-300'}`}>
                        {selectedNode.coordinates[1].toFixed(2)}°B • {selectedNode.coordinates[0].toFixed(2)}°Đ
                      </span>
                    </div>
                    {selectedNode.landmarkNote && (
                      <div className={`p-2.5 rounded-xl border text-[11px] leading-relaxed flex items-start gap-2 ${
                        isCream ? 'bg-white border-amber-200 text-stone-700' : 'bg-amber-500/10 border-amber-500/20 text-amber-200'
                      }`}>
                        <Info className={`w-3.5 h-3.5 ${isCream ? 'text-amber-700' : 'text-amber-400'} shrink-0 mt-0.5`} />
                        <span>{selectedNode.landmarkNote}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Primary Garment Spotlight */}
                <div className={`p-4 rounded-2xl border space-y-2 mb-4 ${
                  isCream
                    ? 'bg-gradient-to-br from-amber-100/60 via-white to-amber-50 border-amber-300/80 shadow-xs'
                    : 'bg-gradient-to-br from-amber-500/10 via-[#0E1528] to-[#0A0F1D] border-amber-500/30'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 ${
                      isCream ? 'text-amber-900' : 'text-amber-400'
                    }`}>
                      <Sparkles className={`w-3.5 h-3.5 ${isCream ? 'text-amber-700' : 'text-amber-300'}`} />
                      <span>Trang phục danh xưng</span>
                    </span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-md border font-medium font-mono ${
                      isCream ? 'bg-amber-200 text-amber-950 border-amber-400 font-bold' : 'bg-amber-400/20 text-amber-200 border-amber-400/30'
                    }`}>
                      {selectedNode.elevationBadge || 'Di sản văn hóa'}
                    </span>
                  </div>
                  <h4 className={`text-lg font-bold font-serif-vi ${
                    isCream ? 'text-amber-950 font-bold' : 'text-amber-100'
                  }`}>
                    {selectedNode.mainGarmentName}
                  </h4>
                  <p className={`text-xs leading-relaxed ${
                    isCream ? 'text-stone-700 font-normal' : 'text-slate-300 font-light'
                  }`}>
                    {selectedNode.philosophicalMeaning}
                  </p>
                </div>

                {/* Cultural Fabric & Craftsmanship */}
                <div className={`space-y-3 text-xs mb-6 ${isCream ? 'text-stone-700' : 'text-slate-300'}`}>
                  <div className={`p-3 rounded-xl border space-y-1 ${
                    isCream ? 'bg-stone-50 border-stone-200' : 'bg-slate-950/60 border-slate-800'
                  }`}>
                    <span className={`font-semibold block ${isCream ? 'text-amber-900' : 'text-amber-300'}`}>
                      Kỹ nghệ dệt thêu & chất liệu:
                    </span>
                    <p className={isCream ? 'text-stone-700 leading-relaxed' : 'text-slate-400 leading-relaxed'}>
                      {selectedNode.craftAndFabric}
                    </p>
                  </div>

                  <div className={`p-3 rounded-xl border space-y-1 ${
                    isCream ? 'bg-stone-50 border-stone-200' : 'bg-slate-950/60 border-slate-800'
                  }`}>
                    <span className={`font-semibold block ${isCream ? 'text-amber-900' : 'text-amber-300'}`}>
                      Dấu ấn sử liệu:
                    </span>
                    <p className={`leading-relaxed italic ${isCream ? 'text-stone-700' : 'text-slate-400'}`}>
                      "{selectedNode.historicalStory}"
                    </p>
                  </div>
                </div>

                {/* Action Button: Try On in Virtual Fitting Room */}
                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleTryOnGarment}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Thử {selectedNode.mainGarmentName} trong phòng thử</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
