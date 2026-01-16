import React, { useState } from 'react';
import { Asset, MaintenanceRecord, MovementHistory, Sector, UserRole } from '../types';
import { ArrowLeft, AlertCircle, Wrench, History, Box, Edit, ArrowRightLeft, Trash2 } from 'lucide-react';
import { MOCK_HISTORY, MOCK_MAINTENANCE } from '../constants';

// We now accept history as a prop to handle dynamic updates properly
// Maintenance still mocked locally for now as requested scope was on history
const getMaintenanceForAsset = (id: string) => MOCK_MAINTENANCE.filter(m => m.assetId === id);

interface AssetDetailProps {
  asset: Asset;
  sectors: Sector[];
  history: MovementHistory[];
  userRole: UserRole;
  onBack: () => void;
  onMove: (asset: Asset) => void;
  onEdit: (asset: Asset) => void;
  onDeleteHistory: (historyId: string) => void;
}

export const AssetDetail: React.FC<AssetDetailProps> = ({ 
  asset, 
  sectors, 
  history,
  userRole, 
  onBack,
  onMove,
  onEdit,
  onDeleteHistory
}) => {
  const [activeTab, setActiveTab] = useState<'INFO' | 'HISTORY' | 'MAINTENANCE'>('INFO');
  
  const maintenance = getMaintenanceForAsset(asset.id);
  const sectorName = sectors.find(s => s.id === asset.sectorId)?.name;
  
  const canEdit = [UserRole.ADMIN, UserRole.TECH].includes(userRole);

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-6 py-3 border-b-2 transition-colors ${
        activeTab === id 
          ? 'border-brand-500 text-brand-400' 
          : 'border-transparent text-slate-400 hover:text-slate-200'
      }`}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Voltar para lista</span>
      </button>

      {/* Header */}
      <div className="bg-hospital-800 rounded-xl p-6 border border-hospital-700 flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center text-slate-400">
            <Box size={32} />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-white">{asset.model}</h1>
              <span className="px-2 py-0.5 rounded text-xs bg-slate-700 text-slate-300 border border-slate-600">
                {asset.type}
              </span>
            </div>
            <p className="text-brand-400 font-mono mt-1 text-lg">{asset.patrimonyCode}</p>
            <p className="text-slate-400 text-sm mt-1">{asset.brand} • SN: {asset.serialNumber}</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
            {canEdit && (
                <>
                <button 
                    onClick={() => onMove(asset)}
                    className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors border border-slate-600"
                >
                    <ArrowRightLeft size={18} />
                    <span>Movimentar</span>
                </button>
                <button 
                    onClick={() => onEdit(asset)}
                    className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-brand-900/50"
                >
                    <Edit size={18} />
                    <span>Editar</span>
                </button>
                </>
            )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-hospital-700">
        <TabButton id="INFO" label="Informações Gerais" icon={AlertCircle} />
        <TabButton id="HISTORY" label="Histórico de Movimentação" icon={History} />
        <TabButton id="MAINTENANCE" label="Manutenção" icon={Wrench} />
      </div>

      {/* Content */}
      <div className="bg-hospital-800 rounded-xl border border-hospital-700 p-6 min-h-[400px]">
        {activeTab === 'INFO' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Localização Atual</h3>
                <div className="bg-hospital-900 p-4 rounded-lg border border-hospital-700">
                  <p className="text-white font-medium text-lg">{sectorName}</p>
                  <p className="text-slate-400 text-sm mt-1">Responsável: {asset.responsiblePerson}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Dados de Aquisição</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-hospital-900 p-3 rounded border border-hospital-700">
                    <p className="text-xs text-slate-500">Data Compra</p>
                    <p className="text-slate-200">{new Date(asset.acquisitionDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="bg-hospital-900 p-3 rounded border border-hospital-700">
                    <p className="text-xs text-slate-500">Fornecedor</p>
                    <p className="text-slate-200 truncate">{asset.supplier}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Status</h3>
                <div className="bg-hospital-900 p-4 rounded-lg border border-hospital-700 flex items-center justify-between">
                  <span className="text-slate-200 font-medium">{asset.status}</span>
                  <div className={`w-3 h-3 rounded-full ${asset.status === 'Em Uso' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Observações</h3>
                <div className="bg-hospital-900 p-4 rounded-lg border border-hospital-700 min-h-[100px]">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {asset.notes || 'Nenhuma observação registrada.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'HISTORY' && (
          <div className="relative border-l-2 border-hospital-700 ml-4 space-y-8 pl-8 py-2">
            {history.length > 0 ? history.map((event) => (
              <div key={event.id} className="relative group">
                <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-hospital-800 border-4 border-brand-600"></div>
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-mono text-brand-400">
                        {new Date(event.timestamp).toLocaleString('pt-BR')}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-sm text-slate-400">por {event.userName}</span>
                    </div>
                    {canEdit && (
                      <button 
                        onClick={() => {
                          if (window.confirm('Tem certeza que deseja retirar este registro de movimentação?')) {
                            onDeleteHistory(event.id);
                          }
                        }}
                        className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1"
                        title="Retirar movimentação"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <h4 className="text-white font-medium text-lg mb-1">
                    {event.fromSector ? `Movido de ${event.fromSector} para ${event.toSector}` : `Alocado em ${event.toSector}`}
                  </h4>
                  <p className="text-slate-400 text-sm bg-hospital-900 p-3 rounded border border-hospital-700 inline-block mt-2">
                    Motivo: "{event.reason}"
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-slate-500 italic">Nenhum histórico de movimentação encontrado.</p>
            )}
          </div>
        )}

        {activeTab === 'MAINTENANCE' && (
          <div className="space-y-4">
             {canEdit && (
                <div className="flex justify-end mb-4">
                     <button className="text-sm bg-amber-600/20 text-amber-500 border border-amber-600/50 hover:bg-amber-600/30 px-3 py-1.5 rounded transition-colors">
                        + Registrar Ocorrência
                     </button>
                </div>
             )}
            {maintenance.length > 0 ? maintenance.map((rec) => (
              <div key={rec.id} className="bg-hospital-900 p-4 rounded-lg border border-hospital-700 hover:border-slate-500 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${rec.status === 'CLOSED' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    <span className="font-semibold text-slate-200">
                      {rec.status === 'CLOSED' ? 'Concluída' : 'Em Andamento'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">{new Date(rec.startDate).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-300 font-medium mb-1">{rec.description}</p>
                <div className="flex justify-between items-end mt-4">
                  <span className="text-sm text-slate-500">Técnico: {rec.technicianName}</span>
                  {rec.cost && (
                    <span className="text-sm font-mono text-slate-400">Custo: R$ {rec.cost.toFixed(2)}</span>
                  )}
                </div>
              </div>
            )) : (
              <div className="text-center py-10 text-slate-500 border-2 border-dashed border-hospital-700 rounded-lg">
                <Wrench className="mx-auto mb-2 opacity-50" />
                <p>Nenhuma manutenção registrada para este equipamento.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};