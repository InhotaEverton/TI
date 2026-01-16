import React, { useState } from 'react';
import { Asset, Sector, UserRole } from '../types';
import { Monitor, Map } from 'lucide-react';
import { AssetForm } from './AssetForm';
import { SectorManager } from './SectorManager';

interface RegistrationScreenProps {
  onSaveAsset: (asset: Asset) => void;
  onAddSector: (sector: Sector) => void;
  onUpdateSector: (sector: Sector) => void;
  onDeleteSector: (id: string) => void;
  sectors: Sector[];
}

export const RegistrationScreen: React.FC<RegistrationScreenProps> = ({
  onSaveAsset,
  onAddSector,
  onUpdateSector,
  onDeleteSector,
  sectors
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'ASSETS' | 'SECTORS'>('ASSETS');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">Cadastros</h1>
        <p className="text-slate-400">Gerencie entradas de novos equipamentos e setores do hospital.</p>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex space-x-4 border-b border-hospital-700 mb-6">
        <button
          onClick={() => setActiveSubTab('ASSETS')}
          className={`pb-3 px-4 flex items-center space-x-2 border-b-2 transition-colors ${
            activeSubTab === 'ASSETS' 
              ? 'border-brand-500 text-brand-400' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Monitor size={20} />
          <span className="font-medium">Equipamentos</span>
        </button>
        <button
          onClick={() => setActiveSubTab('SECTORS')}
          className={`pb-3 px-4 flex items-center space-x-2 border-b-2 transition-colors ${
            activeSubTab === 'SECTORS' 
              ? 'border-brand-500 text-brand-400' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Map size={20} />
          <span className="font-medium">Setores</span>
        </button>
      </div>

      {/* Content */}
      <div className="bg-hospital-800 rounded-xl border border-hospital-700 p-6 shadow-xl">
        {activeSubTab === 'ASSETS' ? (
          <div>
            <div className="mb-6 border-b border-hospital-700 pb-4">
              <h3 className="text-lg font-semibold text-white">Cadastro de Equipamento</h3>
              <p className="text-sm text-slate-400">Preencha o formulário abaixo para adicionar um novo item ao inventário.</p>
            </div>
            <AssetForm 
              onSave={onSaveAsset} 
              sectors={sectors} 
              isInline={true}
            />
          </div>
        ) : (
          <SectorManager 
            sectors={sectors} 
            onAddSector={onAddSector} 
            onUpdateSector={onUpdateSector}
            onDeleteSector={onDeleteSector}
            userRole={UserRole.ADMIN} 
          />
        )}
      </div>
    </div>
  );
};