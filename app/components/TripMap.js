'use client'
import { useEffect, useRef, useState } from 'react'

// ─────────────────────────────────────────────
// PASTE YOUR GOOGLE MAPS API KEY HERE
const GOOGLE_MAPS_API_KEY = 'AIzaSyCyS50rNpXPgQ0j4p4ONiL-YTEBJ5qS0wM'
// ─────────────────────────────────────────────

const CITIES = [
  {
    id: 'lax',
    name: 'Los Angeles',
    short: 'Home',
    country: 'USA',
    flag: '🇺🇸',
    lat: 33.9425,
    lng: -118.4081,
    order: 1,
    dates: 'Jun 22 — depart',
    color: '#8a8078',
    transport: null,
    description: 'Depart LAX. Long travel day to Phnom Penh.',
    highlights: [],
  },
  {
    id: 'pnompenh',
    name: 'Phnom Penh',
    short: 'PNH',
    country: 'Cambodia',
    flag: '🇰🇭',
    lat: 11.5564,
    lng: 104.9282,
    order: 2,
    dates: 'Jun 22–25',
    color: '#c8402a',
    transport: {
      from: 'Los Angeles',
      how: 'Flight',
      duration: '~20h with stopover',
      detail: 'LAX → PNH via connecting flight. Check Google Flights for best routing via Seoul, Tokyo, or Bangkok.',
      cost: 'Book early — ~$900–1,400/person from LAX',
    },
    description: 'Family base — primary reason for Cambodia. Grandmother visits, Royal Palace, Riverside evenings.',
    highlights: ['Grandmother visits', 'Royal Palace + Silver Pagoda', 'Central Market', 'Tuol Sleng + Choeung Ek', 'Riverside BBQ stalls'],
  },
  {
    id: 'siemreap',
    name: 'Siem Reap',
    short: 'SR',
    country: 'Cambodia',
    flag: '🇰🇭',
    lat: 13.3671,
    lng: 103.8448,
    order: 3,
    dates: 'Jun 25–29',
    color: '#b8883a',
    transport: {
      from: 'Phnom Penh',
      how: 'Bus or domestic flight',
      duration: 'Bus ~6h · Flight ~45 min',
      detail: 'Morning bus is scenic and cheap (~$15). Domestic flight is ~$60–80/person but saves 5+ hours. Both options are easy.',
      cost: 'Bus: ~$15/person · Flight: ~$60–80/person',
    },
    description: 'Angkor temples. 3-day pass ($62). Stay near Old Market. Early morning starts are essential.',
    highlights: ['Angkor Wat sunrise (4:30am)', 'Bayon + Angkor Thom', 'Ta Prohm (tree temple)', 'Banteay Srei (outer temples)', 'Tonle Sap floating village'],
  },
  {
    id: 'osaka',
    name: 'Osaka',
    short: 'OSA',
    country: 'Japan',
    flag: '🇯🇵',
    lat: 34.6937,
    lng: 135.5023,
    order: 4,
    dates: 'Jul 2–3',
    color: '#2a6b4a',
    transport: {
      from: 'Phnom Penh',
      how: 'Flight (overnight)',
      duration: '~8h40m with 1 stop',
      detail: 'Vietnam Airlines PNH → KIX. Departs Jul 1 at 9pm, arrives Jul 2 at 6:40am. 1 stop via Hanoi. Booking ref: YG71S02.',
      cost: 'Already booked ✓',
    },
    description: 'Food capital of Japan. Dotonbori street food, Kuromon Market, Shinsekai. 2 nights.',
    highlights: ['Dotonbori (takoyaki + kushikatsu)', 'Kuromon Ichiba Market', 'Shinsekai district', 'Day trip: Nara deer park (45 min)'],
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    short: 'KYO',
    country: 'Japan',
    flag: '🇯🇵',
    lat: 35.0116,
    lng: 135.7681,
    order: 5,
    dates: 'Jul 4–6',
    color: '#2a6b4a',
    transport: {
      from: 'Osaka',
      how: 'JR Special Rapid train',
      duration: '28 minutes',
      detail: 'JR Special Rapid from Osaka Station → Kyoto Station. Runs every 15 min. Pay with Suica card — no ticket needed.',
      cost: '¥580/person (~$4)',
    },
    description: 'Temples, bamboo, hiking. 3 nights. Fushimi Inari summit hike, Kurama–Kibune trail + onsen.',
    highlights: ['Fushimi Inari (summit hike 6:30am)', 'Arashiyama bamboo grove', 'Kurama–Kibune trail + onsen', 'Nishiki Market', 'Gion district at dusk'],
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    short: 'TYO',
    country: 'Japan',
    flag: '🇯🇵',
    lat: 35.6762,
    lng: 139.6503,
    order: 6,
    dates: 'Jul 7–10',
    color: '#2a4a7a',
    transport: {
      from: 'Kyoto',
      how: 'Shinkansen Hikari',
      duration: '2h 40min',
      detail: 'Shinkansen Hikari from Kyoto Station → Tokyo Station. Book 9 reserved seats together in advance — 2–3 months out. Use JR Central English site or Klook.',
      cost: '¥13,970/person (~$90) · ⚠️ Book now',
    },
    description: 'Final destination. Ghibli Museum, Golden Gai, Tsukiji, Shibuya. Fly home Jul 11.',
    highlights: ['Ghibli Museum (⚠️ book Jun 10)', 'Golden Gai bar alley', 'Tsukiji Outer Market 7am', 'Shibuya Crossing', 'Depachika food halls'],
  },
]

