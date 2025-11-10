import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Award, Trophy, Star, Zap, Sparkles } from 'lucide-react';

const SalesDashboard = () => {
  const [data, setData] = useState({
    teams: [
      { name: 'Sales A', amount: 1500000 },
      { name: 'Sales B', amount: 2100000 },
      { name: 'Sales C', amount: 1800000 },
      { name: 'Sales D', amount: 1200000 },
      { name: 'Sales E', amount: 1600000 },
      { name: 'Sales F', amount: 900000 }
    ],
    lastUpdate: new Date().toISOString()
  });
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastMilestone, setLastMilestone] = useState(0);
  const [floatingShapes, setFloatingShapes] = useState([]);
  
  const TARGET = 10000000;
  const blueGradients = [
    'from-blue-400 via-blue-500 to-blue-600',
    'from-cyan-400 via-blue-500 to-indigo-600',
    'from-sky-400 via-blue-500 to-blue-700',
    'from-blue-300 via-cyan-400 to-blue-600',
    'from-indigo-400 via-blue-500 to-blue-600',
    'from-blue-500 via-sky-500 to-cyan-600'
  ];
  
  // Simulate data fetching
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        lastUpdate: new Date().toISOString()
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Calculate totals
  const totalAmount = data.teams.reduce((sum, team) => sum + team.amount, 0);
  const totalPercent = (totalAmount / TARGET) * 100;
  const rankedTeams = [...data.teams].sort((a, b) => b.amount - a.amount);
  const topPerformer = rankedTeams[0];
  
  // Milestone celebrations
  useEffect(() => {
    const currentMilestone = Math.floor(totalPercent / 25) * 25;
    if (currentMilestone > lastMilestone && currentMilestone > 0) {
      setShowConfetti(true);
      setLastMilestone(currentMilestone);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [totalPercent, lastMilestone]);
  
  // Floating geometric shapes
  useEffect(() => {
    const shapes = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 20 + Math.random() * 80,
      duration: 15 + Math.random() * 10,
      delay: Math.random() * 5,
      shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)]
    }));
    setFloatingShapes(shapes);
  }, []);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 overflow-auto relative">
      {/* Animated Background Geometric Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        {floatingShapes.map(shape => (
          <div
            key={shape.id}
            className="absolute"
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              animation: `float ${shape.duration}s ease-in-out infinite`,
              animationDelay: `${shape.delay}s`
            }}
          >
            {shape.shape === 'circle' && (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 blur-sm"></div>
            )}
            {shape.shape === 'square' && (
              <div className="w-full h-full rounded-lg bg-gradient-to-br from-indigo-400 to-blue-500 blur-sm transform rotate-45"></div>
            )}
            {shape.shape === 'triangle' && (
              <div className="w-0 h-0 border-l-[50px] border-r-[50px] border-b-[86px] border-l-transparent border-r-transparent border-b-blue-500 blur-sm"></div>
            )}
          </div>
        ))}
      </div>
      
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(80)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2.5 + Math.random() * 2}s`
              }}
            >
              {i % 3 === 0 ? (
                <Star className="w-6 h-6 text-blue-500 animate-spin-slow" fill="#3B82F6" />
              ) : i % 3 === 1 ? (
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 animate-pulse"></div>
              ) : (
                <div className="w-3 h-3 bg-gradient-to-br from-indigo-400 to-blue-600 transform rotate-45 animate-bounce"></div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Header with Animation */}
      <div className="text-center mb-6 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
        </div>
        <div className="relative">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-2xl animate-gradient-x">
            Dashboard
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
            <p className="text-blue-600 text-sm font-semibold animate-fade-in">
              Last Updated: {new Date(data.lastUpdate).toLocaleString('en-IN')}
            </p>
            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
          </div>
        </div>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Overall Progress Card */}
        <div className="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border-2 border-blue-200 relative overflow-hidden hover:shadow-blue-500/50 transition-all duration-500 hover:scale-[1.02]">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-40 h-40 bg-indigo-500 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-500">
                <Target className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-black bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">Overall Progress</h2>
                <p className="text-blue-600 text-sm font-semibold">Target: {formatCurrency(TARGET)}</p>
              </div>
            </div>
            
            <div className="mb-4 text-center">
              <div className="text-6xl font-black bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent mb-2 animate-pulse-slow">
                {totalPercent.toFixed(1)}%
              </div>
              <div className="text-2xl text-blue-700 font-bold">{formatCurrency(totalAmount)}</div>
            </div>
            
            <div className="relative h-12 bg-gradient-to-r from-blue-100 via-cyan-100 to-indigo-100 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 rounded-full transition-all duration-2000 ease-out relative"
                style={{ width: `${Math.min(totalPercent, 100)}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-shimmer"></div>
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-black text-sm drop-shadow-lg px-2 py-1 bg-blue-900/30 rounded-full backdrop-blur-sm">
                  {formatCurrency(totalAmount)} / {formatCurrency(TARGET)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Corner Decoration */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-10 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        </div>
        
        {/* Top Performer Card */}
        <div className="group relative bg-gradient-to-br from-blue-600 via-cyan-600 to-indigo-700 rounded-3xl shadow-2xl p-6 text-white overflow-hidden hover:shadow-blue-500/80 transition-all duration-500 hover:scale-[1.02]">
          {/* Geometric Pattern Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-32 h-32 border-4 border-white rounded-full animate-spin-slow"></div>
            <div className="absolute bottom-10 left-10 w-24 h-24 border-4 border-white transform rotate-45 animate-bounce-slow"></div>
            <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"></div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center justify-center text-center h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                <Trophy className="w-8 h-8 text-yellow-300 animate-bounce-slow" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black">Top Performer</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Zap className="w-5 h-5 text-yellow-300 animate-pulse" fill="#FDE047" />
                  <span className="text-sm font-semibold">Leading the Pack!</span>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="text-6xl font-black mb-3 animate-float bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent">
                {topPerformer.name}
              </div>
              <div className="text-5xl font-black mb-2 text-yellow-300 animate-pulse-slow">{formatCurrency(topPerformer.amount)}</div>
              <div className="text-2xl font-bold opacity-90">
                {((topPerformer.amount / TARGET) * 100).toFixed(1)}% of Target
              </div>
            </div>
            
            <div className="flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className="w-8 h-8 text-yellow-300 animate-bounce" 
                  fill="#FDE047"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
          
          {/* Glow Effect */}
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-cyan-400 rounded-full blur-3xl opacity-30 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-indigo-400 rounded-full blur-3xl opacity-30 group-hover:scale-150 transition-transform duration-700"></div>
        </div>
      </div>
      
      {/* Team Performance Section */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border-2 border-blue-200 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #3B82F6 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-slow">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">Team Performance</h2>
            </div>
            <div className="text-lg font-bold text-blue-600 flex items-center gap-2">
              <span className="animate-pulse">6 Teams 🚀</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {rankedTeams.map((team, index) => {
              const percent = (team.amount / TARGET) * 100;
              const getMedal = () => {
                if (index === 0) return { emoji: '🥇', gradient: 'from-yellow-400 via-yellow-500 to-amber-600', text: 'Gold', glow: 'shadow-yellow-500/50' };
                if (index === 1) return { emoji: '🥈', gradient: 'from-gray-300 via-gray-400 to-gray-500', text: 'Silver', glow: 'shadow-gray-400/50' };
                if (index === 2) return { emoji: '🥉', gradient: 'from-orange-400 via-orange-500 to-amber-600', text: 'Bronze', glow: 'shadow-orange-500/50' };
                return { emoji: `#${index + 1}`, gradient: blueGradients[index], text: `Rank ${index + 1}`, glow: 'shadow-blue-500/50' };
              };
              const medal = getMedal();
              
              return (
                <div
                  key={team.name}
                  className="group relative bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 rounded-xl p-4 shadow-lg border border-blue-200/50 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Animated background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-cyan-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    {/* Medal/Rank Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl font-black shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        {medal.emoji}
                      </div>
                      <TrendingUp className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    
                    {/* Team Name - Centered */}
                    <div className="text-center mb-3">
                      <h3 className="text-2xl font-black bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent mb-1 animate-float">
                        {team.name}
                      </h3>
                      <p className="text-xs font-bold text-blue-600">{medal.text} Position</p>
                    </div>
                    
                    {/* Amount - Centered */}
                    <div className="mb-3 text-center">
                      <div className="text-2xl font-black text-blue-700 mb-0.5">
                        {formatCurrency(team.amount)}
                      </div>
                      <div className="text-sm font-bold text-blue-500">
                        {percent.toFixed(1)}% of Target
                      </div>
                    </div>
                    
                    {/* Enhanced Progress Bar */}
                    <div className="relative h-8 bg-gradient-to-r from-slate-100 via-blue-50 to-cyan-50 rounded-xl overflow-hidden shadow-inner border border-blue-100/50">
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(59, 130, 246, 0.1) 10px, rgba(59, 130, 246, 0.1) 20px)'
                      }}></div>
                      
                      {/* Progress Fill */}
                      <div
                        className={`relative h-full bg-gradient-to-r ${blueGradients[index]} rounded-xl transition-all duration-1500 ease-out shadow-lg`}
                        style={{ width: `${percent}%` }}
                      >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-shimmer"></div>
                        
                        {/* Glossy Top Edge */}
                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-xl"></div>
                        
                        {/* Animated Dots */}
                        <div className="absolute inset-0 flex items-center px-2">
                          <div className="flex gap-1">
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className="w-1 h-1 bg-white rounded-full animate-pulse"
                                style={{ animationDelay: `${i * 0.2}s` }}
                              ></div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress Percentage Text */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-black text-blue-900 drop-shadow-sm bg-white/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                          {percent.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    
                    {/* Remaining Amount */}
                    <div className="mt-2 text-xs text-blue-600 font-semibold flex items-center justify-between">
                      <span>Remaining:</span>
                      <span className="text-blue-700">{formatCurrency(TARGET - team.amount)}</span>
                    </div>
                  </div>
                  
                  {/* Corner decoration */}
                  {index < 3 && (
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-300 to-cyan-400 rounded-full opacity-10 group-hover:scale-150 group-hover:opacity-20 transition-all duration-500"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 20px) scale(1.05); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-confetti {
          animation: confetti forwards;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fadeIn 2s ease-in;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default SalesDashboard;