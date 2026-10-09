import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  MapPin,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Info,
  Play,
  Pause,
  Share2,
  BookOpen,
  Eye,
  Check,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';
import {
  VIETNAM_GEO_JSON,
  HERITAGE_LOCATIONS,
  CULTURAL_MIGRATION_ROUTES,
  REGIONS_META,
  HeritageLocationNode,
  MigrationRoute,
} from '../data/heritageMapData';
import { soundEngine } from '../utils/audioSynth';
import { TOPS, PRESET_OUTFITS, PresetOutfit } from '../data/vietPhucData';

interface HeritageMapSectionProps {
  onStartFitting?: () => void;
  onSelectTopItem?: (topId: string) => void;
  onApplyPreset?: (preset: PresetOutfit) => void;
}

export const HeritageMapSection: React.FC<HeritageMapSectionProps> = ({
  onStartFitting,
  onSelectTopItem,
  onApplyPreset,
}) => {
  // SVG and Zoom container references
  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomGroupRef = useRef<SVGGElement | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Map state
  const [selectedNodeId, setSelectedNodeId] = useState<string>('hue'); // Default to Imperial Hue
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredRouteId, setHoveredRouteId] = useState<string | null>(null);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('all');
  const [selectedDynastyFilter, setSelectedDynastyFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showRoutes, setShowRoutes] = useState<boolean>(true);
  const [showWaterways, setShowWaterways] = useState<boolean>(true);
  const [isAutoTouring, setIsAutoTouring] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Dimensions of map viewport
  const mapWidth = 840;
  const mapHeight = 920;

  // Selected node object
  const selectedNode = useMemo(() => {
    return HERITAGE_LOCATIONS.find((n) => n.id === selectedNodeId) || HERITAGE_LOCATIONS[0];
  }, [selectedNodeId]);

  // D3 Mercator Projection calibrated specifically for Vietnam's S-curve & islands
  const projection = useMemo(() => {
    return d3
      .geoMercator()
      .center([108.2, 16.2]) // Geographic center of Vietnam
      .scale(2650)
      .translate([mapWidth / 2 - 15, mapHeight / 2]);
  }, [mapWidth, mapHeight]);

  // D3 GeoPath generator
  const pathGenerator = useMemo(() => {
    return d3.geoPath().projection(projection);
  }, [projection]);

  // Projected SVG paths for GeoJSON features
  const projectedFeatures = useMemo(() => {
    return VIETNAM_GEO_JSON.features.map((feature) => ({
      feature,
      pathData: pathGenerator(feature as d3.GeoPermissibleObjects) || '',
    }));
  }, [pathGenerator]);

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return HERITAGE_LOCATIONS.filter((node) => {
      // Region filter
      if (selectedRegionFilter !== 'all' && node.regionId !== selectedRegionFilter) {
        return false;
      }
      // Dynasty filter
      if (selectedDynastyFilter !== 'all') {
        const matchesDynasty = node.dynasties.some((d) =>
          d.toLowerCase().includes(selectedDynastyFilter.toLowerCase())
        );
        if (!matchesDynasty) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = node.name.toLowerCase().includes(q);
        const matchesGarment = node.mainGarmentName.toLowerCase().includes(q);
        const matchesCraft = node.craftAndFabric.toLowerCase().includes(q);
        const matchesStory = node.historicalStory.toLowerCase().includes(q);
        const matchesItems = node.garments.some((g) => g.name.toLowerCase().includes(q));
        if (!matchesName && !matchesGarment && !matchesCraft && !matchesStory && !matchesItems) {
          return false;
        }
      }
      return true;
    });
  }, [selectedRegionFilter, selectedDynastyFilter, searchQuery]);

  // Historical Rivers approximate vector coordinates
  const riverPaths = useMemo(() => {
    // Sông Hồng (Red River): Starts Northwest through Hanoi out to Gulf of Tonkin
    const redRiverPoints: [number, number][] = [
      [103.8, 22.8],
      [104.5, 22.1],
      [105.1, 21.6],
      [105.5, 21.3],
      [105.85, 21.03],
      [106.2, 20.8],
      [106.6, 20.4],
      [106.8, 20.2],
    ];

    // Sông Hương (Perfume River in Hue)
    const perfumeRiverPoints: [number, number][] = [
      [107.4, 16.2],
      [107.52, 16.38],
      [107.59, 16.46],
      [107.68, 16.58],
      [107.75, 16.65],
    ];

    // Sông Tiền & Sông Hậu (Mekong Delta branches)
    const tienRiverPoints: [number, number][] = [
      [105.1, 10.8],
      [105.3, 10.6],
      [105.7, 10.4],
      [106.3, 10.3],
      [106.7, 10.15],
    ];

    const hauRiverPoints: [number, number][] = [
      [105.05, 10.7],
      [105.4, 10.2],
      [105.8, 10.0],
      [106.1, 9.6],
      [106.4, 9.4],
    ];

    const generateSvgPath = (points: [number, number][]) => {
      const lineGen = d3
        .line<[number, number]>()
        .x((d) => projection(d)?.[0] || 0)
        .y((d) => projection(d)?.[1] || 0)
        .curve(d3.curveBasis);
      return lineGen(points) || '';
    };

    return [
      { id: 'song-hong', name: 'Sông Hồng Hà (Đồng Bằng Bắc Bộ)', path: generateSvgPath(redRiverPoints) },
      { id: 'song-huong', name: 'Sông Hương Thơ Mộng (Cố Đô Huế)', path: generateSvgPath(perfumeRiverPoints) },
      { id: 'song-tien', name: 'Sông Tiền Giang (Phù Sa Miệt Vườn)', path: generateSvgPath(tienRiverPoints) },
      { id: 'song-hau', name: 'Sông Hậu Giang (Chín Rồng Phương Nam)', path: generateSvgPath(hauRiverPoints) },
    ];
  }, [projection]);

  // Compute Migration Route curved SVG paths using D3 Bezier Curve
  const migrationRoutePaths = useMemo(() => {
    return CULTURAL_MIGRATION_ROUTES.map((route) => {
      const fromLoc = HERITAGE_LOCATIONS.find((l) => l.id === route.fromLocationId);
      const toLoc = HERITAGE_LOCATIONS.find((l) => l.id === route.toLocationId);
      if (!fromLoc || !toLoc) return null;

      const p1 = projection(fromLoc.coordinates);
      const p2 = projection(toLoc.coordinates);
      if (!p1 || !p2) return null;

      const [x1, y1] = p1;
      const [x2, y2] = p2;

      // Midpoint
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;

      // Normal vector
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy);
      const nx = -dy / (len || 1);
      const ny = dx / (len || 1);

      // Control point offset
      const cx = mx + nx * route.curveOffset;
      const cy = my + ny * route.curveOffset;

      const pathStr = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;

      return {
        route,
        pathStr,
        midX: cx,
        midY: cy,
        fromLoc,
        toLoc,
      };
    }).filter(Boolean);
  }, [projection]);

  // Setup D3 Zoom & Pan Behavior
  useEffect(() => {
    if (!svgRef.current || !zoomGroupRef.current) return;

    const svg = d3.select(svgRef.current);
    const zoomGroup = d3.select(zoomGroupRef.current);

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.8, 5.0])
      .translateExtent([
        [-200, -200],
        [mapWidth + 200, mapHeight + 200],
      ])
      .on('zoom', (event) => {
        zoomGroup.attr('transform', event.transform.toString());
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);
    zoomBehaviorRef.current = zoom;

    return () => {
      svg.on('.zoom', null);
    };
  }, [mapWidth, mapHeight]);

  // Zoom camera smoothly to a specific location node
  const zoomToNode = (node: HeritageLocationNode) => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;

    const [cx, cy] = projection(node.coordinates) || [mapWidth / 2, mapHeight / 2];
    const targetScale = 2.4;
    const targetX = mapWidth / 2 - cx * targetScale;
    const targetY = mapHeight / 2 - cy * targetScale;

    d3.select(svgRef.current)
      .transition()
      .duration(850)
      .ease(d3.easeCubicOut)
      .call(
        zoomBehaviorRef.current.transform,
        d3.zoomIdentity.translate(targetX, targetY).scale(targetScale)
      );
  };

  // Zoom Controls Handlers
  const handleZoomIn = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(350).call(zoomBehaviorRef.current.scaleBy, 1.35);
  };

  const handleZoomOut = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(350).call(zoomBehaviorRef.current.scaleBy, 0.74);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(700)
      .ease(d3.easeCubicOut)
      .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
  };

  // Handle Node Selection
  const handleSelectNode = (node: HeritageLocationNode, shouldZoom = true) => {
    soundEngine.playPluck(523.25);
    setSelectedNodeId(node.id);
    if (shouldZoom) {
      zoomToNode(node);
    }
  };

  // Step through locations with previous/next
  const handleNavigateNext = () => {
    const currentIndex = HERITAGE_LOCATIONS.findIndex((n) => n.id === selectedNodeId);
    const nextIndex = (currentIndex + 1) % HERITAGE_LOCATIONS.length;
    handleSelectNode(HERITAGE_LOCATIONS[nextIndex]);
  };

  const handleNavigatePrev = () => {
    const currentIndex = HERITAGE_LOCATIONS.findIndex((n) => n.id === selectedNodeId);
    const prevIndex = (currentIndex - 1 + HERITAGE_LOCATIONS.length) % HERITAGE_LOCATIONS.length;
    handleSelectNode(HERITAGE_LOCATIONS[prevIndex]);
  };

  // Auto-tour guided journey mode
  useEffect(() => {
    if (!isAutoTouring) return;

    const timer = setInterval(() => {
      setSelectedNodeId((prevId) => {
        const currentIndex = HERITAGE_LOCATIONS.findIndex((n) => n.id === prevId);
        const nextIndex = (currentIndex + 1) % HERITAGE_LOCATIONS.length;
        const nextNode = HERITAGE_LOCATIONS[nextIndex];
        zoomToNode(nextNode);
        soundEngine.playPluck(440);
        return nextNode.id;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [isAutoTouring]);

  // Try on garment action
  const handleTryOnGarment = () => {
    soundEngine.playPluck(659.25);
    if (selectedNode.targetPresetId && onApplyPreset) {
      const preset = PRESET_OUTFITS.find((p) => p.id === selectedNode.targetPresetId);
      if (preset) {
        onApplyPreset(preset);
        return;
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
    <section className="w-full my-16 text-left relative z-10" id="heritage-map-section">
      {/* 1. Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-amber-400 font-sans-vi">
              BẢN ĐỒ VĂN HIẾN VIỆT PHỤC (D3.JS INTERACTIVE HERITAGE MAP)
            </span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-300 font-mono">
              Non Sông Gấm Vóc
            </span>
          </div>

          <h2 className="font-serif-vi text-3xl sm:text-4xl md:text-5xl font-bold text-amber-100 tracking-tight">
            Khởi Nguyên Địa Lý Phục Sức Việt
          </h2>
          <p className="text-sm text-slate-300 mt-2 max-w-3xl font-light font-sans-vi leading-relaxed">
            Khám phá nguồn cội và sự lan tỏa của các thức phục cổ truyền trên dải đất hình chữ S.
            Tương tác trực tiếp trên bản đồ D3.js để tìm hiểu kỹ nghệ dệt thêu, triết lý phục trang và thử ngay các mẫu áo hoàng gia.
          </p>
        </div>

        {/* Global Stats Counter */}
        <div className="flex items-center gap-4 bg-[#0E1526]/80 p-3 px-4 rounded-2xl border border-amber-500/20 backdrop-blur-md self-start lg:self-auto">
          <div className="text-center pr-3 border-r border-slate-700/80">
            <span className="font-serif-vi text-xl font-bold text-amber-300 block">12+</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Điểm Di Sản</span>
          </div>
          <div className="text-center pr-3 border-r border-slate-700/80">
            <span className="font-serif-vi text-xl font-bold text-amber-300 block">5</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Tuyến Lan Tỏa</span>
          </div>
          <div className="text-center">
            <span className="font-serif-vi text-xl font-bold text-amber-300 block">1000+</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Năm Cổ Phong</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Filter & Search Bar */}
      <div className="mb-6 p-4 rounded-2xl bg-[#0E1526]/90 border border-slate-700/80 backdrop-blur-lg flex flex-wrap items-center justify-between gap-4">
        {/* Region Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1 hidden sm:inline flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Vùng đất:</span>
          </span>
          <button
            onClick={() => {
              setSelectedRegionFilter('all');
              soundEngine.playPluck(392);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
              selectedRegionFilter === 'all'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                : 'bg-[#121B30] text-slate-300 hover:text-amber-200 border border-slate-700'
            }`}
          >
            Tất Cả ({HERITAGE_LOCATIONS.length})
          </button>
          {Object.values(REGIONS_META).map((reg) => (
            <button
              key={reg.id}
              onClick={() => {
                setSelectedRegionFilter(reg.id);
                soundEngine.playPluck(440);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                selectedRegionFilter === reg.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'bg-[#121B30] text-slate-300 hover:text-amber-200 border border-slate-700'
              }`}
            >
              {reg.name.split('&')[0].trim()}
            </button>
          ))}
        </div>

        {/* Search & Tool Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm phục trang, làng nghề, địa danh..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#090D18] border border-slate-700/80 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/80"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Toggle Tour Button */}
          <button
            onClick={() => {
              setIsAutoTouring(!isAutoTouring);
              soundEngine.playPluck(isAutoTouring ? 330 : 587);
            }}
            title={isAutoTouring ? 'Tạm dừng du ngoạn' : 'Bật chế độ du ngoạn tự động'}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
              isAutoTouring
                ? 'bg-amber-500 text-slate-950 animate-pulse'
                : 'bg-[#121B30] text-slate-300 hover:text-amber-200 border border-slate-700'
            }`}
          >
            {isAutoTouring ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isAutoTouring ? 'Dừng Du Ngoạn' : 'Du Ngoạn'}</span>
          </button>
        </div>
      </div>

      {/* 3. Main Display: Interactive Map (Left/Center) + Rich Inspector Detail Drawer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 3.1 D3 Interactive Map Canvas Container (Span 7 or 8 on desktop) */}
        <div className="lg:col-span-7 xl:col-span-7 relative rounded-3xl bg-gradient-to-b from-[#090E1A] via-[#0C1222] to-[#080D19] border border-amber-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden">
          {/* Top Bar on Map: Controls and Map Title */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            {/* Compass Title Badge */}
            <div className="pointer-events-auto bg-[#090E1A]/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-amber-500/30 text-xs flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="font-serif-vi font-bold text-amber-200">Đại Nam Dư Địa Chí 3D</span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                (Cuộn chuột phóng to / Kéo để di chuyển)
              </span>
            </div>

            {/* D3 Map Zoom & Layer Controls */}
            <div className="pointer-events-auto flex items-center gap-1.5 bg-[#090E1A]/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-lg">
              <button
                onClick={handleZoomIn}
                title="Phóng to bản đồ"
                className="w-8 h-8 rounded-lg bg-[#121B30] hover:bg-amber-400 hover:text-slate-950 text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomOut}
                title="Thu nhỏ bản đồ"
                className="w-8 h-8 rounded-lg bg-[#121B30] hover:bg-amber-400 hover:text-slate-950 text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                title="Đặt lại góc nhìn toàn cảnh"
                className="w-8 h-8 rounded-lg bg-[#121B30] hover:bg-amber-400 hover:text-slate-950 text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <div className="w-[1px] h-5 bg-slate-700 mx-0.5" />
              <button
                onClick={() => setShowRoutes(!showRoutes)}
                title={showRoutes ? 'Ẩn tuyến lan tỏa' : 'Hiện tuyến lan tỏa'}
                className={`px-2.5 h-8 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  showRoutes
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-[#121B30] text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span className="hidden sm:inline">Tuyến Lan Tỏa</span>
              </button>
            </div>
          </div>

          {/* Actual D3 SVG Element */}
          <div className="w-full h-[580px] sm:h-[680px] md:h-[740px] flex items-center justify-center cursor-grab active:cursor-grabbing relative">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${mapWidth} ${mapHeight}`}
              className="w-full h-full select-none"
              style={{ touchAction: 'none' }}
            >
              {/* SVG Defs: Gradients, Filters, Patterns, Compass */}
              <defs>
                {/* Imperial Metallic Landmass Gradient */}
                <linearGradient id="vietnamLandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1B263B" stopOpacity="0.9" />
                  <stop offset="40%" stopColor="#121D32" stopOpacity="0.85" />
                  <stop offset="80%" stopColor="#0F172A" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#0B1220" stopOpacity="0.98" />
                </linearGradient>

                {/* Ocean Ambient Gradient */}
                <radialGradient id="oceanRadialGradient" cx="60%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="#0B1528" stopOpacity="0.6" />
                  <stop offset="60%" stopColor="#080F1E" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#050811" stopOpacity="0.95" />
                </radialGradient>

                {/* Glow Filter for Active Nodes & Routes */}
                <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Animated dash effect for cultural migration flow */}
                <style>{`
                  @keyframes dashFlow {
                    from { stroke-dashoffset: 120; }
                    to { stroke-dashoffset: 0; }
                  }
                  .animated-migration-path {
                    stroke-dasharray: 6 5;
                    animation: dashFlow 2.8s linear infinite;
                  }
                  @keyframes pulsePing {
                    0% { r: 6px; opacity: 0.9; }
                    80% { r: 24px; opacity: 0; }
                    100% { r: 24px; opacity: 0; }
                  }
                  .radar-ping {
                    animation: pulsePing 2.2s cubic-bezier(0, 0.2, 0.8, 1) infinite;
                  }
                `}</style>
              </defs>

              {/* Background Ocean Fill */}
              <rect width={mapWidth} height={mapHeight} fill="url(#oceanRadialGradient)" />

              {/* D3 Zoomable Container Group */}
              <g ref={zoomGroupRef}>
                {/* 1. ANCIENT NAUTICAL CARTOGRAPHY GRATICULE (Kinh tuyến & Vĩ tuyến nhẹ) */}
                <g className="cartographic-grid opacity-25 pointer-events-none">
                  {/* Longitude lines */}
                  {[104, 106, 108, 110, 112, 114].map((lon) => {
                    const topPt = projection([lon, 23.8]);
                    const btmPt = projection([lon, 8.0]);
                    if (!topPt || !btmPt) return null;
                    return (
                      <g key={`lon-${lon}`}>
                        <line
                          x1={topPt[0]}
                          y1={topPt[1]}
                          x2={btmPt[0]}
                          y2={btmPt[1]}
                          stroke="#38BDF8"
                          strokeWidth="0.5"
                          strokeDasharray="3 4"
                        />
                        <text
                          x={topPt[0]}
                          y={topPt[1] - 8}
                          fontSize="9"
                          fill="#64748B"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {lon}°Đ
                        </text>
                      </g>
                    );
                  })}

                  {/* Latitude lines */}
                  {[10, 12, 14, 16, 18, 20, 22].map((lat) => {
                    const leftPt = projection([102.0, lat]);
                    const rightPt = projection([115.5, lat]);
                    if (!leftPt || !rightPt) return null;
                    return (
                      <g key={`lat-${lat}`}>
                        <line
                          x1={leftPt[0]}
                          y1={leftPt[1]}
                          x2={rightPt[0]}
                          y2={rightPt[1]}
                          stroke="#38BDF8"
                          strokeWidth="0.5"
                          strokeDasharray="3 4"
                        />
                        <text
                          x={rightPt[0] + 12}
                          y={rightPt[1] + 3}
                          fontSize="9"
                          fill="#64748B"
                          fontFamily="monospace"
                        >
                          {lat}°B
                        </text>
                      </g>
                    );
                  })}
                </g>

                {/* 2. EAST SEA WATERMARK & COMPASS ROSE */}
                <g className="east-sea-ornaments pointer-events-none">
                  {/* Ancient Calligraphy Watermark for East Sea */}
                  <g transform={`translate(${mapWidth * 0.72}, ${mapHeight * 0.44})`}>
                    <text
                      textAnchor="middle"
                      className="font-serif-vi"
                      fill="#D4AF37"
                      fillOpacity="0.12"
                      fontSize="36"
                      letterSpacing="8"
                      fontWeight="bold"
                    >
                      BIỂN ĐÔNG
                    </text>
                    <text
                      y="24"
                      textAnchor="middle"
                      className="font-serif-vi"
                      fill="#D4AF37"
                      fillOpacity="0.08"
                      fontSize="14"
                      letterSpacing="4"
                    >
                      VIỆT NAM
                    </text>
                  </g>

                  {/* Ancient Oriental Compass Rose */}
                  <g transform={`translate(${mapWidth * 0.8}, ${mapHeight * 0.18})`} opacity="0.65">
                    {/* Concentric rings */}
                    <circle r="42" fill="none" stroke="#D4AF37" strokeWidth="0.75" strokeDasharray="3 3" />
                    <circle r="36" fill="none" stroke="#D4AF37" strokeWidth="1.2" opacity="0.7" />
                    <circle r="12" fill="none" stroke="#D4AF37" strokeWidth="0.75" />

                    {/* 4 Cardinal points */}
                    <polygon points="0,-36 4,-12 -4,-12" fill="#F59E0B" />
                    <polygon points="0,36 3,12 -3,12" fill="#D4AF37" opacity="0.7" />
                    <polygon points="36,0 12,3 12,-3" fill="#D4AF37" opacity="0.7" />
                    <polygon points="-36,0 -12,3 -12,-3" fill="#D4AF37" opacity="0.7" />

                    {/* 4 Intercardinal needles */}
                    <polygon points="25,-25 8,-4 4,-8" fill="#D4AF37" opacity="0.4" />
                    <polygon points="-25,-25 -8,-4 -4,-8" fill="#D4AF37" opacity="0.4" />
                    <polygon points="25,25 8,4 4,8" fill="#D4AF37" opacity="0.4" />
                    <polygon points="-25,25 -8,4 -4,8" fill="#D4AF37" opacity="0.4" />

                    {/* North Label */}
                    <text y="-44" textAnchor="middle" fill="#F59E0B" fontSize="11" fontWeight="bold" fontFamily="serif">
                      B (BẮC)
                    </text>
                  </g>
                </g>

                {/* 3. VIETNAM MAINLAND & SACRED ARCHIPELAGOS */}
                <g className="vietnam-landmass">
                  {projectedFeatures.map(({ feature, pathData }) => {
                    const isMainland = feature.id === 'vietnam-mainland';
                    const isIsland = feature.properties?.type === 'island';
                    const isArchipelago = feature.properties?.type === 'archipelago';

                    return (
                      <g key={feature.id as string}>
                        {/* Outer Glow Outline for Coastline */}
                        <path
                          d={pathData}
                          fill="none"
                          stroke="#F59E0B"
                          strokeWidth={isMainland ? '4' : '2'}
                          strokeOpacity="0.25"
                          filter="url(#subtleGlow)"
                        />

                        {/* Main Terraced Fill */}
                        <path
                          d={pathData}
                          fill="url(#vietnamLandGradient)"
                          stroke={isArchipelago ? '#38BDF8' : '#D4AF37'}
                          strokeWidth={isMainland ? '1.75' : '1.2'}
                          strokeOpacity={isArchipelago ? '0.7' : '0.85'}
                          className="transition-all duration-300"
                        />
                      </g>
                    );
                  })}
                </g>

                {/* 4. HISTORIC RIVERS (SÔNG HỒNG, SÔNG HƯƠNG, SÔNG TIỀN, SÔNG HẬU) */}
                {showWaterways && (
                  <g className="historic-waterways pointer-events-none">
                    {riverPaths.map((river) => (
                      <path
                        key={river.id}
                        d={river.path}
                        fill="none"
                        stroke="#38BDF8"
                        strokeWidth="1.6"
                        strokeOpacity="0.55"
                        strokeLinecap="round"
                        filter="url(#subtleGlow)"
                      />
                    ))}
                  </g>
                )}

                {/* 5. CULTURAL MIGRATION & SPREAD ROUTES (FLOW ARCS) */}
                {showRoutes && (
                  <g className="migration-routes">
                    {migrationRoutePaths.map((item) => {
                      if (!item) return null;
                      const { route, pathStr, midX, midY } = item;
                      const isHovered = hoveredRouteId === route.id;

                      return (
                        <g
                          key={route.id}
                          onMouseEnter={() => setHoveredRouteId(route.id)}
                          onMouseLeave={() => setHoveredRouteId(null)}
                          className="cursor-pointer"
                        >
                          {/* Wide invisible hit area */}
                          <path
                            d={pathStr}
                            fill="none"
                            stroke="transparent"
                            strokeWidth="16"
                          />

                          {/* Base Route Path Glow */}
                          <path
                            d={pathStr}
                            fill="none"
                            stroke={route.color}
                            strokeWidth={isHovered ? '3.5' : '1.75'}
                            strokeOpacity={isHovered ? 0.9 : 0.45}
                            filter="url(#subtleGlow)"
                          />

                          {/* Animated Moving Particles along Arc */}
                          <path
                            d={pathStr}
                            fill="none"
                            stroke="#FFFDF0"
                            strokeWidth={isHovered ? '2.5' : '1.5'}
                            strokeOpacity={isHovered ? 1 : 0.8}
                            className="animated-migration-path"
                          />

                          {/* Midpoint Info Node Tag on Hover */}
                          {isHovered && (
                            <g transform={`translate(${midX}, ${midY})`}>
                              <rect
                                x="-110"
                                y="-24"
                                width="220"
                                height="28"
                                rx="8"
                                fill="#090E1A"
                                stroke={route.color}
                                strokeWidth="1"
                                opacity="0.95"
                              />
                              <text
                                y="-7"
                                textAnchor="middle"
                                fill="#FDFBF7"
                                fontSize="11"
                                fontWeight="bold"
                                className="font-sans-vi"
                              >
                                {route.title}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* 6. SACRED ARCHIPELAGO LABELS */}
                <g className="archipelago-labels pointer-events-none">
                  {/* Hoàng Sa label */}
                  {(() => {
                    const hsPt = projection([112.1, 16.6]);
                    if (!hsPt) return null;
                    return (
                      <g transform={`translate(${hsPt[0]}, ${hsPt[1]})`}>
                        <text
                          y="-10"
                          textAnchor="middle"
                          fill="#38BDF8"
                          fontSize="10"
                          fontWeight="bold"
                          className="font-serif-vi"
                        >
                          Q.Đ HOÀNG SA
                        </text>
                        <text
                          y="2"
                          textAnchor="middle"
                          fill="#94A3B8"
                          fontSize="8"
                          className="font-sans-vi"
                        >
                          (Việt Nam)
                        </text>
                      </g>
                    );
                  })()}

                  {/* Trường Sa label */}
                  {(() => {
                    const tsPt = projection([113.6, 9.8]);
                    if (!tsPt) return null;
                    return (
                      <g transform={`translate(${tsPt[0]}, ${tsPt[1]})`}>
                        <text
                          y="-10"
                          textAnchor="middle"
                          fill="#38BDF8"
                          fontSize="10"
                          fontWeight="bold"
                          className="font-serif-vi"
                        >
                          Q.Đ TRƯỜNG SA
                        </text>
                        <text
                          y="2"
                          textAnchor="middle"
                          fill="#94A3B8"
                          fontSize="8"
                          className="font-sans-vi"
                        >
                          (Việt Nam)
                        </text>
                      </g>
                    );
                  })()}
                </g>

                {/* 7. HERITAGE LOCATION NODES (INTERACTIVE PINS) */}
                <g className="heritage-location-nodes">
                  {filteredNodes.map((node) => {
                    const pos = projection(node.coordinates);
                    if (!pos) return null;
                    const [cx, cy] = pos;

                    const isSelected = selectedNodeId === node.id;
                    const isHovered = hoveredNodeId === node.id;

                    return (
                      <g
                        key={node.id}
                        transform={`translate(${cx}, ${cy})`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectNode(node);
                        }}
                        onMouseEnter={() => setHoveredNodeId(node.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                        className="cursor-pointer group"
                      >
                        {/* Radar Ripple Effect */}
                        {isSelected && (
                          <circle
                            r="18"
                            fill="none"
                            stroke={node.accentColor}
                            strokeWidth="2"
                            className="radar-ping"
                          />
                        )}

                        {/* Outer Glow Halo on Hover or Selection */}
                        {(isSelected || isHovered) && (
                          <circle
                            r={isSelected ? '22' : '16'}
                            fill={node.accentColor}
                            fillOpacity={isSelected ? '0.28' : '0.18'}
                            filter="url(#goldGlow)"
                          />
                        )}

                        {/* Outer Metallic Ring */}
                        <circle
                          r={isSelected ? '12' : '8'}
                          fill="#090E1A"
                          stroke={isSelected ? '#F59E0B' : node.accentColor}
                          strokeWidth={isSelected ? '2.5' : '1.5'}
                          className="transition-all duration-200"
                        />

                        {/* Center Gem Core */}
                        <circle
                          r={isSelected ? '6' : '3.5'}
                          fill={isSelected ? '#FFFDF0' : node.accentColor}
                          className="transition-all duration-200"
                        />

                        {/* Location Label (Offset based on node position for no overlap) */}
                        <g
                          transform={`translate(${node.coordinates[0] > 108 ? -12 : 12}, ${
                            node.coordinates[1] > 20 ? -12 : 3
                          })`}
                          className="pointer-events-none select-none"
                        >
                          {/* Label Badge Backdrop */}
                          <rect
                            x={node.coordinates[0] > 108 ? '-110' : '0'}
                            y="-11"
                            width="110"
                            height="20"
                            rx="5"
                            fill="#0A0F1D"
                            fillOpacity={isSelected ? '0.95' : '0.85'}
                            stroke={isSelected ? '#F59E0B' : '#334155'}
                            strokeWidth={isSelected ? '1.2' : '0.75'}
                          />
                          <text
                            x={node.coordinates[0] > 108 ? '-55' : '55'}
                            y="3"
                            textAnchor="middle"
                            fill={isSelected ? '#FDE68A' : '#E2E8F0'}
                            fontSize={isSelected ? '10' : '9'}
                            fontWeight={isSelected ? 'bold' : 'normal'}
                            className="font-serif-vi"
                          >
                            {node.name.split('(')[0].trim()}
                          </text>
                        </g>

                        {/* Tooltip on Hover */}
                        {isHovered && !isSelected && (
                          <g transform="translate(0, -32)" className="pointer-events-none z-50">
                            <rect
                              x="-85"
                              y="-28"
                              width="170"
                              height="34"
                              rx="8"
                              fill="#090E1A"
                              stroke={node.accentColor}
                              strokeWidth="1.2"
                              filter="url(#goldGlow)"
                            />
                            <text
                              x="0"
                              y="-14"
                              textAnchor="middle"
                              fill="#FFFDF0"
                              fontSize="11"
                              fontWeight="bold"
                              className="font-serif-vi"
                            >
                              {node.name}
                            </text>
                            <text
                              x="0"
                              y="-1"
                              textAnchor="middle"
                              fill="#FDE68A"
                              fontSize="9"
                              className="font-sans-vi truncate"
                            >
                              Phục trang: {node.mainGarmentName}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>
              </g>
            </svg>
          </div>

          {/* Bottom Overlay Legend on Map */}
          <div className="absolute bottom-3 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            <div className="pointer-events-auto bg-[#090E1A]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-[11px] text-slate-300 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Hoàng Triều</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Dân Gian</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                <span>Cách Tân</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-amber-300">
                <span className="w-3 h-0.5 bg-amber-400" />
                <span>Tuyến Lan Tỏa</span>
              </div>
            </div>

            {/* Scale indicator */}
            <div className="pointer-events-auto bg-[#090E1A]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-[10px] text-slate-400 font-mono">
              Độ thu phóng: {(zoomLevel * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        {/* 3.2 Inspector Detail Drawer / Spotlight Card (Span 5 on desktop) */}
        <div className="lg:col-span-5 xl:col-span-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.3 }}
              className="p-6 sm:p-7 rounded-3xl bg-[#0E1526]/95 border border-amber-500/35 backdrop-blur-xl shadow-2xl relative flex flex-col justify-between overflow-hidden"
            >
              {/* Corner Watermark Pattern */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-amber-500/10 to-transparent pointer-events-none rounded-tr-3xl" />

              <div>
                {/* Header Tag & Navigation Arrows */}
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedNode.icon}</span>
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono uppercase font-bold tracking-wider">
                      {selectedNode.elevationBadge}
                    </span>
                    <span className="text-xs text-slate-400 font-light hidden sm:inline">
                      {selectedNode.coordinates[0].toFixed(2)}°Đ, {selectedNode.coordinates[1].toFixed(2)}°B
                    </span>
                  </div>

                  {/* Previous / Next Location Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleNavigatePrev}
                      title="Địa danh trước"
                      className="p-1.5 rounded-lg bg-[#121B30] hover:bg-amber-400 hover:text-slate-950 text-slate-300 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNavigateNext}
                      title="Địa danh tiếp theo"
                      className="p-1.5 rounded-lg bg-[#121B30] hover:bg-amber-400 hover:text-slate-950 text-slate-300 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Main Titles */}
                <div className="mb-5">
                  <h3 className="font-serif-vi text-2xl sm:text-3xl font-bold text-amber-100 mb-1 leading-snug">
                    {selectedNode.name}
                  </h3>
                  {selectedNode.historicalName && (
                    <p className="text-xs font-serif-vi italic text-amber-300/80 mb-2">
                      {selectedNode.historicalName}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {selectedNode.dynasties.map((dyn, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-[#121B30] text-slate-300 border border-slate-700 text-[11px]"
                      >
                        🏛️ {dyn}
                      </span>
                    ))}
                    <span className="px-2 py-0.5 rounded-md bg-[#121B30] text-amber-300 border border-amber-500/30 text-[11px]">
                      📍 {selectedNode.regionTitle.split('—')[0].trim()}
                    </span>
                  </div>
                </div>

                {/* Garments Showcase list */}
                <div className="mb-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Thức Phục Khởi Nguồn Tiêu Biểu:</span>
                  </h4>
                  <div className="space-y-2">
                    {selectedNode.garments.map((g, gIdx) => (
                      <div
                        key={gIdx}
                        className="p-3 rounded-2xl bg-[#121B30] border border-slate-700/80 text-xs text-slate-200"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-serif-vi font-bold text-amber-200 text-sm">
                            {g.name}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase font-mono px-1.5 py-0.5 rounded bg-[#090E1A]">
                            {g.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-light leading-relaxed">
                          {g.significance}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Craftsmanship & Weaving Village */}
                <div className="mb-4 p-3.5 rounded-2xl bg-[#090E1A] border border-slate-800 text-xs text-slate-300 space-y-1.5">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <span>🧵 Kỹ Nghệ Dệt Nhuộm & Làng Nghề:</span>
                  </span>
                  <p className="leading-relaxed font-light font-sans-vi text-slate-300 text-[11px]">
                    {selectedNode.craftAndFabric}
                  </p>
                </div>

                {/* Historical Context Story */}
                <div className="mb-4 text-xs text-slate-300 space-y-1.5">
                  <span className="font-bold text-amber-400 block uppercase tracking-wider text-[10px]">
                    📜 Biên Niên Lịch Sử & Nguồn Cội:
                  </span>
                  <p className="leading-relaxed font-light font-sans-vi text-slate-300 text-[11px]">
                    {selectedNode.historicalStory}
                  </p>
                </div>

                {/* Philosophical Significance & Quote */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200 space-y-1.5 mb-6">
                  <span className="font-bold text-amber-300 block text-[11px]">
                    🕊️ Triết Lý Thẩm Mỹ:
                  </span>
                  <p className="leading-relaxed font-light font-sans-vi text-[11px]">
                    {selectedNode.philosophicalMeaning}
                  </p>
                  <p className="italic font-serif-vi text-xs text-amber-300/90 pt-1 border-t border-amber-500/20">
                    “{selectedNode.quote}”
                  </p>
                </div>
              </div>

              {/* Action Buttons: Try in Fitting Room & Explore */}
              <div className="pt-2 border-t border-slate-700/80 flex flex-col sm:flex-row items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleTryOnGarment}
                  className="w-full sm:flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Mặc Thử Phục Sức Này Ngay</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 4. Bottom Horizontal Cultural Timeline Carousel of All Regional Nodes */}
      <div className="mt-8 pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-400" />
            <span>Mục Lục Các Địa Danh Khởi Nguyên Cổ Phục Trên Bản Đồ</span>
          </span>
          <span className="text-[11px] text-slate-400">
            Nhấp vào từng thẻ để định vị camera bản đồ
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {HERITAGE_LOCATIONS.map((loc) => {
            const isCurrent = selectedNodeId === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => handleSelectNode(loc)}
                className={`p-3 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-amber-500/20 border-2 border-amber-400 shadow-md text-amber-200'
                    : 'bg-[#0E1526] hover:bg-[#131D33] border border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-lg">{loc.icon}</span>
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: loc.accentColor }}
                    />
                  </div>
                  <h5 className="font-serif-vi text-xs font-bold truncate text-slate-100">
                    {loc.name.split('(')[0].trim()}
                  </h5>
                  <p className="text-[10px] text-amber-400/90 truncate mt-0.5">
                    {loc.mainGarmentName.split('&')[0].trim()}
                  </p>
                </div>
                <span className="text-[9px] text-slate-400 uppercase font-mono mt-2 block">
                  {loc.dynasties[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
