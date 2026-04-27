import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Users, Globe2, FileText, ArrowRight, ExternalLink, ChevronDown, ChevronUp, ZoomIn, Maximize, Hand, MousePointer2, Info, X } from 'lucide-react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
// @ts-ignore
import { geoRobinson } from 'd3-geo-projection';
import AnimatedCounter from './AnimatedCounter';

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

// Finance Data mapping
const financeRegionsInfo = {
  "US & CANADA": { mitigation: "889B", total: "101B" },
  "LATIN AMERICA & CARIBBEAN": { mitigation: "321B", total: "22B" },
  "WESTERN EUROPE": { mitigation: "562B", total: "213B" },
  "MIDDLE EAST & NORTH AFRICA": { mitigation: "367B", total: "8B" },
  "SUB-SAHARAN AFRICA": { mitigation: "134B", total: "5B" },
  "CENTRAL ASIA & EASTERN EUROPE": { mitigation: "454B", total: "17B" },
  "SOUTH ASIA": { mitigation: "357B", total: "17B" },
  "EAST ASIA & PACIFIC": { mitigation: "1186B", total: "387B" },
  "OTHER OCEANIA": { mitigation: "57B", total: "3B" },
};

const getFinanceRegionName = (country: string): string | null => {
  const regions: Record<string, string[]> = {
    "US & CANADA": ["United States", "Canada", "United States of America"],
    "LATIN AMERICA & CARIBBEAN": ["Mexico", "Brazil", "Argentina", "Chile", "Colombia", "Peru", "Bolivia", "Paraguay", "Uruguay", "Venezuela", "Panama", "Nicaragua", "Guatemala", "El Salvador", "Honduras", "Cuba", "Jamaica", "Bahamas", "Haiti", "Dominican Rep.", "Dominican Republic", "Costa Rica", "Belize", "Suriname", "Guyana", "Ecuador", "Puerto Rico", "Falkland Is."],
    "WESTERN EUROPE": ["United Kingdom", "France", "Germany", "Italy", "Spain", "Portugal", "Belgium", "Netherlands", "Ireland", "Sweden", "Norway", "Finland", "Denmark", "Austria", "Switzerland", "Greece", "Iceland", "Luxembourg", "Greenland"],
    "EAST ASIA & PACIFIC": ["China", "Japan", "South Korea", "North Korea", "Taiwan", "Mongolia", "Indonesia", "Philippines", "Vietnam", "Thailand", "Malaysia", "Singapore", "Myanmar", "Cambodia", "Laos", "Brunei", "Dem. Rep. Korea", "Republic of Korea", "Timor-Leste"],
    "SOUTH ASIA": ["India", "Pakistan", "Bangladesh", "Sri Lanka", "Nepal", "Bhutan", "Afghanistan", "Maldives"],
    "MIDDLE EAST & NORTH AFRICA": ["Saudi Arabia", "United Arab Emirates", "Qatar", "Oman", "Yemen", "Iran", "Iraq", "Syria", "Jordan", "Lebanon", "Israel", "Egypt", "Morocco", "Algeria", "Tunisia", "Libya", "Kuwait", "W. Sahara", "Western Sahara", "Palestine"],
    "SUB-SAHARAN AFRICA": ["Nigeria", "Ethiopia", "Kenya", "South Africa", "Tanzania", "Congo", "Dem. Rep. Congo", "Uganda", "Ghana", "Angola", "Rwanda", "Senegal", "Zambia", "Zimbabwe", "Cameroon", "Mali", "Madagascar", "Sudan", "South Sudan", "Somalia", "Somaliland", "Niger", "Chad", "Burkina Faso", "Botswana", "Namibia", "Mozambique", "Cote d'Ivoire", "Côte d'Ivoire", "Central African Rep.", "Central African Republic", "Gabon", "Eq. Guinea", "Equatorial Guinea", "Mauritania", "Guinea", "Guinea-Bissau", "Liberia", "Sierra Leone", "Togo", "Benin", "Eritrea", "Djibouti", "Burundi", "Malawi", "Lesotho", "eSwatini", "Gambia", "Swaziland"],
    "CENTRAL ASIA & EASTERN EUROPE": ["Russia", "Ukraine", "Poland", "Romania", "Czechia", "Hungary", "Belarus", "Kazakhstan", "Uzbekistan", "Turkmenistan", "Kyrgyzstan", "Tajikistan", "Bulgaria", "Serbia", "Slovakia", "Croatia", "Turkey", "Türkiye", "Moldova", "Armenia", "Azerbaijan", "Georgia", "Bosnia and Herz.", "Macedonia", "North Macedonia", "Albania", "Montenegro", "Kosovo", "Slovenia", "Lithuania", "Latvia", "Estonia"],
    "OTHER OCEANIA": ["Australia", "New Zealand", "Papua New Guinea", "Fiji", "Vanuatu", "Solomon Is.", "Solomon Islands", "Samoa", "Tonga", "New Caledonia"]
  };

  for (const [region, countries] of Object.entries(regions)) {
    if (countries.includes(country)) return region;
  }
  return null;
};

