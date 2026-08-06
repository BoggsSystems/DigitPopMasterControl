import React from 'react';

export default function Header({ isStreaming, isConnected, serverUrl, viewerCount, credits, durationSeconds, onToggleStream }) {
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <header className="glass-panel" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
      {/* Left: Title & Session Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: isStreaming ? '#f43f5e' : '#64748b' }} className={isStreaming ? 'pulse-rose' : ''} />
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            DIGITPOP <span style={{ color: '#a855f7', WebkitTextFillColor: '#a855f7' }}>MASTER CONTROL</span>
          </h1>
        </div>

        <div style={{ background: isStreaming ? 'rgba(244, 63, 94, 0.15)' : 'rgba(100, 116, 139, 0.15)', border: `1px solid ${isStreaming ? 'rgba(244, 63, 94, 0.4)' : 'rgba(100, 116, 139, 0.3)'}`, color: isStreaming ? '#f43f5e' : '#94a3b8', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em' }}>
          {isStreaming ? `LIVE ${formatTime(durationSeconds)}` : 'OFFLINE'}
        </div>
      </div>

      {/* Center: Server Connection Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(15, 23, 42, 0.6)', padding: '6px 14px', borderRadius: '10px', border: '1px solid var(--border-glass)', fontSize: '0.85rem' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isConnected ? '#10b981' : '#f59e0b' }} className={isConnected ? 'pulse-emerald' : ''} />
        <span style={{ color: 'var(--text-muted)' }}>Server:</span>
        <span style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: 600 }}>{serverUrl}</span>
      </div>

      {/* Right: Metrics & Broadcast Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', background: 'rgba(15, 23, 42, 0.6)', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '1rem' }}>👁️</span>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>{viewerCount.toLocaleString()}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>VIEWERS</span>
          </div>
          <div style={{ width: '1px', background: 'var(--border-glass)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '1rem' }}>⚡</span>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#34d399' }}>{credits.toLocaleString()}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>CREDITS</span>
          </div>
        </div>

        <button 
          onClick={onToggleStream} 
          className="btn-primary" 
          style={{ background: isStreaming ? 'linear-gradient(135deg, #ef4444, #b91c1c)' : 'linear-gradient(135deg, #10b981, #059669)', boxShadow: isStreaming ? '0 4px 15px rgba(239, 68, 68, 0.4)' : '0 4px 15px rgba(16, 185, 129, 0.4)' }}
        >
          {isStreaming ? '⏹ STOP STREAM' : '▶ GO LIVE'}
        </button>
      </div>
    </header>
  );
}
