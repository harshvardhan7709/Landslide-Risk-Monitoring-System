"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Map, { NavigationControl, Marker, Popup, Source, Layer } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Card } from "@/components/ui/card";
import { 
  Layers, 
  AlertTriangle, 
  Maximize2, 
  Minimize2, 
  Plus, 
  Minus, 
  Compass, 
  ShieldAlert, 
  Loader2,
  MapPin
} from "lucide-react";
import { fetchRiskMapGeoJSON, RiskMapGeoJSON, GeoJSONFeature } from "@/lib/api";

interface RiskMapProps {
  selectedLocationId?: number;
  onSelectLocation?: (id: number) => void;
}

// Map styles for Basemap Switcher
const MAP_STYLES = {
  satellite: {
    version: 8,
    sources: {
      "esri-satellite": {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        ],
        tileSize: 256,
        attribution: "Esri Satellite"
      }
    },
    layers: [
      {
        id: "esri-satellite-layer",
        type: "raster",
        source: "esri-satellite",
        minzoom: 0,
        maxzoom: 19
      }
    ]
  },
  terrain: {
    version: 8,
    sources: {
      "esri-topo": {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
        ],
        tileSize: 256,
        attribution: "Esri Topo"
      }
    },
    layers: [
      {
        id: "esri-topo-layer",
        type: "raster",
        source: "esri-topo",
        minzoom: 0,
        maxzoom: 19
      }
    ]
  },
  osm: {
    version: 8,
    sources: {
      "osm-tiles": {
        type: "raster",
        tiles: [
          "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        ],
        tileSize: 256,
        attribution: "© OpenStreetMap"
      }
    },
    layers: [
      {
        id: "osm-layer",
        type: "raster",
        source: "osm-tiles",
        minzoom: 0,
        maxzoom: 19
      }
    ]
  }
};

// State Label Overlays on the Map matching the reference design
const STATE_LABELS = [
  { name: "Arunachal Pradesh", lon: 94.2, lat: 28.1 },
  { name: "Assam", lon: 92.4, lat: 26.3 },
  { name: "Meghalaya", lon: 91.3, lat: 25.4 },
  { name: "Nagaland", lon: 94.4, lat: 26.1 },
  { name: "Manipur", lon: 93.9, lat: 24.7 },
  { name: "Mizoram", lon: 92.8, lat: 23.3 },
  { name: "Tripura", lon: 91.8, lat: 23.8 },
  { name: "Sikkim", lon: 88.5, lat: 27.5 },
];

