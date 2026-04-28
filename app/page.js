'use client'
import { useState } from 'react'
import { tripMeta, cambodiaItinerary, japanItinerary, transportInfo, bookingChecklist } from './data'
import { useProfile } from './components/comments-store'
import { ProfileSetup } from './components/ProfileSetup'
import { CommentSection } from './components/CommentSection'

const COLORS = {
  red:   { bg: '#fdf1ee', border: '#e8b4a8', accent: '#c8402a', text: '#7a2518' },
  green: { bg: '#eef5f0', border: '#a8ccb4', accent: '#2a6b4a', text: '#1a4a30' },
  gold:  { bg: '#fdf6e8', border: '#e8d090', accent: '#b8883a', text: '#7a5820' },
  blue:  { bg: '#eef2f8', border: '#a8bcdc', accent: '#2a4a7a', text: '#1a2e50' },
}

function Tag({ color, children }) {
  const c = COLORS[color] || COLORS.blue
  return (
    <span style={{
      display: 'inline-block', fontSize: 11, fontWeight: 500,
      padding: '2px 8px', borderRadius: 20,
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      letterSpacing: '0.02em',
    }}>{children}</span>
  )
}

function SectionTitle({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
      <h2 style={{ fontSize: 28, fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#1a1714' }}>
        {children}
      </h2>
      <div style={{ flex: 1, height: 1, background: 'rgba(26,23,20,0.12)' }} />
    </div>
  )
}

function DayCard({ day, isLast, profile, onNeedProfile }) {
  const [open, setOpen] = useState(false)
  const c = COLORS[day.color] || COLORS.blue
  const sectionId = `day-${day.days.replace(/\s+/g, '-').toLowerCase().slice(0, 40)}`

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '3px 1fr', gap: 0, marginBottom: isLast ? 0 : 4 }}>
      <div style={{ background: c.accent, borderRadius: '3px 0 0 3px', opacity: 0.6 }} />
      <div style={{
        background: open ? c.bg : 'white',
        border: `1px solid ${open ? c.border : 'rgba(26,23,20,0.1)'}`,
        borderLeft: 'none', borderRadius: '0 8px 8px 0',
      }}>
        <div onClick={() => setOpen(!open)} style={{ padding: '14px 18px', cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#8a8078', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>
                {day.days}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>{day.icon}</span>
                <span style={{ fontSize: 17, fontWeight: 500, color: '#1a1714' }}>{day.location}</span>
                {day.nights && <Tag color={day.color}>{day.nights}</Tag>}
              </div>
            </div>
            <span style={{ color: '#8a8078', fontSize: 14, marginLeft: 12, marginTop: 2 }}>{open ? '▲' : '▼'}</span>
          </div>
        </div>

        {open && (
          <div style={{ padding: '0 18px 16px', borderTop: `1px solid ${c.border}` }}>
            <div style={{ paddingTop: 14 }}>
              <ul style={{ listStyle: 'none', marginBottom: 12 }}>
                {day.items.map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, marginBottom: 7, fontSize: 14, color: '#4a4540' }}>
                    <span style={{ color: c.accent, flexShrink: 0, marginTop: 2 }}>→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {day.food && day.food.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8a8078', marginBottom: 6 }}>Food</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {day.food.map((f, i) => <Tag key={i} color="gold">{f}</Tag>)}
                  </div>
                </div>
              )}

              {day.split && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                  <div style={{ background: '#eef5f0', borderRadius: 8, padding: '10px 12px', border: '1px solid #a8ccb4' }}>
                    <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', color: '#1a4a30', marginBottom: 4 }}>Parents</div>
                    <div style={{ fontSize: 13, color: '#4a4540' }}>{day.split.parents}</div>
                  </div>
                  <div style={{ background: '#fdf6e8', borderRadius: 8, padding: '10px 12px', border: '1px solid #e8d090' }}>
                    <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', color: '#7a5820', marginBottom: 4 }}>Young crew</div>
                    <div style={{ fontSize: 13, color: '#4a4540' }}>{day.split.young}</div>
                  </div>
                </div>
              )}

              {day.transport && (
                <div style={{ fontSize: 13, color: '#4a4540', background: '#f4efe6', borderRadius: 6, padding: '8px 12px', marginBottom: 8 }}>
                  🚃 {day.transport}
                </div>
              )}

              {day.notes && (
                <div style={{ marginBottom: 12, fontSize: 13, color: '#8a8078', fontStyle: 'italic' }}>
                  {day.notes}
                </div>
              )}

              <CommentSection
                sectionId={sectionId}
                sectionTitle={`${day.location} (${day.days})`}
                profile={profile}
                onNeedProfile={onNeedProfile}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function TransportCard({ item }) {
  const c = COLORS[item.color] || COLORS.blue
  return (
    <div style={{ background: 'white', border: `1px solid rgba(26,23,20,0.1)`, borderRadius: 10, padding: '16px 18px', borderTop: `3px solid ${c.accent}` }}>
      <div style={{ marginBottom: 6 }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: '#1a1714', marginBottom: 2 }}>{item.title}</div>
        <div style={{ fontSize: 13, color: c.accent, fontWeight: 500 }}>{item.subtitle}</div>
      </div>
      <div style={{ fontSize: 13, color: '#4a4540', lineHeight: 1.6, marginBottom: 10 }}>{item.details}</div>
      <div style={{ fontSize: 12, color: c.text, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 6, padding: '6px 10px' }}>
        {item.action}
      </div>
    </div>
  )
}

function ChecklistItem({ item, onToggle }) {
  const priorityColor = item.priority === 'urgent' ? COLORS.red : item.priority === 'soon' ? COLORS.gold : COLORS.green
  return (
    <div onClick={onToggle} style={{
      display: 'flex', gap: 14, alignItems: 'flex-start', padding: '14px 16px',
      background: item.done ? '#f4f4f0' : 'white',
      border: `1px solid ${item.done ? 'rgba(26,23,20,0.08)' : 'rgba(26,23,20,0.12)'}`,
      borderRadius: 8, cursor: 'pointer', marginBottom: 6,
      opacity: item.done ? 0.6 : 1, transition: 'all 0.2s',
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: 4, flexShrink: 0, marginTop: 1,
        border: `2px solid ${item.done ? '#2a6b4a' : 'rgba(26,23,20,0.25)'}`,
        background: item.done ? '#2a6b4a' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', fontSize: 12, fontWeight: 700,
      }}>
        {item.done && '✓'}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: item.done ? '#8a8078' : '#1a1714', textDecoration: item.done ? 'line-through' : 'none' }}>
            {item.item}
          </span>
          <span style={{ fontSize: 11, padding: '1px 7px', borderRadius: 10, fontWeight: 500, background: priorityColor.bg, color: priorityColor.text, border: `1px solid ${priorityColor.border}` }}>
            {item.deadline}
          </span>
        </div>
        <div style={{ fontSize: 13, color: '#8a8078', lineHeight: 1.5 }}>{item.details}</div>
      </div>
    </div>
  )
}

