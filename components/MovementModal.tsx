import React, { useState } from 'react';
import { Asset, AssetStatus, Sector } from '../types';
import { X, ArrowRightLeft } from 'lucide-react';

interface MovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { assetId: string, toSectorId: string, newStatus: AssetStatus, newResponsible: string, reason: string }) => void;
  asset: Asset | null;
  sectors: Sector[];
}

export const MovementModal: React.FC<MovementModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  asset,
  sectors
}) => {
  const [sectorId, setSectorId] = useState('');
  const [status, setStatus] = useState<AssetStatus>(AssetStatus.IN_USE);
  const [responsible, setResponsible] = useState('');
  const [reason, setReason] = useState('');

  // Initialize form when asset changes
  React.useEffect(() => {
    if (asset) {
      setSectorId(asset.sectorId);
      setStatus(asset.status);
      setResponsible(asset.responsiblePerson);
      setReason('');
    }
  }, [asset, isOpen]);

  if (!isOpen || !asset) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert("O motivo da movimentação é obrigatório para auditoria.");
      return;
    }
    onConfirm({
      assetId: asset.id,
      toSectorId: sectorId,
      newStatus: status,
      newResponsible: responsible,
      reason: reason
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-hospital-800 rounded-xl border border-hospital-700 w-full max-w-lg shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-hospital-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ArrowRightLeft className="text-brand-500" />
            Movimentar Ativo
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-hospital-900 p-3 rounded border border-hospital-700 mb-4">
             <p className="text-xs text-slate-500 uppercase">Ativo Selecionado</p>
             <p className="font-bold text-white">{asset.model}</p>
             <p className="text-sm text-brand-400 font-mono">{asset.patrimonyCode}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Novo Setor</label>
              <select
                required
                value={sectorId}
                onChange={(e) => setSectorId(e.target.value)}
                className="w-full bg-hospital-900 border border-hospital-700 rounded px-3 py-2 text-white focus:border-brand-500 focus:outline-none"
              >
                {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Status Atualizado</label>
              <select
                required
                value={status}
                onChange={(e) => setStatus(e.target.value as AssetStatus)}
                className="w-full bg-hospital-900 border border-hospital-700 rounded px-3 py-2 text-white focus:border-brand-500 focus:outline-none"
              >
                {Object.values(AssetStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Responsável no Destino</label>
              <input
                required
                type="text"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                className="w-full bg-hospital-900 border border-hospital-700 rounded px-3 py-2 text-white focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Motivo da Movimentação <span className="text-red-400">*</span></label>
              <textarea
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Justifique a movimentação para fins de auditoria..."
                className="w-full bg-hospital-900 border border-hospital-700 rounded px-3 py-2 text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-slate-300 hover:bg-hospital-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700 transition-colors shadow-lg"
            >
              Confirmar Movimentação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};