const champCountries = new Set([
  "Albania", "Andorra", "Antigua and Barbuda", "Armenia", "Australia", 
  "Azerbaijan", "Bahamas", "Bangladesh", "Belgium", "Bhutan", 
  "Bolivia", "Brazil", "Brunei Darussalam", "Bulgaria", "Burkina Faso", 
  "Cabo Verde", "Canada", "Chad", "Chile", "Colombia", 
  "Costa Rica", "Côte d'Ivoire", "Denmark", "Dominican Republic", "El Salvador", 
  "Estonia", "Eswatini", "Ethiopia", "Finland", "France", 
  "Germany", "Ghana", "Guatemala", "Hungary", "Iceland", 
  "Italy", "Jamaica", "Japan", "Jordan", "Kenya", 
  "Kiribati", "Kyrgyzstan", "Lebanon", "Lesotho", "Mexico", 
  "Moldova", "Mongolia", "Morocco", "Netherlands", "Nicaragua", 
  "Nigeria", "North Macedonia", "Norway", "Pakistan", "Palau", 
  "Panama", "Papua New Guinea", "Paraguay", "Philippines", "Poland", 
  "Portugal", "Rwanda", "Saint Vincent and the Grenadines", "Serbia", "Seychelles", 
  "Sierra Leone", "South Korea", "Sri Lanka", "Sweden", "Tunisia", 
  "Türkiye", "Turkmenistan", "United Arab Emirates", "Ukraine", "United Kingdom", 
  "United States of America", "Yemen", 
  "United States", "Dem. Rep. Korea", "Republic of Korea", "Ivory Coast"
]);

const ndcCategories: Record<string, string> = {
  "Angola": "A+", "Azerbaijan": "A+", "Bahamas": "A+", "Bahrain": "A+", "Bangladesh": "A+", 
  "Belize": "A+", "Bolivia": "A+", "Brazil": "A+", "Burundi": "A+", "Cabo Verde": "A+", 
  "Cambodia": "A+", "Canada": "A+", "Chile": "A+", "China": "A+", "Colombia": "A+", 
  "Costa Rica": "A+", "Côte d'Ivoire": "A+", "Djibouti": "A+", "Ecuador": "A+", "El Salvador": "A+", 
  "Ethiopia": "A+", "Fiji": "A+", "Gabon": "A+", "Guinea": "A+", "Holy See": "A+", 
  "Iraq": "A+", "Kyrgyzstan": "A+", "Lebanon": "A+", "Liberia": "A+", "Mauritania": "A+", 
  "Mauritius": "A+", "Mexico": "A+", "Morocco": "A+", "Nigeria": "A+", "Pakistan": "A+", 
  "Paraguay": "A+", "Peru": "A+", "Qatar": "A+", "Moldova": "A+", "Russian Federation": "A+", "Russia": "A+",
  "Rwanda": "A+", "Sao Tome and Principe": "A+", "Solomon Islands": "A+", "Somalia": "A+", 
  "Sierra Leone": "A+", "South Africa": "A+", "Sri Lanka": "A+", "Suriname": "A+", "United Arab Emirates": "A+", 
  "Uruguay": "A+", "Uzbekistan": "A+", "Vanuatu": "A+", "Venezuela": "A+",
  "Andorra": "A-B", "Kazakhstan": "A-B", "Monaco": "A-B", "Nicaragua": "A-B", "Yemen": "A-B", "Zambia": "A-B",
  "Austria": "A-B", "Barbados": "A-B", "Belgium": "A-B", "Bulgaria": "A-B", "Burkina Faso": "A-B", "Croatia": "A-B", 
  "Cuba": "A-B", "Cyprus": "A-B", "Czechia": "A-B", "Denmark": "A-B", "Estonia": "A-B", "Eswatini": "A-B", 
  "Finland": "A-B", "France": "A-B", "Germany": "A-B", "Greece": "A-B", "Hungary": "A-B", "Indonesia": "A-B", 
  "Ireland": "A-B", "Italy": "A-B", "Kenya": "A-B", "Latvia": "A-B", "Lithuania": "A-B", "Luxembourg": "A-B", 
  "Malta": "A-B", "Marshall Islands": "A-B", "Nepal": "A-B", "Netherlands": "A-B", "Poland": "A-B", "Portugal": "A-B", 
  "Romania": "A-B", "Saudi Arabia": "A-B", "Singapore": "A-B", "Slovakia": "A-B", "Slovenia": "A-B", "Spain": "A-B", 
  "Sweden": "A-B", "Tonga": "A-B", "Tuvalu": "A-B", "Zimbabwe": "A-B", "Bhutan": "A-B", "Malaysia": "A-B", "Mongolia": "A-B",
  "Australia": "C", "Belarus": "C", "Maldives": "C", "Montenegro": "C", "Turkey": "C", "Türkiye": "C", 
  "United Kingdom": "C", "United States": "C", "Brunei Darussalam": "C", "Jamaica": "C", "Mozambique": "C", 
  "Serbia": "C", "Ukraine": "C"
};

