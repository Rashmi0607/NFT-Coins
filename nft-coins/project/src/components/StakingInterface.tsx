import React, { useState } from 'react';
import { Lock, Unlock, Zap, AlertTriangle } from 'lucide-react';

interface StakingInterfaceProps {
  isConnected: boolean;
  balance: number;
  setBalance: (balance: number) => void;
  stakedAmount: number;
  setStakedAmount: (amount: number) => void;
  rewards: number;
  setRewards: (rewards: number) => void;
}

export function StakingInterface({
  isConnected,
  balance,
  setBalance,
  stakedAmount,
  setStakedAmount,
  rewards,
  setRewards
}: StakingInterfaceProps) {
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);

  const handleStake = async () => {
    const amount = parseFloat(stakeAmount);
    if (amount > 0 && amount <= balance) {
      setIsStaking(true);
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setBalance(balance - amount);
      setStakedAmount(stakedAmount + amount);
      setStakeAmount('');
      setIsStaking(false);
    }
  };

  const handleUnstake = async () => {
    const amount = parseFloat(unstakeAmount);
    if (amount > 0 && amount <= stakedAmount) {
      setIsUnstaking(true);
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStakedAmount(stakedAmount - amount);
      setBalance(balance + amount);
      setUnstakeAmount('');
      setIsUnstaking(false);
    }
  };

  const handleClaimRewards = async () => {
    if (rewards > 0) {
      setBalance(balance + rewards);
      setRewards(0);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400">Connect your wallet to start staking and earning rewards</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Staking Interface</h1>
        <p className="text-gray-400">Stake your RWT tokens to earn rewards</p>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-2">Available Balance</h3>
          <p className="text-3xl font-bold text-purple-400">{balance.toFixed(2)} RWT</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-2">Staked Amount</h3>
          <p className="text-3xl font-bold text-blue-400">{stakedAmount.toFixed(2)} RWT</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-2">Pending Rewards</h3>
          <p className="text-3xl font-bold text-green-400">{rewards.toFixed(4)} RWT</p>
        </div>
      </div>

      {/* Staking Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stake Tokens */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center space-x-2 mb-4">
            <Lock className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">Stake Tokens</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount to Stake
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={() => setStakeAmount(balance.toString())}
                  className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Max
                </button>
              </div>
            </div>
            
            <button
              onClick={handleStake}
              disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || parseFloat(stakeAmount) > balance || isStaking}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isStaking ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Staking...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Stake Tokens</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Unstake Tokens */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center space-x-2 mb-4">
            <Unlock className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Unstake Tokens</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount to Unstake
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setUnstakeAmount(stakedAmount.toString())}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Max
                </button>
              </div>
            </div>
            
            <button
              onClick={handleUnstake}
              disabled={!unstakeAmount || parseFloat(unstakeAmount) <= 0 || parseFloat(unstakeAmount) > stakedAmount || isUnstaking}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isUnstaking ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Unstaking...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Unstake Tokens</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Claim Rewards */}
      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Zap className="w-8 h-8 text-green-400" />
            <div>
              <h3 className="text-xl font-semibold text-white">Claim Rewards</h3>
              <p className="text-gray-300">Available: {rewards.toFixed(4)} RWT</p>
            </div>
          </div>
          <button
            onClick={handleClaimRewards}
            disabled={rewards <= 0}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>Claim Rewards</span>
          </button>
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-amber-600/20 border border-amber-500/30 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-amber-400 mt-1" />
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Staking Information</h4>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>• Rewards are calculated in real-time at 1% per hour</li>
              <li>• No minimum staking period or withdrawal fees</li>
              <li>• Rewards compound automatically when restaked</li>
              <li>• Maximum APY is approximately 876% (1% per hour)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}