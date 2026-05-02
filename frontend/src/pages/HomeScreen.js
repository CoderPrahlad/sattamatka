import React, { useState, useEffect } from 'react';

export default function HomeScreen({ wallet, onAdd, onWith, onPlay, navigate }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const sliderImages = [
    "https://placehold.co/400x150/0d2a1a/f0a500/png?text=PLAY+MATKA+WIN+BIG&font=Montserrat",
    "https://placehold.co/400x150/111111/22c55e/png?text=100%25+TRUSTED+APP&font=Montserrat",
    "https://placehold.co/400x150/2b0a0a/ef4444/png?text=FASTEST+WITHDRAWAL&font=Montserrat",
    "https://placehold.co/400x150/000000/f0a500/png?text=DAILY+JACKPOT+OFFERS&font=Montserrat"
  ];

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
    if (!resStr) return "***   --   ***";
    return resStr.replace(/[_]/g, '-').replace(/-/g, '   ');
  };

  // 🔥 Game ke naam ko letters mein todne ka function (Wave Animation ke liye)
  const renderAnimatedTitle = (title) => {
    if (!title) return null;
    const words = title.split(' ');
    
    return words.map((word, wordIndex) => (
      <React.Fragment key={wordIndex}>
        {word.split('').map((char, charIndex) => (
          <span key={`${wordIndex}-${charIndex}`}>{char}</span>
        ))}
        {wordIndex < words.length - 1 && <>&nbsp;</>}
      </React.Fragment>
    ));
  };

  return (
    <div className="screen" style={{ paddingBottom: 80 }}>
      
      {/* Marquee */}
      <div style={{ background: '#0a1d13', padding: '6px 0', borderBottom: '1px solid #1a4a2a', overflow: 'hidden' }}>
        <marquee style={{ color: '#f0a500', fontSize: 12, fontWeight: 800, letterSpacing: '0.5px' }}>
           Welcome To World Best Online Matka Play App... Play and Enjoy!
        </marquee>
      </div>

      <div style={{ padding: '12px 12px 0 12px' }}>
        
        {/* Starline & Disawar */}
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

        {/* Slider */}
        <div style={{ overflow: 'hidden', marginBottom: 14, borderRadius: 8 }}>
          <div className="infinite-slider">
            {[...sliderImages, ...sliderImages].map((img, i) => (
              <img key={i} src={img} alt="Offers Slider" style={{ 
                width: 150, height: 70, borderRadius: 8, objectFit: 'cover', border: '1px solid #1a4a2a', boxShadow: '0 4px 8px rgba(0,0,0,0.4)' 
              }} />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 25 }}>
          <button onClick={onAdd} className="action-btn" style={{ background: 'linear-gradient(to right, #16a34a, #22c55e)' }}>
            💰 ADD MONEY
          </button>
          <button onClick={onWith} className="action-btn" style={{ background: 'linear-gradient(to right, #dc2626, #ef4444)' }}>
            💸 WITHDRAW
          </button>
        </div>

        {/* Games List (Lucky Fortune Style) */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#f0a500', padding: 40, fontWeight: 700 }}>⏳ Loading Games...</div>
        ) : games.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', padding: 40 }}>Koi game available nahi hai.</div>
        ) : (
          games.map(g => (
            <div key={g.id} className="lucky-card">
              
              <div className="lucky-title">
                {renderAnimatedTitle(g.name)}
              </div>

              <div className="lucky-numbers">
                {formatResult(g.result)}
              </div>

              <div className="lucky-time-row">
                <div>OPEN<br/>{g.open_time || '--:--'}</div>
                <div>||</div>
                <div>CLOSE<br/>{g.close_time || '--:--'}</div>  
              </div>

              <button 
                className={`lucky-btn ${g.status !== 'open' ? 'disabled' : ''}`}
                onClick={() => onPlay(g)}
                disabled={g.status !== 'open'}
              >
                {g.status === 'open' ? 'PLAY GAME' : 'MARKET CLOSED'}
              </button>

            </div>
          ))
        )}
      </div>
    </div>
  );
}