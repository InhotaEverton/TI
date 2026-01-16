import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { AssetList } from './components/AssetList';
import { AssetDetail } from './components/AssetDetail';
import { AssetFormModal } from './components/AssetFormModal';
import { MovementModal } from './components/MovementModal';
import { RegistrationScreen } from './components/RegistrationScreen';
import { MaintenanceList } from './components/MaintenanceList';
import { MaintenanceFormModal } from './components/MaintenanceFormModal';
import { Dashboard } from './components/Dashboard';
import { MOCK_ASSETS, MOCK_SECTORS, MOCK_USERS, MOCK_HISTORY, MOCK_MAINTENANCE } from './constants';
import { Asset, AssetStatus, MaintenanceRecord, MovementHistory, Sector, User } from './types';
import { ShieldCheck } from 'lucide-react';

const LoginScreen = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Admin' && password === 'Hrss@#9530') {
      // Return the mock admin user
      onLogin(MOCK_USERS[0]);
    } else {
      setError('Usuário ou senha incorretos.');
    }
  };

  return (
    <div className="min-h-screen bg-hospital-900 flex items-center justify-center p-4">
      <div className="bg-hospital-800 p-8 rounded-2xl border border-hospital-700 w-full max-w-md shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-600/30">
            <ShieldCheck size={32} />
          </div>
        </div>
        <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-white mb-2 leading-tight">Santa Casa de<br/>Sto. Antônio do Amparo</h2>
            <p className="text-slate-400 text-sm">Controle de Patrimônio TI</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Usuário</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-hospital-900 border border-hospital-700 text-white px-4 py-3 rounded-lg focus:border-brand-500 focus:outline-none"
              placeholder="Digite seu usuário"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-hospital-900 border border-hospital-700 text-white px-4 py-3 rounded-lg focus:border-brand-500 focus:outline-none"
              placeholder="Digite sua senha"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg transition-colors mt-2 shadow-lg shadow-brand-900/50"
          >
            Acessar Sistema
          </button>
        </form>
      </div>
    </div>
  );
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [activeTab, setActiveTab] = useState('cadastros');
  const [view, setView] = useState<'LIST' | 'DETAIL'>('LIST');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Application State
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [sectors, setSectors] = useState<Sector[]>(MOCK_SECTORS);
  const [history, setHistory] = useState<MovementHistory[]>(MOCK_HISTORY);
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>(MOCK_MAINTENANCE);

  // Modals State
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [movingAsset, setMovingAsset] = useState<Asset | null>(null);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

  if (!currentUser) {
    return <LoginScreen onLogin={setCurrentUser} />;
  }

  // --- Handlers ---

  const handleAssetClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setView('DETAIL');
    setActiveTab('registros'); 
  };

  const handleBackToList = () => {
    setSelectedAsset(null);
    setView('LIST');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setView('LIST'); 
  };

  // Create or Update Asset
  const handleSaveAsset = (assetData: Asset) => {
    if (editingAsset) {
      setAssets(prev => prev.map(a => a.id === assetData.id ? assetData : a));
      if (selectedAsset && selectedAsset.id === assetData.id) {
        setSelectedAsset(assetData); 
      }
    } else {
      setAssets(prev => [assetData, ...prev]);
    }
    setShowAssetModal(false);
    setEditingAsset(null);
  };

  const handleEditAssetClick = (asset: Asset) => {
    setEditingAsset(asset);
    setShowAssetModal(true);
  };

  // Sector Management
  const handleAddSector = (newSector: Sector) => {
    setSectors(prev => [...prev, newSector]);
  };

  const handleUpdateSector = (updatedSector: Sector) => {
    setSectors(prev => prev.map(s => s.id === updatedSector.id ? updatedSector : s));
  };

  const handleDeleteSector = (sectorId: string) => {
    setSectors(prev => prev.filter(s => s.id !== sectorId));
  };

  // Movement Logic
  const handleMovementClick = (asset: Asset) => {
    setMovingAsset(asset);
    setShowMovementModal(true);
  };

  const handleConfirmMovement = (data: { assetId: string, toSectorId: string, newStatus: AssetStatus, newResponsible: string, reason: string }) => {
    const currentAsset = assets.find(a => a.id === data.assetId);
    if (!currentAsset) return;

    const newHistory: MovementHistory = {
      id: `hist-${Date.now()}`,
      assetId: currentAsset.id,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      fromSector: sectors.find(s => s.id === currentAsset.sectorId)?.name,
      toSector: sectors.find(s => s.id === data.toSectorId)?.name || 'Desconhecido',
      fromResponsible: currentAsset.responsiblePerson,
      toResponsible: data.newResponsible,
      reason: data.reason
    };
    
    setHistory(prev => [newHistory, ...prev]);

    const updatedAsset = {
      ...currentAsset,
      sectorId: data.toSectorId,
      status: data.newStatus,
      responsiblePerson: data.newResponsible
    };

    setAssets(prev => prev.map(a => a.id === data.assetId ? updatedAsset : a));
    if (selectedAsset && selectedAsset.id === data.assetId) {
      setSelectedAsset(updatedAsset);
    }
  };

  const handleDeleteHistory = (historyId: string) => {
    setHistory(prev => prev.filter(h => h.id !== historyId));
  };

  // Maintenance Logic
  const handleAddMaintenance = (record: MaintenanceRecord) => {
    setMaintenance(prev => [record, ...prev]);
    // Optionally update asset status to MAINTENANCE
    if (record.status !== 'CLOSED') {
        setAssets(prev => prev.map(a => 
            a.id === record.assetId 
            ? { ...a, status: AssetStatus.MAINTENANCE } 
            : a
        ));
    }
  };

  // Render logic based on new Tab Structure
  const renderContent = () => {
    if (view === 'DETAIL' && selectedAsset) {
        const assetHistory = history.filter(h => h.assetId === selectedAsset.id);
        return (
        <AssetDetail 
            asset={selectedAsset}
            sectors={sectors}
            history={assetHistory}
            userRole={currentUser.role}
            onBack={handleBackToList}
            onMove={handleMovementClick}
            onEdit={handleEditAssetClick}
            onDeleteHistory={handleDeleteHistory}
        />
        );
    }

    switch (activeTab) {
      case 'cadastros':
        return (
          <RegistrationScreen 
             onSaveAsset={handleSaveAsset}
             onAddSector={handleAddSector}
             onUpdateSector={handleUpdateSector}
             onDeleteSector={handleDeleteSector}
             sectors={sectors}
          />
        );
      
      case 'registros':
        return (
          <AssetList 
            assets={assets} 
            sectors={sectors}
            userRole={currentUser.role}
            onViewAsset={handleAssetClick}
            onEditAsset={handleEditAssetClick}
            onAddAsset={() => setActiveTab('cadastros')} 
          />
        );
      
      case 'manutencoes':
        return (
          <MaintenanceList 
            maintenanceRecords={maintenance}
            assets={assets}
            onAddMaintenance={() => setShowMaintenanceModal(true)}
          />
        );

      case 'relatorios':
        return (
           <Dashboard assets={assets} sectors={sectors} />
        )

      default:
        return <div className="text-white">Selecione uma guia.</div>;
    }
  };

  return (
    <Layout 
      user={currentUser} 
      activeTab={activeTab} 
      onTabChange={handleTabChange}
      onLogout={() => setCurrentUser(null)}
    >
      {renderContent()}

      {/* Global Modals */}
      <AssetFormModal 
        isOpen={showAssetModal}
        onClose={() => setShowAssetModal(false)}
        onSave={handleSaveAsset}
        editingAsset={editingAsset}
        sectors={sectors}
      />

      <MovementModal 
        isOpen={showMovementModal}
        onClose={() => setShowMovementModal(false)}
        onConfirm={handleConfirmMovement}
        asset={movingAsset}
        sectors={sectors}
      />

      <MaintenanceFormModal
        isOpen={showMaintenanceModal}
        onClose={() => setShowMaintenanceModal(false)}
        onSave={handleAddMaintenance}
        assets={assets}
      />
    </Layout>
  );
}