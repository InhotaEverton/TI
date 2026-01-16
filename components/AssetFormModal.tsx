import React from 'react';
import { Asset, Sector } from '../types';
import { X } from 'lucide-react';
import { AssetForm } from './AssetForm';

interface AssetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: Asset) => void;
  editingAsset?: Asset | null;
  sectors: Sector[];
}

export const AssetFormModal: React.FC<AssetFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingAsset,
  sectors
}) => {
  if (!isOpen) return null;

  const handleSave = (asset: Asset) => {
    onSave(asset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-hospital-800 rounded-xl border border-hospital-700 w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-hospital-700">
          <h2 className="text-xl font-bold text-white">
            {editingAsset ? 'Editar Ativo' : 'Novo Ativo'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <AssetForm 
            onSave={handleSave} 
            onCancel={onClose} 
            editingAsset={editingAsset} 
            sectors={sectors} 
          />
        </div>
      </div>
    </div>
  );
};