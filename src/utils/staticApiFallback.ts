/**
 * RoadSense AI - Static & Offline API Fallback Engine
 * Provides complete in-browser persistence and analytics for GitHub Pages
 * and static hosting environments where an Express backend cannot run.
 */

import { AccidentRecord, DashboardSummary, AnalyticsTrends, StatisticalSummary, LocationStats, VehicleStats, SeverityStats, MapData, DataQualityReport } from '../types.js';

interface StoredLocation {
  location_id: number;
  region: string;
  road_name: string | null;
  latitude: number | null;
  longitude: number | null;
}

interface StoredAccident {
  accident_id: number;
  source_record_id: string;
  accident_datetime: string | null;
  location_id: number | null;
  vehicle_type: string | null;
  severity: string | null;
  weather: string | null;
  source_name: string;
  imported_at: string;
}

const STORAGE_KEY_ACCIDENTS = 'roadsense_accidents_v1';
const STORAGE_KEY_LOCATIONS = 'roadsense_locations_v1';
const STORAGE_KEY_HISTORY = 'roadsense_history_v1';

const INITIAL_LOCATIONS: StoredLocation[] = [
  { location_id: 1, region: 'Downtown Metro', road_name: 'Market Street & 4th Ave', latitude: 37.7858, longitude: -122.4065 },
  { location_id: 2, region: 'Downtown Metro', road_name: 'Mission Boulevard', latitude: 37.7602, longitude: -122.4194 },
  { location_id: 3, region: 'Downtown Metro', road_name: 'Van Ness Expressway', latitude: 37.7812, longitude: -122.4215 },
  { location_id: 4, region: 'Downtown Metro', road_name: 'Broadway Tunnel Corridor', latitude: 37.7961, longitude: -122.4124 },
  { location_id: 5, region: 'East Bay Hub', road_name: 'Interstate 880 Southbound', latitude: 37.8044, longitude: -122.2712 },
  { location_id: 6, region: 'East Bay Hub', road_name: 'Grand Avenue Junction', latitude: 37.8115, longitude: -122.2598 },
  { location_id: 7, region: 'East Bay Hub', road_name: 'Telegraph Avenue', latitude: 37.8421, longitude: -122.2611 },
  { location_id: 8, region: 'East Bay Hub', road_name: 'San Pablo Corridor', latitude: 37.8512, longitude: -122.2854 },
  { location_id: 9, region: 'North Peninsula', road_name: 'Highway 101 Northbound MP 14', latitude: 37.6624, longitude: -122.4082 },
  { location_id: 10, region: 'North Peninsula', road_name: 'El Camino Real', latitude: 37.6534, longitude: -122.4231 },
  { location_id: 11, region: 'North Peninsula', road_name: 'Skyline Boulevard (Hwy 35)', latitude: 37.6189, longitude: -122.4645 },
  { location_id: 12, region: 'South Valley', road_name: 'Capital Expressway', latitude: 37.3125, longitude: -121.8214 },
  { location_id: 13, region: 'South Valley', road_name: 'Interstate 280 Interchange', latitude: 37.3278, longitude: -121.9056 },
  { location_id: 14, region: 'South Valley', road_name: 'Stevens Creek Boulevard', latitude: 37.3235, longitude: -122.0321 },
  { location_id: 15, region: 'Coastal Sector', road_name: 'Pacific Coast Highway 1', latitude: 37.5021, longitude: -122.4789 },
  { location_id: 16, region: 'North Peninsula', road_name: 'Airport Perimeter Loop', latitude: null, longitude: null },
  { location_id: 17, region: 'East Bay Hub', road_name: 'Port Terminal Access Way', latitude: null, longitude: null },
  { location_id: 18, region: 'South Valley', road_name: 'Industrial Park Connector', latitude: null, longitude: null },
  { location_id: 19, region: 'Coastal Sector', road_name: 'Ocean Shore Route (Unmapped)', latitude: null, longitude: null },
];

