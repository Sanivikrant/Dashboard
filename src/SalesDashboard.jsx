import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Trophy, Star, Sparkles, RefreshCw } from 'lucide-react';

const SalesDashboard = () => {
  const [data, setData] = useState({
    teams: [],
    individuals: [],
    independentSales: 0,
    lastUpdate: new Date().toISOString(),
    loading: true,
    error: null
  });
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastMilestone, setLastMilestone] = useState(0);
  const [floatingShapes, setFloatingShapes] = useState([]);
  
  const TARGET = 10000000; 
  const DEADLINE = new Date('2025-11-30T23:59:59');
  
  // Google Sheets CSV URLs
  const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR-xZM6xxrwv_XRmlLEi5PHnF5JX6QXloLTKk9HlH5WKgX08KESJFzBEbPPWtmOuBHmq-Gf4Evdusm3/pub?gid=0&single=true&output=csv';
  
  // Individual Sales CSV URL
  const INDIVIDUAL_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRTr8BTA9HBgjurHo5H88_1uhm-cSkGuXTDYckX2-OEam0dsTstCjognbDucJYO0_J12yXq2R-Glz_C/pub?output=csv';
  
  const blueGradients = [
    'from-blue-400 via-blue-500 to-blue-600',
    'from-cyan-400 via-blue-500 to-indigo-600',
    'from-sky-400 via-blue-500 to-blue-700',
    'from-blue-300 via-cyan-400 to-blue-600',
    'from-indigo-400 via-blue-500 to-blue-600',
    'from-blue-500 via-sky-500 to-cyan-600',
    'from-blue-400 via-indigo-500 to-blue-600',
    'from-cyan-300 via-blue-400 to-indigo-500',
    'from-sky-300 via-cyan-500 to-blue-600'
  ];
  
  // Fetch data from Google Sheets CSV
  const fetchSheetData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));
      
      // Fetch team data
      const teamResponse = await fetch(SHEET_CSV_URL);
      const teamCsvText = await teamResponse.text();
      
      // Parse team CSV
      const teamLines = teamCsvText.trim().split('\n');
      const teams = [];
      let independentSales = 0;
      
      for (let i = 1; i < teamLines.length; i++) {
        const line = teamLines[i].trim();
        if (!line) continue;
        
        // Split by comma, handling empty first column
        const parts = line.split(',');
        
        if (parts.length >= 2) {
          const name = parts[0].replace(/^"|"$/g, '').trim();
          const amountStr = parts[1].replace(/^"|"$/g, '').trim();
          const amount = parseFloat(amountStr.replace(/[^0-9.-]/g, ''));
          
          if (!isNaN(amount) && amount > 0) {
            if (!name || name === '') {
              // Empty team name - this is Independent Sales
              independentSales = amount;
            } else {
              // Regular team entry
              teams.push({ name, amount });
            }
          }
        }
      }
      
      teams.sort((a, b) => b.amount - a.amount);
      
      // Fetch individual data
      const individualResponse = await fetch(INDIVIDUAL_SHEET_CSV_URL);
      const individualCsvText = await individualResponse.text();
      
      // Parse individual CSV (columns: Person Name, Amount, Photo URL)
      const individualLines = individualCsvText.trim().split('\n');
      const individuals = [];
      
      for (let i = 1; i < individualLines.length; i++) {
        const line = individualLines[i].trim();
        if (!line) continue;
        
        const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (matches && matches.length >= 3) {
          const name = matches[0].replace(/^"|"$/g, '').trim();
          const amountStr = matches[1].replace(/^"|"$/g, '').trim();
          const photoUrl = matches[2].replace(/^"|"$/g, '').trim();
          const amount = parseFloat(amountStr.replace(/[^0-9.-]/g, ''));
          
          if (name && !isNaN(amount) && amount > 0 && photoUrl) {
            individuals.push({ name, amount, photoUrl });
          }
        }
      }
      
      // Sort individuals by amount and get top 3
      individuals.sort((a, b) => b.amount - a.amount);
      const topIndividuals = individuals.slice(0, 3);
      
      setData({
        teams,
        individuals: topIndividuals,
        independentSales,
        lastUpdate: new Date().toISOString(),
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load data from Google Sheets. Please check the connection.'
      }));
    }
  };
  
  // Initial fetch and auto-refresh every 60 seconds
  useEffect(() => {
    fetchSheetData();
    const interval = setInterval(fetchSheetData, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Calculate totals including Independent Sales
  const teamTotal = data.teams.reduce((sum, team) => sum + team.amount, 0);
  const totalAmount = teamTotal + data.independentSales;
  const totalPercent = (totalAmount / TARGET) * 100;
  const topPerformer = data.teams[0];
  
  // Calculate days remaining
  const now = new Date();
  const daysRemaining = Math.ceil((DEADLINE - now) / (1000 * 60 * 60 * 24));
  
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
  
  // Split teams into left and right columns
  const leftTeams = data.teams.slice(0, Math.ceil(data.teams.length / 2));
  const rightTeams = data.teams.slice(Math.ceil(data.teams.length / 2));
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-3 overflow-auto relative">
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
      <div className="text-center mb-4 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
        </div>
        <div className="relative">
          <h1 className="text-6xl md:text-5xl font-black bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-2xl animate-gradient-x">
            PROTOUCH
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
            <p className="text-blue-600 text-sm font-semibold animate-fade-in">
              Last Updated: {new Date(data.lastUpdate).toLocaleString('en-IN')}
            </p>
            <button 
              onClick={fetchSheetData}
              className="ml-2 p-1 hover:bg-blue-100 rounded-full transition-colors"
              disabled={data.loading}
            >
              <RefreshCw className={`w-4 h-4 text-blue-600 ${data.loading ? 'animate-spin' : ''}`} />
            </button>
            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
          </div>
          {data.error && (
            <div className="mt-2 text-red-600 text-sm font-semibold bg-red-50 px-4 py-2 rounded-lg inline-block">
              {data.error}
            </div>
          )}
        </div>
      </div>
      
      {/* Main Layout: Left Teams | Center Total | Right Teams */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3 items-start">
        {/* LEFT COLUMN - First Half of Teams */}
        <div className="space-y-2.5">
          {leftTeams.map((team, index) => {
            const percent = (team.amount / TARGET) * 100;
            const actualIndex = index;
            const getMedal = () => {
              if (actualIndex === 0) return { emoji: '🥇' };
              if (actualIndex === 1) return { emoji: '🥈' };
              if (actualIndex === 2) return { emoji: '🥉' };
              return { emoji: `${actualIndex + 1}` };
            };
            const medal = getMedal();
            
            return (
              <div
                key={team.name}
                className="group relative bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 rounded-xl p-3.5 shadow-lg border border-blue-200/50 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-cyan-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`${actualIndex < 3 ? 'text-5xl' : 'text-3xl'} font-black transition-all duration-300`}>{medal.emoji}</div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-5xl font-black bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
                        {team.name}
                      </h3>
                      <TrendingUp className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="text-4xl font-black text-blue-700">
                      {formatCurrency(team.amount)}
                    </div>
                    <div className="text-sm font-bold text-blue-500">
                      {percent.toFixed(1)}% of Target
                    </div>
                  </div>
                  
                  <div className="relative h-7 bg-gradient-to-r from-slate-100 via-blue-50 to-cyan-50 rounded-full overflow-hidden shadow-inner border border-blue-100">
                    <div
                      className={`h-full bg-gradient-to-r ${blueGradients[actualIndex]} rounded-full transition-all duration-1500 ease-out relative shadow-lg`}
                      style={{ width: `${percent}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-shimmer"></div>
                      <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-ping"></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* CENTER COLUMN - Overall Progress & Top Performer */}
        <div className="space-y-3">
          {/* Overall Progress Card */}
          <div className="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-5 border-2 border-blue-200 relative overflow-hidden hover:shadow-blue-500/50 transition-all duration-500">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500 rounded-full blur-3xl animate-blob"></div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-500">
                  <Target className="w-7 h-7 text-white animate-pulse" />
                </div>
                <div className="text-center">
                  <h2 className="text-5xl font-black bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">Team Progress</h2>
                  <p className="text-blue-600 text-xs font-semibold">Target: {formatCurrency(TARGET)}</p>
                </div>
              </div>
              
              <div className="mb-3 text-center">
                <div className="text-9xl font-black bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent mb-1 animate-pulse-slow">
                  {totalPercent.toFixed(1)}%
                </div>
                <div className="text-5xl text-blue-700 font-bold">{formatCurrency(totalAmount)}</div>
                <div className="mt-1 text-xs font-bold text-blue-600">
                  {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Deadline passed'}
                </div>
              </div>
              
              <div className="relative h-10 bg-gradient-to-r from-blue-100 via-cyan-100 to-indigo-100 rounded-full overflow-hidden shadow-inner border border-blue-200">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 rounded-full transition-all duration-2000 ease-out relative shadow-lg"
                  style={{ width: `${Math.min(totalPercent, 100)}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-shimmer"></div>
                  <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg animate-bounce-slow"></div>
                </div>
              </div>
              
              <div className="mt-2 text-center text-xs font-bold text-blue-600">
                Remaining: {formatCurrency(TARGET - totalAmount)}
              </div>
            </div>
          </div>
          
          {/* Top Performer Card */}
          {topPerformer && (
            <div className="group relative bg-gradient-to-br from-blue-600 via-cyan-600 to-indigo-700 rounded-3xl shadow-2xl p-5 text-white overflow-hidden hover:shadow-blue-500/80 transition-all duration-500">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 right-10 w-32 h-32 border-4 border-white rounded-full animate-spin-slow"></div>
                <div className="absolute bottom-10 left-10 w-24 h-24 border-4 border-white transform rotate-45 animate-bounce-slow"></div>
              </div>
              
              <div className="relative z-10 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="w-7 h-7 text-yellow-300 animate-bounce-slow" />
                  <h2 className="text-4xl font-black">Top Performer</h2>
                </div>
                
                <div className="mb-2">
                  <div className="text-6xl font-black mb-1 animate-float bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent">
                    {topPerformer.name}
                  </div>
                  <div className="text-4xl font-black mb-1 text-yellow-300">{formatCurrency(topPerformer.amount)}</div>
                  <div className="text-base font-bold opacity-90">
                    {((topPerformer.amount / TARGET) * 100).toFixed(1)}% of Target
                  </div>
                </div>
                
                <div className="flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-6 h-6 text-yellow-300 animate-bounce" 
                      fill="#FDE047"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* RIGHT COLUMN - Second Half of Teams */}
        <div className="space-y-2.5">
          {rightTeams.map((team, index) => {
            const percent = (team.amount / TARGET) * 100;
            const actualIndex = leftTeams.length + index;
            const getMedal = () => {
              if (actualIndex === 0) return { emoji: '🥇' };
              if (actualIndex === 1) return { emoji: '🥈' };
              if (actualIndex === 2) return { emoji: '🥉' };
              return { emoji: `${actualIndex + 1}` };
            };
            const medal = getMedal();
            
            return (
              <div
                key={team.name}
                className="group relative bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 rounded-xl p-3.5 shadow-lg border border-blue-200/50 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-cyan-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`${actualIndex < 3 ? 'text-5xl' : 'text-3xl'} font-black transition-all duration-300`}>{medal.emoji}</div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-5xl font-black bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
                        {team.name}
                      </h3>
                      <TrendingUp className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="text-4xl font-black text-blue-700">
                      {formatCurrency(team.amount)}
                    </div>
                    <div className="text-sm font-bold text-blue-500">
                      {percent.toFixed(1)}% of Target
                    </div>
                  </div>
                  
                  <div className="relative h-7 bg-gradient-to-r from-slate-100 via-blue-50 to-cyan-50 rounded-full overflow-hidden shadow-inner border border-blue-100">
                    <div
                      className={`h-full bg-gradient-to-r ${blueGradients[actualIndex]} rounded-full transition-all duration-1500 ease-out relative shadow-lg`}
                      style={{ width: `${percent}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-shimmer"></div>
                      <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-ping"></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Top 3 Individual Performers - Full Width Row */}
      {data.individuals && data.individuals.length > 0 && (
        <div className="mb-3">
          <div className="text-center mb-4">
            <h2 className="text-4xl font-black bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 bg-clip-text text-transparent flex items-center justify-center gap-3">
              <Star className="w-8 h-8 text-yellow-500 animate-bounce-slow" fill="#EAB308" />
              Top 3 Counsellor 
              <Star className="w-8 h-8 text-yellow-500 animate-bounce-slow" fill="#EAB308" />
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-5xl mx-auto">
            {data.individuals.map((person, index) => {
              const cardStyles = [
                {
                  bg: 'bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100',
                  border: 'border-yellow-400',
                  glowColor: 'shadow-yellow-400',
                  textGradient: 'from-yellow-700 via-amber-600 to-yellow-800',
                  ringGradient: 'from-yellow-400 via-amber-500 to-yellow-600'
                },
                {
                  bg: 'bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200',
                  border: 'border-slate-400',
                  glowColor: 'shadow-slate-400',
                  textGradient: 'from-slate-700 via-gray-600 to-slate-800',
                  ringGradient: 'from-slate-400 via-gray-500 to-slate-600'
                },
                {
                  bg: 'bg-gradient-to-br from-orange-50 via-amber-100 to-orange-200',
                  border: 'border-orange-400',
                  glowColor: 'shadow-orange-400',
                  textGradient: 'from-orange-700 via-amber-700 to-orange-800',
                  ringGradient: 'from-orange-400 via-amber-500 to-orange-600'
                }
              ];
              
              const style = cardStyles[index];
              
              return (
                <div
                  key={person.name}
                  className={`group relative ${style.bg} rounded-2xl p-4 border-2 ${style.border} overflow-hidden hover:scale-105 transition-all duration-500 animate-slide-in ${style.glowColor} shadow-lg`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Decorative Background Elements */}
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
                  <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
                  
                  <div className="relative z-10 flex items-center gap-3">
                    {/* Medal on Left */}
                    <div className="flex-shrink-0">
                      <div className={`text-5xl ${index === 0 ? 'animate-bounce-slow' : ''}`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </div>
                    </div>
                    
                    {/* Photo with Animated Glow Ring */}
                    <div className="flex-shrink-0 relative">
                      <div className="absolute inset-0 rounded-full animate-spin-slow">
                        <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${style.ringGradient} opacity-75 blur-sm`}></div>
                      </div>
                      <div className="relative w-20 h-20 rounded-full overflow-hidden border-3 border-white shadow-xl group-hover:scale-110 transition-all duration-500">
                        <img 
                          src={person.photoUrl} 
                          alt={person.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&size=80&background=3B82F6&color=fff&bold=true`;
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className={`text-2xl font-black bg-gradient-to-r ${style.textGradient} bg-clip-text text-transparent truncate`}>
                        {person.name}
                      </div>
                      <div className={`text-2xl font-black bg-gradient-to-r ${style.textGradient} bg-clip-text text-transparent`}>
                        {formatCurrency(person.amount)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
          opacity: 0;
        }
        
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
      
      <footer className="bg-[#001f4d] text-white text-center py-3 text-sm fixed bottom-0 left-0 w-full">
        © 2025 Protouchpro Services Private Limited — All Rights Reserved
      </footer>
    </div>
  );
};

export default SalesDashboard;