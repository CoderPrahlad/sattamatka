import React, { useState } from 'react';

// Yeh aapka API_URL jo direct connect karega
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ── LIGHTNING WRAPPER FOR AUTH ──
const LightningWrapper = ({ children }) => (
  <div className="lightning-wrapper" style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', padding: '3px', marginBottom: '20px' }}>
    <div className="lightning-spin"></div>
    <div className="lightning-content" style={{ position: 'relative', zIndex: 2, background: 'rgba(5, 15, 5, 0.97)', borderRadius: '18px', height: '100%', width: '100%', padding: '22px' }}>
      {children}
    </div>
  </div>
);

export default function AuthScreen({ onLogin }) {
  const [tab, setTab] = useState('login');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const go = async () => {
    setErr('');
    setLoading(true);
    try {
      let endpoint = '';
      let payload = {};

      if (tab === 'login') {
        if (!mobile || !password) { setErr('Mobile aur password daalo'); setLoading(false); return; }
        endpoint = '/api/auth/login';
        payload = { mobile, password };
      } else {
        if (!name || !mobile || !password) { setErr('Sab fields zaroori hain'); setLoading(false); return; }
        if (mobile.length !== 10) { setErr('Valid 10-digit mobile daalo'); setLoading(false); return; }
        if (password.length < 6) { setErr('Password minimum 6 characters'); setLoading(false); return; }
        endpoint = '/api/auth/register';
        payload = { name, mobile, password };
      }

      // 🔥 DIRECT FETCH LAGAYA HAI, BINA api.js KE 🔥
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Agar server ka koi nakhra hua toh yahan pakda jayega
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const res = await response.json();

      if (!res.success) { 
        setErr(res.message || `${tab === 'login' ? 'Login' : 'Registration'} failed`); 
        setLoading(false); 
        return; 
      }

      localStorage.setItem('mk_token', res.token);
      onLogin(res.user);

    } catch (e) {
      console.error("Auth Error:", e);
      // 🔥 ASLI ERROR SCREEN PAR DIKHEGA 🔥
      setErr(`Asli Error: ${e.message}`);
    }
    setLoading(false);
  };

  const switchTab = (t) => { setTab(t); setErr(''); setName(''); setMobile(''); setPassword(''); };

  return (
    <div className="auth-wrap">
      <div className="auth-logo">SATKA MATKA <em></em></div>
      <div className="auth-sub">India's #1 Matka Gaming Platform</div>

      <LightningWrapper>
        <div className="auth-tabs">
          <div className={`at${tab === 'login' ? ' active' : ''}`} onClick={() => switchTab('login')}>Login</div>
          <div className={`at${tab === 'register' ? ' active' : ''}`} onClick={() => switchTab('register')}>Register</div>
        </div>

        {tab === 'register' && (
          <div className="fg">
            <label className="fl">Full Name</label>
            <input
              className="fi"
              type="text"
              placeholder="Aapka naam"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
        )}

        <div className="fg">
          <label className="fl">Mobile Number</label>
          <input
            className="fi"
            type="tel"
            placeholder="10-digit mobile"
            maxLength={10}
            value={mobile}
            onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
          />
        </div>

        <div className="fg" style={{ position: 'relative' }}>
          <label className="fl">Password</label>
          <input
            className="fi"
            type={showPass ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && go()}
            style={{ paddingRight: 40 }}
          />
          <span
            onClick={() => setShowPass(p => !p)}
            style={{ position: 'absolute', right: 12, top: 34, cursor: 'pointer', fontSize: 16, userSelect: 'none' }}
          >
            {showPass ? '🙈' : '👁️'}
          </span>
        </div>

        {/* Error dikhane wala box thoda clear kiya h */}
        {err && <div className="err-msg" style={{fontSize: '13px', lineHeight: '1.4', padding: '10px'}}>{err}</div>}

        <button className="btn-g" onClick={go} disabled={loading}>
          {loading ? '⏳ Please wait...' : tab === 'login' ? '🔐 Login' : '🚀 Create Account'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 10, color: '#bbb', marginTop: 12 }}>
          18+ Only. Play Responsibly.
        </p>
      </LightningWrapper>
    </div>
  );
}