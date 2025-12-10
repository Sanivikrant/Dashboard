import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Trophy, Star, Sparkles, RefreshCw } from 'lucide-react';

const SalesDashboard = () => {



  // new code 
  const [data, setData] = useState({
    teams: [],
    individuals: [],
    independentSales: 0,
    totalAmount: 0, // Add this
    lastUpdate: new Date().toISOString(),
    loading: true,
    error: null
  });





  // const [data, setData] = useState({
  //   teams: [],
  //   individuals: [],
  //   independentSales: 0,
  //   lastUpdate: new Date().toISOString(),
  //   loading: true,
  //   error: null
  // });

  const [showConfetti, setShowConfetti] = useState(false);
  const [lastMilestone, setLastMilestone] = useState(0);
  const [floatingShapes, setFloatingShapes] = useState([]);

  // Latest Sale Popup State
  const [latestSale, setLatestSale] = useState(null);
  const [showSalePopup, setShowSalePopup] = useState(false);
  const [previousSaleId, setPreviousSaleId] = useState(null);
  const [salePopupTimer, setSalePopupTimer] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showRocketAnimation, setShowRocketAnimation] = useState(false);
  const [showBlastScreen, setShowBlastScreen] = useState(false);

  const TARGET = 10000000;
  const DEADLINE = new Date('2025-12-30T23:59:59');

  // Google Sheets CSV URLs
  const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR-xZM6xxrwv_XRmlLEi5PHnF5JX6QXloLTKk9HlH5WKgX08KESJFzBEbPPWtmOuBHmq-Gf4Evdusm3/pub?gid=0&single=true&output=csv';

  // Individual Sales CSV URL
  const INDIVIDUAL_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRTr8BTA9HBgjurHo5H88_1uhm-cSkGuXTDYckX2-OEam0dsTstCjognbDucJYO0_J12yXq2R-Glz_C/pub?output=csv';

  // Latest Sale CSV URL
  const LATEST_SALE_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRrBFBzEUlrB3DqGGi7GLXMsunmqFbxn1kzmYEI9qBTCFxz7YIcjTAGJegeoANT0F6uL39K6hQb6tsP/pub?output=csv';

  const blueGradients = [
    'from-blue-400 via-blue-500 to-blue-600',
    'from-cyan-400 via-blue-500 to-indigo-600',
    'from-sky-400 via-blue-500 to-blue-700'
  ];

  // Team Card Component
  const TeamCard = ({ team, index, actualIndex }) => {
    const percent = (team.amount / TARGET) * 100;
    const getMedal = () => {
      if (actualIndex === 0) return '🥇';
      if (actualIndex === 1) return '🥈';
      if (actualIndex === 2) return '🥉';
      return `${actualIndex + 1}`;
    };

    return (
      <div
        className="group relative bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 rounded-xl p-3.5 shadow-lg border border-blue-200/50 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-in"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-cyan-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className={`${actualIndex < 3 ? 'text-5xl' : 'text-3xl'} font-black`}>{getMedal()}</div>
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
            {/* <div className="text-sm font-bold text-blue-500">
              {percent.toFixed(1)}% of Target
            </div> */}
          </div>

          {/* <div className="relative h-7 bg-gradient-to-r from-slate-100 via-blue-50 to-cyan-50 rounded-full overflow-hidden shadow-inner border border-blue-100">
            <div
              className={`h-full bg-gradient-to-r ${blueGradients[actualIndex % 3]} rounded-full transition-all duration-1500 ease-out relative shadow-lg`}
              style={{ width: `${percent}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-shimmer"></div>
              <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
              <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-ping"></div>
            </div>
          </div> */}
        </div>
      </div>
    );
  };

  // Play enrollment sound with music
  const playEnrollmentSound = () => {
    try {
      const audioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioContext = new audioContextClass();

      if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
          console.log('AudioContext resumed');
        });
      }

      const playTone = (frequency, duration, startTime, volume = 0.4) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        oscillator.frequency.setValueAtTime(frequency, startTime);

        gainNode.gain.setValueAtTime(volume, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      const now = audioContext.currentTime;

      playTone(523.25, 0.25, now, 0.5);
      playTone(659.25, 0.25, now + 0.15, 0.5);
      playTone(783.99, 0.25, now + 0.3, 0.5);
      playTone(1046.50, 0.4, now + 0.5, 0.6);
      playTone(1174.66, 0.35, now + 0.95, 0.6);
      playTone(1046.50, 0.5, now + 1.35, 0.7);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  // Fetch data from Google Sheets CSV
  const fetchSheetData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      const teamResponse = await fetch(SHEET_CSV_URL);
      const teamCsvText = await teamResponse.text();

      const teamLines = teamCsvText.trim().split('\n');
      const teams = [];
      let independentSales = 0;

      let fetchedTotal = 0;

      // Parse team data and find TOTAL
      for (let i = 1; i < teamLines.length; i++) {
        const line = teamLines[i].trim();
        if (!line) continue;

        const parts = line.split(',');

        if (parts.length >= 2) {
          const name = parts[0].replace(/^"|"$/g, '').trim();
          const amountStr = parts[1].replace(/^"|"$/g, '').trim();
          const amount = parseFloat(amountStr.replace(/[^0-9.-]/g, ''));

          if (!isNaN(amount) && amount > 0) {
            // Check if this is the TOTAL row
            if (name.toUpperCase() === 'TOTAL') {
              fetchedTotal = amount;
              break; // Stop after finding TOTAL
            } else if (name && name !== '') {
              // Add regular teams
              teams.push({ name, amount });
            } else {
              // Empty name = independent sales
              independentSales = amount;
            }
          }
        }
      }

      // for (let i = 1; i < teamLines.length; i++) {
      //   const line = teamLines[i].trim();
      //   if (!line) continue;

      //   const parts = line.split(',');

      //   if (parts.length >= 2) {
      //     const name = parts[0].replace(/^"|"$/g, '').trim();
      //     const amountStr = parts[1].replace(/^"|"$/g, '').trim();
      //     const amount = parseFloat(amountStr.replace(/[^0-9.-]/g, ''));

      //     if (!isNaN(amount) && amount > 0) {
      //       if (!name || name === '') {
      //         independentSales = amount;
      //       } else {
      //         teams.push({ name, amount });
      //       }
      //     }
      //   }
      // }

      teams.sort((a, b) => b.amount - a.amount);

      const individualResponse = await fetch(INDIVIDUAL_SHEET_CSV_URL);
      const individualCsvText = await individualResponse.text();

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

      individuals.sort((a, b) => b.amount - a.amount);
      const topIndividuals = individuals.slice(0, 3);



      // new code 
      // NEW
      setData({
        teams,
        individuals: topIndividuals,
        independentSales,
        totalAmount: fetchedTotal, // Add this new field
        lastUpdate: new Date().toISOString(),
        loading: false,
        error: null
      });


      // setData({
      //   teams,
      //   individuals: topIndividuals,
      //   independentSales,
      //   lastUpdate: new Date().toISOString(),
      //   loading: false,
      //   error: null
      // });
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load data from Google Sheets. Please check the connection.'
      }));
    }
  };

  // Fetch Latest Sale Data
  const fetchLatestSale = async () => {
    try {
      const response = await fetch(LATEST_SALE_CSV_URL);
      const csvText = await response.text();

      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        console.log('No data rows in latest sale sheet');
        return;
      }

      const lastLine = lines[lines.length - 1].trim();
      if (!lastLine) {
        console.log('Last line is empty');
        return;
      }

      console.log('Latest sale row:', lastLine);

      const parts = lastLine.split(',');

      if (parts.length >= 2) {
        const salesperson = parts[0].replace(/^"|"$/g, '').trim();
        const program = parts[1].replace(/^"|"$/g, '').trim();

        if (!salesperson || !program) {
          console.log('Missing Counsellor or program');
          return;
        }

        const saleId = `${lines.length}-${salesperson}-${program}`;

        console.log('Current sale ID:', saleId);
        console.log('Previous sale ID:', previousSaleId);

        if (saleId !== previousSaleId) {
          console.log('NEW SALE DETECTED!');

          playEnrollmentSound();
          setShowRocketAnimation(true);

          const newSale = {
            id: saleId,
            salesperson,
            program,
            timestamp: new Date().toISOString()
          };

          setLatestSale(newSale);

          if (salePopupTimer) {
            clearTimeout(salePopupTimer);
          }

          // const blastScreenTimer = setTimeout(() => {
          //   setShowBlastScreen(true);
          // }, 4000);

          const popupTimer = setTimeout(() => {
            setShowSalePopup(true);
            setShowCelebration(true);
            setShowBlastScreen(false);
            setShowRocketAnimation(false);
          }, 4000);

          const timer = setTimeout(() => {
            setShowSalePopup(false);
            setShowCelebration(false);
            setShowRocketAnimation(false);
            setShowBlastScreen(false);
          }, 29000);

          setSalePopupTimer(timer);
        }

        setPreviousSaleId(saleId);
      } else {
        console.log('Not enough columns in CSV');
      }
    } catch (error) {
      console.error('Error fetching latest sale:', error);
    }
  };

  // Initial fetch and auto-refresh every 60 seconds
  useEffect(() => {
    fetchSheetData();
    const interval = setInterval(fetchSheetData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch latest sale every 60 seconds
  useEffect(() => {
    fetchLatestSale();
    const interval = setInterval(fetchLatestSale, 60000);
    return () => {
      clearInterval(interval);
      if (salePopupTimer) {
        clearTimeout(salePopupTimer);
      }
    };
  }, [salePopupTimer]);

  // Calculate totals including Independent Sales
  // const teamTotal = data.teams.reduce((sum, team) => sum + team.amount, 0);
  // const totalAmount = teamTotal + data.independentSales;

  // new code 

  // NEW
  const totalAmount = data.totalAmount || 0;

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

  // Floating geometric shapes - reduced count
  useEffect(() => {
    const shapes = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 30 + Math.random() * 60,
      duration: 15 + Math.random() * 10,
      delay: Math.random() * 5,
      shape: ['circle', 'square'][i % 2]
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
          </div>
        ))}
      </div>

      {/* Confetti Effect - reduced particles */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(40)].map((_, i) => (
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
              {i % 2 === 0 ? (
                <Star className="w-6 h-6 text-blue-500" fill="#3B82F6" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500"></div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ROCKET ANIMATION - Optimized */}
      {showRocketAnimation && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
          <div
            className="absolute bottom-10 right-10 text-[200px] drop-shadow-2xl"
            style={{
              animation: 'rocket-launch 4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
              filter: 'drop-shadow(0 0 30px rgba(255, 165, 0, 1)) drop-shadow(0 0 50px rgba(255, 100, 0, 0.8))',
              textShadow: '0 0 30px rgba(255, 165, 0, 1), 0 0 60px rgba(255, 100, 0, 0.8)',
              willChange: 'transform'
            }}
          >
            🚀
          </div>

          <div
            className="absolute bottom-10 right-10 w-40 h-40 rounded-full blur-3xl opacity-70"
            style={{
              background: 'radial-gradient(circle, rgba(255, 165, 0, 0.9) 0%, rgba(255, 100, 0, 0.4) 100%)',
              animation: 'rocket-launch 4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
              willChange: 'transform'
            }}
          ></div>

          {/* Rocket trail particles - reduced from 20 to 8 */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`trail-${i}`}
              className="absolute text-4xl drop-shadow-2xl"
              style={{
                right: '45px',
                bottom: '65px',
                animation: `rocket-trail 4s ease-in forwards`,
                animationDelay: `${i * 0.2}s`,
                opacity: 0.9 - (i * 0.08),
                filter: 'drop-shadow(0 0 10px rgba(255, 165, 0, 0.9))',
                willChange: 'transform, opacity'
              }}
            >
              {['🔥', '💛', '🧡'][i % 3]}
            </div>
          ))}

          {/* Sparkle trail - reduced from 10 to 5 */}
          {[...Array(5)].map((_, i) => (
            <div
              key={`sparkle-trail-${i}`}
              className="absolute drop-shadow-lg"
              style={{
                right: `${35 + Math.random() * 30}px`,
                bottom: `${55 - i * 20}px`,
                animation: `sparkle-trail 4s ease-in forwards`,
                animationDelay: `${i * 0.3}s`,
                opacity: 0.7 - (i * 0.12),
                fontSize: '24px',
                willChange: 'transform, opacity'
              }}
            >
              ✨
            </div>
          ))}

          {/* Smoke clouds - reduced from 6 to 3 */}
          {[...Array(3)].map((_, i) => (
            <div
              key={`smoke-${i}`}
              className="absolute text-6xl drop-shadow-xl"
              style={{
                right: `${35 + i * 20}px`,
                bottom: `${55 - i * 15}px`,
                animation: `rocket-smoke 4s ease-in forwards`,
                animationDelay: `${i * 0.4}s`,
                opacity: 0.5 - (i * 0.15),
                filter: 'drop-shadow(0 0 8px rgba(255, 100, 0, 0.6))',
                willChange: 'transform, opacity'
              }}
            >
              💨
            </div>
          ))}
        </div>
      )}

      {/* FULL SCREEN BLAST EFFECT - Optimized */}
      {showBlastScreen && (
        <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-200 via-orange-400 to-red-600" style={{
            animation: 'blast-fade 3s ease-out forwards',
            willChange: 'opacity'
          }}></div>

          <div className="absolute inset-0" style={{
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.9) 0%, rgba(255,200,0,0.4) 40%, transparent 70%)',
            animation: 'flash-out 2s ease-out forwards',
            willChange: 'opacity'
          }}></div>

          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[300px] drop-shadow-2xl" style={{
            animation: 'blast-scale 0.8s cubic-bezier(0.36, 0, 0.66, -0.56) forwards',
            textShadow: '0 0 50px rgba(255, 100, 0, 1), 0 0 100px rgba(255, 50, 0, 0.8)',
            filter: 'drop-shadow(0 0 60px rgba(255, 100, 0, 1))',
            willChange: 'transform, opacity'
          }}>
            💥
          </div>

          {/* Shockwave rings - reduced from 3 to 2 */}
          {[...Array(2)].map((_, i) => (
            <div
              key={`ring-${i}`}
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 rounded-full"
              style={{
                borderColor: i % 2 === 0 ? 'rgba(255, 200, 0, 0.8)' : 'rgba(255, 100, 0, 0.8)',
                width: '80px',
                height: '80px',
                animation: `blast-ring 3s ease-out forwards`,
                animationDelay: `${i * 0.3}s`,
                boxShadow: `0 0 ${20 + i * 10}px rgba(255, 150, 0, 0.6)`,
                willChange: 'width, height, opacity'
              }}
            ></div>
          ))}

          {/* Explosion particles - reduced from 40 to 20 */}
          {[...Array(20)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute text-6xl drop-shadow-2xl"
              style={{
                left: '50%',
                top: '50%',
                animation: `particle-burst 3s ease-out forwards`,
                animationDelay: `${i * 0.06}s`,
                transform: `rotate(${(i * 360) / 20}deg) translateX(${150 + Math.random() * 100}px)`,
                filter: 'drop-shadow(0 0 15px rgba(255, 100, 0, 0.9))',
                textShadow: '0 0 20px rgba(255, 150, 0, 0.8)',
                willChange: 'transform, opacity'
              }}
            >
              {['🔥', '💫', '⚡', '✨'][i % 4]}
            </div>
          ))}

          {/* Light bursts - reduced from 6 to 3 */}
          {[...Array(3)].map((_, i) => (
            <div
              key={`light-${i}`}
              className="absolute rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${150 + Math.random() * 150}px`,
                height: `${150 + Math.random() * 150}px`,
                background: `radial-gradient(circle, rgba(255, ${200 - i * 15}, 0, 0.9) 0%, rgba(255, ${150 - i * 15}, 0, 0.3) 50%, transparent 70%)`,
                animation: `light-burst 3s ease-out forwards`,
                animationDelay: `${i * 0.3}s`,
                willChange: 'transform, opacity'
              }}
            ></div>
          ))}

          <div className="absolute inset-0 opacity-50" style={{
            background: 'repeating-linear-gradient(0deg, rgba(255,255,255,.1) 0px, rgba(255,255,255,.1) 2px, transparent 2px, transparent 4px)',
            animation: 'screen-flicker 0.3s infinite'
          }}></div>
        </div>
      )}

      {/* LATEST SALE POPUP WITH NEW DESIGN */}
      {showSalePopup && latestSale && (
        <>
          {/* Full Page Celebration Effects */}
          {showCelebration && (
            <div className="fixed inset-0 pointer-events-none z-40">
              {/* Falling Flowers - reduced */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={`flower-${i}`}
                  className="absolute animate-fall-flower"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: '-50px',
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${3 + Math.random() * 2}s`
                  }}
                >
                  <div className="text-4xl" style={{ filter: 'drop-shadow(0 0 10px rgba(255,192,203,0.8))' }}>
                    {['🌸', '🌺', '🌼'][i % 3]}
                  </div>
                </div>
              ))}

              {/* Sparkling Stars - reduced */}
              {[...Array(15)].map((_, i) => (
                <div
                  key={`star-${i}`}
                  className="absolute animate-twinkle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${1 + Math.random() * 2}s`
                  }}
                >
                  <Star className="w-6 h-6 text-yellow-400" fill="#FBBF24" />
                </div>
              ))}

              {/* Colorful Confetti - reduced */}
              {[...Array(50)].map((_, i) => {
                const colors = ['bg-pink-500', 'bg-yellow-400', 'bg-blue-500', 'bg-green-500'];
                const shapes = ['rounded-full', 'rounded-sm'];
                return (
                  <div
                    key={`confetti-${i}`}
                    className="absolute animate-confetti-burst"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 30}%`,
                      animationDelay: `${Math.random() * 1}s`,
                      animationDuration: `${2 + Math.random() * 3}s`
                    }}
                  >
                    <div className={`w-3 h-3 ${colors[i % 4]} ${shapes[i % 2]}`}></div>
                  </div>
                );
              })}

              {/* Sparkles - reduced */}
              {[...Array(20)].map((_, i) => (
                <div
                  key={`sparkle-${i}`}
                  className="absolute animate-sparkle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 4}s`
                  }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </div>
              ))}
            </div>
          )}

          {/* Central Popup */}
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="relative bg-gradient-to-br from-white via-pink-50 to-purple-50 rounded-3xl shadow-2xl p-8 max-w-2xl w-full mx-4 border-4 border-pink-300 animate-popup-bounce overflow-hidden">
              {/* Animated background glow */}
              <div className="absolute inset-0 opacity-20 rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 w-40 h-40 bg-pink-400 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-400 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/2 w-40 h-40 bg-indigo-400 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
              </div>

              {/* Corner Sparkles - reduced */}
              <div className="absolute -top-5 -left-5 text-7xl animate-bounce-slow drop-shadow-lg">✨</div>
              <div className="absolute -top-5 -right-5 text-7xl animate-bounce-slow drop-shadow-lg" style={{ animationDelay: '0.5s' }}>✨</div>

              <div className="relative z-10 text-center">
                {/* Trophy Icon */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl animate-pulse scale-150"></div>
                    <Trophy className="w-24 h-24 text-yellow-500 relative animate-bounce-slow drop-shadow-2xl" fill="#EAB308" />
                  </div>
                </div>

                {/* Congratulations Header */}
                <div className="mb-6">
                  <h2 className="text-6xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2 animate-gradient-x drop-shadow-lg">
                    🎉 Enrollment! 🎉
                  </h2>
                  <div className="flex justify-center gap-2">
                    <Star className="w-8 h-8 text-yellow-400 animate-spin-slow drop-shadow-lg" fill="#FBBF24" />
                    <Star className="w-8 h-8 text-yellow-400 animate-spin-slow drop-shadow-lg" fill="#FBBF24" style={{ animationDelay: '0.5s' }} />
                    <Star className="w-8 h-8 text-yellow-400 animate-spin-slow drop-shadow-lg" fill="#FBBF24" style={{ animationDelay: '1s' }} />
                  </div>
                </div>

                {/* Salesperson Name */}
                <div className="mb-6 bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 rounded-2xl p-6 border-2 border-pink-300 shadow-lg">
                  <p className="text-4xl font-bold text-gray-700 mb-2">Congratulations!</p>
                  <h3 className="text-6xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-lg">
                    {latestSale.salesperson}
                  </h3>
                </div>

                {/* Program  */}
                <div className="bg-white/90 rounded-xl p-5 border-2 border-purple-300 shadow-lg mb-6">
                  <p className="text-3xl font-bold text-gray-700 mb-2">Program:</p>
                  <p className="text-5xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent drop-shadow-lg">
                    {latestSale.program}
                  </p>
                </div>

                {/* Celebration Message */}
                <div className="mt-6">
                  <p className="text-4xl font-bold text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text">
                    🎊 Keep up the amazing work! 🎊
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
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
          {leftTeams.map((team, index) => (
            <TeamCard key={team.name} team={team} index={index} actualIndex={index} />
          ))}
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
                  {/* <div className="text-base font-bold opacity-90">
                    {((topPerformer.amount / TARGET) * 100).toFixed(1)}% of Target
                  </div> */}
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
          {rightTeams.map((team, index) => (
            <TeamCard
              key={team.name}
              team={team}
              index={index}
              actualIndex={leftTeams.length + index}
            />
          ))}
        </div>
      </div>

      {/* Top 3 Individual Performers - Full Width Row */}
      {data.individuals && data.individuals.length > 0 && (
        <div className="mb-3">
          <div className="text-center mb-4">
            <h2 className="text-5xl font-black bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 bg-clip-text text-transparent flex items-center justify-center gap-3">
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
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:scale-110 transition-all duration-500 bg-gradient-to-br from-blue-400 to-blue-600">
                      {person.photoUrl && person.photoUrl !== '' ? (
                        <img
                          src={person.photoUrl}
                          alt={person.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const fallback = e.target.nextElementSibling;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className="absolute inset-0 flex items-center justify-center text-white text-3xl font-black"
                        style={{ display: person.photoUrl && person.photoUrl !== '' ? 'none' : 'flex' }}
                      >
                        {person.name.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className={`text-4xl font-black bg-gradient-to-r ${style.textGradient} bg-clip-text text-transparent truncate`}>
                        {person.name}
                      </div>
                      <div className={`text-3xl font-black bg-gradient-to-r ${style.textGradient} bg-clip-text text-transparent`}>
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
  /* Optimized Animations - GPU Accelerated */
  
  @keyframes slide-in {
    from {
      opacity: 0;
      transform: translate3d(0, 20px, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
  
  @keyframes float {
    0%, 100% { transform: translate3d(0, 0, 0); }
    50% { transform: translate3d(0, -10px, 0); }
  }
  
  @keyframes confetti {
    0% { transform: translate3d(0, 0, 0) rotate(0deg); opacity: 1; }
    100% { transform: translate3d(0, 100vh, 0) rotate(720deg); opacity: 0; }
  }
  
  @keyframes blob {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
    33% { transform: translate3d(20px, -20px, 0) scale(1.1); }
    66% { transform: translate3d(-20px, 20px, 0) scale(0.9); }
  }
  
  @keyframes shimmer {
    0% { transform: translate3d(-100%, 0, 0); }
    100% { transform: translate3d(200%, 0, 0); }
  }
  
  @keyframes gradient-x {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes popup-bounce {
    0% { 
      opacity: 0;
      transform: scale(0.3) translate3d(0, -100px, 0);
    }
    50% {
      transform: scale(1.05) translate3d(0, 10px, 0);
    }
    70% {
      transform: scale(0.95) translate3d(0, -5px, 0);
    }
    100% {
      opacity: 1;
      transform: scale(1) translate3d(0, 0, 0);
    }
  }
  
  @keyframes fall-flower {
    0% {
      transform: translate3d(0, 0, 0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translate3d(0, 100vh, 0) rotate(360deg);
      opacity: 0.3;
    }
  }
  
  @keyframes twinkle {
    0%, 100% {
      opacity: 0.3;
      transform: scale(0.5);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }
  
  @keyframes confetti-burst {
    0% {
      transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate3d(0, 150vh, 0) rotate(720deg) scale(0.5);
      opacity: 0;
    }
  }
  
  @keyframes sparkle {
    0%, 100% {
      opacity: 0;
      transform: scale(0) rotate(0deg);
    }
    50% {
      opacity: 1;
      transform: scale(1.5) rotate(180deg);
    }
  }
  
  @keyframes rocket-launch {
    0% {
      transform: translate3d(0, 0, 0) rotate(0deg);
      opacity: 1;
    }
    50% {
      transform: translate3d(-50vw, -50vh, 0) rotate(-35deg);
    }
    100% {
      transform: translate3d(-50vw, -100vh, 0) rotate(-45deg);
      opacity: 0;
    }
  }
  
  @keyframes rocket-trail {
    0% {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
    100% {
      transform: translate3d(0, -350px, 0);
      opacity: 0;
    }
  }
  
  @keyframes rocket-smoke {
    0% {
      transform: translate3d(0, 0, 0) scale(0.5);
      opacity: 1;
    }
    100% {
      transform: translate3d(0, -250px, 0) scale(1.8);
      opacity: 0;
    }
  }

  @keyframes blast-fade {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }

  @keyframes blast-scale {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    50% {
      transform: scale(1.3);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes blast-ring {
    0% {
      transform: scale(0);
      opacity: 1;
      border-width: 4px;
    }
    100% {
      transform: scale(10);
      opacity: 0;
      border-width: 1px;
    }
  }

  @keyframes particle-burst {
    0% {
      transform: translate3d(0, 0, 0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate3d(200px, 0, 0) scale(0);
      opacity: 0;
    }
  }

  @keyframes light-burst {
    0% {
      transform: translate3d(0, -50%, 0) scale(0.5);
      opacity: 1;
    }
    100% {
      transform: translate3d(0, -50%, 0) scale(2);
      opacity: 0;
    }
  }

  @keyframes sparkle-trail {
    0% {
      transform: translate3d(0, 0, 0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate3d(0, -150px, 0) scale(0.3);
      opacity: 0;
    }
  }

  @keyframes flash-out {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }

  @keyframes screen-flicker {
    0%, 100% { transform: translate3d(0, 0, 0); }
    20% { transform: translate3d(0, 2px, 0); }
    40% { transform: translate3d(0, -2px, 0); }
    60% { transform: translate3d(0, 1px, 0); }
    80% { transform: translate3d(0, -1px, 0); }
  }
  
  /* Utility Classes */
  .animate-slide-in {
    animation: slide-in 0.5s ease-out forwards;
    opacity: 0;
    will-change: transform, opacity;
  }
  
  .animate-confetti {
    animation: confetti forwards;
    will-change: transform, opacity;
  }
  
  .animate-blob {
    animation: blob 7s ease-in-out infinite;
    will-change: transform;
  }
  
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  
  .animation-delay-4000 {
    animation-delay: 4s;
  }
  
  .animate-shimmer {
    animation: shimmer 3s infinite;
    will-change: transform;
  }
  
  .animate-gradient-x {
    background-size: 200% 200%;
    animation: gradient-x 3s ease infinite;
  }
  
  .animate-spin-slow {
    animation: spin 8s linear infinite;
    will-change: transform;
  }
  
  .animate-pulse-slow {
    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  .animate-bounce-slow {
    animation: bounce 3s infinite;
    will-change: transform;
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
    will-change: transform;
  }
  
  .animate-fade-in {
    animation: fade-in 0.5s ease-in;
  }
  
  .animate-popup-bounce {
    animation: popup-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    will-change: transform, opacity;
  }
  
  .animate-fall-flower {
    animation: fall-flower forwards;
    will-change: transform, opacity;
  }
  
  .animate-twinkle {
    animation: twinkle infinite;
  }
  
  .animate-confetti-burst {
    animation: confetti-burst forwards;
    will-change: transform, opacity;
  }
  
  .animate-sparkle {
    animation: sparkle 3s ease-in-out infinite;
  }

  .animate-blast-fade {
    animation: blast-fade 3s ease-out forwards;
    will-change: opacity;
  }
  
  /* Performance optimization - reduce animations on low-end devices */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`}</style>

      <footer className="bg-[#001f4d] text-white text-center py-3 text-sm fixed bottom-0 left-0 w-full">
        © 2025 Protouchpro Services Private Limited — All Rights Reserved
      </footer>
    </div>
  );
};

export default SalesDashboard;