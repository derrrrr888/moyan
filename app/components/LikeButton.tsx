'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function LikeButton({ 
  id, 
  initialLikes, 
  table = 'articles',
  size = 'md'
}: { 
  id: number
  initialLikes: number
  table?: 'articles' | 'comments'
  size?: 'sm' | 'md'
}) {
  const storageKey = table === 'articles' ? 'liked_articles' : 'liked_comments'
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(initialLikes)
  const [popping, setPopping] = useState(false)

  useEffect(() => {
    const likedItems = JSON.parse(localStorage.getItem(storageKey) || '[]')
    setLiked(likedItems.includes(id))
  }, [id, storageKey])

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setPopping(true)
    setTimeout(() => setPopping(false), 300)

    const likedItems: number[] = JSON.parse(localStorage.getItem(storageKey) || '[]')
    const newLiked = !liked

    if (newLiked) {
      likedItems.push(id)
      setLikes(prev => prev + 1)
      await supabase.from(table).update({ likes: likes + 1 }).eq('id', id)
    } else {
      const idx = likedItems.indexOf(id)
      if (idx > -1) likedItems.splice(idx, 1)
      setLikes(prev => prev - 1)
      await supabase.from(table).update({ likes: Math.max(0, likes - 1) }).eq('id', id)
    }

    localStorage.setItem(storageKey, JSON.stringify(likedItems))
    setLiked(newLiked)
  }

  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-1 transition-transform duration-300 ease-out select-none
        ${popping ? 'scale-125' : 'scale-100'}
        ${liked ? 'text-red-500' : 'text-[#8a8a8a] hover:text-red-400'}
      `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${iconSize} transition-all duration-200 ${liked ? 'fill-red-500 stroke-red-500' : 'fill-none'}`}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span className="min-w-[1rem] text-center text-xs">{likes}</span>
    </button>
  )
}