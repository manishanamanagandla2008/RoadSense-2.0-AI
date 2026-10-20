import { RoadHazard, RoadSegment, RouteOption, WorkOrder, DetectedBoundingBox } from '../types/roadsense.js';

export const INITIAL_HAZARDS: RoadHazard[] = [
  {
    id: 'HAZ-2026-081',
    type: 'pothole',
    title: 'Severe Rim-Damaging Pothole Cluster',
    severity: 'critical',
    confidence: 97,
    latitude: 37.7858,
    longitude: -122.4065,
    roadName: 'Market Street & 4th Ave',
    region: 'Downtown Metro',
    reportedAt: '12 mins ago',
    depthCm: 7.8,
    status: 'dispatched',
    upvotes: 42,
  },
  {
    id: 'HAZ-2026-082',
    type: 'waterlogging',
    title: 'Hydroplane Hazard - Deep Surface Ponding',
    severity: 'high',
    confidence: 94,
    latitude: 37.7602,
    longitude: -122.4194,
    roadName: 'Mission Boulevard (Southbound)',
    region: 'Mission Corridor',
    reportedAt: '28 mins ago',
    depthCm: 5.2,
    status: 'active',
    upvotes: 19,
  },
  {
    id: 'HAZ-2026-083',
    type: 'crack',
    title: 'Transverse Fatigue Fissure (>15mm)',
    severity: 'moderate',
    confidence: 91,
    latitude: 37.8044,
    longitude: -122.2712,
    roadName: 'Interstate 880 (Lane 2)',
    region: 'East Bay Express',
    reportedAt: '1 hour ago',
    widthMm: 18,
    status: 'investigating',
    upvotes: 8,
  },
  {
    id: 'HAZ-2026-084',
    type: 'debris',
    title: 'Loose Gravel & Tire Tread in Left Shoulder',
    severity: 'moderate',
    confidence: 89,
    latitude: 37.6624,
    longitude: -122.4082,
    roadName: 'Highway 101 Northbound MP 14',
    region: 'Peninsula Corridor',
    reportedAt: '45 mins ago',
    status: 'active',
    upvotes: 14,
  },
  {
    id: 'HAZ-2026-085',
    type: 'cave_in',
    title: 'Sub-base Subsidence / Storm Drain Edge Drop',
    severity: 'critical',
    confidence: 98,
    latitude: 37.3278,
    longitude: -121.9056,
    roadName: 'Interstate 280 Interchange',
    region: 'South Valley',
    reportedAt: '2 hours ago',
    depthCm: 11.4,
    status: 'dispatched',
    upvotes: 67,
  },
  {
    id: 'HAZ-2026-086',
    type: 'accident_hotspot',
    title: 'Blind Turn Friction Deficit Zone',
    severity: 'high',
    confidence: 95,
    latitude: 37.5021,
    longitude: -122.4789,
    roadName: 'Pacific Coast Highway 1',
    region: 'Coastal Route',
    reportedAt: '3 hours ago',
    status: 'active',
    upvotes: 31,
  }
];

export const ROAD_SEGMENTS: RoadSegment[] = [
  {
    id: 'SEG-101-N',
    name: 'Hwy 101 Airport Bypass',
    region: 'Peninsula',
    coordinates: [
      [37.6400, -122.4000],
      [37.6624, -122.4082],
      [37.6850, -122.4150],
      [37.7100, -122.4050]
    ],
    healthScore: 89,
    iri: 1.4,
    trafficVolume: 'extreme',
    speedLimit: 65,
    activeHazardsCount: 1,
    surfaceType: 'Concrete',
    lastPaved: 'June 2025'
  },
  {
    id: 'SEG-MKT-DT',
    name: 'Market Street Commercial Strip',
    region: 'Downtown Metro',
    coordinates: [
      [37.7750, -122.4180],
      [37.7858, -122.4065],
      [37.7940, -122.3950]
    ],
    healthScore: 41, // Critical
    iri: 4.8,
    trafficVolume: 'high',
    speedLimit: 25,
    activeHazardsCount: 4,
    surfaceType: 'Asphalt',
    lastPaved: 'October 2018'
  },
  {
    id: 'SEG-880-EB',
    name: 'I-880 Port Freight Corridor',
    region: 'East Bay',
    coordinates: [
      [37.7800, -122.2500],
      [37.8044, -122.2712],
      [37.8300, -122.2900]
    ],
    healthScore: 62, // Moderate
    iri: 2.9,
    trafficVolume: 'extreme',
    speedLimit: 55,
    activeHazardsCount: 2,
    surfaceType: 'Bituminous Overlay',
    lastPaved: 'March 2021'
  },
  {
    id: 'SEG-280-SV',
    name: 'I-280 Silicon Valley Expressway',
    region: 'South Valley',
    coordinates: [
      [37.3100, -121.8900],
      [37.3278, -121.9056],
      [37.3500, -121.9300]
    ],
    healthScore: 78,
    iri: 2.1,
    trafficVolume: 'high',
    speedLimit: 65,
    activeHazardsCount: 1,
    surfaceType: 'Asphalt',
    lastPaved: 'August 2023'
  },
  {
    id: 'SEG-PCH-CS',
    name: 'Route 1 Coastal Scenic Pass',
    region: 'Coastal',
    coordinates: [
      [37.4700, -122.4500],
      [37.5021, -122.4789],
      [37.5400, -122.5000]
    ],
    healthScore: 54,
    iri: 3.5,
    trafficVolume: 'medium',
    speedLimit: 45,
    activeHazardsCount: 2,
    surfaceType: 'Asphalt',
    lastPaved: 'September 2020'
  }
];

