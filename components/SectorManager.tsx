import React, { useState } from 'react';
import { Sector, UserRole } from '../types';
import { Plus, MapPin, Trash2, Edit2, Save, X } from 'lucide-react';

interface SectorManagerProps {
  sectors: Sector[];
  onAddSector: (sector: Sector) => void;
  onUpdateSector: (sector: Sector) => void;
  onDeleteSector: (sectorId: string) => void;
  userRole: UserRole;
}

export const SectorManager: React.FC<SectorManagerProps> = ({ 
  sectors, 
  onAddSector, 
  onUpdateSector,
  onDeleteSector,
  userRole 
}) => {
  // Create State
  const [newSectorName, setNewSectorName] = useState('');
  const [newSectorFloor, setNewSectorFloor] = useState('');

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editFloor, setEditFloor] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectorName || !newSectorFloor) return;

    onAddSector({
      id: `sec-${Date.now()}`,
      name: newSectorName,
      floor: newSectorFloor
    });

    setNewSectorName('');
    setNewSectorFloor('');
  };

  const startEdit = (sector: Sector) => {
    setEditingId(sector.id);
    setEditName(sector.name);
    setEditFloor(sector.floor || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditFloor('');
  };

  const saveEdit = (id: string) => {
    onUpdateSector({
      id,
      name: editName,
      floor: editFloor
    });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este setor?')) {
      onDeleteSector(id);
    }
  };

  const canEdit = userRole === UserRole.ADMIN || userRole === UserRole.TECH;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Gerenciamento de Setores</h1>
        <p className="text-slate-400">Cadastre e edite os locais físicos do hospital.</p>
      </div>

      {canEdit && (
        <div className="bg-hospital-800 p-6 rounded-xl border border-hospital-700 shadow-lg mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Plus className="text-brand-500" size={20}/> Novo Setor
          </h3>
          <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Nome do Setor</label>
              <input 
                value={newSectorName}
                onChange={e => setNewSectorName(e.target.value)}
                placeholder="Ex: UTI Neonatal"
                className="w-full bg-hospital-900 border border-hospital-700 rounded px-3 py-2 text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Andar / Bloco</label>
              <input 
                value={newSectorFloor}
                onChange={e => setNewSectorFloor(e.target.value)}
                placeholder="Ex: 3º Andar"
                className="w-full bg-hospital-900 border border-hospital-700 rounded px-3 py-2 text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
            <button 
              type="submit"
              disabled={!newSectorName || !newSectorFloor}
              className="w-full md:w-auto px-6 py-2 bg-brand-600 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded hover:bg-brand-700 transition-colors"
            >
              Adicionar
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sectors.map((sector) => (
          <div key={sector.id} className="bg-hospital-800 p-4 rounded-lg border border-hospital-700 hover:border-brand-500/50 transition-colors group relative">
            
            {editingId === sector.id ? (
              // Edit Mode
              <div className="space-y-3">
                <input 
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full bg-hospital-900 border border-brand-500 rounded px-2 py-1 text-white text-sm focus:outline-none"
                  autoFocus
                />
                <input 
                  value={editFloor}
                  onChange={e => setEditFloor(e.target.value)}
                  className="w-full bg-hospital-900 border border-brand-500 rounded px-2 py-1 text-white text-sm focus:outline-none"
                  placeholder="Andar"
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button onClick={cancelEdit} className="p-1 text-slate-400 hover:text-white">
                    <X size={18} />
                  </button>
                  <button onClick={() => saveEdit(sector.id)} className="p-1 text-emerald-400 hover:text-emerald-300">
                    <Save size={18} />
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center text-brand-400">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200">{sector.name}</h4>
                    <p className="text-xs text-slate-500">{sector.floor}</p>
                  </div>
                </div>
                
                {canEdit && (
                  <div className="flex space-x-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => startEdit(sector)}
                      className="p-1.5 text-slate-500 hover:text-brand-400 hover:bg-slate-700 rounded transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(sector.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};