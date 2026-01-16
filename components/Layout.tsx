import React from 'react';
import { 
  Database, 
  FolderPlus, 
  Wrench, 
  FileText, 
  Menu,
  X
} from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  activeTab, 
  onTabChange, 
  onLogout 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // New Menu Structure
  const menuItems = [
    { id: 'cadastros', label: 'Cadastros', icon: FolderPlus },
    { id: 'registros', label: 'Todos os registros', icon: Database },
    { id: 'manutencoes', label: 'Manutenções', icon: Wrench },
    { id: 'relatorios', label: 'Relatórios', icon: FileText },
  ];

  const NavItem: React.FC<{ item: typeof menuItems[0] }> = ({ item }) => (
    <button
      onClick={() => {
        onTabChange(item.id);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        activeTab === item.id 
          ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      <item.icon size={20} />
      <span className="font-medium">{item.label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-hospital-900 text-slate-100 flex overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-hospital-700 bg-hospital-800/50 backdrop-blur-sm">
        <div className="p-6 flex items-center space-x-3 border-b border-hospital-700">
          <div className="w-8 h-8 shrink-0 bg-brand-500 rounded flex items-center justify-center font-bold text-white">S</div>
          <span className="text-sm font-bold leading-tight">Santa Casa de<br/>Sto. Antônio do Amparo</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
        </nav>

        <div className="p-4 border-t border-hospital-700">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-brand-400">
              <span className="font-bold text-lg text-white">ADM</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate">Administrador</p>
              <p className="text-xs text-slate-400 truncate">Acesso Total</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-64 h-full bg-hospital-800 p-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
               <span className="text-sm font-bold leading-tight">Santa Casa de<br/>Sto. Antônio do Amparo</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X />
              </button>
            </div>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <NavItem key={item.id} item={item} />
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-hospital-700 bg-hospital-800">
          <span className="font-bold text-sm leading-tight">Santa Casa de<br/>Sto. Antônio do Amparo</span>
          <button onClick={() => setIsMobileMenuOpen(true)}>
            <Menu />
          </button>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};