function generateSeedAccidents(): StoredAccident[] {
  const vehicleTypes = ['Passenger Car', 'Passenger Car', 'SUV', 'SUV', 'Pickup Truck', 'Commercial Truck', 'Motorcycle', 'Transit Bus', 'Bicycle', 'Light Van'];
  const severities = ['Property Damage Only', 'Property Damage Only', 'Minor Injury', 'Minor Injury', 'Serious Injury', 'Fatal'];
  const weatherConditions = ['Clear', 'Clear', 'Clear', 'Rain', 'Rain', 'Fog / Mist', 'Overcast', 'Snow / Sleet', null];
  const now = new Date('2026-10-18T20:00:00Z');
  const accidents: StoredAccident[] = [];

  for (let i = 1; i <= 140; i++) {
    const locId = (i % INITIAL_LOCATIONS.length) + 1;
    const dayOffset = Math.floor((i * 19) % 270);
    let hour = (i * 7) % 24;
    if (i % 3 === 0) hour = 17 + (i % 3);
    else if (i % 4 === 0) hour = 7 + (i % 3);
    const minute = (i * 13) % 60;

    const recordDate = new Date(now.getTime() - dayOffset * 86400000);
    recordDate.setUTCHours(hour, minute, 0, 0);
    const dateStr = recordDate.toISOString().replace('T', ' ').substring(0, 19);

    const vehicle = (i === 12) ? null : vehicleTypes[i % vehicleTypes.length];
    const severity = (i === 45) ? null : severities[i % severities.length];
    const weather = weatherConditions[i % weatherConditions.length];

    accidents.push({
      accident_id: i,
      source_record_id: `DEMO-2026-${String(i).padStart(4, '0')}`,
      accident_datetime: dateStr,
      location_id: locId,
      vehicle_type: vehicle,
      severity: severity,
      weather: weather,
      source_name: 'Metro Road Safety Dept (Demonstration)',
      imported_at: new Date(now.getTime() - (300 - i) * 60000).toISOString()
    });
  }
  return accidents;
}

class ClientDatabase {
  private accidents: StoredAccident[] = [];
  private locations: StoredLocation[] = [];
  private history: any[] = [];

  constructor() {
    this.load();
  }

  public resetToBenchmark() {
    this.locations = [...INITIAL_LOCATIONS];
    this.accidents = generateSeedAccidents();
    this.history = [{
      import_id: 1,
      source_id: 1,
      filename: 'synthetic_metro_safety_benchmark_2026.csv',
      total_rows: 142,
      successful_rows: 140,
      rejected_rows: 2,
      duplicate_rows: 0,
      missing_value_rows: 16,
      validation_status: 'COMPLETED',
      imported_at: new Date().toISOString()
    }];
    this.save();
  }

  private load() {
    try {
      const storedAcc = localStorage.getItem(STORAGE_KEY_ACCIDENTS);
      const storedLoc = localStorage.getItem(STORAGE_KEY_LOCATIONS);
      const storedHist = localStorage.getItem(STORAGE_KEY_HISTORY);

      if (storedAcc && storedLoc) {
        this.accidents = JSON.parse(storedAcc);
        this.locations = JSON.parse(storedLoc);
        this.history = storedHist ? JSON.parse(storedHist) : [];
      } else {
        this.resetToBenchmark();
      }
    } catch {
      this.resetToBenchmark();
    }
  }

