'use client'
import { useState } from 'react'
import { AVATARS } from './comments-store'

export function ProfileSetup({ onSave, onClose }) {
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState(AVATARS[0])

  const handleSave = () => {
    if (!name.trim()) return
    onSave({ name: name.trim(), avatar, id: Date.now().toString() })
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(26,23,20,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 24,
    }} onClick={onClose}>
      <div style={{
        background: '#faf7f2', borderRadius: 16, padding: 32,
        maxWidth: 400, width: '100%', boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
      }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 6, color: '#1a1714' }}>
          Create your travel profile
        </h3>
        <p style={{ fontSize: 13, color: '#8a8078', marginBottom: 24, lineHeight: 1.6 }}>
          No sign-up needed. Just pick a name and emoji so the group knows who's commenting.
        </p>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8a8078', marginBottom: 8 }}>
            Your name
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder="Mom, Logan, Brother's GF..."
            autoFocus
            style={{
              width: '100%', padding: '10px 14px', fontSize: 15,
              border: '1px solid rgba(26,23,20,0.2)', borderRadius: 8,
              background: 'white', color: '#1a1714', outline: 'none',
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8a8078', marginBottom: 10 }}>
            Pick your travel emoji
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {AVATARS.map(a => (
              <button key={a} onClick={() => setAvatar(a)} style={{
                width: 44, height: 44, borderRadius: 10, fontSize: 22,
                border: avatar === a ? '2px solid #1a1714' : '1px solid rgba(26,23,20,0.15)',
                background: avatar === a ? '#f4efe6' : 'white',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.1s',
              }}>{a}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '11px', borderRadius: 8, border: '1px solid rgba(26,23,20,0.2)',
            background: 'transparent', fontSize: 14, cursor: 'pointer', color: '#8a8078',
            fontFamily: "'DM Sans', sans-serif",
          }}>Cancel</button>
          <button onClick={handleSave} disabled={!name.trim()} style={{
            flex: 2, padding: '11px', borderRadius: 8, border: 'none',
            background: name.trim() ? '#1a1714' : '#d0c8c0',
            color: 'white', fontSize: 14, fontWeight: 500, cursor: name.trim() ? 'pointer' : 'not-allowed',
            fontFamily: "'DM Sans', sans-serif", transition: 'background 0.15s',
          }}>
            {avatar} Set profile
          </button>
        </div>
      </div>
    </div>
  )
}
