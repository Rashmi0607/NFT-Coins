import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { StakingInterface } from './components/StakingInterface';
import { TokenInfo } from './components/TokenInfo';
import { SmartContracts } from './components/SmartContracts';
import { Documentation } from './components/Documentation';

export type Tab = 'dashboard' | 'staking' | 'token' | 'contracts' | 'docs';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string>('');
  const [balance, setBalance] = useState(1000);
  const [stakedAmount, setStakedAmount] = useState(0);
  const [rewards, setRewards] = useState(0);

  // Simulate wallet connection
  const connectWallet = () => {
    setIsConnected(true);
    setUserAddress('0x742d35Cc659C044E8134123b5C12345bC5d123456');
    setBalance(1000);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setUserAddress('');
    setBalance(0);
    setStakedAmount(0);
    setRewards(0);
  };

  // Simulate rewards accumulation
  useEffect(() => {
    if (stakedAmount > 0) {
      const interval = setInterval(() => {
        setRewards(prev => prev + (stakedAmount * 0.01));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [stakedAmount]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isConnected={isConnected}
        userAddress={userAddress}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
      />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard 
            isConnected={isConnected}
            balance={balance}
            stakedAmount={stakedAmount}
            rewards={rewards}
          />
        )}
        
        {activeTab === 'staking' && (
          <StakingInterface 
            isConnected={isConnected}
            balance={balance}
            setBalance={setBalance}
            stakedAmount={stakedAmount}
            setStakedAmount={setStakedAmount}
            rewards={rewards}
            setRewards={setRewards}
          />
        )}
        
        {activeTab === 'token' && <TokenInfo />}
        
        {activeTab === 'contracts' && <SmartContracts />}
        
        {activeTab === 'docs' && <Documentation />}
      </main>
    </div>
  );
}

export default App;