import React from 'react';
import { Coins, Users, TrendingUp, Shield, Copy } from 'lucide-react';

export function TokenInfo() {
  const tokenDetails = [
    { label: 'Token Name', value: 'RewardToken' },
    { label: 'Symbol', value: 'RWT' },
    { label: 'Decimals', value: '18' },
    { label: 'Total Supply', value: '1,000,000 RWT' },
    { label: 'Contract Address', value: '0x1234...5678' },
    { label: 'Network', value: 'Binance Smart Chain' },
  ];

  const allocation = [
    { category: 'Staking Rewards', percentage: 40, amount: '400,000 RWT', color: 'bg-purple-500' },
    { category: 'Liquidity Pool', percentage: 25, amount: '250,000 RWT', color: 'bg-blue-500' },
    { category: 'Development', percentage: 15, amount: '150,000 RWT', color: 'bg-green-500' },
    { category: 'Marketing', percentage: 10, amount: '100,000 RWT', color: 'bg-orange-500' },
    { category: 'Team', percentage: 10, amount: '100,000 RWT', color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Token Information</h1>
        <p className="text-gray-400">Complete details about the RewardToken (RWT)</p>
      </div>

      {/* Token Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">RewardToken</h2>
              <p className="text-gray-400">RWT</p>
            </div>
          </div>

          <div className="space-y-4">
            {tokenDetails.map((detail, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0">
                <span className="text-gray-400">{detail.label}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">{detail.value}</span>
                  {detail.label === 'Contract Address' && (
                    <button className="text-purple-400 hover:text-purple-300 transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-6">Token Allocation</h3>
          
          <div className="space-y-4">
            {allocation.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">{item.category}</span>
                  <span className="text-white font-medium">{item.percentage}%</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-white/20 rounded-full h-2">
                    <div 
                      className={`${item.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 min-w-max">{item.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Token Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Staking Rewards</h3>
          <p className="text-gray-400 text-sm">Earn passive income by staking your RWT tokens with competitive APY rates</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Community Driven</h3>
          <p className="text-gray-400 text-sm">Participate in governance and help shape the future of the platform</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Secure & Audited</h3>
          <p className="text-gray-400 text-sm">Smart contracts audited by leading security firms for maximum safety</p>
        </div>
      </div>

      {/* Tokenomics Chart */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-6">Tokenomics Overview</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-white">Distribution Strategy</h4>
            <div className="space-y-3">
              <div className="bg-white/5 rounded-lg p-4">
                <h5 className="text-purple-400 font-medium mb-2">Staking Rewards (40%)</h5>
                <p className="text-gray-400 text-sm">Distributed over 2 years to incentivize long-term holding and network participation</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h5 className="text-blue-400 font-medium mb-2">Liquidity Pool (25%)</h5>
                <p className="text-gray-400 text-sm">Provides deep liquidity on decentralized exchanges and reduces price volatility</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h5 className="text-green-400 font-medium mb-2">Development (15%)</h5>
                <p className="text-gray-400 text-sm">Funds platform development, audits, and technical improvements</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-medium text-white">Token Utility</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2" />
                <div>
                  <h5 className="text-white font-medium">Staking</h5>
                  <p className="text-gray-400 text-sm">Stake RWT to earn rewards and participate in network security</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
                <div>
                  <h5 className="text-white font-medium">Governance</h5>
                  <p className="text-gray-400 text-sm">Vote on protocol upgrades and parameter changes</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2" />
                <div>
                  <h5 className="text-white font-medium">Fee Reduction</h5>
                  <p className="text-gray-400 text-sm">Hold RWT to get reduced fees on platform operations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}