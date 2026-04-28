'use client'
import { useState } from 'react'
import { useComments } from './comments-store'

const QUICK_REACTIONS = ['👍', '❤️', '😬', '🤔', '🔥', '😂']

function timeAgo(ts) {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function CommentSection({ sectionId, sectionTitle, profile, onNeedProfile }) {
  const { comments, addComment, deleteComment, addReaction } = useComments(sectionId)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [summarizing, setSummarizing] = useState(false)
  const [summary, setSummary] = useState(null)
  const [open, setOpen] = useState(false)

  const handleSubmit = async () => {
    if (!text.trim()) return
    if (!profile) { onNeedProfile(); return }
    setSubmitting(true)
    addComment({
      id: Date.now().toString(),
      text: text.trim(),
      author: profile.name,
      avatar: profile.avatar,
      profileId: profile.id,
      timestamp: Date.now(),
      reactions: {},
    })
    setText('')
    setSubmitting(false)
    if (!open) setOpen(true)
  }

  const handleSummarize = async () => {
    if (comments.length === 0) return
    setSummarizing(true)
    setSummary(null)
    try {
      const commentText = comments.map(c => `${c.author}: "${c.text}"`).join('\n')
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `These are family comments about "${sectionTitle}" section of a Cambodia + Japan trip itinerary:\n\n${commentText}\n\nWrite a short, warm 2-3 sentence summary of the group's overall vibe and any key concerns or suggestions. Be casual and friendly, like you're talking to the trip organizer. Keep it under 80 words.`
          }]
        })
      })
      const data = await res.json()
      const txt = data.content?.find(b => b.type === 'text')?.text
      setSummary(txt || 'Could not generate summary.')
    } catch {
      setSummary('Could not generate summary right now.')
    }
    setSummarizing(false)
  }

  const myComments = profile ? comments.filter(c => c.profileId === profile.id) : []

  return (
    <div style={{ marginTop: 12 }}>
      {/* Toggle button */}
      <button onClick={() => setOpen(!open)} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'none', border: '1px solid rgba(26,23,20,0.12)',
        borderRadius: 8, padding: '8px 14px', cursor: 'pointer',
        fontSize: 13, color: '#8a8078', fontFamily: "'DM Sans', sans-serif",
        transition: 'all 0.15s',
      }}>
        <span>💬</span>
        <span>{comments.length > 0 ? `${comments.length} comment${comments.length !== 1 ? 's' : ''}` : 'Leave a comment'}</span>
        <span style={{ marginLeft: 4, fontSize: 11 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{
          marginTop: 10, background: '#f9f6f1',
          border: '1px solid rgba(26,23,20,0.1)',
          borderRadius: 10, padding: 16,
        }}>
          {/* Input */}
          <div style={{ marginBottom: 14 }}>
            {profile ? (
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: '#1a1714', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 16,
                }}>{profile.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: '#8a8078', marginBottom: 6 }}>
                    Commenting as <strong style={{ color: '#1a1714' }}>{profile.name}</strong>
                  </div>
                  <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder={`What do you think about ${sectionTitle}?`}
                    rows={2}
                    style={{
                      width: '100%', padding: '10px 12px', fontSize: 14,
                      border: '1px solid rgba(26,23,20,0.15)', borderRadius: 8,
                      background: 'white', color: '#1a1714', outline: 'none',
                      fontFamily: "'DM Sans', sans-serif", resize: 'vertical',
                      lineHeight: 1.5,
                    }}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!text.trim() || submitting}
                    style={{
                      marginTop: 8, padding: '8px 18px', borderRadius: 8,
                      border: 'none', fontSize: 13, fontWeight: 500,
                      background: text.trim() ? '#1a1714' : '#d0c8c0',
                      color: 'white', cursor: text.trim() ? 'pointer' : 'not-allowed',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {submitting ? 'Posting...' : 'Post comment'}
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={onNeedProfile} style={{
                width: '100%', padding: '12px', borderRadius: 8,
                border: '1px dashed rgba(26,23,20,0.2)', background: 'white',
                fontSize: 14, color: '#8a8078', cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
              }}>
                ✏️ Set up your profile to comment
              </button>
            )}
          </div>

          {/* AI Summary button */}
          {comments.length >= 2 && (
            <div style={{ marginBottom: 14 }}>
              <button onClick={handleSummarize} disabled={summarizing} style={{
                padding: '7px 14px', borderRadius: 8, fontSize: 13,
                border: '1px solid rgba(184,136,58,0.4)', background: '#fdf6e8',
                color: '#7a5820', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              }}>
                {summarizing ? '✨ Summarizing...' : '✨ Summarize feedback'}
              </button>
              {summary && (
                <div style={{
                  marginTop: 10, padding: '12px 14px', background: '#fffdf5',
                  border: '1px solid rgba(184,136,58,0.3)', borderRadius: 8,
                  fontSize: 14, color: '#4a4540', lineHeight: 1.6, fontStyle: 'italic',
                }}>
                  {summary}
                </div>
              )}
            </div>
          )}

          {/* Comments list */}
          {comments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '16px 0', color: '#a09890', fontSize: 13 }}>
              No comments yet — be the first!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {comments.map(c => (
                <div key={c.id} style={{
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  background: 'white', borderRadius: 8,
                  border: '1px solid rgba(26,23,20,0.08)', padding: '10px 12px',
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                    background: '#f4efe6', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 15,
                  }}>{c.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#1a1714' }}>{c.author}</span>
                      <span style={{ fontSize: 11, color: '#a09890' }}>{timeAgo(c.timestamp)}</span>
                    </div>
                    <div style={{ fontSize: 14, color: '#4a4540', lineHeight: 1.5, marginBottom: 8 }}>{c.text}</div>

                    {/* Reactions */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                      {QUICK_REACTIONS.map(emoji => {
                        const count = c.reactions?.[emoji] || 0
                        return (
                          <button key={emoji} onClick={() => addReaction(c.id, emoji)} style={{
                            padding: '2px 8px', borderRadius: 12, fontSize: 13,
                            border: '1px solid rgba(26,23,20,0.12)',
                            background: count > 0 ? '#f4efe6' : 'transparent',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                          }}>
                            {emoji}{count > 0 && <span style={{ fontSize: 11, color: '#8a8078' }}>{count}</span>}
                          </button>
                        )
                      })}
                      {profile && c.profileId === profile.id && (
                        <button onClick={() => deleteComment(c.id)} style={{
                          marginLeft: 'auto', fontSize: 11, color: '#c8402a', background: 'none',
                          border: 'none', cursor: 'pointer', opacity: 0.6,
                        }}>delete</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
