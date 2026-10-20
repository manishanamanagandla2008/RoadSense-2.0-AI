export type NavView = 'vision' | 'map' | 'routes' | 'hud' | 'municipal' | 'advisor';

export interface RoadHazard {
  id: string;
  type: 'pothole' | 'crack' | 'waterlogging' | 'debris' | 'accident_hotspot' | 'cave_in';
  title: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  confidence: number; // 0 - 100%
  latitude: number;
  longitude: number;
  roadName: string;
  region: string;
  reportedAt: string;
  depthCm?: number;
  widthMm?: number;
  status: 'active' | 'investigating' | 'dispatched' | 'repaired';
  photoUrl?: string;
  upvotes?: number;
}

export interface RoadSegment {
  id: string;
  name: string;
  region: string;
  coordinates: [number, number][]; // Polyline coordinates
  healthScore: number; // 0 - 100 (100 = brand new pavement)
  iri: number; // International Roughness Index (m/km)
  trafficVolume: 'low' | 'medium' | 'high' | 'extreme';
  speedLimit: number;
  activeHazardsCount: number;
  surfaceType: 'Asphalt' | 'Concrete' | 'Bituminous Overlay';
  lastPaved: string;
}

export interface DetectedBoundingBox {
  id: string;
  label: string;
  category: 'pothole' | 'crack' | 'waterlogging' | 'debris' | 'marking';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  confidence: number;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  width: number; // percentage
  height: number; // percentage
  dimensions?: string;
}

export interface RouteOption {
  id: string;
  name: string;
  tag: 'Recommended (Safest)' | 'Fastest (Higher Hazard)';
  durationMinutes: number;
  distanceKm: number;
  safetyScore: number; // 0 - 100
  potholesEnRoute: number;
  waterloggedSections: number;
  roughnessAvgIri: number;
  description: string;
  turnSteps: Array<{
    instruction: string;
    roadCondition: 'Smooth' | 'Fair' | 'Caution' | 'Hazardous';
    tip?: string;
  }>;
}

export interface WorkOrder {
  id: string;
  hazardId: string;
  title: string;
  location: string;
  priority: 'Immediate' | 'High' | 'Medium' | 'Routine';
  estimatedCostUsd: number;
  assignedCrew: string;
  status: 'Pending Review' | 'Scheduled' | 'In Progress' | 'Completed';
  targetDate: string;
}

export interface TelemetryReading {
  speedMph: number;
  gForceZ: number; // vertical vibration
  roadQualityIndex: number;
  weatherRisk: 'Low' | 'Moderate' | 'Severe';
  nearestHazardDistanceMeters: number | null;
  nearestHazardName: string | null;
}