export const ROUTE_OPTIONS: RouteOption[] = [
  {
    id: 'route-safest',
    name: 'RoadSense AI SafeRoute™ (Optimized)',
    tag: 'Recommended (Safest)',
    durationMinutes: 24,
    distanceKm: 18.6,
    safetyScore: 96,
    potholesEnRoute: 0,
    waterloggedSections: 0,
    roughnessAvgIri: 1.3,
    description: 'Routes via recently resurfaced Hwy 101 & Embarcadero arterial, bypassing the active 7.8cm pothole cluster on Market St and high-water pooling on Mission Blvd.',
    turnSteps: [
      { instruction: 'Depart via Hwy 101 North corridor', roadCondition: 'Smooth', tip: 'Newly diamond-ground concrete, IRI 1.2 m/km' },
      { instruction: 'Keep right at Exit 433B toward The Embarcadero', roadCondition: 'Smooth', tip: 'Smooth pavement, zero reported anomalies' },
      { instruction: 'Merge onto 3rd Street bypass', roadCondition: 'Fair', tip: 'Minor expansion joints, clear lane markings' },
      { instruction: 'Arrive at Financial District Destination safely', roadCondition: 'Smooth' }
    ]
  },
  {
    id: 'route-fastest',
    name: 'Standard Navigation (Shortest Distance)',
    tag: 'Fastest (Higher Hazard)',
    durationMinutes: 21,
    distanceKm: 16.2,
    safetyScore: 61,
    potholesEnRoute: 5,
    waterloggedSections: 2,
    roughnessAvgIri: 4.2,
    description: 'Cuts directly through Market St and Mission Blvd. Saves ~3 minutes, but exposes your vehicle to 5 severe potholes (up to 7.8cm depth) and hydroplane hazards.',
    turnSteps: [
      { instruction: 'Proceed onto Mission Blvd Southbound', roadCondition: 'Hazardous', tip: '⚠️ Standing water 5.2cm depth, hydroplane risk' },
      { instruction: 'Turn left onto Market Street & 4th Ave', roadCondition: 'Hazardous', tip: '⚠️ Severe pothole cluster, multiple tire rim damage reports' },
      { instruction: 'Continue on 4th Ave across transit tracks', roadCondition: 'Caution', tip: 'High vibration, uneven asphalt transitions' },
      { instruction: 'Arrive at Destination (Suspension strain high)', roadCondition: 'Caution' }
    ]
  }
];

export const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'WO-2026-104',
    hazardId: 'HAZ-2026-081',
    title: 'Emergency Hot-Mix Cold-Pour Asphalt Infill',
    location: 'Market Street & 4th Ave',
    priority: 'Immediate',
    estimatedCostUsd: 1450,
    assignedCrew: 'Metro Rapid Pavement Unit 3',
    status: 'In Progress',
    targetDate: 'Today, 18:00'
  },
  {
    id: 'WO-2026-105',
    hazardId: 'HAZ-2026-085',
    title: 'Sub-base Stabilization & Catch-basin Re-levelling',
    location: 'I-280 Interchange Milepost 3.2',
    priority: 'Immediate',
    estimatedCostUsd: 4800,
    assignedCrew: 'State DOT Heavy Highway Crew',
    status: 'Scheduled',
    targetDate: 'Tomorrow, 06:00'
  },
  {
    id: 'WO-2026-106',
    hazardId: 'HAZ-2026-082',
    title: 'Storm Grate Clearing & Hydrovac De-silting',
    location: 'Mission Boulevard (Southbound)',
    priority: 'High',
    estimatedCostUsd: 850,
    assignedCrew: 'Stormwater Infrastructure Team',
    status: 'Pending Review',
    targetDate: 'Oct 22, 2026'
  },
  {
    id: 'WO-2026-107',
    hazardId: 'HAZ-2026-083',
    title: 'Crack Sealant Injection & Rubberized Asphalt Fill',
    location: 'I-880 East Bay Corridor',
    priority: 'Medium',
    estimatedCostUsd: 2200,
    assignedCrew: 'District 4 Maintenance',
    status: 'Scheduled',
    targetDate: 'Oct 25, 2026'
  }
];

