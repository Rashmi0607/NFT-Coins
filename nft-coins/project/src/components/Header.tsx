import React from 'react';
import { Layers, Wallet, Wallet as WalletX } from 'lucide-react';
import type { Tab } from '../App';

interface HeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  isConnected: boolean;
  userAddress: string;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

export function Header({ 
  activeTab, 
  setActiveTab, 
  isConnected, 
  userAddress, 
  connectWallet, 
  disconnectWallet 
}: HeaderProps) {
  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard' },
    { id: 'staking' as Tab, label: 'Staking' },
    { id: 'token' as Tab, label: 'Token Info' },
    { id: 'contracts' as Tab, label: 'Smart Contracts' },
    { id: 'docs' as Tab, label: 'Documentation' },
  ];

  return (
    <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Layers className="w-8 h-8 text-purple-400" />
              <h1 className="text-xl font-bold text-white">Nori Farm</h1>
            </div>
            
            <nav className="hidden md:flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm text-gray-300">Connected</div>
                  <div className="text-xs text-gray-400">
                    {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                  </div>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  <WalletX className="w-4 h-4" />
                  <span>Disconnect</span>
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}