export default function TripDashboard() {
  const [checklist, setChecklist] = useState(bookingChecklist)
  const [activeSection, setActiveSection] = useState('overview')
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const { profile, saveProfile, clearProfile } = useProfile()

  const toggleItem = (i) => setChecklist(prev => prev.map((item, idx) => idx === i ? { ...item, done: !item.done } : item))
  const doneCount = checklist.filter(i => i.done).length

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'cambodia', label: 'Cambodia' },
    { id: 'japan', label: 'Japan' },
    { id: 'transport', label: 'Transport' },
    { id: 'checklist', label: 'Checklist' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#faf7f2' }}>
      {showProfileSetup && (
        <ProfileSetup
          onSave={(p) => { saveProfile(p); setShowProfileSetup(false) }}
          onClose={() => setShowProfileSetup(false)}
        />
      )}

      {/* Header */}
      <div style={{ background: '#1a1714', color: 'white', padding: '48px 24px 36px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8a8078', marginBottom: 10 }}>Family Trip · June 22 – July 11, 2026</div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontFamily: "'Playfair Display', serif", fontWeight: 700, lineHeight: 1.1, marginBottom: 14 }}>
            Cambodia<br />& Japan
          </h1>
          <div style={{ fontSize: 15, color: '#a09890', marginBottom: 28 }}>{tripMeta.tagline}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {tripMeta.group.map((p, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: '4px 12px', fontSize: 13, color: '#d0c8c0' }}>
                {p.name} <span style={{ color: '#8a8078', fontSize: 11 }}>· {p.role}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 280, height: 280, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', right: 20, top: 20, width: 160, height: 160, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)' }} />
      </div>

      {/* Nav */}
      <div style={{ background: 'white', borderBottom: '1px solid rgba(26,23,20,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
            {sections.map(s => (
              <button key={s.id} onClick={() => { setActiveSection(s.id); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' }) }} style={{
                background: 'none', border: 'none', padding: '16px 14px', fontSize: 14,
                fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', whiteSpace: 'nowrap',
                color: activeSection === s.id ? '#1a1714' : '#8a8078',
                borderBottom: activeSection === s.id ? '2px solid #1a1714' : '2px solid transparent',
                fontWeight: activeSection === s.id ? 500 : 400, transition: 'all 0.15s',
              }}>
                {s.label}
                {s.id === 'checklist' && (
                  <span style={{ marginLeft: 6, fontSize: 11, background: doneCount === checklist.length ? '#2a6b4a' : '#c8402a', color: 'white', borderRadius: 10, padding: '1px 6px' }}>
                    {doneCount}/{checklist.length}
                  </span>
                )}
              </button>
            ))}
          </div>
          <button onClick={() => profile ? clearProfile() : setShowProfileSetup(true)} style={{
            display: 'flex', alignItems: 'center', gap: 7, padding: '7px 12px',
            border: '1px solid rgba(26,23,20,0.15)', borderRadius: 20,
            background: profile ? '#1a1714' : 'transparent',
            cursor: 'pointer', fontSize: 13, flexShrink: 0,
            color: profile ? 'white' : '#8a8078',
            fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s',
          }}>
            {profile ? <>{profile.avatar} <span>{profile.name}</span> <span style={{ opacity: 0.5, fontSize: 11 }}>× exit</span></> : <>👤 <span>Set profile</span></>}
          </button>
        </div>
      </div>

      {!profile && (
        <div style={{ background: '#fdf6e8', borderBottom: '1px solid rgba(184,136,58,0.3)', padding: '10px 24px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ fontSize: 14, color: '#7a5820' }}>✏️ <strong>Set up your travel profile</strong> to leave comments and reactions on any part of the trip</div>
            <button onClick={() => setShowProfileSetup(true)} style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: '#b8883a', color: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
              Create profile →
            </button>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>

        {/* Overview */}
        <section id="overview" style={{ marginBottom: 64 }}>
          <SectionTitle>Trip at a glance</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 32 }}>
            {[
              { label: 'Total days', value: '20', sub: 'Jun 22 – Jul 11' },
              { label: 'Countries', value: '2', sub: 'Cambodia + Japan' },
              { label: 'People', value: '9', sub: 'Family + friends' },
              { label: 'Cities', value: '5', sub: 'PNH · SR · OSA · KYO · TYO' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'white', border: '1px solid rgba(26,23,20,0.1)', borderRadius: 10, padding: '18px 20px' }}>
                <div style={{ fontSize: 11, color: '#8a8078', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 32, fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#1a1714', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: '#8a8078', marginTop: 4 }}>{s.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'white', border: '1px solid rgba(26,23,20,0.1)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
            {[
              { dates: 'Jun 22–30', place: 'Phnom Penh', note: 'Family + grandmother', color: '#c8402a', days: '9 nights' },
              { dates: 'Jun 25–29', place: 'Siem Reap', note: 'Angkor temples', color: '#b8883a', days: '4 nights' },
              { dates: 'Jul 2–3', place: 'Osaka', note: 'Dotonbori, Kuromon Market', color: '#2a6b4a', days: '2 nights' },
              { dates: 'Jul 4–6', place: 'Kyoto', note: 'Temples, hiking, onsen', color: '#2a6b4a', days: '3 nights' },
              { dates: 'Jul 7–10', place: 'Tokyo', note: 'Ghibli, nightlife, food', color: '#2a4a7a', days: '4 nights' },
              { dates: 'Jul 11', place: 'Fly home', note: 'NRT → LAX 14:35', color: '#4a4540', days: '' },
            ].map((row, i, arr) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '110px 1fr auto', alignItems: 'center', padding: '14px 20px', gap: 16, borderBottom: i < arr.length - 1 ? '1px solid rgba(26,23,20,0.06)' : 'none' }}>
                <div style={{ fontSize: 12, color: '#8a8078', fontWeight: 500 }}>{row.dates}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1714', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: row.color, flexShrink: 0, display: 'inline-block' }} />
                    {row.place}
                  </div>
                  <div style={{ fontSize: 13, color: '#8a8078' }}>{row.note}</div>
                </div>
                <div style={{ fontSize: 12, color: '#a09890', fontStyle: 'italic' }}>{row.days}</div>
              </div>
            ))}
          </div>
          <CommentSection sectionId="overview-general" sectionTitle="the trip overall" profile={profile} onNeedProfile={() => setShowProfileSetup(true)} />
        </section>

        {/* Cambodia */}
        <section id="cambodia" style={{ marginBottom: 64 }}>
          <SectionTitle>🇰🇭 Cambodia</SectionTitle>
          <div style={{ marginBottom: 12, fontSize: 14, color: '#4a4540', fontStyle: 'italic' }}>Jun 22 – Jul 1 · Phnom Penh + Siem Reap · Primary purpose: time with grandmother</div>
          {cambodiaItinerary.map((day, i) => (
            <DayCard key={i} day={day} isLast={i === cambodiaItinerary.length - 1} profile={profile} onNeedProfile={() => setShowProfileSetup(true)} />
          ))}
          <div style={{ marginTop: 16 }}>
            <CommentSection sectionId="cambodia-general" sectionTitle="the Cambodia section overall" profile={profile} onNeedProfile={() => setShowProfileSetup(true)} />
          </div>
        </section>

        {/* Japan */}
        <section id="japan" style={{ marginBottom: 64 }}>
          <SectionTitle>🇯🇵 Japan</SectionTitle>
          <div style={{ marginBottom: 12, fontSize: 14, color: '#4a4540', fontStyle: 'italic' }}>Jul 2 – Jul 11 · Osaka · Kyoto · Tokyo · 9 days, 3 cities</div>
          <div style={{ background: '#fdf6e8', border: '1px solid #e8d090', borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#7a5820' }}>
            ⚠️ <strong>Japan Grandma</strong> — local knowledge is your secret weapon. Let her lead on restaurants and navigation.
          </div>
          {japanItinerary.map((day, i) => (
            <DayCard key={i} day={day} isLast={i === japanItinerary.length - 1} profile={profile} onNeedProfile={() => setShowProfileSetup(true)} />
          ))}
          <div style={{ marginTop: 16 }}>
            <CommentSection sectionId="japan-general" sectionTitle="the Japan section overall" profile={profile} onNeedProfile={() => setShowProfileSetup(true)} />
          </div>
        </section>

        {/* Transport */}
        <section id="transport" style={{ marginBottom: 64 }}>
          <SectionTitle>🚃 Getting around Japan</SectionTitle>
          <div style={{ background: '#eef5f0', border: '1px solid #a8ccb4', borderRadius: 8, padding: '14px 16px', marginBottom: 20, fontSize: 14, color: '#1a4a30' }}>
            <strong>The simple version for mom:</strong> Everyone gets a Suica card at Osaka airport. Tap going in, tap going out. Google Maps tells you which train. That's it.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, marginBottom: 20 }}>
            {transportInfo.map((item, i) => <TransportCard key={i} item={item} />)}
          </div>
          <CommentSection sectionId="transport-general" sectionTitle="transport and logistics" profile={profile} onNeedProfile={() => setShowProfileSetup(true)} />
        </section>

        {/* Checklist */}
        <section id="checklist" style={{ marginBottom: 64 }}>
          <SectionTitle>✅ Booking checklist</SectionTitle>
          <div style={{ marginBottom: 16, fontSize: 14, color: '#8a8078' }}>Click items to mark as done. {doneCount}/{checklist.length} complete.</div>
          {['urgent', 'soon', 'prep'].map(priority => {
            const items = checklist.filter(i => i.priority === priority)
            const labels = { urgent: '🔴 Do immediately', soon: '🟡 Book soon', prep: '🟢 Before you go' }
            return (
              <div key={priority} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8a8078', marginBottom: 8 }}>{labels[priority]}</div>
                {items.map((item) => {
                  const globalIndex = checklist.findIndex(c => c === item)
                  return <ChecklistItem key={globalIndex} item={item} onToggle={() => toggleItem(globalIndex)} />
                })}
              </div>
            )
          })}
          <div style={{ marginTop: 20 }}>
            <CommentSection sectionId="checklist-general" sectionTitle="the booking checklist" profile={profile} onNeedProfile={() => setShowProfileSetup(true)} />
          </div>
        </section>

        <div style={{ textAlign: 'center', padding: '32px 0', borderTop: '1px solid rgba(26,23,20,0.1)', color: '#8a8078', fontSize: 13 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: '#1a1714', marginBottom: 8 }}>Cambodia & Japan 2026</div>
          Jun 22 – Jul 11 · 9 people · Made with love (and a lot of research)
        </div>
      </div>
    </div>
  )
}
