'use client'
import { useState, useEffect } from 'react'

const STORAGE_KEY = 'trip-comments-v1'
const PROFILE_KEY = 'trip-profile-v1'

const AVATARS = ['🧳', '✈️', '🗺️', '📸', '🍜', '🌸', '🏯', '🎋', '🐉', '🌺', '🎌', '🏖️']

export function useProfile() {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROFILE_KEY)
      if (saved) setProfile(JSON.parse(saved))
    } catch {}
  }, [])

  const saveProfile = (p) => {
    setProfile(p)
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)) } catch {}
  }

  const clearProfile = () => {
    setProfile(null)
    try { localStorage.removeItem(PROFILE_KEY) } catch {}
  }

  return { profile, saveProfile, clearProfile }
}

export function useComments(sectionId) {
  const [comments, setComments] = useState([])

  useEffect(() => {
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      setComments(all[sectionId] || [])
    } catch { setComments([]) }
  }, [sectionId])

  const addComment = (comment) => {
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      const updated = [comment, ...(all[sectionId] || [])]
      all[sectionId] = updated
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
      setComments(updated)
    } catch {}
  }

  const deleteComment = (id) => {
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      const updated = (all[sectionId] || []).filter(c => c.id !== id)
      all[sectionId] = updated
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
      setComments(updated)
    } catch {}
  }

  const addReaction = (commentId, emoji) => {
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      const updated = (all[sectionId] || []).map(c => {
        if (c.id !== commentId) return c
        const reactions = { ...(c.reactions || {}) }
        reactions[emoji] = (reactions[emoji] || 0) + 1
        return { ...c, reactions }
      })
      all[sectionId] = updated
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
      setComments(updated)
    } catch {}
  }

  return { comments, addComment, deleteComment, addReaction }
}

export { AVATARS }