  public save() {
    try {
      localStorage.setItem(STORAGE_KEY_ACCIDENTS, JSON.stringify(this.accidents));
      localStorage.setItem(STORAGE_KEY_LOCATIONS, JSON.stringify(this.locations));
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(this.history));
    } catch (e) {
      console.warn('localStorage save failed:', e);
    }
  }

  public getJoinedAccidents(filters: Record<string, string> = {}): AccidentRecord[] {
    const locMap = new Map<number, StoredLocation>();
    for (const l of this.locations) {
      locMap.set(l.location_id, l);
    }

    let list = this.accidents.map(a => {
      const loc = a.location_id ? locMap.get(a.location_id) : undefined;
      return {
        accident_id: a.accident_id,
        source_record_id: a.source_record_id,
        accident_datetime: a.accident_datetime,
        location_id: a.location_id,
        region: loc?.region || null,
        road_name: loc?.road_name || null,
        latitude: loc?.latitude ?? null,
        longitude: loc?.longitude ?? null,
        vehicle_type: a.vehicle_type,
        severity: a.severity,
        weather: a.weather,
        source_name: a.source_name,
        imported_at: a.imported_at,
      };
    });

    if (filters.startDate) {
      list = list.filter(a => a.accident_datetime && a.accident_datetime >= filters.startDate);
    }
    if (filters.endDate) {
      list = list.filter(a => a.accident_datetime && a.accident_datetime <= filters.endDate);
    }
    if (filters.region) {
      list = list.filter(a => a.region === filters.region);
    }
    if (filters.roadName) {
      list = list.filter(a => a.road_name && a.road_name.toLowerCase().includes(filters.roadName.toLowerCase()));
    }
    if (filters.vehicleType) {
      list = list.filter(a => a.vehicle_type === filters.vehicleType);
    }
    if (filters.severity) {
      list = list.filter(a => a.severity === filters.severity);
    }
    if (filters.weather) {
      list = list.filter(a => a.weather === filters.weather);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(a =>
        (a.source_record_id && a.source_record_id.toLowerCase().includes(q)) ||
        (a.region && a.region.toLowerCase().includes(q)) ||
        (a.road_name && a.road_name.toLowerCase().includes(q)) ||
        (a.vehicle_type && a.vehicle_type.toLowerCase().includes(q)) ||
        (a.severity && a.severity.toLowerCase().includes(q))
      );
    }

    return list;
  }

  public getDashboard(filters: Record<string, string> = {}): DashboardSummary {
    const list = this.getJoinedAccidents(filters);
    const totalAccidents = list.length;

    // Monthly trends
    const monthCounts: Record<string, number> = {};
    for (const a of list) {
      if (a.accident_datetime) {
        const m = a.accident_datetime.substring(0, 7);
        monthCounts[m] = (monthCounts[m] || 0) + 1;
      }
    }
    const monthlyTrends = Object.entries(monthCounts)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Severities
    const sevCounts: Record<string, number> = {};
    for (const a of list) {
      const s = a.severity || 'Not Recorded';
      sevCounts[s] = (sevCounts[s] || 0) + 1;
    }
    const severityDistribution = Object.entries(sevCounts)
      .map(([severity, count]) => ({ severity, count }))
      .sort((a, b) => b.count - a.count);

    // Vehicles
    const vehCounts: Record<string, number> = {};
    for (const a of list) {
      const v = a.vehicle_type || 'Unknown';
      vehCounts[v] = (vehCounts[v] || 0) + 1;
    }
    const vehicleDistribution = Object.entries(vehCounts)
      .map(([vehicle_type, count]) => ({ vehicle_type, count }))
      .sort((a, b) => b.count - a.count);

    // Regions
    const regCounts: Record<string, number> = {};
    for (const a of list) {
      const r = a.region || 'Unspecified';
      regCounts[r] = (regCounts[r] || 0) + 1;
    }
    const topRegions = Object.entries(regCounts)
      .map(([region, count]) => ({ region, count }))
      .sort((a, b) => b.count - a.count);

    // Weather
    const weaCounts: Record<string, number> = {};
    for (const a of list) {
      const w = a.weather || 'Missing Weather Data';
      weaCounts[w] = (weaCounts[w] || 0) + 1;
    }
    const weatherSummary = Object.entries(weaCounts)
      .map(([weather, count]) => ({ weather, count }))
      .sort((a, b) => b.count - a.count);

    const distinctLocations = new Set(list.map(a => a.region).filter(Boolean)).size;

    return {
      totalAccidents,
      accidentsToday: 0,
      accidentsThisMonth: list.filter(a => a.accident_datetime && a.accident_datetime.startsWith('2026-10')).length,
      locationsRepresented: distinctLocations,
      mostFrequentVehicle: vehicleDistribution[0]?.vehicle_type || 'N/A',
      mostFrequentSeverity: severityDistribution[0]?.severity || 'N/A',
      monthlyTrends,
      severityDistribution,
      vehicleDistribution,
      topRegions,
      weatherSummary,
      lastUpdated: new Date().toISOString()
    };
  }

  public getTrends(filters: Record<string, string> = {}): AnalyticsTrends {
    const list = this.getJoinedAccidents(filters);
    const hourlyCounts: Record<number, number> = {};
    const weekdayCounts: Record<number, number> = {};
    const monthlyCounts: Record<string, number> = {};
    const dailyCounts: Record<string, number> = {};
    let weekdayTotal = 0;
    let weekendTotal = 0;

    for (let h = 0; h < 24; h++) hourlyCounts[h] = 0;
    for (let d = 0; d < 7; d++) weekdayCounts[d] = 0;

    for (const a of list) {
      if (a.accident_datetime) {
        const dt = new Date(a.accident_datetime.replace(' ', 'T') + 'Z');
        if (!isNaN(dt.getTime())) {
          const h = dt.getUTCHours();
          const dayOfWeek = dt.getUTCDay();
          const m = a.accident_datetime.substring(0, 7);
          const dateOnly = a.accident_datetime.substring(0, 10);

          hourlyCounts[h] = (hourlyCounts[h] || 0) + 1;
          weekdayCounts[dayOfWeek] = (weekdayCounts[dayOfWeek] || 0) + 1;
          monthlyCounts[m] = (monthlyCounts[m] || 0) + 1;
          dailyCounts[dateOnly] = (dailyCounts[dateOnly] || 0) + 1;

          if (dayOfWeek === 0 || dayOfWeek === 6) {
            weekendTotal++;
          } else {
            weekdayTotal++;
          }
        }
      }
    }

    return {
      hourly: Object.entries(hourlyCounts).map(([h, c]) => ({ hour: Number(h), count: c })),
      weekday: Object.entries(weekdayCounts).map(([w, c]) => ({ weekday: Number(w), count: c })),
      monthly: Object.entries(monthlyCounts).map(([m, c]) => ({ month: m, count: c })).sort((a, b) => a.month.localeCompare(b.month)),
      daily: Object.entries(dailyCounts).map(([day, c]) => ({ day, count: c })).sort((a, b) => a.day.localeCompare(b.day)).slice(-30),
      weekdayVsWeekend: { weekday: weekdayTotal, weekend: weekendTotal }
    };
  }

  public getStatistics(filters: Record<string, string> = {}): StatisticalSummary {
    const list = this.getJoinedAccidents(filters);
    const dailyMap: Record<string, number> = {};
    for (const a of list) {
      if (a.accident_datetime) {
        const d = a.accident_datetime.substring(0, 10);
        dailyMap[d] = (dailyMap[d] || 0) + 1;
      }
    }

    const counts = Object.values(dailyMap);
    if (counts.length === 0) {
      return { sampleSizeDays: 0, meanDaily: 0, medianDaily: 0, minDaily: 0, maxDaily: 0, stdDev: 0, notes: 'No data' };
    }

    counts.sort((a, b) => a - b);
    const sum = counts.reduce((acc, v) => acc + v, 0);
    const mean = sum / counts.length;
    const mid = Math.floor(counts.length / 2);
    const median = counts.length % 2 !== 0 ? counts[mid] : (counts[mid - 1] + counts[mid]) / 2;
    const min = counts[0];
    const max = counts[counts.length - 1];
    const variance = counts.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / counts.length;
    const stdDev = Math.sqrt(variance);

    return {
      sampleSizeDays: counts.length,
      totalRecordedAccidents: list.length,
      meanDaily: Number(mean.toFixed(2)),
      medianDaily: Number(median.toFixed(2)),
      minDaily: min,
      maxDaily: max,
      stdDev: Number(stdDev.toFixed(2)),
      notes: 'Sample variance reflects daily recorded crash volume.'
    };
  }

  public getLocations(filters: Record<string, string> = {}): LocationStats {
    const list = this.getJoinedAccidents(filters);
    const regionMap: Record<string, { count: number; fatal: number; serious: number }> = {};
    const roadMap: Record<string, { region: string; count: number; fatal: number }> = {};

    for (const a of list) {
      const reg = a.region || 'Unknown Region';
      if (!regionMap[reg]) regionMap[reg] = { count: 0, fatal: 0, serious: 0 };
      regionMap[reg].count++;
      if (a.severity === 'Fatal') regionMap[reg].fatal++;
      if (a.severity === 'Serious Injury') regionMap[reg].serious++;

      const road = a.road_name || 'Multiple / Unspecified Roads';
      const roadKey = `${reg}:::${road}`;
      if (!roadMap[roadKey]) roadMap[roadKey] = { region: reg, count: 0, fatal: 0 };
      roadMap[roadKey].count++;
      if (a.severity === 'Fatal') roadMap[roadKey].fatal++;
    }

    const regions = Object.entries(regionMap).map(([region, stat]) => ({
      region,
      count: stat.count,
      fatal_count: stat.fatal,
      serious_count: stat.serious
    })).sort((a, b) => b.count - a.count);

    const roads = Object.entries(roadMap).map(([k, stat]) => ({
      road_name: k.split(':::')[1],
      region: stat.region,
      count: stat.count,
      fatal_count: stat.fatal
    })).sort((a, b) => b.count - a.count).slice(0, 15);

    return {
      regions,
      roads,
      disclaimer: 'Recorded accident counts indicate recorded crash events and do not establish traffic exposure or per-capita crash risk.'
    };
  }

  public getVehicles(filters: Record<string, string> = {}): VehicleStats {
    const list = this.getJoinedAccidents(filters);
    const vMap: Record<string, number> = {};
    const vsMap: Record<string, Record<string, number>> = {};

    for (const a of list) {
      const v = a.vehicle_type || 'Not Specified';
      vMap[v] = (vMap[v] || 0) + 1;
      if (!vsMap[v]) vsMap[v] = {};
      const s = a.severity || 'Unknown';
      vsMap[v][s] = (vsMap[v][s] || 0) + 1;
    }

    const vehicleSummary = Object.entries(vMap).map(([vehicle_type, count]) => ({ vehicle_type, count })).sort((a, b) => b.count - a.count);
    const vehicleBySeverity: Array<{ vehicle_type: string; severity: string; count: number }> = [];
    for (const [veh, sevs] of Object.entries(vsMap)) {
      for (const [sev, count] of Object.entries(sevs)) {
        vehicleBySeverity.push({ vehicle_type: veh, severity: sev, count });
      }
    }

    return {
      vehicleSummary,
      vehicleBySeverity,
      note: 'Vehicle breakdown illustrates types involved in reported incidents.'
    };
  }

  public getSeverity(filters: Record<string, string> = {}): SeverityStats {
    const list = this.getJoinedAccidents(filters);
    let knownCount = 0;
    let missingCount = 0;
    const distMap: Record<string, number> = {};
    const regSevMap: Record<string, Record<string, number>> = {};

    for (const a of list) {
      if (a.severity) {
        knownCount++;
        distMap[a.severity] = (distMap[a.severity] || 0) + 1;
        const r = a.region || 'Unspecified';
        if (!regSevMap[r]) regSevMap[r] = {};
        regSevMap[r][a.severity] = (regSevMap[r][a.severity] || 0) + 1;
      } else {
        missingCount++;
      }
    }

    const distribution = Object.entries(distMap).map(([severity, count]) => ({ severity, count })).sort((a, b) => b.count - a.count);
    const severityByRegion: Array<{ region: string; severity: string; count: number }> = [];
    for (const [r, sevs] of Object.entries(regSevMap)) {
      for (const [s, c] of Object.entries(sevs)) {
        severityByRegion.push({ region: r, severity: s, count: c });
      }
    }

    return {
      totalKnownSeverity: knownCount,
      missingSeverityCount: missingCount,
      distribution,
      severityByRegion,
      severityByHour: []
    };
  }

  public getMap(filters: Record<string, string> = {}): MapData {
    const list = this.getJoinedAccidents(filters);
    const mappable = list.filter(a => a.latitude !== null && a.longitude !== null);
    const unmapped = list.filter(a => a.latitude === null || a.longitude === null);

    const unmappedRegMap: Record<string, number> = {};
    for (const u of unmapped) {
      const reg = u.region || 'Unspecified Region';
      unmappedRegMap[reg] = (unmappedRegMap[reg] || 0) + 1;
    }

    const unmappedByRegion = Object.entries(unmappedRegMap).map(([region, unmapped_count]) => ({ region, unmapped_count }));
    const totalMappable = mappable.length;
    const totalUnmapped = unmapped.length;
    const coverage = list.length > 0 ? (totalMappable / list.length) * 100 : 0;

    return {
      mappable,
      unmappedByRegion,
      stats: {
        totalMappable,
        totalUnmapped,
        coordinateCoveragePct: Number(coverage.toFixed(1))
      },
      disclaimer: 'Only accidents with validated GPS coordinates are projected on the map. Unmapped regional records are tabulated separately to avoid speculative positioning.'
    };
  }

  public getDataQuality(): DataQualityReport {
    const list = this.getJoinedAccidents();
    const missingDates = list.filter(a => !a.accident_datetime).length;
    const missingLocations = list.filter(a => !a.location_id).length;
    const missingVehicles = list.filter(a => !a.vehicle_type).length;
    const missingSeverity = list.filter(a => !a.severity).length;
    const missingWeather = list.filter(a => !a.weather).length;
    const missingCoordinates = list.filter(a => a.latitude === null || a.longitude === null).length;

    const incompleteSample = list.filter(a =>
      !a.accident_datetime || !a.vehicle_type || !a.severity || !a.weather || a.latitude === null
    ).slice(0, 15);

    return {
      totalRecords: list.length,
      missingDates,
      missingLocations,
      missingVehicles,
      missingSeverity,
      missingWeather,
      missingCoordinates,
      importHistory: this.history,
      dataSources: [{
        source_id: 1,
        source_name: 'Metro Road Safety Dept (Demonstration)',
        source_type: 'CSV_BATCH',
        description: 'Curated demonstration dataset with simulated temporal patterns and quality metrics.',
        is_synthetic: 1,
        imported_at: new Date().toISOString()
      }],
      incompleteSample,
      auditedAt: new Date().toISOString()
    };
  }

  public createAccident(body: any): AccidentRecord {
    // Find or create location
    let loc = this.locations.find(l => l.region === body.region && l.road_name === body.road_name);
    if (!loc) {
      const nextLocId = this.locations.length > 0 ? Math.max(...this.locations.map(l => l.location_id)) + 1 : 1;
      loc = {
        location_id: nextLocId,
        region: body.region || 'Downtown Metro',
        road_name: body.road_name || null,
        latitude: body.latitude ? Number(body.latitude) : null,
        longitude: body.longitude ? Number(body.longitude) : null,
      };
      this.locations.push(loc);
    }

    const nextId = this.accidents.length > 0 ? Math.max(...this.accidents.map(a => a.accident_id)) + 1 : 1;
    const newAcc: StoredAccident = {
      accident_id: nextId,
      source_record_id: body.source_record_id || `MANUAL-${Date.now().toString().slice(-4)}`,
      accident_datetime: body.accident_datetime || new Date().toISOString().replace('T', ' ').substring(0, 19),
      location_id: loc.location_id,
      vehicle_type: body.vehicle_type || null,
      severity: body.severity || null,
      weather: body.weather || null,
      source_name: body.source_name || 'Manual Ingestion',
      imported_at: new Date().toISOString()
    };

    this.accidents.unshift(newAcc);
    this.save();

    return {
      ...newAcc,
      region: loc.region,
      road_name: loc.road_name,
      latitude: loc.latitude,
      longitude: loc.longitude,
    };
  }

  public updateAccident(id: number, body: any): boolean {
    const acc = this.accidents.find(a => a.accident_id === id);
    if (!acc) return false;

    if (body.vehicle_type !== undefined) acc.vehicle_type = body.vehicle_type;
    if (body.severity !== undefined) acc.severity = body.severity;
    if (body.weather !== undefined) acc.weather = body.weather;
    if (body.accident_datetime !== undefined) acc.accident_datetime = body.accident_datetime;
    if (body.source_record_id !== undefined) acc.source_record_id = body.source_record_id;

    if (body.region !== undefined || body.road_name !== undefined) {
      let loc = this.locations.find(l => l.region === body.region && l.road_name === body.road_name);
      if (!loc) {
        const nextLocId = this.locations.length > 0 ? Math.max(...this.locations.map(l => l.location_id)) + 1 : 1;
        loc = {
          location_id: nextLocId,
          region: body.region || 'Downtown Metro',
          road_name: body.road_name || null,
          latitude: body.latitude ? Number(body.latitude) : null,
          longitude: body.longitude ? Number(body.longitude) : null,
        };
        this.locations.push(loc);
      }
      acc.location_id = loc.location_id;
    }

    this.save();
    return true;
  }

  public deleteAccident(id: number): boolean {
    const idx = this.accidents.findIndex(a => a.accident_id === id);
    if (idx !== -1) {
      this.accidents.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  public clearSynthetic(): number {
    const initial = this.accidents.length;
    this.accidents = this.accidents.filter(a => !a.source_name.includes('Demonstration') && !a.source_name.includes('Synthetic'));
    const removed = initial - this.accidents.length;
    this.save();
    return removed;
  }
}

export const clientDb = new ClientDatabase();

/**
 * Global fetch interceptor:
 * Automatically serves static responses if running on GitHub Pages or if
 * the backend network request fails with 404 or connection error.
 */
const isRunningOnStaticHost = () => typeof window !== 'undefined' && (
  window.location.hostname.endsWith('github.io') ||
  window.location.protocol === 'file:'
);

export function setupStaticApiFallback(): void {
  try {
    if (typeof window === 'undefined') return;
    const originalFetch = window.fetch.bind(window);

    const safeFetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
      const urlStr = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

      if (urlStr.includes('/api/')) {
        if (isRunningOnStaticHost()) {
          return handleStaticRequest(urlStr, init);
        }
        try {
          const res = await originalFetch(input, init);
          if (res.ok) return res;
          return handleStaticRequest(urlStr, init);
        } catch {
          return handleStaticRequest(urlStr, init);
        }
      }
      return originalFetch(input, init);
    };

    try {
      window.fetch = safeFetch;
    } catch {
      try {
        Object.defineProperty(window, 'fetch', {
          value: safeFetch,
          writable: true,
          configurable: true,
        });
      } catch (e) {
        console.warn('Unable to intercept window.fetch in this environment:', e);
      }
    }
  } catch (err) {
    console.warn('Static API fallback initialization skipped:', err);
  }
}

