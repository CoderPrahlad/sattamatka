import React, { useState, useEffect, useCallback, useRef } from 'react';
  import './App.css';

  import AuthScreen from './components/AuthScreen';
  import Drawer from './components/Drawer';
  import Toast from './components/Toast';
  import { AddModal, WithdrawModal } from './components/Modals';

  import HomeScreen from './pages/HomeScreen';
  import GameTypePage from './pages/GameTypePage';
  import BetForm from './pages/BetForm';
  import { BidsPage, TxnsPage, WalletPage, SupportPage, HowToPlayPage, FAQPage, TermsPage, PrivacyPage } from './pages/OtherPages';
  import AdminPanel, { AdminLogin } from './pages/AdminPanel';

  import { INIT_BIDS, INIT_TXNS } from './data/gameData';

  const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  function apiCall(path, method = 'GET', body = null) {
    const token = localStorage.getItem('mk_token');
    return fetch(`${API}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      ...(body ? { body: JSON.stringify(body) } : {})
    }).then(r => r.json());
  }

function ProfileScreen({ user, showToast }) {
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [updating, setUpdating] = useState(false);

  // 🔥 1. Default premium avatar agar purana ya broken link ho 🔥
  const defaultAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky&backgroundColor=ffcc00";

  // 🔥 2. Smart URL Checker (Local vs Online image handle karne ke liye) 🔥
  const getAvatarUrl = () => {
    if (!user?.profile_pic) return defaultAvatar;
    if (user.profile_pic.startsWith('http')) return user.profile_pic;
    return `${API}${user.profile_pic}`; // Agar local path (/uploads/...) ho
  };

  const handleUpdate = async () => {
    if (!name) return showToast('Naam khali nahi chhod sakte!', 'err');
    
    setUpdating(true);
    try {
      const token = localStorage.getItem('mk_token');

      // Password Update Logic
      if (password) {
        if (password.length < 6) throw new Error('Password min 6 characters ka ho');
        const resPass = await apiCall('/api/auth/update-password', 'POST', { newPassword: password });
        if (!resPass.success) throw new Error(resPass.message || 'Password update fail');
      }

      // Profile Name Update (No Image upload anymore)
      const response = await fetch(`${API}/api/auth/update-profile`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ name: name })
      });

      const resProfile = await response.json();
      
      if (resProfile.success) {
        showToast('Profile Updated Successfully! 🚀', 'ok');
        setPassword('');
      } else {
        throw new Error(resProfile.message || 'Profile update fail');
      }

    } catch (err) {
      console.error(err);
      showToast(err.message || 'Server connection error!', 'err');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="screen" style={{ padding: '20px 15px', paddingBottom: 80 }}>
      <div style={{ background:'linear-gradient(135deg,#091f13,#0d3520)', padding:'20px', borderRadius:12, border:'1px solid rgba(240,165,0,0.3)', marginBottom:20 }}>
        <h3 style={{ color:'#f0a500', marginTop:0, textAlign:'center', fontFamily:'Rajdhani, sans-serif', fontSize: 22 }}>👤 MY PROFILE</h3>
        
        {/* 🔥 3. AVATAR DISPLAY WITH ERROR FALLBACK 🔥 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 25 }}>
          <div style={{ position: 'relative', width: 95, height: 95 }}>
            <img 
              src={getAvatarUrl()} 
              // Agar link broken hoga, toh ye code automatic default avatar set kar dega
              onError={(e) => { e.target.onerror = null; e.target.src = defaultAvatar; }} 
              alt="Avatar" 
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid #f0a500', padding: 3, background: '#0a1d13' }} 
            />
          </div>
        </div>

        <div style={{ marginBottom:15 }}>
          <label style={{ color:'#aaa', fontSize:12, marginBottom:5, display:'block', fontWeight: 'bold' }}>Mobile Number Verified ✅</label>
          <input 
            value={user?.mobile || '9999999999'} 
            disabled
            style={{ width:'100%', padding:'12px', borderRadius:6, border:'1px solid #11301e', background:'#06150c', color:'#888', boxSizing:'border-box', cursor: 'not-allowed' }} 
          />
        </div>

        <div style={{ marginBottom:15 }}>
          <label style={{ color:'#aaa', fontSize:12, marginBottom:5, display:'block', fontWeight: 'bold' }}>Full Name</label>
          <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            style={{ width:'100%', padding:'12px', borderRadius:6, border:'1px solid #1a4a2a', background:'#0a1d13', color:'#fff', boxSizing:'border-box' }} 
          />
        </div>

        <div style={{ marginBottom:25 }}>
          <label style={{ color:'#aaa', fontSize:12, marginBottom:5, display:'block', fontWeight: 'bold' }}>New Password</label>
          <input 
            type="password" 
            placeholder="Naya password likhein (optional)" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            style={{ width:'100%', padding:'12px', borderRadius:6, border:'1px solid #1a4a2a', background:'#0a1d13', color:'#fff', boxSizing:'border-box' }} 
          />
        </div>

        <button 
          onClick={handleUpdate} 
          disabled={updating}
          style={{ width:'100%', padding:'14px', background:'linear-gradient(90deg,#f59e0b,#fcd34d,#f59e0b)', border:'none', borderRadius:8, color:'#000', fontWeight:900, fontSize:15, cursor: updating ? 'not-allowed' : 'pointer', opacity: updating ? 0.7 : 1 }}>
          {updating ? 'SAVING DATA...' : 'UPDATE PROFILE'}
        </button>
      </div>

      <div style={{ background:'linear-gradient(135deg,#091f13,#0d3520)', padding:'20px', borderRadius:12, border:'1px solid rgba(240,165,0,0.3)' }}>
        <h3 style={{ color:'#f0a500', marginBottom:10, textAlign:'center', fontFamily:'Rajdhani, sans-serif', fontSize: 22 }}>🎧 HELP & SUPPORT</h3>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={() => window.open('https://wa.me/919999999999', '_blank')} style={{ flex:1, padding:'14px 10px', background:'rgba(37,211,102,0.1)', border:'1px solid #25D366', borderRadius:8, color:'#25D366', fontWeight:'bold' }}>💬 WhatsApp</button>
          <button onClick={() => window.open('https://t.me/matkaking_support', '_blank')} style={{ flex:1, padding:'14px 10px', background:'rgba(0,136,204,0.1)', border:'1px solid #0088cc', borderRadius:8, color:'#0088cc', fontWeight:'bold' }}>✈️ Telegram</button>
        </div>
      </div>
    </div>
  );
}

  // ── STARLINE / DISAWAR GAME LIST PAGE (UPDATED TO DARK GREEN & GOLD) ────────
  function CategoryGamesScreen({ category, onPlay }) {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    const getGameIcon = (name) => {
      if (!name) return '🎯';
      const n = name.toUpperCase();
      if (n.includes('MORNING'))  return '🌅';
      if (n.includes('NOON'))     return '☀️';
      if (n.includes('EVENING'))  return '🌇';
      if (n.includes('NIGHT'))    return '🌙';
      if (n.includes('DISAWAR'))  return '🎰';
      if (n.includes('GALI'))     return '🏙️';
      if (n.includes('FARID'))    return '🏰';
      if (n.includes('GAZI'))     return '👑';
      return '🎰';
    };

    const formatResult = (g) => {
      if (g.open_result || g.close_result) {
        return `${g.open_result || '***'} - ${g.jodi_result || '--'} - ${g.close_result || '***'}`;
      }
      return '*** -- ***';
    };

    useEffect(() => {
      const fetchGames = async () => {
        try {
          const token = localStorage.getItem('mk_token');
          const res = await fetch(`${API}/api/games?category=${category}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success) setGames(Array.isArray(data.games) ? data.games : []);
        } catch (err) {
          console.error('CategoryGames fetch error:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchGames();
    }, [category]);

    return (
      <div className="screen" style={{ paddingBottom: 80 }}>
        <style>{`
          /* 🔥 BIJLI (GOLD) BORDER ANIMATION 🔥 */
          @keyframes spinLight3 { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
          .cat-lightning { 
            position:absolute; top:-50%; left:-50%; width:200%; height:200%;
            background:conic-gradient(from 0deg, transparent 60%, rgba(255, 204, 0, 0.4) 80%, #ffcc00 95%, #fff 100%);
            animation:spinLight3 4s linear infinite; 
          }
          
          /* GAME CARD WRAPPER */
          .cat-game-wrapper { 
            position:relative; border-radius:10px; margin-bottom:12px;
            box-shadow: 0 4px 12px rgba(255, 204, 0, 0.15); transition:transform 0.2s ease;
            overflow:hidden; padding:2.5px; 
          }
          .cat-game-wrapper:hover { transform:translateY(-3px); }
          
          .cat-card-inner { 
            position:relative; background:linear-gradient(145deg, #021a14, #063d35);
            border-radius:8px; padding:12px 14px; z-index:2; height: 100%;
          }
          
          @keyframes spinIcon3 { 0%{transform:rotate(0deg)} 100%{transform:rotate(-360deg)} }
          .rotate-icon3 { display:inline-block; animation:spinIcon3 2s linear infinite; }
          
          /* PLAY BUTTON ACTIVE (GLOW REMOVED) */
          .cat-play-btn { 
            width:100%; padding:10px; border:none; border-radius:10px 40px 10px 40px;
            color:#001a17; font-weight:900; font-size:13px; cursor:pointer;
            display:flex; align-items:center; justify-content:center; gap:6px;
            background:linear-gradient(90deg, #ffcc00, #ffaa00, #ffcc00);
            background-size:200% auto; box-shadow:0 4px 8px rgba(0,0,0,0.4);
            transition:all 0.3s ease; letter-spacing:1px; 
          }
          .cat-play-btn:hover { background-position:right center; transform:scale(1.02); }
          
          .cat-play-btn-disabled { 
            width:100%; padding:10px; background:#0a1a12;
            border:1px solid rgba(255, 204, 0, 0.1); border-radius:10px 40px 10px 40px;
            color:#555; font-weight:900; font-size:13px; cursor:not-allowed;
            display:flex; align-items:center; justify-content:center; gap:6px;
            box-shadow: inset 0 2px 5px rgba(0,0,0,0.5);
          }

          /* Result number glow */
          @keyframes resultGlow {
            from { text-shadow: 0 0 5px #00e676; }
            to   { text-shadow: 0 0 20px #00ff88; }
          }
          .cat-result-number {
            animation: resultGlow 1.5s infinite alternate;
          }
        `}</style>

        {/* HEADER SECTION */}
        <div style={{ background:'linear-gradient(135deg, #021a14, #063d35)',
          padding:'16px 14px 12px', borderBottom:'2px solid rgba(255, 204, 0, 0.3)',
          marginBottom:14, textAlign:'center' }}>
          <div style={{ fontSize:32, marginBottom:4 }}>
            {category === 'starline' ? '⭐' : '🎰'}
          </div>
          <div style={{ color:'#ffcc00', fontSize:20, fontWeight:900,
            fontFamily:'Teko, sans-serif', letterSpacing:2 }}>
            {category === 'starline' ? 'STARLINE' : 'DISAWAR'} GAMES
          </div>
          <div style={{ color:'#00e676', fontSize:11, fontWeight:700, marginTop:2 }}>
            {games.filter(g => g.status === 'open').length} Games Open
          </div>
        </div>

        {/* GAMES LIST */}
        <div style={{ padding:'0 12px' }}>
          {loading ? (
            <div style={{ textAlign:'center', color:'#ffcc00', padding:60, fontWeight:700 }}>
              ⏳ Loading Games...
            </div>
          ) : games.length === 0 ? (
            <div style={{ textAlign:'center', color:'rgba(255,255,255,0.4)', padding:60, fontSize:14 }}>
              <div style={{ fontSize:40, marginBottom:10 }}>🚫</div>
              Koi game available nahi hai.
            </div>
          ) : (
            games.map(g => (
              <div key={g.id} className="cat-game-wrapper">
                <div className="cat-lightning"></div>
                
                <div className="cat-card-inner">
                  {/* TOP ROW — Time */}
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <div style={{ fontSize:10, color:'#ffcc00', fontWeight:800,
                      background:'rgba(255, 204, 0, 0.1)', padding:'2px 8px',
                      borderRadius:4, border:'1px solid rgba(255, 204, 0, 0.3)' }}>
                      {g.open_time}
                    </div>
                    <div style={{ fontSize:10, color:'#aaa', fontWeight:700 }}>
                      Close: {g.close_time}
                    </div>
                  </div>

                  {/* GAME NAME */}
                  <div style={{ textAlign:'center', fontSize:20, fontWeight:900,
                    color:'#fff', fontFamily:'Teko, sans-serif',
                    textTransform:'uppercase', textShadow:'0 0 20px rgba(255, 204, 0, 0.2)',
                    marginBottom:4, letterSpacing: 2 }}>
                    {getGameIcon(g.name)} {g.name}
                  </div>

                  {/* RESULT (GREEN) */}
                  <div className="cat-result-number" style={{ textAlign:'center', fontSize:22, fontWeight:900,
                    color:'#00e676', letterSpacing:'3px', fontFamily:'Orbitron, sans-serif',
                    marginBottom:8 }}>
                    {formatResult(g)}
                  </div>

                  {/* STATUS DOT */}
                  <div style={{ fontSize:10,
                    color: g.status === 'open' ? '#00e676' : '#ff4444',
                    fontWeight:800, marginBottom:10, fontFamily: 'Teko, sans-serif', letterSpacing: 1,
                    display:'flex', alignItems:'center', gap:5 }}>
                    <span style={{ width:7, height:7, borderRadius:'50%',
                      display:'inline-block',
                      background: g.status === 'open' ? '#00e676' : '#ff4444',
                      boxShadow: g.status === 'open' ? '0 0 6px #00e676' : '0 0 6px #ff4444'
                    }}></span>
                    {g.status ? g.status.toUpperCase() : 'CLOSE'}
                  </div>

                  {/* PLAY BUTTON */}
                  <button
                    onClick={() => g.status === 'open' && onPlay(g)}
                    disabled={g.status !== 'open'}
                    className={g.status === 'open' ? 'cat-play-btn' : 'cat-play-btn-disabled'}
                  >
                    {g.status === 'open' && <span className="rotate-icon3" style={{ fontSize:12 }}>◀</span>}
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

  // ── MAIN APP ─────────────────────────────────────────────────────────────────
  export default function App() {
    const isAdmin = window.location.pathname === '/admin' || window.location.search.includes('admin=1');

    const [user, setUser]                   = useState(null);
    const [authLoading, setAuthLoading]     = useState(true);
    const [tab, setTab]                     = useState('home');
    const [wallet, setWallet]               = useState(0);
    const [bids, setBids]                   = useState(INIT_BIDS);
    const [txns, setTxns]                   = useState(INIT_TXNS);
    const [modal, setModal]                 = useState(null);
    const [drawer, setDrawer]               = useState(false);
    const [toast, setToast]                 = useState(null);
    const [selectedGame, setSelectedGame]   = useState(null);
    const [selectedType, setSelectedType]   = useState(null);
    const [page, setPage]                   = useState('home');
    const [adminLoggedIn, setAdminLoggedIn] = useState(false);
    const [showNotices, setShowNotices]     = useState(false);
    const [noticesData, setNoticesData]     = useState([]);

    const walletRef        = useRef(0);
    const bidSubmittingRef = useRef(false);

    const showToast = (msg, type = 'ok') => setToast({ msg, type });

    useEffect(() => {
      const token = localStorage.getItem('mk_token');
      if (!token) { setAuthLoading(false); return; }
      apiCall('/api/auth/profile')
        .then(res => {
          if (res && res.success && res.user) setUser(res.user);
          else localStorage.removeItem('mk_token');
        })
        .catch(() => localStorage.removeItem('mk_token'))
        .finally(() => setAuthLoading(false));
    }, []);

    const fetchWallet = useCallback(() => {
      if (!localStorage.getItem('mk_token')) return;
      return apiCall('/api/wallet/balance')
        .then(d => {
          if (d && d.success) {
            const walletBal  = Number(d.wallet_balance  || 0);
            const winningBal = Number(d.winning_balance || 0);
            const total = walletBal + winningBal;
            walletRef.current = total;
            setWallet(total);
            return { walletBal, winningBal, total };
          }
          return null;
        })
        .catch(() => null);
    }, []);

    useEffect(() => { if (user) fetchWallet(); }, [user, fetchWallet]);
    useEffect(() => {
      if (!user) return;
      const interval = setInterval(fetchWallet, 30000);
      return () => clearInterval(interval);
    }, [user, fetchWallet]);

    const handleLogin = (u) => { setUser(u); setWallet(0); walletRef.current = 0; };

    const handleAdd = amt => {
      fetchWallet();
      setTxns(t => [{
        id: Date.now(), type: 'credit', name: 'Add Funds',
        date: new Date().toLocaleString('en-IN'),
        ref: '#MK' + Math.random().toString(36).slice(2, 10).toUpperCase(),
        amt, statusTxt: 'PENDING'
      }, ...t]);
      showToast(`Rs.${amt.toLocaleString()} added!`);
    };

    const handleWith = amt => {
      fetchWallet();
      setTxns(t => [{
        id: Date.now(), type: 'debit', name: 'Withdrawal',
        date: new Date().toLocaleString('en-IN'),
        ref: '#WD' + Date.now().toString().slice(-10),
        amt, statusTxt: 'PENDING'
      }, ...t]);
      showToast(`Withdrawal Rs.${amt.toLocaleString()} sent`);
    };

    const handleBidSubmit = async (data) => {
      if (bidSubmittingRef.current) {
        showToast('Bid processing ho rahi hai... ruko!', 'err');
        return;
      }
      bidSubmittingRef.current = true;
      const amount = data.totalAmt || data.amount || 0;

      try {
        const fresh = await fetchWallet();
        const currentBalance = fresh ? fresh.total : walletRef.current;

        if (amount > currentBalance) {
          showToast(`Insufficient balance! Available: Rs.${currentBalance.toLocaleString()}`, 'err');
          bidSubmittingRef.current = false;
          return;
        }

        if (data.numbers) {
          const results = await Promise.all(
            data.numbers.map(bet =>
              apiCall('/api/games/bid', 'POST', {
                game_id:   selectedGame.id,
                game_type: selectedType.id,
                number:    bet.num,
                amount:    bet.amt,
                session:   data.session || 'open'
              })
            )
          );
          const failed = results.find(r => !r.success);
          if (failed) {
            showToast(failed.message || 'Bid failed!', 'err');
            await fetchWallet();
            bidSubmittingRef.current = false;
            return;
          }
        } else {
          const res = await apiCall('/api/games/bid', 'POST', {
            game_id:   selectedGame.id,
            game_type: selectedType.id,
            number:    data.number,
            amount:    data.amount,
            session:   data.session || 'open'
          });
          if (!res.success) {
            showToast(res.message || 'Bid failed!', 'err');
            await fetchWallet();
            bidSubmittingRef.current = false;
            return;
          }
        }

        await fetchWallet();
        showToast(`Bid Rs.${amount.toLocaleString()} placed!`);

        const cat = selectedGame?.game_category;
        const backPage = cat === 'starline' ? 'starline' : cat === 'disawar' ? 'disawar' : 'home';
        setPage(backPage);
        setSelectedGame(null);
        setSelectedType(null);

      } catch (err) {
        await fetchWallet();
        showToast('Network error! Dobara try karo.', 'err');
      } finally {
        bidSubmittingRef.current = false;
      }
    };

    const navigate = (id) => {
      setPage(id);
      const validTabs = ['home', 'bids', 'disawar', 'wallet', 'profile', 'game'];
      if (validTabs.includes(id)) setTab(id);
    };

    const handleNav = (id) => {
      fetchWallet();
      if (id === 'add') setModal('add');
      else if (id === 'with') setModal('with');
      else { setPage(id); setSelectedGame(null); setSelectedType(null); setTab(id); }
    };

    const goBack = () => {
      const cat = selectedGame?.game_category;
      if (page === 'bet-form') {
        setPage('game-types');
        setSelectedType(null);
      } else if (page === 'game-types') {
        if (cat === 'starline') { setPage('starline'); setSelectedGame(null); }
        else if (cat === 'disawar') { setPage('disawar'); setSelectedGame(null); }
        else { setPage('home'); setSelectedGame(null); setTab('game'); }
      } else {
        setPage('home'); setTab('game');
      }
    };

    if (isAdmin) {
      if (!adminLoggedIn) return <AdminLogin onLogin={() => setAdminLoggedIn(true)} />;
      return <AdminPanel onLogout={() => setAdminLoggedIn(false)} />;
    }

    if (authLoading) {
      return (
        <div style={{ height:'100vh', display:'flex', justifyContent:'center', alignItems:'center',
          background:'#0a1d13', color:'#f0a500', fontSize:18, fontWeight:700,
          fontFamily:'Rajdhani, sans-serif' }}>
          Loading MatkaKing...
        </div>
      );
    }

    if (!user) return <AuthScreen onLogin={handleLogin} />;

    const isTxnTab  = page === 'txns';
    const isSubPage = ['game-types', 'bet-form', 'starline', 'disawar'].includes(page);

    const navTitle =
      page === 'game-types' ? selectedGame?.name :
      page === 'bet-form'   ? selectedType?.label :
      page === 'starline'   ? 'STARLINE' :
      page === 'disawar'    ? 'DISAWAR' :
      null;

    return (
      <>
        {/* TOP NAV */}
        <div className="topnav">
          <div className="tn-left">
            {isSubPage
              ? <div className="back-btn" onClick={goBack}>&#x2039;</div>
              : <div className="hamburger" onClick={() => setDrawer(true)}><span/><span/><span/></div>
            }
            <span className="brand">
              {isSubPage ? (navTitle || 'KHAJANA') : <>SATKA MATKA <em></em></>}
            </span>
          </div>
          <div className="tn-right">
            {isTxnTab && <div className="tn-filter show">Filter</div>}
            {!isTxnTab && (
              <div className="tn-wallet" onClick={() => { fetchWallet(); setPage('wallet'); setTab('wallet'); }}>
                <span>&#x1F4BC;</span>
                <span>Rs.{wallet.toLocaleString('en-IN', { minimumFractionDigits:2, maximumFractionDigits:2 })}</span>
              </div>
            )}
            <div className="tn-bell" style={{ cursor:'pointer' }} onClick={() => {
              apiCall('/api/notices').then(res => {
                if (res && res.success) setNoticesData(res.notices || []);
                setShowNotices(true);
              }).catch(() => setShowNotices(true));
            }}>
              &#x1F514;<div className="bell-dot"/>
            </div>
          </div>
        </div>

        {/* PAGES */}
        {page === 'home' && (
          <HomeScreen
            wallet={wallet}
            onAdd={() => setModal('add')}
            onWith={() => setModal('with')}
            onPlay={g => { setSelectedGame(g); setPage('game-types'); setTab('game'); }}
            navigate={navigate}
          />
        )}
        
        {/* PROFILE & SUPPORT SCREEN */}
        {page === 'profile' && <ProfileScreen user={user} showToast={showToast} />}

        {page === 'game-types' && (
          <GameTypePage
            game={selectedGame}
            onSelect={gt => { setSelectedType(gt); setPage('bet-form'); }}
          />
        )}

        {page === 'bet-form' && (
          <BetForm
            game={selectedGame}
            gameType={selectedType}
            wallet={wallet}
            onSubmit={handleBidSubmit}
          />
        )}

        {/* STARLINE */}
        {page === 'starline' && (
          <CategoryGamesScreen
            category="starline"
            onPlay={g => { setSelectedGame(g); setPage('game-types'); }}
          />
        )}

        {/* DISAWAR */}
        {page === 'disawar' && (
          <CategoryGamesScreen
            category="disawar"
            onPlay={g => { setSelectedGame(g); setPage('game-types'); }}
          />
        )}

        {page === 'bids'    && <BidsPage apiCall={apiCall}/>}
        {page === 'txns'    && <TxnsPage apiCall={apiCall} navigate={navigate}/>}
        {page === 'wallet'  && <WalletPage wallet={wallet} onAdd={() => setModal('add')} onWith={() => setModal('with')} user={user} navigate={navigate} apiCall={apiCall}/>}
        {page === 'support' && <SupportPage apiCall={apiCall} user={user} />}
        {page === 'htp'     && <HowToPlayPage onBack={() => setPage('home')} />}
        {page === 'faq'     && <FAQPage onBack={() => setPage('home')} />}
        {page === 'terms'   && <TermsPage onBack={() => setPage('home')} />}
        {page === 'privacy' && <PrivacyPage onBack={() => setPage('home')} />}

        {/* BOTTOM NAV */}
        {!isSubPage && (
          <div className="botnav">
            <div className={`bn-item${tab==='bids'?' active':''}`} onClick={() => navigate('bids')}>
              <span className="ni">&#x1F528;</span><span>My Bids</span>
            </div>
            <div className={`bn-item${tab==='disawar'?' active':''}`} onClick={() => navigate('disawar')}>
              <span className="ni" style={{ color: tab==='disawar' ? '#f0a500' : '#e5e7eb' }}>&#x1F3B0;</span>
              <span style={{ color: tab==='disawar' ? '#f0a500' : '#9ca3af' }}>Disawar</span>
            </div>
            
            {/* BEECH WALA BUTTON - GAME LIST KHOLEGA (🎮) */}
            <div className="bn-center" onClick={() => { setPage('home'); setTab('game'); setSelectedGame(null); setSelectedType(null); }}>
              <div className="home-circle"><span className="ni">🎮</span></div>
              <span style={{ color: tab==='game' ? '#f0a500' : '#9ca3af' }}>Game</span>
            </div>

            <div className={`bn-item${tab==='wallet'?' active':''}`} onClick={() => navigate('wallet')}>
              <span className="ni">&#x1F3E6;</span><span>Wallet</span>
            </div>

            {/* RIGHT BUTTON - PROFILE AUR SUPPORT KHOLEGA (🏠) */}
            <div className={`bn-item${tab==='profile'?' active':''}`} onClick={() => { setPage('profile'); setTab('profile'); }}>
              <span className="ni" style={{ color: tab==='profile' ? '#f0a500' : '#e5e7eb' }}>&#x1F3E0;</span>
              <span style={{ color: tab==='profile' ? '#f0a500' : '#9ca3af' }}>Home</span>
            </div>
          </div>
        )}

        {/* OVERLAYS */}
        {drawer && (
          <Drawer
            user={user}
            onClose={() => setDrawer(false)}
            onNav={handleNav}
            onLogout={() => {
              localStorage.removeItem('mk_token');
              setUser(null); setWallet(0); walletRef.current = 0; setDrawer(false);
            }}
          />
        )}
        {modal === 'add'  && <AddModal onClose={() => setModal(null)} onSuccess={handleAdd}/>}
        {modal === 'with' && <WithdrawModal wallet={wallet} onClose={() => setModal(null)} onSuccess={handleWith}/>}
        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)}/>}

        {/* NOTIFICATIONS */}
        {showNotices && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:9999,
            display:'flex', alignItems:'center', justifyContent:'center' }}
            onClick={() => setShowNotices(false)}>
            <div style={{ background:'#0d3526', width:'90%', maxWidth:350, borderRadius:16,
              overflow:'hidden', border:'1px solid #f0a500' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ background:'#f0a500', color:'#000', padding:'12px 16px',
                fontWeight:700, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:16 }}>Notifications</span>
                <span onClick={() => setShowNotices(false)} style={{ cursor:'pointer', fontSize:20, lineHeight:1 }}>X</span>
              </div>
              <div style={{ padding:16, maxHeight:'60vh', overflowY:'auto' }}>
                {noticesData.length === 0 ? (
                  <div style={{ color:'#aaa', textAlign:'center', padding:'30px 20px', fontSize:14 }}>
                    Abhi koi naya notification nahi hai.
                  </div>
                ) : (
                  noticesData.map((n, i) => (
                    <div key={n.id || i} style={{ background:'#1a4a2a', padding:12, borderRadius:8,
                      marginBottom:10, color:'#fff', fontSize:13,
                      borderLeft:'4px solid #22c55e', lineHeight:1.5 }}>
                      {n.message}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }