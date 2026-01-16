import React, { useState } from 'react';
import { Asset, MaintenanceRecord, MaintenanceType } from '../types';
import { X, Save, Calendar } from 'lucide-react';

interface MaintenanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: MaintenanceRecord) => void;
  assets: Asset[];
}

export const MaintenanceFormModal: React.FC<MaintenanceFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  assets
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<Partial<MaintenanceRecord>>({
    status: 'OPEN',
    type: MaintenanceType.CORRECTIVE,
    startDate: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.assetId && formData.technicianName && formData.description && formData.startDate) {
      const newRecord: MaintenanceRecord = {
        id: `mnt-${Date.now()}`,
        assetId: formData.assetId,
        technicianName: formData.technicianName,
        description: formData.description,
        status: formData.status as 'OPEN' | 'IN_PROGRESS' | 'CLOSED',
        type: formData.type as MaintenanceType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        nextMaintenanceDate: formData.nextMaintenanceDate
      };
      onSave(newRecord);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-hospital-800 rounded-xl border border-hospital-700 w-full max-w-2xl shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-hospital-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Nova Manutenção
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Equipamento</label>
              <select
                required
                name="assetId"
                value={formData.assetId || ''}
                onChange={handleChange}
                className="w-full bg-hospital-900 border border-hospital-700 rounded px-3 py-2 text-white focus:border-brand-500 focus:outline-none"
              >
                <option value="">Selecione um ativo...</option>
                {assets.map(a => (
                  <option key={a.id} value={a.id}>{a.patrimonyCode} - {a.model} ({a.brand})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Tipo de Manutenção</label>
              <select
                required
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-hospital-900 border border-hospital-700 rounded px-3 py-2 text-white focus:border-brand-500 focus:outline-none"
              >
                {Object.values(MaintenanceType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Status</label>
              <select
                required
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-hospital-900 border border-hospital-700 rounded px-3 py-2 text-white focus:border-brand-500 focus:outline-none"
              >
                <option value="OPEN">Aberta</option>
                <option value="IN_PROGRESS">Em Andamento</option>
                <option value="CLOSED">Concluída</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Técnico Responsável</label>
              <input
                required
                name="technicianName"
                value={formData.technicianName || ''}
                onChange={handleChange}
                className="w-full bg-hospital-900 border border-hospital-700 rounded px-3 py-2 text-white focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Data Inicial</label>
              <input
                required
                type="date"
                name="startDate"
                value={formData.startDate || ''}
                onChange={handleChange}
                className="w-full bg-hospital-900 border border-hospital-700 rounded px-3 py-2 text-white focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Data Conclusão</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate || ''}
                onChange={handleChange}
                className="w-full bg-hospital-900 border border-hospital-700 rounded px-3 py-2 text-white focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Próxima Manutenção</label>
              <input
                type="date"
                name="nextMaintenanceDate"
                value={formData.nextMaintenanceDate || ''}
                onChange={handleChange}
                className="w-full bg-hospital-900 border border-hospital-700 rounded px-3 py-2 text-white focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Descrição do Serviço</label>
              <textarea
                required
                rows={3}
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                className="w-full bg-hospital-900 border border-hospital-700 rounded px-3 py-2 text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-hospital-700 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-slate-300 hover:bg-hospital-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2 bg-brand-600 text-white rounded hover:bg-brand-700 transition-colors shadow-lg"
            >
              <Save size={18} />
              <span>Salvar Manutenção</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};