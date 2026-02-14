import React, { useState } from 'react';
import { View } from './types';
import Home from './components/Home';
import Simulation from './components/Simulation';
import AgentsInfo from './components/AgentsInfo';
import RulesInfo from './components/RulesInfo';
import ReplayBrowser from './components/ReplayBrowser';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home onNavigate={setCurrentView} />;
      case 'simulation':
        return <Simulation onBack={() => setCurrentView('home')} />;
      case 'agents':
        return <AgentsInfo onBack={() => setCurrentView('home')} />;
      case 'rules':
        return <RulesInfo onBack={() => setCurrentView('home')} />;
      case 'replays':
        return <ReplayBrowser onBack={() => setCurrentView('home')} />;
      default:
        return <Home onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-200 font-sans overflow-hidden flex flex-col">
      {/* 
         Global overlay scanlines or vignette could be added here for extra retro feel 
         pointer-events-none absolute inset-0 bg-[url('scanlines.png')] opacity-10 z-50
      */}
      <div className="flex-1 overflow-hidden relative">
          {renderView()}
      </div>
    </div>
  );
};

export default App;