import React, { useState, useEffect } from 'react';
import { Asset, AssetStatus, AssetType, Sector } from '../types';
import { Save } from 'lucide-react';

interface AssetFormProps {
  onSave: (asset: Asset) => void;
  onCancel?: () => void;
  editingAsset?: Asset | null;
  sectors: Sector[];
  isInline?: boolean;
}

export const AssetForm: React.FC<AssetFormProps> = ({
  onSave,
  onCancel,
  editingAsset,
  sectors,
  isInline = false
}) => {
  const initialFormState: Asset = {
    id: '',
    patrimonyCode: '',
    serialNumber: '',
    type: AssetType.DESKTOP,
    brand: '',
    model: '',
    acquisitionDate: new Date().toISOString().split('T')[0],
    supplier: '',
    status: AssetStatus.STORAGE,
    sectorId: sectors[0]?.id || '',
    responsiblePerson: '',
    notes: ''
  };

  const [formData, setFormData] = useState<Asset>(initialFormState);

  useEffect(() => {
    if (editingAsset) {
      setFormData(editingAsset);
    } else {
      setFormData({
        ...initialFormState,
        id: `ast-${Date.now()}`,
        sectorId: sectors[0]?.id || ''
      });
    }
  }, [editingAsset, sectors]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    // Reset if inline creation
    if (isInline && !editingAsset) {
        setFormData({
            ...initialFormState,
            id: `ast-${Date.now()}`,
            sectorId: sectors[0]?.id || ''
        });
        alert("Equipamento cadastrado com sucesso!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identificação */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase">Patrimônio</label>
          <input
            required
            name="patrimonyCode"
            value={formData.patrimonyCode}
            onChange={handleChange}
            className="w-full bg-hospital-900 border border-hospital-700 rounded px-3 py-2 text-white focus:border-brand-500 focus:outline-none"
            placeholder="Ex: HSP-0000"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase">Nº Série</label>
          <input
            required
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleChange}
            className="w-full bg-hospital-900 border border-hospital-700 rounded px-3 py-2 text-white focus:border-brand-500 focus:outline-none"
            placeholder="Serial do fabricante"
          />
        </div>

        {/* Equipamento */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase">Tipo</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full bg-hospital-900 border border-hospital-700 rounded px-3 py-2 text-white focus:border-brand-500 focus:outline-none"
          >
            {Object.values(AssetType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase">Marca</label>
          <input
            required
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full bg-hospital-900 border border-hospital-700 rounded px-3 py-2 text-white focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase">Modelo</label>
          <input
            required
            name="model"
            value={formData.model}
            onChange={handleChange}
            className="w-full bg-hospital-900 border border-hospital-700 rounded px-3 py-2 text-white focus:border-brand-500 focus:outline-none"
          />
        </div>

        {/* Localização (Apenas Setor, conforme solicitado) */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase">Setor</label>
          <select
            name="sectorId"
            value={formData.sectorId}
            onChange={handleChange}
            className="w-full bg-hospital-900 border border-hospital-700 rounded px-3 py-2 text-white focus:border-brand-500 focus:outline-none"
          >
            {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>
      
      <div className="pt-4 border-t border-hospital-700 flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded text-slate-300 hover:bg-hospital-700 transition-colors"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="flex items-center space-x-2 px-6 py-2 bg-brand-600 text-white rounded hover:bg-brand-700 transition-colors shadow-lg"
        >
          <Save size={18} />
          <span>{editingAsset ? 'Salvar Alterações' : 'Cadastrar Equipamento'}</span>
        </button>
      </div>
    </form>
  );
};