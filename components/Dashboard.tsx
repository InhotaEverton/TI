import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Asset, AssetStatus, Sector } from '../types';
import { Activity, AlertTriangle, Box, CheckCircle } from 'lucide-react';

interface DashboardProps {
  assets: Asset[];
  sectors: Sector[];
}

export const Dashboard: React.FC<DashboardProps> = ({ assets, sectors }) => {
  // Stats Calculation
  const totalAssets = assets.length;
  const inUse = assets.filter(a => a.status === AssetStatus.IN_USE).length;
  const inMaintenance = assets.filter(a => a.status === AssetStatus.MAINTENANCE).length;
  const inStorage = assets.filter(a => a.status === AssetStatus.STORAGE).length;

  // Chart Data Preparation
  const statusData = [
    { name: 'Em Uso', value: inUse, color: '#10b981' }, // Emerald 500
    { name: 'Estoque', value: inStorage, color: '#3b82f6' }, // Blue 500
    { name: 'Manutenção', value: inMaintenance, color: '#f59e0b' }, // Amber 500
    { name: 'Outros', value: totalAssets - (inUse + inMaintenance + inStorage), color: '#64748b' } // Slate 500
  ];

  // Group by Sector
  const sectorData = sectors.map(sector => {
    return {
      name: sector.name,
      count: assets.filter(a => a.sectorId === sector.id).length
    };
  }).sort((a, b) => b.count - a.count); // Descending order

  const StatCard = ({ title, value, icon: Icon, colorClass, borderClass }: any) => (
    <div className={`bg-hospital-800 p-6 rounded-xl border-l-4 ${borderClass} shadow-lg shadow-black/20`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold mt-2 text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg bg-opacity-10 ${colorClass.replace('text-', 'bg-')}`}>
          <Icon className={colorClass} size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard Geral</h1>
        <p className="text-slate-400">Visão geral do parque tecnológico hospitalar</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total de Ativos" 
          value={totalAssets} 
          icon={Box} 
          colorClass="text-purple-400" 
          borderClass="border-purple-500"
        />
        <StatCard 
          title="Em Uso" 
          value={inUse} 
          icon={CheckCircle} 
          colorClass="text-emerald-400" 
          borderClass="border-emerald-500"
        />
        <StatCard 
          title="Em Manutenção" 
          value={inMaintenance} 
          icon={Activity} 
          colorClass="text-amber-400" 
          borderClass="border-amber-500"
        />
        <StatCard 
          title="Atenção Necessária" 
          value={assets.filter(a => a.status === AssetStatus.LOST || a.status === AssetStatus.DISPOSED).length} 
          icon={AlertTriangle} 
          colorClass="text-red-400" 
          borderClass="border-red-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Status Distribution */}
        <div className="bg-hospital-800 p-6 rounded-xl border border-hospital-700">
          <h3 className="text-lg font-semibold mb-6 text-slate-200">Distribuição por Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                  itemStyle={{ color: '#f1f5f9' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Distribution */}
        <div className="bg-hospital-800 p-6 rounded-xl border border-hospital-700">
          <h3 className="text-lg font-semibold mb-6 text-slate-200">Ativos por Setor</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{fill: '#334155', opacity: 0.2}}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};