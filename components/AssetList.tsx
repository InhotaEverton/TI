import React, { useState } from 'react';
import { Asset, AssetStatus, AssetType, Sector, UserRole } from '../types';
import { Search, Filter, Plus, Eye, Pencil } from 'lucide-react';

interface AssetListProps {
  assets: Asset[];
  sectors: Sector[];
  userRole: UserRole;
  onViewAsset: (asset: Asset) => void;
  onEditAsset: (asset: Asset) => void;
  onAddAsset: () => void;
}

export const AssetList: React.FC<AssetListProps> = ({ 
  assets, 
  sectors, 
  userRole, 
  onViewAsset,
  onEditAsset,
  onAddAsset 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const getStatusColor = (status: AssetStatus) => {
    switch (status) {
      case AssetStatus.IN_USE: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case AssetStatus.MAINTENANCE: return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case AssetStatus.STORAGE: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case AssetStatus.DISPOSED: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case AssetStatus.LOST: return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getSectorName = (id: string) => sectors.find(s => s.id === id)?.name || 'Desconhecido';

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = 
      asset.patrimonyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'ALL' || asset.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || asset.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const canEdit = [UserRole.ADMIN, UserRole.TECH].includes(userRole);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventário de TI</h1>
          <p className="text-slate-400">Gerenciamento de {assets.length} ativos cadastrados</p>
        </div>
        {canEdit && (
          <button 
            onClick={onAddAsset}
            className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-brand-900/50"
          >
            <Plus size={18} />
            <span>Novo Ativo</span>
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-hospital-800 p-4 rounded-xl border border-hospital-700 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por patrimônio, serial ou modelo..." 
            className="w-full bg-hospital-900 border border-hospital-700 text-slate-200 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div className="relative min-w-[150px]">
            <select 
              className="w-full bg-hospital-900 border border-hospital-700 text-slate-200 pl-4 pr-8 py-2 rounded-lg appearance-none focus:outline-none focus:border-brand-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="ALL">Todos os Tipos</option>
              {Object.values(AssetType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>
          <div className="relative min-w-[150px]">
            <select 
              className="w-full bg-hospital-900 border border-hospital-700 text-slate-200 pl-4 pr-8 py-2 rounded-lg appearance-none focus:outline-none focus:border-brand-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">Todos os Status</option>
              {Object.values(AssetStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-hospital-800 rounded-xl border border-hospital-700 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-hospital-900/50 text-slate-400 uppercase font-medium text-xs">
              <tr>
                <th className="px-6 py-4">Patrimônio</th>
                <th className="px-6 py-4">Equipamento</th>
                <th className="px-6 py-4">Setor</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hospital-700">
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-hospital-700/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-brand-400 font-medium">
                      {asset.patrimonyCode}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{asset.model}</div>
                      <div className="text-xs text-slate-500">{asset.brand} - {asset.type}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getSectorName(asset.sectorId)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(asset.status)}`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => onViewAsset(asset)}
                          className="text-slate-400 hover:text-brand-400 transition-colors p-2 hover:bg-slate-700 rounded-full"
                          title="Ver Detalhes"
                        >
                          <Eye size={18} />
                        </button>
                        {canEdit && (
                          <button 
                            onClick={() => onEditAsset(asset)}
                            className="text-slate-400 hover:text-amber-400 transition-colors p-2 hover:bg-slate-700 rounded-full"
                            title="Editar Ativo"
                          >
                            <Pencil size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Search size={32} className="opacity-20" />
                      <p>Nenhum ativo encontrado para os filtros selecionados.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};