async function handleStaticRequest(urlStr: string, init?: RequestInit): Promise<Response> {
  const parsed = new URL(urlStr, window.location.origin);
  const pathname = parsed.pathname;
  const searchParams = parsed.searchParams;
  const method = (init?.method || 'GET').toUpperCase();

  const filterObj: Record<string, string> = {};
  searchParams.forEach((v, k) => { filterObj[k] = v; });

  const makeJson = (data: any, status = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  if (pathname.endsWith('/dashboard')) {
    const data = clientDb.getDashboard(filterObj);
    return makeJson({ success: true, data });
  }

  if (pathname.endsWith('/analytics/trends')) {
    const data = clientDb.getTrends(filterObj);
    return makeJson({ success: true, data });
  }

  if (pathname.endsWith('/analytics/statistics')) {
    const data = clientDb.getStatistics(filterObj);
    return makeJson({ success: true, data });
  }

  if (pathname.endsWith('/analytics/locations')) {
    const data = clientDb.getLocations(filterObj);
    return makeJson({ success: true, data });
  }

  if (pathname.endsWith('/analytics/vehicles')) {
    const data = clientDb.getVehicles(filterObj);
    return makeJson({ success: true, data });
  }

  if (pathname.endsWith('/analytics/severity')) {
    const data = clientDb.getSeverity(filterObj);
    return makeJson({ success: true, data });
  }

  if (pathname.endsWith('/map/accidents')) {
    const data = clientDb.getMap(filterObj);
    return makeJson({ success: true, data });
  }

  if (pathname.endsWith('/data-quality')) {
    const data = clientDb.getDataQuality();
    return makeJson({ success: true, data });
  }

  if (pathname.endsWith('/reports/data')) {
    const list = clientDb.getJoinedAccidents(filterObj);
    const severities = clientDb.getSeverity(filterObj).distribution;
    const vehicles = clientDb.getVehicles(filterObj).vehicleSummary.slice(0, 8);
    const topLocations = clientDb.getLocations(filterObj).roads.slice(0, 10);
    return makeJson({
      success: true,
      report: {
        title: 'RoadSense AI Comprehensive Safety & Accident Audit',
        generatedAt: new Date().toISOString(),
        filtersApplied: filterObj,
        totalRecords: list.length,
        severities,
        vehicles,
        topLocations,
        sources: [{ source_name: 'Standard Database', count: list.length }],
        disclaimer: 'Results describe patterns in the available accident records and do not establish causation.'
      }
    });
  }

  if (pathname.endsWith('/reports/csv')) {
    const records = clientDb.getJoinedAccidents(filterObj);
    const headers = ['accident_id', 'source_record_id', 'accident_datetime', 'region', 'road_name', 'latitude', 'longitude', 'vehicle_type', 'severity', 'weather', 'source_name'];
    const rows = [headers.join(',')];
    for (const r of records) {
      rows.push([
        r.accident_id,
        `"${(r.source_record_id || '').replace(/"/g, '""')}"`,
        `"${r.accident_datetime || ''}"`,
        `"${(r.region || '').replace(/"/g, '""')}"`,
        `"${(r.road_name || '').replace(/"/g, '""')}"`,
        r.latitude ?? '',
        r.longitude ?? '',
        `"${(r.vehicle_type || '').replace(/"/g, '""')}"`,
        `"${(r.severity || '').replace(/"/g, '""')}"`,
        `"${(r.weather || '').replace(/"/g, '""')}"`,
        `"${(r.source_name || '').replace(/"/g, '""')}"`
      ].join(','));
    }
    return new Response(rows.join('\n'), {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=roadsense_export_${Date.now()}.csv`
      }
    });
  }

  if (pathname.endsWith('/system/status')) {
    const list = clientDb.getJoinedAccidents();
    return makeJson({
      success: true,
      status: 'OPERATIONAL',
      serverTime: new Date().toISOString(),
      database: isRunningOnStaticHost() ? 'In-Browser LocalStorage Database Engine (GitHub Pages)' : 'Relational SQL Database Engine',
      totalRecords: list.length,
      realtimeMode: 'Internal Database Periodic Polling (30s interval)',
      liveFeedAvailable: false,
      disclaimer: 'All metrics reflect local and synchronized database records.'
    });
  }

  if (pathname.endsWith('/sample-data/reset')) {
    clientDb.resetToBenchmark();
    return makeJson({ success: true, message: 'Demonstration dataset successfully reset to default benchmark.' });
  }

  if (pathname.endsWith('/sample-data/clear')) {
    const removed = clientDb.clearSynthetic();
    return makeJson({ success: true, message: `Removed ${removed} demonstration records.` });
  }

  // /api/accidents handling
  if (pathname.endsWith('/accidents')) {
    if (method === 'GET') {
      const records = clientDb.getJoinedAccidents(filterObj);
      const page = parseInt(filterObj.page || '1', 10);
      const limit = parseInt(filterObj.limit || '25', 10);
      const total = records.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const offset = (page - 1) * limit;
      const paginated = records.slice(offset, offset + limit);

      const distinctRegions = Array.from(new Set(records.map(r => r.region).filter(Boolean)));
      const distinctVehicles = Array.from(new Set(records.map(r => r.vehicle_type).filter(Boolean)));
      const distinctSeverities = Array.from(new Set(records.map(r => r.severity).filter(Boolean)));
      const distinctWeather = Array.from(new Set(records.map(r => r.weather).filter(Boolean)));

      return makeJson({
        success: true,
        data: paginated,
        pagination: { page, limit, total, totalPages },
        filters: {
          regions: distinctRegions,
          vehicles: distinctVehicles,
          severities: distinctSeverities,
          weather: distinctWeather,
        }
      });
    }

    if (method === 'POST') {
      let body: any = {};
      try {
        body = init?.body ? JSON.parse(init.body as string) : {};
      } catch {}
      const created = clientDb.createAccident(body);
      return makeJson({ success: true, data: created, message: 'Record created successfully' }, 201);
    }
  }

  // Match /api/accidents/:id for PUT or DELETE
  const matchId = pathname.match(/\/accidents\/(\d+)$/);
  if (matchId) {
    const id = parseInt(matchId[1], 10);
    if (method === 'DELETE') {
      const ok = clientDb.deleteAccident(id);
      return makeJson({ success: ok, message: ok ? 'Record deleted' : 'Record not found' });
    }
    if (method === 'PUT') {
      let body: any = {};
      try {
        body = init?.body ? JSON.parse(init.body as string) : {};
      } catch {}
      const ok = clientDb.updateAccident(id, body);
      return makeJson({ success: ok, message: ok ? 'Record updated' : 'Record not found' });
    }
  }

  return makeJson({ success: false, error: 'Endpoint not found' }, 404);
}
