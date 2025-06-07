import React from 'react';
import { Coins, TrendingUp, Clock, Users } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { RewardsChart } from './RewardsChart';

interface DashboardProps {
  isConnected: boolean;
  balance: number;
  stakedAmount: number;
  rewards: number;
}

export function Dashboard({ isConnected, balance, stakedAmount, rewards }: DashboardProps) {
  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coins className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400">Connect your wallet to view your dashboard and start earning rewards</p>
        </div>
      </div>
    );
  }

  const apy = stakedAmount > 0 ? ((rewards / stakedAmount) * 365 * 24 * 100).toFixed(1) : '0';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Monitor your staking performance and rewards</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="RWT Balance"
          value={balance.toFixed(2)}
          change="+12.5%"
          icon={<Coins className="w-6 h-6" />}
          color="purple"
        />
        <StatsCard
          title="Staked Amount"
          value={stakedAmount.toFixed(2)}
          change="+8.2%"
          icon={<TrendingUp className="w-6 h-6" />}
          color="blue"
        />
        <StatsCard
          title="Pending Rewards"
          value={rewards.toFixed(4)}
          change="+24.1%"
          icon={<Clock className="w-6 h-6" />}
          color="green"
        />
        <StatsCard
          title="APY"
          value={`${apy}%`}
          change="+3.2%"
          icon={<Users className="w-6 h-6" />}
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Rewards Over Time</h3>
          <RewardsChart />
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Portfolio Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Available Balance</span>
              <span className="text-white font-medium">{balance.toFixed(2)} RWT</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Staked Amount</span>
              <span className="text-white font-medium">{stakedAmount.toFixed(2)} RWT</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Pending Rewards</span>
              <span className="text-green-400 font-medium">{rewards.toFixed(4)} RWT</span>
            </div>
            <div className="border-t border-white/20 pt-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span className="text-white">Total Value</span>
                <span className="text-white">{(balance + stakedAmount + rewards).toFixed(2)} RWT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}