const ndcColors = {
  "A+": "#3c4799",
  "A-B": "#5d8d8b",
  "C": "#f0c763",
  "None": "#e2e8f0"
};

const financeColors: Record<string, string> = {
  "US & CANADA": "#3c4799",
  "LATIN AMERICA & CARIBBEAN": "#5d8d8b",
  "WESTERN EUROPE": "#e8983c",
  "EAST ASIA & PACIFIC": "#9aba75",
  "SOUTH ASIA": "#993e69",
  "MIDDLE EAST & NORTH AFRICA": "#f0c763",
  "SUB-SAHARAN AFRICA": "#467d9d",
  "CENTRAL ASIA & EASTERN EUROPE": "#e0514c",
  "OTHER OCEANIA": "#8cb3cc" // Soft blue, fits palette
};

interface MapDashboardProps {
  stats: {
    title: string;
    value: number | string;
    description: string;
    link: string;
  }[];
}

export default function MapDashboard({ stats }: MapDashboardProps) {
  const [activeTab, setActiveTab] = useState<'champ' | 'ndc' | 'finance'>('champ');
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<{name: string, stat?: string} | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [mapZoom, setMapZoom] = useState(1);
  const [mapPan, setMapPan] = useState({ x: 0, y: 0 });
  const [activeTool, setActiveTool] = useState<'default' | 'pan'>('default');
  const [isDragging, setIsDragging] = useState(false);
  const [showZoomSlider, setShowZoomSlider] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const handleResetMap = () => { 
    setMapZoom(1); 
    setMapPan({ x: 0, y: 0 }); 
    setActiveTool('default');
    setShowZoomSlider(false);
  };

  const tabs = [
    { id: 'champ', label: 'CHAMP Endorsements' },
    { id: 'ndc', label: 'Urban Content in NDCs' },
    { id: 'finance', label: 'Urban Climate Finance' }
  ];

  const normalizeName = (name: string) => {
    if (name === "United States of America") return "United States";
    if (name === "Dem. Rep. Korea") return "North Korea";
    if (name === "Korea" || name === "Republic of Korea") return "South Korea";
    if (name === "S. Sudan") return "South Sudan";
    if (name === "W. Sahara") return "Western Sahara";
    if (name === "Central African Rep.") return "Central African Republic";
    if (name === "Eq. Guinea") return "Equatorial Guinea";
    if (name === "Dominican Rep.") return "Dominican Republic";
    if (name === "Solomon Is.") return "Solomon Islands";
    if (name === "Falkland Is.") return "Falkland Islands";
    if (name === "Bosnia and Herz.") return "Bosnia and Herzegovina";
    return name;
  };

  const getGeoRegion = (geoName: string) => {
    return getFinanceRegionName(normalizeName(geoName));
  };

  const getGeoColor = (geoName: string) => {
    const name = normalizeName(geoName);
    
    if (activeTab === 'champ') {
      return champCountries.has(name) || champCountries.has(geoName) ? "#3c4799" : "#e2e8f0";
    }
    
    if (activeTab === 'ndc') {
      const category = ndcCategories[name] || ndcCategories[geoName];
      return category ? ndcColors[category as keyof typeof ndcColors] : ndcColors.None;
    }
    
    if (activeTab === 'finance') {
      const region = getFinanceRegionName(name);
      if (region && hoveredRegion === region) {
        return "#8cb3cc"; // Hover color for regions
      }
      return region ? financeColors[region] : "#e2e8f0";
    }
    
    return "#e2e8f0";
  };

  // Adjust scaling/translation for tighter fit with no Antarctica.
  const baseScale = 160;
  const baseTranslate = [900 / 2, 500 / 2 + 40];
  const projection = geoRobinson()
    .scale(baseScale * mapZoom)
    .translate([baseTranslate[0] + mapPan.x, baseTranslate[1] + mapPan.y]);

  return (
    <div className="mb-24 relative">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-line pb-6 gap-6">
        <h2 className="font-heading text-3xl font-semibold text-ink tracking-tight max-w-lg">Snapshot: Multilevel Climate Action and Finance</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line mb-10 overflow-hidden">
        {stats.map((item, index) => {
          const tabKeys: ('champ' | 'ndc' | 'finance')[] = ['champ', 'ndc', 'finance'];
          const isCorrespondingTab = activeTab === tabKeys[index];
          
          return (
            <a 
              key={index} 
              href={item.link} 
              target="_blank" 
              rel="noreferrer"
              className={`flex flex-col justify-between p-8 relative transition-colors duration-300 ${
                isCorrespondingTab ? 'bg-paper shadow-[inset_0_-4px_0_0_#3c4799]' : 'bg-surface hover:bg-slate-50'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className={`text-[12px] font-bold uppercase tracking-[0.15em] min-h-[36px] ${
                  isCorrespondingTab ? 'text-accent' : 'text-ink-muted'
                }`}>
                  {item.title}
                </h3>
                <ExternalLink className={`w-4 h-4 ${isCorrespondingTab ? 'text-accent' : 'text-slate-400'}`} />
              </div>
              <div className="relative z-10">
                <div className="font-heading text-5xl md:text-[3.5rem] text-ink font-medium mb-3 tracking-tight">
                  {/* Handle string values by bypassing AnimatedCounter if it has spaces or letters */}
                  {isNaN(parseFloat(item.value as string)) && !(item.value as string).match(/^[0-9.]+[A-Za-z%]?$/) ? (
                    <span className={isCorrespondingTab ? 'text-accent' : 'text-secondary'}>{item.value as string}</span>
                  ) : (
                    <span className={isCorrespondingTab ? 'text-accent' : 'text-secondary'}>
                      <AnimatedCounter value={item.value} />
                    </span>
                  )}
                </div>
                <p className="text-ink-muted text-sm leading-relaxed font-light">{item.description}</p>
              </div>
            </a>
          );
        })}
      </div>

      <div className="border border-line bg-surface overflow-hidden relative">
        <div className="flex border-b border-line w-full overflow-x-auto no-scrollbar relative bg-surface">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-2 px-8 py-4 text-[13px] uppercase tracking-widest transition-colors whitespace-nowrap relative
                ${activeTab === tab.id 
                  ? 'text-accent font-bold' 
                  : 'text-ink-muted hover:text-ink font-semibold'
                }
              `}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="activeMapTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
              )}
            </button>
          ))}
        </div>

        <div 
          className={`relative bg-slate-50 flex items-center justify-center overflow-hidden group ${activeTool === 'pan' ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'}`}
          onMouseDown={() => {
            if (activeTool === 'pan') setIsDragging(true);
          }}
          onMouseUp={() => {
            if (activeTool === 'pan') setIsDragging(false);
          }}
          onMouseLeave={() => {
            if (activeTool === 'pan') setIsDragging(false);
          }}
          onMouseMove={(e) => {
            if (activeTool === 'pan' && isDragging) {
              setMapPan(p => ({ x: p.x + e.movementX, y: p.y + e.movementY }));
              return; // Don't update tooltip while dragging
            }
            if (isDragging) return; // safety
            const rect = e.currentTarget.getBoundingClientRect();
            setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            setContainerSize({ width: rect.width, height: rect.height });
          }}
        >
          {/* Info Button */}
          <button
            onClick={() => setIsInfoOpen(!isInfoOpen)}
            className="absolute top-4 left-4 z-40 bg-white border border-line shadow-sm p-2 rounded-full hover:bg-slate-50 transition-colors text-slate-600 hover:text-[#3c4799] focus:outline-none"
            title="Map Information"
          >
            <Info size={18} />
          </button>

          {/* Info Modal */}
          <AnimatePresence>
            {isInfoOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-16 left-4 z-50 bg-surface border border-line shadow-xl w-[320px] rounded-md overflow-hidden"
              >
                <div className="flex justify-between items-center p-3 border-b border-line bg-slate-50">
                  <h4 className="font-heading font-semibold text-ink text-sm">Map Information</h4>
                  <button onClick={() => setIsInfoOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={16} />
                  </button>
                </div>
                <div className="p-4 text-sm text-slate-600 space-y-3 font-light leading-relaxed">
                  {activeTab === 'champ' && (
                    <>
                      <p><strong className="font-semibold text-ink">CHAMP Endorsing Country:</strong> Countries that have endorsed the Coalition for High Ambition Multilevel Partnerships (CHAMP) initiative.</p>
                      <p className="text-xs text-ink-muted border-t border-line pt-2 mt-2 font-medium">Source: CHAMP</p>
                      <a href="https://www.cop28.com/en/cop28-uae-coalition-for-high-ambition-multilevel-partnerships-for-climate-action" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#3c4799] hover:underline font-medium mt-1">
                        Read more about CHAMP <ExternalLink size={12} />
                      </a>
                    </>
                  )}
                  {activeTab === 'ndc' && (
                    <>
                      <p className="leading-snug space-y-1.5">
                        <strong className="font-semibold text-ink text-[13px] block">Strong (Category A+ / A):</strong>
                        Explicit and well-developed urban policies, dedicated urban strategies, and clear multi-level governance structures.
                      </p>
                      <p className="leading-snug space-y-1.5 pt-1">
                        <strong className="font-semibold text-ink text-[13px] block">Moderate (Category B):</strong>
                        Some urban references, identified urban challenges, but lacks comprehensive dedicated measures.
                      </p>
                      <p className="leading-snug space-y-1.5 pt-1">
                        <strong className="font-semibold text-ink text-[13px] block">Weak (Category C / D):</strong>
                        Minimal or no urban context; urban areas strictly mentioned in vulnerability contexts without active policy measures.
                      </p>
                      <p className="text-xs text-ink-muted border-t border-line pt-2 mt-2 font-medium">Source: UN-Habitat</p>
                      <a href="https://unhabitat.org/sites/default/files/2025/02/urban_content_in_ndc_3.0._a_global_snapshot_updated-128-ndcs-1_1.pdf" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#3c4799] hover:underline font-medium mt-1">
                        View UN-Habitat Report <ExternalLink size={12} />
                      </a>
                    </>
                  )}
                  {activeTab === 'finance' && (
                    <>
                      <p><strong className="font-semibold text-ink">Urban Climate Finance:</strong> Displays regional urban climate finance needs versus current flows.</p>
                      <p className="text-xs text-ink-muted border-t border-line pt-2 mt-2 font-medium">Source: CCFLA</p>
                      <a href="https://citiesclimatefinance.org/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#3c4799] hover:underline font-medium mt-1">
                        Read the State of Cities Report <ExternalLink size={12} />
                      </a>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-40 opacity-40 hover:opacity-100 transition-opacity duration-300">
            {/* Zoom Control */}
            <div className="flex items-center gap-2">
              <AnimatePresence>
                {showZoomSlider && (
                  <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 120, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="bg-white border border-line shadow-sm rounded-md px-3 py-2 flex items-center overflow-hidden h-[38px]"
                  >
                    <input 
                      type="range" 
                      min="1" 
                      max="5" 
                      step="0.1" 
                      value={mapZoom} 
                      onChange={(e) => setMapZoom(parseFloat(e.target.value))}
                      className="w-full accent-[#3c4799] cursor-pointer"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <button 
                title="Zoom" 
                onClick={() => setShowZoomSlider(!showZoomSlider)} 
                className={`bg-white border text-ink border-line p-2 shadow-sm hover:bg-slate-100 transition-colors rounded-md ${showZoomSlider ? 'text-[#3c4799] bg-slate-50' : 'text-slate-600'}`}
              >
                <ZoomIn size={18} />
              </button>
            </div>
            
            {/* Pan/Select Controls */}
            <div className="bg-white border border-line shadow-sm flex flex-col rounded-md overflow-hidden">
              <button 
                title="Select" 
                onClick={() => setActiveTool('default')} 
                className={`p-2 hover:bg-slate-100 transition-colors border-b border-line ${activeTool === 'default' ? 'bg-slate-100 text-[#3c4799]' : 'text-slate-600'}`}
              >
                <MousePointer2 size={18} />
              </button>
              <button 
                title="Pan" 
                onClick={() => setActiveTool('pan')} 
                className={`p-2 hover:bg-slate-100 transition-colors ${activeTool === 'pan' ? 'bg-slate-100 text-[#3c4799]' : 'text-slate-600'}`}
              >
                <Hand size={18} />
              </button>
            </div>
            
            <button 
              title="Reset Map" 
              onClick={handleResetMap} 
              className="bg-white p-2 border border-line shadow-sm hover:bg-slate-100 text-slate-600 rounded-md transition-colors mt-auto"
            >
              <Maximize size={18} />
            </button>
          </div>
          <ComposableMap
            projection={projection}
            width={900}
            height={500}
            className="w-full h-auto max-w-[1200px]"
            style={{ width: "100%", maxHeight: "75vh" }}
          >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies
                    .filter((geo) => geo.properties.name !== "Antarctica")
                    .map((geo) => {
                      const fill = getGeoColor(geo.properties.name);
                      const regionName = getGeoRegion(geo.properties.name);
                      
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={fill}
                          stroke={activeTab === 'finance' ? fill : "#ffffff"}
                          strokeWidth={activeTab === 'finance' ? 1.5 : 0.5}
                          style={{
                            default: { outline: "none", transition: "all 0.3s ease" },
                            hover: { 
                              fill: activeTab === 'ndc' ? fill : (fill !== "#e2e8f0" || activeTab === 'finance' ? (activeTab === 'finance' ? "#8cb3cc" : "#2d3780") : "#d1d5db"), 
                              stroke: activeTab === 'finance' ? "#8cb3cc" : "#ffffff",
                              outline: "none" 
                            },
                            pressed: { outline: "none" },
                          }}
                          onMouseEnter={() => {
                            if (activeTab === 'finance' && regionName) {
                              setHoveredRegion(regionName);
                            } else if (activeTab === 'champ') {
                              setHoveredCountry({ name: geo.properties.name, stat: champCountries.has(normalizeName(geo.properties.name)) || champCountries.has(geo.properties.name) ? "Endorsed" : "Not Endorsed" });
                            } else if (activeTab === 'ndc') {
                              const category = ndcCategories[normalizeName(geo.properties.name)] || ndcCategories[geo.properties.name] || 'None';
                              const categoryLabels: Record<string, string> = {
                                "A+": "A+ (Strong + Means of Implementation)",
                                "A-B": "A / B+ (Strong / Moderate)",
                                "C": "C+ / C (Low Content)",
                                "None": "No Data / No Content"
                              };
                              setHoveredCountry({ name: geo.properties.name, stat: categoryLabels[category] });
                            }
                          }}
                          onMouseLeave={() => {
                            if (activeTab === 'finance') {
                              setHoveredRegion(null);
                            } else {
                              setHoveredCountry(null);
                            }
                          }}
                        />
                      );
                    })
                }
              </Geographies>
          </ComposableMap>

          {/* Dynamic Tooltip for CHAMP and NDC Maps */}
          <AnimatePresence>
            {(activeTab === 'champ' || activeTab === 'ndc') && hoveredCountry && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute z-50 pointer-events-none bg-surface border border-line shadow-2xl p-4 max-w-[250px]"
                style={{
                  ...(containerSize.width && (tooltipPos.x + 280 > containerSize.width)
                    ? { right: containerSize.width - tooltipPos.x + 15 }
                    : { left: tooltipPos.x + 15 }),
                  ...(containerSize.height && (tooltipPos.y + 120 > containerSize.height)
                    ? { bottom: containerSize.height - tooltipPos.y + 15 }
                    : { top: tooltipPos.y + 15 })
                }}
              >
                <div className="text-[12px] uppercase tracking-widest font-bold text-ink mb-2 border-b border-line pb-2">
                  {hoveredCountry.name}
                </div>
                <div>
                  <span className="text-[11px] text-ink-muted block uppercase tracking-wider mb-1">
                    {activeTab === 'champ' ? 'CHAMP Status' : 'Urban Content Rating'}
                  </span>
                  <span className={`font-semibold text-sm ${activeTab === 'champ' && hoveredCountry.stat === 'Endorsed' ? 'text-accent' : 'text-ink'}`}>
                    {hoveredCountry.stat}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dynamic Tooltip for Finance Map */}
          <AnimatePresence>
            {activeTab === 'finance' && hoveredRegion && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute z-50 pointer-events-none bg-surface border border-line shadow-2xl p-4 max-w-[200px]"
                style={{
                  ...(containerSize.width && (tooltipPos.x + 230 > containerSize.width)
                    ? { right: containerSize.width - tooltipPos.x + 15 }
                    : { left: tooltipPos.x + 15 }),
                  ...(containerSize.height && (tooltipPos.y + 150 > containerSize.height)
                    ? { bottom: containerSize.height - tooltipPos.y + 15 }
                    : { top: tooltipPos.y + 15 })
                }}
              >
                <div className="text-[10px] uppercase tracking-widest font-bold text-ink-muted mb-2 border-b border-line pb-2">
                  {hoveredRegion}
                </div>
                <div className="space-y-2">
                   <div>
                     <span className="text-[11px] text-ink-muted block uppercase tracking-wider">Mitigation Needs</span>
                     <span className="font-heading font-medium text-ink text-lg text-[#8cb3cc]">${financeRegionsInfo[hoveredRegion as keyof typeof financeRegionsInfo]?.mitigation}</span>
                   </div>
                   <div>
                     <span className="text-[11px] text-ink-muted block uppercase tracking-wider">Total Flows</span>
                     <span className="font-heading font-medium text-ink text-lg text-[#2d3780]">${financeRegionsInfo[hoveredRegion as keyof typeof financeRegionsInfo]?.total}</span>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-6 left-6 shadow-xl w-[240px] z-40 bg-transparent flex flex-col">
             <button 
               className="w-full flex items-center justify-between p-4 bg-surface border border-line hover:bg-slate-50 transition-colors shadow-sm"
               onClick={() => setIsLegendOpen(!isLegendOpen)}
             >
               <h4 className="text-[11px] uppercase tracking-widest font-bold text-ink text-left">
                  {activeTab === 'champ' ? 'CHAMP Commitments' : activeTab === 'ndc' ? 'Urban Content in NDCs' : 'Financing Needs & Flows'}
               </h4>
               {isLegendOpen ? <ChevronDown className="w-4 h-4 text-ink-muted ml-4" /> : <ChevronUp className="w-4 h-4 text-ink-muted ml-4" />}
             </button>
             
             <AnimatePresence>
                {isLegendOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-surface border-x border-b border-line shadow-xl"
                  >
                    <div className="p-5 pt-4 space-y-3">
                      {activeTab === 'champ' && (
                        <>
                          <div className="flex items-center gap-3">
                             <div className="w-3 h-3 bg-[#3c4799]"></div>
                             <span className="text-[13px] text-ink-muted">CHAMP Endorsing Country</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-3 h-3 bg-[#e2e8f0] border border-slate-300"></div>
                             <span className="text-[13px] text-ink-muted">Not Endorsed</span>
                          </div>
                        </>
                      )}
                      
                      {activeTab === 'ndc' && (
                        <>
                          <div className="flex items-center gap-3">
                             <div className="w-3 h-3 bg-[#3c4799]"></div>
                             <span className="text-[13px] text-ink-muted">A+ (Strong + Means of Implementation)</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-3 h-3 bg-[#5d8d8b]"></div>
                             <span className="text-[13px] text-ink-muted">A / B+ (Strong / Moderate)</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-3 h-3 bg-[#f0c763]"></div>
                             <span className="text-[13px] text-ink-muted">C+ / C (Low Content)</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-3 h-3 bg-[#e2e8f0] border border-slate-300"></div>
                             <span className="text-[13px] text-ink-muted">No Data / No Content</span>
                          </div>
                        </>
                      )}

                      {activeTab === 'finance' && (
                        <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto no-scrollbar pr-2">
                          {Object.entries(financeColors).map(([region, color]) => (
                            <div key={region} className="flex items-center gap-3">
                               <div className="w-3 h-3 flex-shrink-0" style={{ backgroundColor: color }}></div>
                               <span className="text-[11px] text-ink-muted font-medium truncate">{region}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
