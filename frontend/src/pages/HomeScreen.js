import React, { useState, useEffect } from 'react';

// 🔥 FIX 1: Yahan 'navigate' add kiya hai 🔥
export default function HomeScreen({ wallet, onAdd, onWith, onPlay, navigate }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tooltipInfo, setTooltipInfo] = useState(null);

  const sliderImages = [
    "https://placehold.co/400x150/063d35/ffcc00/png?text=PLAY+MATKA+WIN+BIG&font=Montserrat",
    "https://placehold.co/400x150/021f1b/00cc44/png?text=100%25+TRUSTED+APP&font=Montserrat",
    "https://placehold.co/400x150/021a14/ff2244/png?text=FASTEST+WITHDRAWAL&font=Montserrat",
    "https://placehold.co/400x150/000000/FFD700/png?text=DAILY+JACKPOT+OFFERS&font=Montserrat"
  ];

  // 🔥 PREMIUM ICONS FOR GAMES 🔥
  const getGameIcon = (name) => {
    if (!name) return '🎯';
    const n = name.toUpperCase();
    if (n.includes('TIME')) return '⏳';
    if (n.includes('MILAN')) return '🎲';
    if (n.includes('KALYAN')) return '👑';
    if (n.includes('RAJDHANI')) return '🏰';
    if (n.includes('MAIN')) return '💎';
    if (n.includes('MADHUR')) return '🏺';
    if (n.includes('SRIDEVI')) return '👸';
    if (n.includes('SUPREME')) return '🌟';
    if (n.includes('KUBER')) return '💰';
    if (n.includes('NIGHT')) return '🌙';
    if (n.includes('DAY')) return '☀️';
    return '🎰'; 
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const token = localStorage.getItem('mk_token');
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'; 
        
        const res = await fetch(`${API_URL}/api/games`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setGames(data);
        } else if (data && data.games) {
          setGames(data.games);
        } else if (data && data.data) {
          setGames(data.data);
        }
      } catch (err) {
        console.error("Games fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  const formatResult = (resStr) => {
    if (!resStr) return "*** -- ***";
    return resStr.replace(/[_]/g, '-').replace(/-/g, ' -- ');
  };

  return (
    <div className="screen" style={{ paddingBottom: 80 }}>
      
      <style>{`
        /* SLIDER ANIMATION */
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .infinite-slider {
          display: flex; gap: 10px; width: max-content;
          animation: scroll 15s linear infinite;
        }
        .infinite-slider:hover { animation-play-state: paused; }

        /* ACTION BUTTONS */
        .action-btn {
          flex: 1; padding: 12px; border: none; border-radius: 20px; 
          color: #fff; font-weight: 900; font-size: 13px; cursor: pointer; 
          display: flex; align-items: center; justify-content: center; gap: 6px; 
          box-shadow: 0 4px 10px rgba(0,0,0,0.3); transition: all 0.3s ease;
          text-transform: uppercase; letter-spacing: 1px;
        }
        .action-btn:hover { transform: scale(1.03); }

        /* PLAY NOW SYMBOL ROTATE */
        @keyframes spinIcon {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        .rotate-icon { display: inline-block; animation: spinIcon 2s linear infinite; }

        /* 🔥 BIJLI (GOLD) BORDER ANIMATION 🔥 */
        @keyframes spinLight {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .lightning-spin {
          position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
          background: conic-gradient(from 0deg, transparent 60%, rgba(255, 204, 0, 0.4) 80%, #ffcc00 95%, #fff 100%);
          animation: spinLight 4s linear infinite; 
        }

        /* 🔥 TOP BUTTONS GOLD WRAPPER 🔥 */
        .top-btn-wrapper {
          flex: 1; position: relative; border-radius: 25px; overflow: hidden;
          padding: 2px; box-shadow: 0 4px 10px rgba(255, 204, 0, 0.25);
          transition: transform 0.2s ease;
        }
        .top-btn-wrapper:hover { transform: translateY(-3px); }
        .top-btn-inner {
          width: 100%; height: 100%; padding: 10px;
          background: linear-gradient(145deg, #021a14, #063d35);
          border: none; border-radius: 23px; color: #ffcc00; font-weight: 900; font-size: 12px; 
          cursor: pointer; display: flex; align-items: center; justify-content: center; 
          gap: 6px; letter-spacing: 1px; position: relative; z-index: 2;
        }

        /* GAME CARD WRAPPER */
        .game-wrapper {
          position: relative; border-radius: 10px; margin-bottom: 12px;
          box-shadow: 0 4px 12px rgba(255, 204, 0, 0.15); transition: transform 0.2s ease;
          overflow: hidden; padding: 2.5px;
        }
        .game-wrapper:hover { transform: translateY(-3px); }
        .game-card-content {
          position: relative; background: linear-gradient(145deg, #021a14, #063d35);
          border-radius: 8px; padding: 10px 12px; z-index: 2; height: 100%;
        }

        /* PLAY BUTTON ACTIVE (GLOW REMOVED) */
        .play-btn-active {
          width: 100%; padding: 10px; border: none; border-radius: 10px 40px 10px 40px;
          color: #001a17; font-weight: 900; font-size: 13px; cursor: pointer; 
          display: flex; align-items: center; justify-content: center; gap: 6px;
          background: linear-gradient(90deg, #ffcc00, #ffaa00, #ffcc00);
          background-size: 200% auto;
          box-shadow: 0 4px 8px rgba(0,0,0,0.4); /* Standard shadow, no yellow glow */
          transition: all 0.3s ease; letter-spacing: 1px;
        }
        .play-btn-active:hover {
          background-position: right center;
          transform: scale(1.03);
          /* Hover par bhi koi extra glow nahi aayega */
        }

        /* SHINE on play button */
        @keyframes shineMove {
          0%   { left: -100%; }
          100% { left: 100%; }
        }

        .play-btn-disabled {
          width: 100%; padding: 10px; background: #0a1a12; 
          border: 1px solid rgba(255, 204, 0, 0.1); border-radius: 10px 40px 10px 40px;
          color: #555; font-weight: 900; font-size: 13px; cursor: not-allowed; 
          display: flex; align-items: center; justify-content: center; gap: 6px;
          box-shadow: inset 0 2px 5px rgba(0,0,0,0.5);
        }

        /* Result number glow */
        @keyframes resultGlow {
          from { text-shadow: 0 0 5px #00e676; }
          to   { text-shadow: 0 0 20px #00ff88; }
        }
        .result-number {
          animation: resultGlow 1.5s infinite alternate;
        }
      `}</style>

      {/* MARQUEE */}
      <div style={{ background: 'rgba(2,20,15,0.95)', padding: '6px 0', borderBottom: '1px solid rgba(255, 204, 0, 0.18)', overflow: 'hidden' }}>
        <marquee style={{ color: '#ffcc00', fontSize: 12, fontWeight: 800, letterSpacing: '0.5px' }}>
           Welcome To World Best Online Matka Play App... Play and Enjoy!
        </marquee>
      </div>

      <div style={{ padding: '12px 12px 0 12px' }}>
        
        {/* STARLINE & DISAWAR */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <div className="top-btn-wrapper">
            <div className="lightning-spin" style={{ animationDuration: '3s' }}></div>
            <button className="top-btn-inner" onClick={() => navigate && navigate('starline')}>▶ STARLINE</button>
          </div>
          <div className="top-btn-wrapper">
            <div className="lightning-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}></div>
            <button className="top-btn-inner" onClick={() => navigate && navigate('disawar')}>▶ DISAWAR</button>
          </div>
        </div>

        {/* SLIDER */}
        <div style={{ overflow: 'hidden', marginBottom: 14, borderRadius: 8 }}>
          <div className="infinite-slider">
            {[...sliderImages, ...sliderImages].map((img, i) => (
              <img key={i} src={img} alt="Offers Slider" style={{ 
                width: 150, height: 70, borderRadius: 8, objectFit: 'cover',
                border: '1px solid rgba(255, 204, 0, 0.25)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.4)' 
              }} />
            ))}
          </div>
        </div>

        {/* ADD / WITHDRAW BUTTONS */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
          <button onClick={onAdd} className="action-btn" style={{ background: 'linear-gradient(to right, #006622, #00cc44)' }}>
            💰 ADD MONEY
          </button>
          <button onClick={onWith} className="action-btn" style={{ background: 'linear-gradient(to right, #660011, #ff2244)' }}>
            💸 WITHDRAW
          </button>
        </div>

        {/* GAMES LIST */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#ffcc00', padding: 40, fontWeight: 700 }}>⏳ Loading Games...</div>
        ) : games.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: 40 }}>Koi game available nahi hai.</div>
        ) : (
          games.map(g => (
            <div key={g.id} className="game-wrapper">
              
              <div className="lightning-spin"></div>

              <div className="game-card-content">
                
                {/* TOP ROW — Time + Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ 
                    fontSize: 10, color: '#ffcc00', fontWeight: 800,
                    background: 'rgba(255, 204, 0, 0.1)', padding: '2px 8px',
                    borderRadius: 4, border: '1px solid rgba(255, 204, 0, 0.3)'
                  }}>
                    {g.open_time}
                  </div>
                  
                  <div 
                    style={{ position: 'relative' }} 
                    onMouseEnter={() => setTooltipInfo(g.id)}
                    onMouseLeave={() => setTooltipInfo(null)}
                    onClick={() => setTooltipInfo(tooltipInfo === g.id ? null : g.id)}
                  >
                    <div style={{ 
                      color: '#ffcc00', border: '1.5px solid rgba(255, 204, 0, 0.6)', borderRadius: '50%', 
                      width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      fontSize: 10, fontWeight: 900, cursor: 'pointer', background: 'rgba(255, 204, 0, 0.1)'
                    }}>i</div>
                    
                    {tooltipInfo === g.id && (
                      <div style={{ 
                        position: 'absolute', right: 0, top: 22,
                        background: '#021a14', border: '1px solid rgba(255, 204, 0, 0.4)',
                        borderRadius: 6, padding: '6px 10px', 
                        color: '#fff', fontSize: 10, fontWeight: 700, zIndex: 50, 
                        whiteSpace: 'nowrap', boxShadow: '0 8px 16px rgba(0,0,0,0.8)'
                      }}>
                        <div style={{ marginBottom: 4 }}>🟢 Open: <span style={{ color: '#ffcc00' }}>{g.open_time || '--:--'}</span></div>
                        <div>🔴 Close: <span style={{ color: '#ffcc00' }}>{g.close_time || '--:--'}</span></div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* GAME NAME */}
                <div style={{ 
                  textAlign: 'center', fontSize: 19, fontWeight: 900, color: '#fff', 
                  fontFamily: 'Teko, sans-serif', textTransform: 'uppercase',
                  marginTop: 2, letterSpacing: 2,
                  textShadow: '0 0 20px rgba(255, 204, 0, 0.2)'
                }}>
                  {getGameIcon(g.name)} {g.name}
                </div>

                {/* RESULT */}
                <div className="result-number" style={{ 
                  textAlign: 'center', fontSize: 23, fontWeight: 900, color: '#00e676', 
                  margin: '4px 0 8px 0', letterSpacing: '3px',
                  fontFamily: 'Orbitron, sans-serif'
                }}>
                  {formatResult(g.result)}
                </div>

                {/* STATUS DOT */}
                <div style={{ 
                  fontSize: 10,
                  color: g.status === 'open' ? '#00cc44' : '#ff2244', 
                  fontWeight: 800, marginBottom: 10,
                  display: 'flex', alignItems: 'center', gap: 5,
                  fontFamily: 'Teko, sans-serif', letterSpacing: 2
                }}>
                  <span style={{ 
                    width: 7, height: 7,
                    background: g.status === 'open' ? '#00cc44' : '#ff2244', 
                    borderRadius: '50%', display: 'inline-block',
                    boxShadow: g.status === 'open' ? '0 0 6px #00cc44' : '0 0 6px #ff2244'
                  }}></span>
                  {g.status ? g.status.toUpperCase() : 'CLOSE'}
                </div>

                {/* PLAY BUTTON */}
                <button 
                  onClick={() => onPlay(g)} 
                  disabled={g.status !== 'open'} 
                  className={g.status === 'open' ? 'play-btn-active' : 'play-btn-disabled'}
                >
                  {g.status === 'open' && <span className="rotate-icon" style={{ fontSize: 12 }}>◀</span>}
                  {g.status === 'open' ? 'PLAY NOW' : 'MARKET CLOSED'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}