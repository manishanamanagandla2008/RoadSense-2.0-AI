import React, { useState } from 'react';
import { INITIAL_WORK_ORDERS } from '../data/mockRoadData.js';
import { WorkOrder, RoadHazard } from '../types/roadsense.js';
import {
  Building2,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertOctagon,
  HardHat,
  TrendingDown,
  ArrowUpRight,
  Filter
} from 'lucide-react';

interface MunicipalCommandProps {
  hazards: RoadHazard[];
  onNavigateToMap: () => void;
}

export const MunicipalCommand: React.FC<MunicipalCommandProps> = ({ hazards, onNavigateToMap }) => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [notification, setNotification] = useState<string | null>(null);

  const totalBudgetRequired = workOrders.reduce((sum, wo) => sum + wo.estimatedCostUsd, 0);
  const completedOrders = workOrders.filter((wo) => wo.status === 'Completed').length;

  const handleUpdateStatus = (id: string, newStatus: WorkOrder['status']) => {
    setWorkOrders((prev) =>
      prev.map((wo) => (wo.id === id ? { ...wo, status: newStatus } : wo))
    );
    setNotification(`Work Order ${id} updated to "${newStatus}"`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleExportCsv = () => {
    const headers = ['Order ID', 'Title', 'Location', 'Priority', 'Cost (USD)', 'Assigned Crew', 'Status', 'Target Date'];
    const rows = workOrders.map((wo) => [
      wo.id,
      `"${wo.title.replace(/"/g, '""')}"`,
      `"${wo.location.replace(/"/g, '""')}"`,
      wo.priority,
      wo.estimatedCostUsd,
      `"${wo.assignedCrew.replace(/"/g, '""')}"`,
      wo.status,
      wo.targetDate
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roadsense_work_orders_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredOrders = workOrders.filter((wo) => {
    if (filterStatus === 'All') return true;
    return wo.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Headline & Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>DEPARTMENT OF TRANSPORTATION // PUBLIC WORKS CONSOLE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Citywide Pavement Maintenance & Crew Dispatch
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Automated work order creation from continuous AI vision feeds and citizen-verified defect coordinates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
              <span>Export Dispatch CSV</span>
            </button>
          </div>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-900 text-emerald-100 p-3 rounded-xl text-xs flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-300 hover:text-white">✕</button>
        </div>
      )}

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">City Network Health</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900">74.2</span>
            <span className="text-xs text-slate-400 font-medium">/ 100 RHI</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium block pt-1">↑ +2.1% from Q3 resurfacing</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Road Hazards</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-rose-600">{hazards.length}</span>
            <span className="text-xs text-slate-400 font-medium">Verified Pins</span>
          </div>
          <span className="text-[11px] text-slate-500 block pt-1">2 critical severity cave-ins</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Work Orders Dispatched</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-amber-600">{workOrders.length}</span>
            <span className="text-xs text-slate-400 font-medium">Active</span>
          </div>
          <span className="text-[11px] text-slate-500 block pt-1">{completedOrders} completed this week</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Estimated Infill Budget</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900">${totalBudgetRequired.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-medium">USD</span>
          </div>
          <span className="text-[11px] text-slate-500 block pt-1">Average $1,340 / intervention</span>
        </div>
      </div>

      {/* Work Orders Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Header Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <HardHat className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-sm text-slate-900">Priority Maintenance Queue</h3>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {['All', 'In Progress', 'Scheduled', 'Pending Review', 'Completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">Intervention & Title</th>
                <th className="px-5 py-3">Road Location</th>
                <th className="px-5 py-3">Priority</th>
                <th className="px-5 py-3">Cost Est.</th>
                <th className="px-5 py-3">Assigned Crew</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((wo) => {
                const isImmediate = wo.priority === 'Immediate';
                const isHigh = wo.priority === 'High';

                return (
                  <tr key={wo.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800 whitespace-nowrap">
                      {wo.id}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">
                      {wo.title}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                      {wo.location}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        isImmediate ? 'bg-rose-100 text-rose-800 font-mono' :
                        isHigh ? 'bg-amber-100 text-amber-800 font-mono' : 'bg-slate-100 text-slate-700 font-mono'
                      }`}>
                        {wo.priority}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-900 whitespace-nowrap">
                      ${wo.estimatedCostUsd.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                      {wo.assignedCrew}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <select
                        value={wo.status}
                        onChange={(e) => handleUpdateStatus(wo.id, e.target.value as any)}
                        className="bg-slate-50 border border-slate-200 text-slate-800 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="Pending Review">Pending Review</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={onNavigateToMap}
                        className="text-amber-600 hover:text-amber-800 font-medium hover:underline text-[11px]"
                      >
                        Inspect Pin ➔
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pavement Deterioration Predictive Model Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider">
              PREDICTIVE PAVEMENT FAILURE MODEL
            </span>
            <h4 className="font-extrabold text-base text-white">Impending Winter Freeze-Thaw Vulnerability Audit</h4>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Based on historical rainfall telemetry and crack density, <strong>Market Street</strong> and <strong>Port Freight Corridor (I-880)</strong> have an 88% probability of structural sub-base collapse if not sealed within the next 45 days.
            </p>
          </div>

          <button
            onClick={() => handleUpdateStatus('WO-2026-104', 'In Progress')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs whitespace-nowrap shadow-sm transition-all"
          >
            Authorize Preventative Sealing
          </button>
        </div>
      </div>
    </div>
  );
};