// Route segments to draw on the map
const ROUTE_SEGMENTS = [
  { from: 'lax', to: 'pnompenh', type: 'flight' },
  { from: 'pnompenh', to: 'siemreap', type: 'ground' },
  { from: 'siemreap', to: 'osaka', type: 'flight' },
  { from: 'osaka', to: 'kyoto', type: 'train' },
  { from: 'kyoto', to: 'tokyo', type: 'train' },
  { from: 'tokyo', to: 'lax', type: 'flight', dashed: true },
]

function loadGoogleMaps(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) { resolve(window.google.maps); return }
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`
    script.async = true
    script.onload = () => resolve(window.google.maps)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

function TransportBadge({ type }) {
  const styles = {
    flight: { bg: '#eef2f8', color: '#2a4a7a', label: '✈ Flight' },
    train:  { bg: '#eef5f0', color: '#2a6b4a', label: '🚅 Shinkansen' },
    ground: { bg: '#fdf6e8', color: '#7a5820', label: '🚌 Bus / Flight' },
  }
  const s = styles[type] || styles.ground
  return (
    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, fontWeight: 500, background: s.bg, color: s.color }}>
      {s.label}
    </span>
  )
}

export default function TripMap({ profile, onNeedProfile }) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const [selected, setSelected] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(null)
  const markersRef = useRef([])

  useEffect(() => {
    if (!mapRef.current) return
    if (GOOGLE_MAPS_API_KEY === 'YOUR_API_KEY_HERE') {
      setError('placeholder')
      return
    }

    loadGoogleMaps(GOOGLE_MAPS_API_KEY).then((maps) => {
      const map = new maps.Map(mapRef.current, {
        zoom: 3,
        center: { lat: 25, lng: 118 },
        mapTypeId: 'roadmap',
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#f4efe6' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#4a4540' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#faf7f2' }] },
          { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#d0c8c0' }] },
          { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#8a8078' }] },
          { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#eae4d8' }] },
          { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#e8e0d0' }] },
          { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#d8ead0' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
          { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#f0ebe0' }] },
          { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#e8e0d0' }] },
          { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#d8d0c8' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c8dce8' }] },
          { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#8aacbc' }] },
        ],
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
      })

      mapInstance.current = map

      // Draw route lines
      ROUTE_SEGMENTS.forEach(seg => {
        const from = CITIES.find(c => c.id === seg.from)
        const to = CITIES.find(c => c.id === seg.to)
        if (!from || !to) return

        const lineColor = seg.type === 'flight' ? '#2a4a7a' : seg.type === 'train' ? '#2a6b4a' : '#b8883a'
        const path = [
          { lat: from.lat, lng: from.lng },
          { lat: to.lat, lng: to.lng },
        ]

        // Curved flight paths using geodesic
        new maps.Polyline({
          path,
          geodesic: true,
          strokeColor: lineColor,
          strokeOpacity: seg.dashed ? 0 : 0.5,
          strokeWeight: seg.type === 'train' ? 3 : 2,
          icons: seg.dashed ? [{
            icon: { path: 'M 0,-1 0,1', strokeOpacity: 0.5, scale: 3 },
            offset: '0', repeat: '12px',
          }] : [],
          map,
        })
      })

      // Draw city markers
      CITIES.forEach(city => {
        const marker = new maps.Marker({
          position: { lat: city.lat, lng: city.lng },
          map,
          title: city.name,
          icon: {
            path: maps.SymbolPath.CIRCLE,
            scale: city.id === 'lax' ? 7 : 11,
            fillColor: city.color,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2.5,
          },
          label: {
            text: city.short,
            color: '#ffffff',
            fontSize: '10px',
            fontWeight: '600',
            fontFamily: 'DM Sans, sans-serif',
          },
          zIndex: city.order,
        })

        marker.addListener('click', () => setSelected(city))
        markersRef.current.push(marker)
      })

      setLoaded(true)
    }).catch(() => setError('failed'))
  }, [])

  // Highlight selected marker
  useEffect(() => {
    if (!mapInstance.current || !window.google) return
    markersRef.current.forEach((marker, i) => {
      const city = CITIES[i]
      if (!city) return
      marker.setIcon({
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: selected?.id === city.id ? 14 : (city.id === 'lax' ? 7 : 11),
        fillColor: city.color,
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: selected?.id === city.id ? 3 : 2.5,
      })
    })
  }, [selected])

  const selectedCity = selected || CITIES[1] // default to Phnom Penh

  return (
    <div style={{ marginBottom: 40 }}>
      {/* Map container */}
      <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(26,23,20,0.12)', background: '#eae4d8' }}>
        {/* Placeholder when no API key */}
        {error === 'placeholder' ? (
          <div style={{ height: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f4efe6', padding: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>🗺️</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: '#1a1714', marginBottom: 8 }}>Map ready — needs your API key</div>
            <div style={{ fontSize: 13, color: '#8a8078', maxWidth: 420, lineHeight: 1.6, marginBottom: 20 }}>
              Open <code style={{ background: '#e8e0d0', padding: '1px 6px', borderRadius: 4, fontSize: 12 }}>app/components/TripMap.js</code> and replace <code style={{ background: '#e8e0d0', padding: '1px 6px', borderRadius: 4, fontSize: 12 }}>'YOUR_API_KEY_HERE'</code> at the top of the file with your Google Maps API key.
            </div>
            <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" style={{ padding: '9px 20px', background: '#1a1714', color: 'white', borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
              Get API key at console.cloud.google.com →
            </a>
          </div>
        ) : error === 'failed' ? (
          <div style={{ height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fdf1ee' }}>
            <div style={{ textAlign: 'center', color: '#c8402a' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>⚠️</div>
              <div style={{ fontSize: 14 }}>Map failed to load. Check your API key and make sure Maps JavaScript API is enabled.</div>
            </div>
          </div>
        ) : (
          <div ref={mapRef} style={{ height: 420, width: '100%' }} />
        )}

        {/* City selector strip — always visible */}
        <div style={{
          display: 'flex', overflowX: 'auto', gap: 0,
          background: 'white', borderTop: '1px solid rgba(26,23,20,0.1)',
        }}>
          {CITIES.filter(c => c.id !== 'lax').map(city => (
            <button key={city.id} onClick={() => {
              setSelected(city)
              if (mapInstance.current && window.google) {
                mapInstance.current.panTo({ lat: city.lat, lng: city.lng })
                mapInstance.current.setZoom(city.country === 'Japan' ? 8 : 9)
              }
            }} style={{
              flex: '1 0 auto', padding: '10px 14px', border: 'none', cursor: 'pointer',
              background: selected?.id === city.id ? city.color : 'transparent',
              borderBottom: selected?.id === city.id ? `3px solid ${city.color}` : '3px solid transparent',
              transition: 'all 0.15s', fontFamily: "'DM Sans', sans-serif",
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: selected?.id === city.id ? 'white' : '#1a1714', whiteSpace: 'nowrap' }}>
                {city.flag} {city.name}
              </div>
              <div style={{ fontSize: 11, color: selected?.id === city.id ? 'rgba(255,255,255,0.75)' : '#8a8078', whiteSpace: 'nowrap' }}>
                {city.dates}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Info panel for selected city */}
      {selectedCity && selectedCity.id !== 'lax' && (
        <div style={{
          marginTop: 12, background: 'white',
          border: `1px solid rgba(26,23,20,0.1)`,
          borderTop: `3px solid ${selectedCity.color}`,
          borderRadius: 10, padding: 20,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, color: '#8a8078', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                {selectedCity.dates} · {selectedCity.country}
              </div>
              <h3 style={{ fontSize: 22, fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#1a1714' }}>
                {selectedCity.flag} {selectedCity.name}
              </h3>
            </div>
            {selectedCity.transport && <TransportBadge type={selectedCity.transport.how === 'Flight' || selectedCity.transport.how === 'Flight (overnight)' ? 'flight' : selectedCity.transport.how.includes('Rapid') || selectedCity.transport.how.includes('Shinkansen') ? 'train' : 'ground'} />}
          </div>

          <p style={{ fontSize: 14, color: '#4a4540', lineHeight: 1.6, marginBottom: 16 }}>{selectedCity.description}</p>

          {/* Transport card */}
          {selectedCity.transport && (
            <div style={{ background: '#f4efe6', borderRadius: 8, padding: '12px 14px', marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8a8078', marginBottom: 8 }}>
                Getting here from {selectedCity.transport.from}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#8a8078', marginBottom: 2 }}>How</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1714' }}>{selectedCity.transport.how}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#8a8078', marginBottom: 2 }}>Duration</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1714' }}>{selectedCity.transport.duration}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#8a8078', marginBottom: 2 }}>Cost</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: selectedCity.transport.cost.includes('⚠️') ? '#c8402a' : '#2a6b4a' }}>{selectedCity.transport.cost}</div>
                </div>
              </div>
              <div style={{ marginTop: 10, fontSize: 13, color: '#4a4540', lineHeight: 1.5 }}>{selectedCity.transport.detail}</div>
            </div>
          )}

          {/* Highlights */}
          {selectedCity.highlights.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8a8078', marginBottom: 8 }}>Key spots</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selectedCity.highlights.map((h, i) => (
                  <span key={i} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 16, background: '#f4efe6', color: '#4a4540', border: '1px solid rgba(26,23,20,0.1)' }}>
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