export interface InspectionPreset {
  id: string;
  name: string;
  category: string;
  image: string;
  pavementQualityScore: number;
  iriEstimated: number;
  vibrationImpactG: number;
  recommendedSpeedMph: number;
  detectedBoxes: DetectedBoundingBox[];
}

export const INSPECTION_PRESETS: InspectionPreset[] = [
  {
    id: 'urban-potholes',
    name: 'Urban Arterial · Severe Pothole Cluster',
    category: 'City Street / High Traffic',
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80',
    pavementQualityScore: 36,
    iriEstimated: 4.6,
    vibrationImpactG: 2.4,
    recommendedSpeedMph: 15,
    detectedBoxes: [
      {
        id: 'box-1',
        label: 'Severe Pothole',
        category: 'pothole',
        severity: 'critical',
        confidence: 98,
        x: 38,
        y: 62,
        width: 24,
        height: 20,
        dimensions: 'Depth: 7.2cm · Dia: 48cm'
      },
      {
        id: 'box-2',
        label: 'Alligator Cracking',
        category: 'crack',
        severity: 'high',
        confidence: 92,
        x: 18,
        y: 50,
        width: 22,
        height: 18,
        dimensions: 'Network: 1.2m²'
      },
      {
        id: 'box-3',
        label: 'Surface Ravelling',
        category: 'crack',
        severity: 'moderate',
        confidence: 88,
        x: 64,
        y: 58,
        width: 19,
        height: 15,
        dimensions: 'Aggregate loss'
      }
    ]
  },
  {
    id: 'rainy-highway',
    name: 'Highway Storm · Waterlogging & Low Friction',
    category: 'Expressway / Inclement Weather',
    image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1200&q=80',
    pavementQualityScore: 52,
    iriEstimated: 3.1,
    vibrationImpactG: 1.1,
    recommendedSpeedMph: 45,
    detectedBoxes: [
      {
        id: 'box-4',
        label: 'Hydroplane Hazard Zone',
        category: 'waterlogging',
        severity: 'critical',
        confidence: 96,
        x: 28,
        y: 65,
        width: 44,
        height: 25,
        dimensions: 'Water depth: ~5.5cm'
      },
      {
        id: 'box-5',
        label: 'Faded Lane Delineation',
        category: 'marking',
        severity: 'high',
        confidence: 89,
        x: 12,
        y: 55,
        width: 16,
        height: 35,
        dimensions: 'Reflectivity: Low (<80 mcd)'
      }
    ]
  },
  {
    id: 'night-express',
    name: 'Night Expressway · Structural Joint Gap',
    category: 'Overpass / Bridge Deck',
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
    pavementQualityScore: 71,
    iriEstimated: 2.3,
    vibrationImpactG: 1.6,
    recommendedSpeedMph: 55,
    detectedBoxes: [
      {
        id: 'box-6',
        label: 'Bridge Expansion Joint Defect',
        category: 'debris',
        severity: 'moderate',
        confidence: 94,
        x: 42,
        y: 68,
        width: 26,
        height: 14,
        dimensions: 'Gap width: 34mm'
      }
    ]
  },
  {
    id: 'smooth-corridor',
    name: 'Resurfaced Smart Corridor · Benchmark Grade',
    category: 'Smart City Pilot / Resurfaced',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    pavementQualityScore: 94,
    iriEstimated: 0.9,
    vibrationImpactG: 0.2,
    recommendedSpeedMph: 65,
    detectedBoxes: [
      {
        id: 'box-7',
        label: 'Verified Pavement Baseline',
        category: 'marking',
        severity: 'low',
        confidence: 99,
        x: 32,
        y: 52,
        width: 36,
        height: 40,
        dimensions: 'Zero distress detected'
      }
    ]
  }
];
