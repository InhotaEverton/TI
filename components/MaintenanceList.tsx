import React from 'react';
import { Asset, MaintenanceRecord } from '../types';
import { Wrench, CheckCircle, Clock, Plus } from 'lucide-react';

interface MaintenanceListProps {
  maintenanceRecords: MaintenanceRecord[];
  assets: Asset[];
  onAddMaintenance: () => void;
}

export const MaintenanceList: React.FC<MaintenanceListProps> = ({
  maintenanceRecords,
  assets,
  onAddMaintenance
}) => {
  const getAssetName = (id: string) => {
    const asset = assets.find(a => a.id === id);
    return asset ? `${asset.model} (${asset.patrimonyCode})` : 'Ativo Desconhecido';
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestão de Manutenções</h1>
          <p className="text-slate-400">Acompanhamento técnico e histórico de reparos.</p>
        </div>
        <button 
          onClick={onAddMaintenance}
          className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-brand-900/50"
        >
          <Plus size={18} />
          <span>Nova Manutenção</span>
        </button>
      </div>

      <div className="bg-hospital-800 rounded-xl border border-hospital-700 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-hospital-900/50 text-slate-400 uppercase font-medium text-xs">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Equipamento</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">Início</th>
                <th className="px-6 py-4">Conclusão</th>
                <th className="px-6 py-4">Próxima</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hospital-700">
              {maintenanceRecords.length > 0 ? (
                maintenanceRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-hospital-700/30 transition-colors">
                    <td className="px-6 py-4">
                      {record.status === 'CLOSED' ? (
                        <span className="flex items-center text-emerald-400 text-xs font-bold uppercase">
                          <CheckCircle size={14} className="mr-1" /> Concluída
                        </span>
                      ) : (
                        <span className="flex items-center text-amber-400 text-xs font-bold uppercase">
                          <Clock size={14} className="mr-1" /> Em Andamento
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-white">
                      {getAssetName(record.assetId)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-hospital-900 rounded text-xs border border-hospital-700">
                        {record.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 max-w-xs truncate" title={record.description}>
                      {record.description}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {formatDate(record.startDate)}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {formatDate(record.endDate)}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-brand-400">
                      {formatDate(record.nextMaintenanceDate)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Wrench size={32} className="opacity-20" />
                      <p>Nenhum registro de manutenção encontrado.</p>
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