export function RiskMap({ selectedLocationId, onSelectLocation }: RiskMapProps) {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [geoData, setGeoData] = useState<RiskMapGeoJSON | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<GeoJSONFeature | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeBasemap, setActiveBasemap] = useState<"satellite" | "terrain" | "osm">("satellite");
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const [viewState, setViewState] = useState({
    longitude: 92.9,
    latitude: 25.8,
    zoom: 5.9
  });

  useEffect(() => {
    setIsMounted(true);
    async function loadMapData() {
      try {
        setLoading(true);
        const data = await fetchRiskMapGeoJSON();
        setGeoData(data);
      } catch (e) {
        console.error("Failed to load risk map GeoJSON:", e);
      } finally {
        setLoading(false);
      }
    }
    loadMapData();
  }, []);

  // Center on selected location if changed externally
  useEffect(() => {
    if (geoData?.features && selectedLocationId) {
      const match = geoData.features.find(f => f.geometry.type === "Point" && f.properties.id === selectedLocationId);
      if (match) {
        setSelectedFeature(match);
        setViewState(prev => ({
          ...prev,
          longitude: match.geometry.coordinates[0],
          latitude: match.geometry.coordinates[1],
          zoom: 7.2
        }));
      }
    }
  }, [selectedLocationId, geoData]);

  const handleZoomIn = () => {
    setViewState(prev => ({ ...prev, zoom: Math.min(prev.zoom + 0.8, 14) }));
  };

  const handleZoomOut = () => {
    setViewState(prev => ({ ...prev, zoom: Math.max(prev.zoom - 0.8, 4) }));
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(err => console.error(err));
      setIsFullscreen(false);
    }
  };

  const handleMarkerClick = (feature: GeoJSONFeature) => {
    setSelectedFeature(feature);
    if (onSelectLocation && feature.properties.id !== undefined) {
      onSelectLocation(feature.properties.id);
    }
    setViewState(prev => ({
      ...prev,
      longitude: feature.geometry.coordinates[0],
      latitude: feature.geometry.coordinates[1],
      zoom: 7.2
    }));
  };

  // Polygon features for GIS overlay
  const polygonData = useMemo(() => {
    if (!geoData) return { type: "FeatureCollection", features: [] };
    return {
      type: "FeatureCollection",
      features: geoData.features.filter(f => f.geometry.type === "Polygon")
    };
  }, [geoData]);

  // Point features for markers
  const pointFeatures = useMemo(() => {
    if (!geoData) return [];
    return geoData.features.filter(f => f.geometry.type === "Point");
  }, [geoData]);

  if (!isMounted) {
    return (
      <Card className="shadow-sm border-slate-100 h-full flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="text-xs text-slate-400 font-semibold">Initializing High-Resolution NER GIS Map...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      ref={containerRef}
      className="shadow-sm border-slate-100 h-full flex flex-col relative overflow-hidden select-none"
    >
      {/* Map Title Header */}
      <div className="absolute top-4 left-4 z-20 bg-[#06182B]/85 backdrop-blur-md px-3.5 py-2 rounded-lg shadow-lg border border-white/10 text-white">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <span className="tracking-wide">Landslide Risk Map - North Eastern Region</span>
          <span className="text-[10px] bg-blue-500/30 text-blue-300 border border-blue-400/30 px-1.5 py-0.5 rounded font-mono">
            LIVE GIS
          </span>
        </h2>
      </div>

      <div className="flex-1 w-full h-full bg-[#071926] relative">
        <Map
          ref={mapRef}
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle={MAP_STYLES[activeBasemap] as any}
          attributionControl={false}
        >
          {/* Multi-Colored Risk Polygons Layer (GeoJSON) */}
          <Source id="ner-risk-polygons" type="geojson" data={polygonData as any}>
            <Layer
              id="risk-polygons-fill"
              type="fill"
              paint={{
                "fill-color": ["get", "fill_color"],
                "fill-opacity": ["get", "fill_opacity"]
              }}
            />
            <Layer
              id="risk-polygons-stroke"
              type="line"
              paint={{
                "line-color": ["get", "stroke_color"],
                "line-width": 2,
                "line-opacity": 0.85
              }}
            />
          </Source>

          {/* Map Controls (Left Toolbar Matching Reference UI) */}
          <div className="absolute top-16 left-4 z-20 flex flex-col gap-1.5 bg-white/95 backdrop-blur-md rounded-lg shadow-xl p-1 border border-slate-200">
            <button 
              onClick={handleZoomIn}
              title="Zoom In"
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-800 font-bold transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button 
              onClick={handleZoomOut}
              title="Zoom Out"
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-800 font-bold transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="h-px bg-slate-200 my-0.5" />
            <button 
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              title="Change Map Layers"
              className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                showLayerMenu ? "bg-blue-600 text-white" : "hover:bg-slate-100 text-slate-700"
              }`}
            >
              <Layers className="w-4 h-4" />
            </button>
            <button 
              onClick={toggleFullscreen}
              title="Toggle Fullscreen"
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-700 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Layer Selector Popup Menu */}
          {showLayerMenu && (
            <div className="absolute top-36 left-16 z-30 bg-white rounded-lg shadow-2xl border border-slate-200 p-2.5 w-44 text-xs font-semibold space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Basemap Layer
              </span>
              <button
                onClick={() => { setActiveBasemap("satellite"); setShowLayerMenu(false); }}
                className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between ${
                  activeBasemap === "satellite" ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>🛰️ Satellite Terrain</span>
                {activeBasemap === "satellite" && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
              </button>
              <button
                onClick={() => { setActiveBasemap("terrain"); setShowLayerMenu(false); }}
                className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between ${
                  activeBasemap === "terrain" ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>🏔️ Topographic Map</span>
                {activeBasemap === "terrain" && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
              </button>
              <button
                onClick={() => { setActiveBasemap("osm"); setShowLayerMenu(false); }}
                className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between ${
                  activeBasemap === "osm" ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>🗺️ OpenStreetMap</span>
                {activeBasemap === "osm" && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
              </button>
            </div>
          )}

          {/* Permanent State Name Labels on Map */}
          {STATE_LABELS.map((st, i) => (
            <Marker key={i} longitude={st.lon} latitude={st.lat} anchor="center">
              <span className="text-white font-extrabold text-[12px] md:text-[13px] tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] opacity-95 pointer-events-none uppercase">
                {st.name}
              </span>
            </Marker>
          ))}

          {/* Render Hazard Warning Icons (Triangles) & Point Markers matching reference design */}
          {pointFeatures.map((feature) => {
            const [lon, lat] = feature.geometry.coordinates;
            const props = feature.properties;
            const isSelected = selectedLocationId === props.id;
            const isHighOrVeryHigh = props.risk_score >= 0.50;

            return (
              <Marker
                key={props.id}
                longitude={lon}
                latitude={lat}
                anchor="center"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  handleMarkerClick(feature);
                }}
              >
                <div 
                  className={`cursor-pointer transition-all duration-200 hover:scale-130 flex items-center justify-center ${
                    isSelected ? "scale-130 ring-4 ring-white rounded-full shadow-2xl" : ""
                  }`}
                >
                  {isHighOrVeryHigh ? (
                    // Warning Triangle Badge matching reference image
                    <div className="relative group">
                      <div 
                        className={`p-1.5 rounded-lg shadow-xl border-2 border-white flex items-center justify-center text-white ${
                          props.risk_score >= 0.75 ? "bg-red-600 animate-pulse" : "bg-orange-500"
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4 text-white fill-white stroke-red-800" />
                      </div>
                      <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[9px] font-bold px-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        {props.name}
                      </span>
                    </div>
                  ) : (
                    // Circular Risk Point
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white shadow-md border-2 border-white"
                      style={{ backgroundColor: props.color }}
                    >
                      <span className="text-[8px] font-black">{Math.round(props.risk_score * 100)}</span>
                    </div>
                  )}
                </div>
              </Marker>
            );
          })}

          {/* Interactive Click Popup */}
          {selectedFeature && (
            <Popup
              longitude={selectedFeature.geometry.coordinates[0]}
              latitude={selectedFeature.geometry.coordinates[1]}
              anchor="bottom"
              offset={22}
              onClose={() => setSelectedFeature(null)}
              closeButton={true}
              closeOnClick={false}
              className="z-30"
            >
              <div className="p-3 max-w-xs text-slate-900 font-sans">
                <div className="flex items-center justify-between border-b pb-1.5 mb-2">
                  <h4 className="font-bold text-sm text-slate-900">
                    {selectedFeature.properties.name}, {selectedFeature.properties.state}
                  </h4>
                  <span 
                    className="text-[11px] font-bold px-2 py-0.5 rounded text-white"
                    style={{ backgroundColor: selectedFeature.properties.color }}
                  >
                    {selectedFeature.properties.risk_level}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-xs mb-2">
                  <div className="bg-slate-50 p-1.5 rounded">
                    <span className="text-slate-500 text-[10px] block">Risk Score</span>
                    <span className="font-black text-slate-900 text-sm">{selectedFeature.properties.risk_score}</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded">
                    <span className="text-slate-500 text-[10px] block">Rainfall (24h)</span>
                    <span className="font-black text-slate-900 text-sm">{selectedFeature.properties.rainfall_24h} mm</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded">
                    <span className="text-slate-500 text-[10px] block">Slope / Elevation</span>
                    <span className="font-bold text-slate-900">{selectedFeature.properties.slope}° / {selectedFeature.properties.elevation}m</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded">
                    <span className="text-slate-500 text-[10px] block">Soil Moisture</span>
                    <span className="font-bold text-slate-900">{selectedFeature.properties.soil_moisture}%</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 mb-2 italic">
                  {selectedFeature.properties.warning_message}
                </p>

                <div className="flex gap-1.5 pt-1">
                  <button 
                    onClick={() => {
                      if (onSelectLocation && selectedFeature.properties.id !== undefined) {
                        onSelectLocation(selectedFeature.properties.id);
                      }
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-1.5 rounded transition-colors"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => alert(`Early warning bulletin dispatched for ${selectedFeature.properties.name} zone.`)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-[11px] font-bold py-1.5 rounded transition-colors"
                  >
                    Get Early Warning
                  </button>
                </div>
              </div>
            </Popup>
          )}

          {/* Dark Floating Legend on Bottom-Right Matching Reference Image */}
          <div className="absolute bottom-6 right-6 z-20 bg-[#06182B]/90 backdrop-blur-md p-3.5 rounded-xl shadow-2xl border border-white/10 w-44 text-white">
            <div className="space-y-2 text-xs font-semibold">
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-[#22C55E] shadow-sm shadow-green-500/50" />
                <span className="text-slate-200">Low Risk</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-[#FACC15] shadow-sm shadow-yellow-500/50" />
                <span className="text-slate-200">Moderate Risk</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-[#F97316] shadow-sm shadow-orange-500/50" />
                <span className="text-slate-200">High Risk</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-[#EF4444] shadow-sm shadow-red-500/50" />
                <span className="text-slate-100 font-bold">Very High Risk</span>
              </div>
            </div>
          </div>
          
          {/* Map Scale Bar on Bottom-Left */}
          <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
            <div className="flex flex-col border-l-2 border-white border-b-2 px-1.5 pb-0.5 text-[10px] font-bold text-white bg-black/50 backdrop-blur-xs rounded-xs w-20">
              <span>100 km</span>
              <span className="border-t border-white/60 pt-0.5 mt-0.5">50 mi</span>
            </div>
          </div>
        </Map>
      </div>
    </Card>
  );
}
